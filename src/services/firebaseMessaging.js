"use client";

import {
  getMessaging,
  isSupported,
  onRegistered,
  register,
} from "firebase/messaging";

import app from "@/lib/firebase";
import api from "@/lib/api/client";

export const initializeMessaging = async () => {
  try {
    if (typeof window === "undefined") return null;

    if (!("Notification" in window)) {
      console.log("Notifications are not supported by this browser.");
      return null;
    }

    const supported = await isSupported();

    if (!supported) {
      console.log("Firebase Cloud Messaging is not supported.");
      return null;
    }

    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      console.log("Notification permission denied.");
      return null;
    }

    const messaging = getMessaging(app);

    onRegistered(messaging, async (installationId) => {
      console.log("Firebase Installation ID:", installationId);

      try {
        await api.patch("/user/update_fcm", {
          fcm_token: installationId,
        });

        console.log("Firebase Installation ID saved successfully.");
      } catch (error) {
        console.error(
          "Failed to save Firebase Installation ID:",
          error
        );
      }
    });

    await register(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    });

    console.log("Firebase Messaging registered successfully.");

    return messaging;
  } catch (error) {
    console.error("Firebase Messaging initialization failed:", error);
    return null;
  }
};