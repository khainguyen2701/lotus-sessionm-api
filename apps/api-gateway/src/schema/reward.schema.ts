export const ForbiddenSchemaError = {
  type: 'object',
  properties: {
    success: {
      type: 'boolean',
      example: false,
    },
    statusCode: {
      type: 'number',
      example: 403,
    },
    message: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'You do not have access',
        },
        error: {
          type: 'string',
          example: 'Forbidden',
        },
        statusCode: {
          type: 'number',
          example: 403,
        },
      },
    },
    timestamp: {
      type: 'string',
      format: 'date-time',
      example: '2025-08-21T07:34:24.587Z',
    },
  },
};

export const BadRequestSchemaError = {
  type: 'object',
  properties: {
    success: {
      type: 'boolean',
      example: false,
    },
    statusCode: {
      type: 'number',
      example: 400,
    },
    message: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'User ID is required',
        },
        error: {
          type: 'string',
          example: 'Bad Request',
        },
        statusCode: {
          type: 'number',
          example: 400,
        },
      },
    },
    timestamp: {
      type: 'string',
      format: 'date-time',
      example: '2025-08-21T07:36:51.062Z',
    },
  },
};

export const TokenSchemaError = {
  type: 'object',
  properties: {
    success: {
      type: 'boolean',
      example: false,
    },
    statusCode: {
      type: 'number',
      example: 400,
    },
    message: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Token is invalid',
        },
        error: {
          type: 'string',
          example: 'Unauthorized',
        },
        statusCode: {
          type: 'number',
          example: 401,
        },
      },
    },
    timestamp: {
      type: 'string',
      format: 'date-time',
      example: '2025-08-21T07:36:51.062Z',
    },
  },
};

export const GetTransactionResponse = {
  type: 'object',
  properties: {
    success: {
      type: 'boolean',
      example: true,
    },
    data: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                example: 'fff997c7-4a1e-40c2-bc24-30f405dcbef1',
              },
              transaction_type: {
                type: 'string',
                example: 'earn',
              },
              description: {
                type: 'string',
                example: 'Points awarded for manual request: Test 3',
              },
              transaction_source: {
                type: 'string',
                example: 'internal',
              },
              transaction_date: {
                type: 'string',
                format: 'date-time',
                example: '2025-08-20T08:14:49.002Z',
              },
              created_at: {
                type: 'string',
                format: 'date-time',
                example: '2025-08-20T01:14:48.902Z',
              },
              updated_at: {
                type: 'string',
                format: 'date-time',
                example: '2025-08-20T01:14:48.902Z',
              },
              user: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                    example: '08fffc48-e81d-4923-8519-2d06df4b0877',
                  },
                  user_name: {
                    type: 'string',
                    example: 'tinnguyen',
                  },
                  first_name: {
                    type: 'string',
                    example: 'tin',
                  },
                  last_name: {
                    type: 'string',
                    example: 'Khaiiiii',
                  },
                  user_number: {
                    type: 'string',
                    example: 'KN6-HDW-NMV',
                  },
                },
              },
              status: {
                type: 'string',
                example: 'processed',
              },
              points_used: {
                type: 'number',
                example: 995,
              },
              points_used_at: {
                type: 'string',
                format: 'date-time',
                example: '2025-08-20T08:14:49.002Z',
              },
              reason: {
                type: 'string',
                example:
                  'Manual request approved - Request ID: b97f2623-e69a-4d0e-9da4-65911d316b58',
              },
            },
          },
        },
        pagination: {
          type: 'object',
          properties: {
            total: {
              type: 'number',
              example: 6,
            },
            page: {
              type: 'number',
              example: 1,
            },
            size: {
              type: 'number',
              example: 10,
            },
            totalPages: {
              type: 'number',
              example: 1,
            },
          },
        },
      },
    },
    timestamp: {
      type: 'string',
      format: 'date-time',
      example: '2025-08-21T07:38:53.111Z',
    },
  },
};
