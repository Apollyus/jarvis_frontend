/**
 * Globální konstanty aplikace
 */

export const STORAGE_KEYS = {
  API_KEY: 'mcp_chat_api_key',
  SESSIONS: 'mcp_chat_sessions',
  MESSAGES_PREFIX: 'mcp_chat_messages_',
  ACTIVE_SESSION: 'mcp_chat_active_session',
} as const;

export const MESSAGE_DEFAULTS = {
  MAX_LENGTH: 4000,
  TYPING_INDICATOR_DELAY: 300,
} as const;

export const SESSION_DEFAULTS = {
  DEFAULT_TITLE: 'Nová konverzace',
  TITLE_MAX_LENGTH: 100,
} as const;

export const UI_CONSTANTS = {
  TOAST_DURATION: 3000,
  SCROLL_BEHAVIOR: 'smooth' as ScrollBehavior,
} as const;