//Member portal
export const AuthMemberSignUpSchemaCreated = {
  type: 'object',
  properties: {
    success: {
      type: 'boolean',
      example: true,
    },
    data: {
      type: 'object',
      properties: {
        user_id: {
          type: 'string',
          example: '755006af-8cd4-434b-9526-40f0002e742e',
        },
        account_id: {
          type: 'string',
          example: '705eb143-033d-40b6-bea1-4937fcea4b4c',
        },
        user: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: '755006af-8cd4-434b-9526-40f0002e742e',
            },
            user_name: {
              type: 'string',
              example: 'khaidev1',
            },
            user_email: {
              type: 'string',
              example: 'khaidev1@gmail.com',
            },
            user_type: {
              type: 'string',
              example: 'user',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              example: '2025-08-11T04:08:31.348Z',
            },
          },
        },
        access_token: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
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

export const AuthMemberSignUpSchemaError = {
  type: 'object',
  properties: {
    success: {
      type: 'boolean',
      example: false,
    },
    statusCode: {
      type: 'number',
      example: 500,
    },
    message: {
      type: 'string',
      example: 'Email already exists',
    },
    timestamp: {
      type: 'string',
      format: 'date-time',
      example: '2025-08-11T11:08:31.789Z',
    },
  },
};

export const AuthMemberSignInSchemaError = {
  type: 'object',
  properties: {
    success: {
      type: 'boolean',
      example: false,
    },
    statusCode: {
      type: 'number',
      example: 500,
    },
    message: {
      type: 'string',
      example: 'Email already exists',
    },
    timestamp: {
      type: 'string',
      format: 'date-time',
      example: '2025-08-11T11:08:31.789Z',
    },
  },
};

export const AuthMemberSignInSchemaSuccess = {
  type: 'object',
  properties: {
    success: {
      type: 'boolean',
      example: true,
    },
    data: {
      type: 'object',
      properties: {
        user_id: {
          type: 'string',
          example: '5f1f98c2-0c13-49aa-823a-7288139a9739',
        },
        access_token: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
        refresh_token: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
    },
    timestamp: {
      type: 'string',
      format: 'date-time',
      example: '2024-03-14T12:00:00Z',
    },
  },
};

// Admin portal
