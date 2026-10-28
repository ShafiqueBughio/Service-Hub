"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  FaceLandmarker,
  FilesetResolver,
} from "@mediapipe/tasks-vision";
import { MdCameraswitch, MdClose, MdPhotoCamera } from "react-icons/md";

const toPreviewUrl = (value) => {
  if (!value) return null;
  if (typeof value === "string") return value;
  if (value instanceof File) return URL.createObjectURL(value);
  return value.preview || value.url || null;
};

const stopStream = (stream) => {
  stream?.getTracks?.().forEach((track) => track.stop());
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const LiveSelfieCapture = ({
  label = "Selfie",
  value,
  onChange,
  error,
  mode = "auth"
}) => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const faceLandmarkerRef = useRef(null);
  const animationRef = useRef(null);
  const stableFramesRef = useRef(0);
  const lastVideoTimeRef = useRef(-1);
  const lastDetectionTimeRef = useRef(0); //added
  const lastPromptRef = useRef("");

  const [cameraOpen, setCameraOpen] = useState(false);
  const [starting, setStarting] = useState(false);
  const [modelLoading, setModelLoading] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [preview, setPreview] = useState(() => toPreviewUrl(value));
  const [instruction, setInstruction] = useState("Position your face inside the oval");
  const [faceReady, setFaceReady] = useState(false);
  const [faceCount, setFaceCount] = useState(0);

  useEffect(() => {
    const next = toPreviewUrl(value);
    setPreview(next);

    if (value instanceof File) {
      return () => URL.revokeObjectURL(next);
    }
  }, [value]);

  useEffect(() => {
    if (!cameraOpen) return;

    let cancelled = false;
    let stream = null;

    const startCameraAndDetector = async () => {
      setStarting(true);
      setModelLoading(true);
      setCameraError("");
      setFaceReady(false);
      setFaceCount(0);
      setInstruction("Starting camera...");
      stableFramesRef.current = 0;
      lastVideoTimeRef.current = -1;

      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error("Camera is not supported. Use HTTPS or localhost.");
        }

        stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            facingMode: { ideal: "user" },
            width: { ideal: 640 },
            height: { ideal: 480 },
          },
        });

        if (cancelled) {
          stopStream(stream);
          return;
        }

        streamRef.current = stream;

        const video = videoRef.current;
        if (!video) throw new Error("Camera video could not be initialized.");

        video.srcObject = stream;
        await video.play();

        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );

        if (cancelled) return;

        const landmarker = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "/models/face_landmarker.task",
          },
          runningMode: "VIDEO",
          numFaces: 2,
          minFaceDetectionConfidence: 0.5,
          minFacePresenceConfidence: 0.5,
          minTrackingConfidence: 0.5,
          outputFacialTransformationMatrixes: true,
        });

        if (cancelled) {
          landmarker.close();
          return;
        }

        faceLandmarkerRef.current = landmarker;
        setInstruction("Look straight at the camera");
        setModelLoading(false);
        setStarting(false);

        let previousPrompt = "";
        let previousReady = false;
        let previousCount = -1;

        const updatePrompt = (prompt) => {
          if (previousPrompt !== prompt) {
            previousPrompt = prompt;
            setInstruction(prompt);
          }
        };

        const updateReady = (ready) => {
          if (previousReady !== ready) {
            previousReady = ready;
            setFaceReady(ready);
          }
        };

        const updateCount = (count) => {
          if (previousCount !== count) {
            previousCount = count;
            setFaceCount(count);
          }
        };

        const detectFrame = () => {
          if (cancelled) return;

          const currentVideo = videoRef.current;
          const detector = faceLandmarkerRef.current;

          if (
            !currentVideo ||
            !detector ||
            currentVideo.readyState < 2 ||
            currentVideo.videoWidth === 0
          ) {
            animationRef.current = requestAnimationFrame(detectFrame);
            return;
          }

          //added
          const now = performance.now();

          if (now - lastDetectionTimeRef.current < 100) {
            animationRef.current = requestAnimationFrame(detectFrame);
            return;
          }

          if (currentVideo.currentTime !== lastVideoTimeRef.current) {
            lastVideoTimeRef.current = currentVideo.currentTime;
            lastDetectionTimeRef.current = now; //added

            try {
              //added
              if (cancelled || faceLandmarkerRef.current !== detector) {
                if (!cancelled) {
                  animationRef.current = requestAnimationFrame(detectFrame);
                }
                return;
              }
              const result = detector.detectForVideo(
                currentVideo,
                now
              );

              const faces = result.faceLandmarks || [];
              updateCount(faces.length);

              if (faces.length === 0) {
                stableFramesRef.current = 0;
                updateReady(false);
                updatePrompt("No face detected — look at the camera");
              } else if (faces.length > 1) {
                stableFramesRef.current = 0;
                updateReady(false);
                updatePrompt("Only one person should be in the frame");
              } else {
                const landmarks = faces[0];

                const xs = landmarks.map((point) => point.x);
                const ys = landmarks.map((point) => point.y);

                const minX = Math.min(...xs);
                const maxX = Math.max(...xs);
                const minY = Math.min(...ys);
                const maxY = Math.max(...ys);

                const faceWidth = maxX - minX;
                const faceHeight = maxY - minY;
                const centerX = (minX + maxX) / 2;
                const centerY = (minY + maxY) / 2;

                let prompt = "";
                let validPosition = true;

                // Position within the approximate oval guide.
                if (centerX < 0.38 || centerX > 0.62) {
                  prompt = "Center your face in the oval";
                  validPosition = false;
                } else if (centerY < 0.32 || centerY > 0.62) {
                  prompt = centerY < 0.32
                    ? "Move your face down slightly"
                    : "Move your face up slightly";
                  validPosition = false;
                } else if (faceHeight < 0.28 || faceWidth < 0.18) {
                  prompt = "Move closer to the camera";
                  validPosition = false;
                } else if (faceHeight > 0.62 || faceWidth > 0.52) {
                  prompt = "Move a little farther away";
                  validPosition = false;
                }

                // Approximate head orientation using facial landmarks.
                // These checks are guidance, not biometric verification.
                const leftEye = landmarks[33];
                const rightEye = landmarks[263];
                const nose = landmarks[1];
                const forehead = landmarks[10];
                const chin = landmarks[152];

                if (validPosition && leftEye && rightEye && nose) {
                  const eyeDistance = Math.abs(rightEye.x - leftEye.x);
                  const eyeMidX = (leftEye.x + rightEye.x) / 2;

                  if (
                    eyeDistance > 0 &&
                    Math.abs(nose.x - eyeMidX) / eyeDistance > 0.22
                  ) {
                    prompt = "Look straight at the camera";
                    validPosition = false;
                  }
                }

                if (validPosition && leftEye && rightEye) {
                  const eyeSlope = Math.abs(rightEye.y - leftEye.y);
                  const eyeDistance = Math.abs(rightEye.x - leftEye.x);

                  if (eyeDistance > 0 && eyeSlope / eyeDistance > 0.12) {
                    prompt = "Straighten your head";
                    validPosition = false;
                  }
                }

                if (
                  validPosition &&
                  forehead &&
                  chin &&
                  chin.y - forehead.y < 0.25
                ) {
                  prompt = "Look straight at the camera";
                  validPosition = false;
                }

                if (validPosition) {
                  stableFramesRef.current += 1;

                  if (stableFramesRef.current >= 12) {
                    updateReady(true);
                    updatePrompt("Perfect! Hold still and capture");
                  } else {
                    updateReady(false);
                    updatePrompt("Hold still...");
                  }
                } else {
                  stableFramesRef.current = 0;
                  updateReady(false);
                  updatePrompt(prompt || "Look straight at the camera");
                }
              }
            } catch (err) {
              console.error("Face detection failed:", err);
              console.error("Error name:", err?.name);
              console.error("Error message:", err?.message);

              setCameraError(
                err?.message ||
                "Face detection failed. Please close the camera and try again."
              );

              setStarting(false);
              setModelLoading(false);

              return;
            }
          }

          animationRef.current = requestAnimationFrame(detectFrame);
        };

        animationRef.current = requestAnimationFrame(detectFrame);
      } catch (err) {
        console.error("Camera or face detector initialization failed:", err);

        if (!cancelled) {
          setCameraError(
            err?.name === "NotAllowedError"
              ? "Camera permission denied. Please allow camera access."
              : "Unable to start face detection. Check your camera and model file."
          );
          setStarting(false);
          setModelLoading(false);
        }
      }
    };

    startCameraAndDetector();

    return () => {
      cancelled = true;

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }

      faceLandmarkerRef.current?.close();
      faceLandmarkerRef.current = null;

      stopStream(streamRef.current || stream);
      streamRef.current = null;

      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }

      stableFramesRef.current = 0;
    };
  }, [cameraOpen]);

  const closeCamera = () => {
    setCameraOpen(false);
    setStarting(false);
    setModelLoading(false);
    setFaceReady(false);
    setCameraError("");
  };

  const handleCapture = async () => {
    const video = videoRef.current;

    if (
      !video ||
      !video.videoWidth ||
      !faceReady ||
      faceCount !== 1 ||
      capturing
    ) {
      return;
    }

    setCapturing(true);

    try {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");

      if (!ctx) throw new Error("Could not create image canvas.");

      // Save the selfie mirrored, matching the user's preview.
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const blob = await new Promise((resolve, reject) => {
        canvas.toBlob(
          (result) => {
            if (result) resolve(result);
            else reject(new Error("Could not create selfie image."));
          },
          "image/jpeg",
          0.92
        );
      });

      const file = new File([blob], `selfie-${Date.now()}.jpg`, {
        type: "image/jpeg",
      });

      onChange?.(file);
      closeCamera();
    } catch (err) {
      console.error("Selfie capture failed:", err);
      setCameraError("Could not capture selfie. Please try again.");
    } finally {
      setCapturing(false);
    }
  };

  const isCaptureReady =
    !starting &&
    !modelLoading &&
    !capturing &&
    !cameraError &&
    faceReady &&
    faceCount === 1;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}

      {
        mode === "auth" &&
        <p className="text-md text-gray-400 -mt-0.5">
          Live camera only — gallery or file upload is not allowed.
        </p>
      }

      <button
        type="button"
        onClick={() => setCameraOpen(true)}
        className={`relative w-full aspect-[4/3] max-h-64 border-2 border-dashed rounded-2xl overflow-hidden flex flex-col items-center justify-center gap-2 transition-colors ${error
          ? "border-red-400 bg-red-50"
          : "border-primary/40 bg-blue-50 hover:bg-blue-100"
          }`}
      >
        {preview ? (
          <>
            <img
              src={preview}
              alt="selfie"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <span className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs font-medium text-white bg-black/60 px-3 py-1.5 rounded-full">
              Retake live selfie
            </span>
          </>
        ) : (
          <>
            <MdPhotoCamera size={32} className="text-primary cursor-pointer" />
            <span className="text-sm text-gray-600 font-medium">
              Take live selfie
            </span>
          </>
        )}
      </button>

      {(error || cameraError) && !cameraOpen && (
        <p className="text-red-500 text-xs">{error || cameraError}</p>
      )}

      {cameraOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90dvh] overflow-y-auto shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h3 className="font-semibold text-gray-800">Live selfie</h3>

              <button
                type="button"
                onClick={closeCamera}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 cursor-pointer"
                aria-label="Close camera"
              >
                <MdClose size={20} className="text-gray-600" />
              </button>
            </div>

            <div className="relative bg-black aspect-[3/4] w-full overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover"
                style={{ transform: "scaleX(-1)" }}
              />

              {/* Oval face-position guide */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div
                  className={`w-[60%] h-[60%] rounded-[50%] border-[3px] transition-colors duration-200 ${faceReady
                    ? "border-green-400"
                    : faceCount > 1
                      ? "border-red-400"
                      : "border-white/80"
                    }`}
                  style={{
                    boxShadow: "0 0 0 999px rgba(0,0,0,0.28)",
                  }}
                />
              </div>

              <div
                className={`absolute top-4 left-3 right-3 text-center text-sm font-semibold px-3 py-2 rounded-xl ${faceReady
                  ? "bg-green-600/90 text-white"
                  : "bg-black/65 text-white"
                  }`}
              >
                {modelLoading
                  ? "Loading face detector..."
                  : instruction}
              </div>

              {starting && (
                <div className="absolute inset-0 flex items-center justify-center text-white text-sm bg-black/40">
                  Starting camera...
                </div>
              )}

              {cameraError && (
                <div className="absolute inset-0 flex items-center justify-center px-6 text-center text-sm text-red-200 bg-black/75">
                  {cameraError}
                </div>
              )}
            </div>

            <div className="px-4 pt-3 text-xs text-gray-500 text-center">
              {faceReady
                ? "Face position looks good. Keep still to capture."
                : "Keep your face inside the oval and look straight ahead."}
            </div>

            <div className="p-4 flex gap-3">
              <button
                type="button"
                onClick={closeCamera}
                className="flex-1 border border-gray-300 text-gray-700 rounded-xl py-2.5 text-sm font-semibold hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleCapture}
                disabled={!isCaptureReady}
                className={`flex-1 bg-primary-gradient text-white rounded-xl py-2.5 text-sm font-semibold disabled:opacity-50 flex items-center justify-center gap-1.5 ${isCaptureReady
                  ? "cursor-pointer"
                  : "cursor-not-allowed opacity-50"}`}
              >
                <MdPhotoCamera size={17} />
                {capturing ? "Capturing..." : "Capture"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveSelfieCapture;
