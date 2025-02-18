export const LAST_ACTIVE_TIMEOUT =
  import.meta.env.VITE_ENVIRONMENT === 'test'
    ? 20 * 60 * 1000
    : 20 * 60 * 1000; // 20 minutes for production, 7 days for development
