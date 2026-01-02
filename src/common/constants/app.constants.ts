export const APP_CONSTANTS = {
  CORS: {
    ALLOWED_METHODS: [
      'GET',
      'POST',
      'PUT',
      'PATCH',
      'DELETE',
      'OPTIONS',
    ] as const,
    ALLOWED_HEADERS: ['Content-Type', 'Authorization', 'Accept'] as const,
    MAX_AGE_SECONDS: 86400,
  },
} as const;
