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
          example: '08fffc48-e81d-4923-8519-2d06df4b0877',
        },
        user_name: {
          type: 'string',
          example: 'tinnguyen',
        },
        user_email: {
          type: 'string',
          example: 'tin.nguyen@kyanon.digital',
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
              example: '3c81f1b1-c391-4b2d-8255-2a25e73aa915',
            },
            tier_name: {
              type: 'string',
              example: 'bronze',
            },
            tier_description: {
              type: 'string',
              example:
                'Hội viên hạng thẻ Triệu dặm có thể tặng 01 thẻ hạng Bạch kim cho người thân trong Tài khoản gia đình. Đây là quyền lợi đặc biệt của Vietnam Airlines dành cho hạng thẻ cao cấp nhất. Tìm hiểu quyền lợi của hội viên Triệu dặm.',
            },
            min_points: {
              type: 'number',
              example: 100,
            },
            max_points: {
              type: 'number',
              example: 499,
            },
            priority: {
              type: 'number',
              example: 3,
            },
            benefit: {
              type: 'array',
              items: {
                type: 'string',
              },
              example: [
                'Miễn phí hoặc giảm giá khi mua trước chỗ ngồi',
                'Làm thủ tục tại quầy ưu tiên - Mời thêm 5 khách',
                'Ưu tiên chọn chỗ ngồi khi làm thủ tục tại sân bay (nếu còn chỗ trống)',
                'Ưu tiên xác nhận chỗ trong trường hợp Vietnam Airlines thay đổi chuyến bay',
                'Gắn thẻ hành lý ưu tiên',
                'Tặng thêm hành lý ký gửi 2 kiện 23 kg',
                'Mang 01 bộ golf miễn phí theo chính sách ưu đãi hành lý',
                'Ưu tiên lên máy bay',
                'Quyền lợi khác - Tặng thêm dặm thưởng sau chuyến bay Tặng thêm 100% số dặm được cộng của chuyến bay',
                'Quyền lợi khác - Tặng dặm thưởng dịp sinh nhật  2.000 dặm',
                'Sử dụng phòng khách Thương gia/phòng khách Bông Sen - Mời thêm 3 khách VN, 1 khách nước ngoài',
                'Lối đi ưu tiên tại khu vực an ninh soi chiếu hoặc khu vực xuất nhập cảnh tại sân bay có cung ứng dịch vụ',
                'Dịch vụ đón tiễn tại sân bay "Meet & Greet"',
                'Quyền lợi khác - Tặng 01 thẻ Bạch kim cho người thân trong Tài khoản Gia đình',
              ],
            },
            next_tier: {
              type: 'string',
              example: 'gold',
            },
            previous_tier: {
              type: 'string',
              example: null,
            },
            maintain_points: {
              type: 'number',
              example: 100,
            },
            points_reward: {
              type: 'number',
              example: 1,
            },
            reward_ratio: {
              type: 'string',
              example: '10.00',
            },
          },
        },
        first_name: {
          type: 'string',
          example: 'tin',
        },
        last_name: {
          type: 'string',
          example: 'nguyen',
        },
        gender: {
          type: 'string',
          example: 'm',
        },
        dob: {
          type: 'string',
          example: '2000-01-27',
        },
        address: {
          type: 'string',
          example: '123 Main St',
        },
        city: {
          type: 'string',
          example: 'New York',
        },
        state: {
          type: 'string',
          example: 'NY',
        },
        zip: {
          type: 'string',
          example: '10001',
        },
        country: {
          type: 'string',
          example: 'USA',
        },
        phone_numbers: {
          type: 'string',
          example: '0872702781',
        },
        points: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: '213bd16d-9d60-467b-b581-2c421896b9ac',
            },
            total_points: {
              type: 'number',
              example: 150,
            },
            used_points: {
              type: 'number',
              example: 0,
            },
            balance_points: {
              type: 'number',
              example: 150,
            },
            available_points: {
              type: 'number',
              example: 150,
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              example: '2025-08-15T03:19:27.023Z',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              example: '2025-08-15T03:19:27.023Z',
            },
          },
        },
        user_number: {
          type: 'string',
          example: 'KN6-HDW-NMV',
        },
        created_at: {
          type: 'string',
          format: 'date-time',
          example: '2025-08-15T03:19:27.023Z',
        },
        updated_at: {
          type: 'string',
          format: 'date-time',
          example: '2025-08-15T04:05:16.865Z',
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
