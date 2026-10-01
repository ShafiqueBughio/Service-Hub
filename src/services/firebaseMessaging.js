"use client";

import { getMessaging, isSupported, getToken, onMessage } from "firebase/messaging";
import app from "@/lib/firebase/firebase";
import api from "@/lib/api/client";

export const initializeMessaging = async () => {
  try {
    if (typeof window === "undefined") return null;
    if (!("Notification" in window)) return null;

    const supported = await isSupported();
    if (!supported) return null;

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.log("Notification permission denied.");
      return null;
    }

    const messaging = getMessaging(app);

    // getToken() returns the FCM web push token (Vapid-based)
    // This is the token Firebase Admin uses to send push notifications
    const fcmToken = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    });

    if (!fcmToken) {
      console.warn("No FCM token received.");
      return messaging;
    }

    // console.log("FCM Token (for push):", fcmToken);

    // Save this token to backend — stored in fcm_token column in user_sessions
    // We call it fid in the API body but the value is the FCM web push token
    try {
      await api.patch("/user/update_fcm", { fcm_token:fcmToken });
      console.log("FCM token saved successfully.");
    } catch (error) {
      console.error("Failed to save FCM token:", error);
    }

    // Handle foreground notifications (when app tab is open and focused)
    onMessage(messaging, (payload) => {
      console.log("Foreground notification received:", payload);
      const title = payload.notification?.title ?? "Notification";
      const body  = payload.notification?.body  ?? "";
      if (Notification.permission === "granted") {
        new Notification(title, { body, icon: "/next.svg" });
      }
    });

    return messaging;
  } catch (error) {
    console.error("Firebase Messaging initialization failed:", error);
    return null;
  }
};
