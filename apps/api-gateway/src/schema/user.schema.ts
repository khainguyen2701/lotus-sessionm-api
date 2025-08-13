export const UserGetProfileSchemaSuccess = {
  type: 'object',
  properties: {
    success: {
      type: 'boolean',
      example: true,
    },
    data: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          example: '755006af-8cd4-434b-9526-40f0002e742e',
        },
        user_email: {
          type: 'string',
          example: 'khaidev1@gmail.com',
        },
        user_type: {
          type: 'string',
          example: 'user',
        },
        tier: {
          type: 'object',
          properties: {},
        },
        sessionm_account: {
          type: 'object',
          properties: {},
        },
        first_name: {
          type: 'string',
          example: 'Khai',
        },
        last_name: {
          type: 'string',
          example: 'Dev',
        },
        created_at: {
          type: 'string',
          format: 'date-time',
          example: '2025-08-11T11:08:31.789Z',
        },
        updated_at: {
          type: 'string',
          format: 'date-time',
          example: '2025-08-11T11:08:31.789Z',
        },
      },
    },
    timestamp: {
      type: 'string',
      format: 'date-time',
      example: '2025-08-11T11:08:31.789Z',
    },
  },
};

export const UserGetProfileSchemaError = {
  type: 'object',
  properties: {
    success: {
      type: 'boolean',
      example: false,
    },
    message: {
      type: 'string',
      example: 'User not found',
    },
    timestamp: {
      type: 'string',
      format: 'date-time',
      example: '2025-08-11T11:08:31.789Z',
    },
  },
};
