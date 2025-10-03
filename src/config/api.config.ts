/**
 * API konfigurace a konstanty
 */

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  WS_URL: import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws/chat',
  MAX_RECONNECT_ATTEMPTS: Number(import.meta.env.VITE_MAX_RECONNECT_ATTEMPTS) || 5,
  RECONNECT_DELAY: Number(import.meta.env.VITE_RECONNECT_DELAY) || 1000,
} as const;

export const API_ENDPOINTS = {
  LOGIN: '/api/auth/login',
  LOGOUT: '/api/auth/logout',
  VALIDATE_KEY: '/api/auth/validate',
} as const;