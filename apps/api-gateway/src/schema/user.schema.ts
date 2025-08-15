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
          example: '3623e0a9-2ca4-4fbc-b1e1-ef1a9f642af5',
        },
        user_email: {
          type: 'string',
          example: 'khai.nguyen@kyanon.digital',
        },
        user_type: {
          type: 'string',
          example: 'user',
        },
        tier: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'a8285f70-01fc-4254-9aba-0f7c56582cd9',
            },
            tier_name: {
              type: 'string',
              example: 'silver',
            },
            tier_description: {
              type: 'string',
              example:
                'Hội viên hạng Bạc được hưởng giá ưu đãi khi mua trước chỗ ngồi và ưu tiên xác nhận chỗ khi Vietnam Airlines thay đổi chuyến bay. Tìm hiểu thêm quyền lợi dành cho hội viên hạng Bạc.',
            },
            min_points: {
              type: 'number',
              example: 0,
            },
            max_points: {
              type: 'number',
              example: 2000,
            },
            priority: {
              type: 'number',
              example: 5,
            },
            benefit: {
              type: 'array',
              items: {
                type: 'string',
              },
              example: [
                'Ưu tiên xác nhận chỗ trong trường hợp Vietnam Airlines thay đổi chuyến bay',
              ],
            },
          },
        },
        first_name: {
          type: 'string',
          example: 'khai',
        },
        last_name: {
          type: 'string',
          example: 'nguyen',
        },
        points: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: 'bba989cc-9ae3-4800-9314-6569e1064c39',
            },
            total_points: {
              type: 'number',
              example: 0,
            },
            used_points: {
              type: 'number',
              example: 0,
            },
            balance_points: {
              type: 'number',
              example: 0,
            },
            available_points: {
              type: 'number',
              example: 0,
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              example: '2025-08-15T01:15:57.933Z',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              example: '2025-08-15T01:15:57.933Z',
            },
          },
        },
        user_number: {
          type: 'string',
          example: 'AP8-U3Q-58L',
        },
        created_at: {
          type: 'string',
          format: 'date-time',
          example: '2025-08-15T01:15:57.933Z',
        },
        updated_at: {
          type: 'string',
          format: 'date-time',
          example: '2025-08-15T01:15:57.933Z',
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
