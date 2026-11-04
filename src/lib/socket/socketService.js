"use client";

import { io } from "socket.io-client";

let socket = null;

/**
 * Connect to the backend socket server.
 * Idempotent — calling multiple times returns the same socket.
 *
 * @param {string} accessToken  — the current JWT access token
 * @returns {Socket}
 */
export const connectSocket = (accessToken) => {
  if (socket?.connected) return socket;

  socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") || "http://localhost:9000", {
    auth:             { token: accessToken },
    transports:       ["websocket", "polling"],
    reconnectionDelay: 2000,
    reconnectionAttempts: 5,
    autoConnect:      true,
  });

  socket.on("connect", () => {
    console.log("[Socket] Connected:", socket.id);
  });

  socket.on("authenticated", ({ user_id, user_type }) => {
    console.log("[Socket] Authenticated as", user_id, user_type);
  });

  socket.on("disconnect", (reason) => {
    console.log("[Socket] Disconnected:", reason);
  });

  socket.on("connect_error", (err) => {
    console.error("[Socket] Connection error:", err.message);
  });

  return socket;
};

/**
 * Disconnect and destroy the socket instance.
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

/**
 * Get the current socket instance (may be null if not connected).
 */
export const getSocket = () => socket;
