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
          required: true,
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
          required: true,
        },
        dob: {
          type: 'string',
          example: '2000-01-27',
          required: true,
        },
        address: {
          type: 'string',
          example: '123 Main St',
          required: true,
        },
        city: {
          type: 'string',
          example: 'New York',
          required: true,
        },
        state: {
          type: 'string',
          example: 'NY',
          required: true,
        },
        zip: {
          type: 'string',
          example: '10001',
          required: true,
        },
        country: {
          type: 'string',
          example: 'USA',
          required: true,
        },
        phone_numbers: {
          type: 'string',
          example: '0872702781',
          required: true,
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

export const AdminGetListUserSchema = {
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
                example: '0588d55c-c0df-492c-a29e-58982900ccbb',
              },
              user_name: {
                type: 'string',
                example: 'HanPhan',
              },
              user_email: {
                type: 'string',
                example: 'han.phan@kyanon.digital',
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
                      'Hội viên hạng thẻ Triệu dặm có thể tặng 01 thẻ hạng Bạch kim cho người thân trong Tài khoản gia đình.',
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
                      type: 'object',
                      properties: {
                        en: {
                          type: 'string',
                          example: 'Discounted advance seat selection',
                        },
                        vi: {
                          type: 'string',
                          example: 'Giá ưu đãi khi mua trước chỗ ngồi',
                        },
                      },
                    },
                  },
                  next_tier: {
                    type: 'string',
                    example: 'silver',
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
                example: 'Han',
              },
              last_name: {
                type: 'string',
                example: 'Phan',
              },
              gender: {
                type: 'string',
                example: 'f',
              },
              dob: {
                type: 'string',
                example: '2000-12-15',
              },
              address: {
                type: 'string',
                example: 'HCM, Phường 6, Quận 8, Thành phố Hồ Chí Minh',
              },
              city: {
                type: 'string',
                example: 'Thành phố Hồ Chí Minh',
              },
              state: {
                type: 'string',
                example: 'Quận 8',
              },
              zip: {
                type: 'string',
                example: '700000',
              },
              country: {
                type: 'string',
                example: 'Vietnam',
              },
              phone_numbers: {
                type: 'string',
                example: '0999696888',
              },
              points: {
                type: 'object',
                properties: {
                  id: {
                    type: 'string',
                    example: 'a1324b07-aaf3-420b-89f3-473905f3479e',
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
                    example: '2025-08-16T11:28:46.057Z',
                  },
                  created_at: {
                    type: 'string',
                    format: 'date-time',
                    example: '2025-08-16T11:28:46.057Z',
                  },
                },
              },
              user_number: {
                type: 'string',
                example: 'C7X-NBA-QTF',
              },
              district: {
                type: 'string',
                example: null,
              },
              ward: {
                type: 'string',
                example: null,
              },
              created_at: {
                type: 'string',
                format: 'date-time',
                example: '2025-08-16T11:28:46.057Z',
              },
              updated_at: {
                type: 'string',
                format: 'date-time',
                example: '2025-08-16T11:28:46.057Z',
              },
            },
          },
        },
        pagination: {
          type: 'object',
          properties: {
            total: {
              type: 'number',
              example: 3,
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
      example: '2025-08-17T17:11:41.752Z',
    },
  },
};

export const AdminGetDetailUserSchema = {
  type: 'object',
  properties: {
    success: {
      type: 'boolean',
      example: true,
    },
    data: {
      type: 'object',
      properties: {
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
                  example: '397e708f-c069-4cf6-b961-254738ecd609',
                },
                tier_name: {
                  type: 'string',
                  example: 'gold',
                },
                tier_description: {
                  type: 'string',
                  example:
                    'Hội viên hạng thẻ Triệu dặm có thể tặng 01 thẻ hạng Bạch kim cho người thân trong Tài khoản gia đình. Đây là quyền lợi đặc biệt của Vietnam Airlines dành cho hạng thẻ cao cấp nhất. Tìm hiểu quyền lợi của hội viên Triệu dặm.',
                },
                min_points: {
                  type: 'number',
                  example: 1000,
                },
                max_points: {
                  type: 'number',
                  example: 99999999,
                },
                priority: {
                  type: 'number',
                  example: 1,
                },
                benefit: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      en: {
                        type: 'string',
                        example:
                          'Priority waitlist & seat handling (including when Vietnam Airlines changes the flight)',
                      },
                      vi: {
                        type: 'string',
                        example:
                          'Ưu tiên danh sách chờ & xử lý chỗ (bao gồm khi Vietnam Airlines thay đổi chuyến bay)',
                      },
                    },
                  },
                  example: [
                    {
                      en: 'Priority waitlist & seat handling (including when Vietnam Airlines changes the flight)',
                      vi: 'Ưu tiên danh sách chờ & xử lý chỗ (bao gồm khi Vietnam Airlines thay đổi chuyến bay)',
                    },
                    {
                      en: 'Priority selection of available seats at airport check-in',
                      vi: 'Ưu tiên chọn ghế còn trống khi làm thủ tục tại sân bay',
                    },
                    {
                      en: 'Free advance seat selection for Business/Premium Economy/Economy Flex/Standard until 26h before departure',
                      vi: 'Miễn phí chọn trước chỗ ngồi cho vé Thương gia/Phổ thông đặc biệt/Phổ thông linh hoạt/Phổ thông tiêu chuẩn (đến 26 giờ trước giờ bay)',
                    },
                    {
                      en: '30% off advance seat selection for Economy Saver/Super Saver',
                      vi: 'Giảm 30% phí chọn trước chỗ ngồi cho vé Phổ thông tiết kiệm/Siêu tiết kiệm',
                    },
                    {
                      en: 'Possible complimentary upgrade to Business at check-in (subject to priority)',
                      vi: 'Có thể được nâng hạng Thương gia miễn phí tại quầy (theo thứ tự ưu tiên)',
                    },
                    {
                      en: 'Possible complimentary upgrade to Premium Economy at check-in if fare/conditions met and seats available',
                      vi: 'Có thể được nâng lên Phổ thông đặc biệt tại quầy nếu vé/điều kiện phù hợp và còn chỗ',
                    },
                    {
                      en: 'Guaranteed seat: booking class Y on international (≥72h); Y/B on HAN–DAD–SGN domestic (≥48h)',
                      vi: 'Đảm bảo chỗ hạng Y quốc tế (đặt trước ≥72 giờ); hạng Y/B nội địa HAN–DAD–SGN (đặt trước ≥48 giờ)',
                    },
                    {
                      en: 'SkyPriority check-in; companions traveling on award tickets on the same flight may use SkyPriority check-in',
                      vi: 'Làm thủ tục tại quầy SkyPriority; người thân đi vé thưởng cùng chuyến được làm thủ tục SkyPriority',
                    },
                    {
                      en: 'Priority boarding with SkyPriority customers (subject to airport availability)',
                      vi: 'Ưu tiên lên máy bay cùng khách SkyPriority (tùy khả năng cung ứng sân bay)',
                    },
                    {
                      en: 'SkyPriority baggage tags',
                      vi: 'Gắn thẻ hành lý ưu tiên SkyPriority',
                    },
                    {
                      en: '+1 checked bag (23kg)',
                      vi: '+1 kiện hành lý ký gửi 23kg',
                    },
                    {
                      en: 'Free one golf set up to 23kg',
                      vi: 'Miễn phí 01 bộ golf đến 23kg',
                    },
                    {
                      en: 'Business lounge access (regardless of fare class)',
                      vi: 'Sử dụng phòng khách Thương gia (không phân biệt hạng vé)',
                    },
                    {
                      en: '+50% bonus miles after flights',
                      vi: '+50% dặm thưởng sau mỗi chuyến bay',
                    },
                    {
                      en: '1,500 birthday bonus miles',
                      vi: 'Tặng 1.500 dặm thưởng sinh nhật',
                    },
                    {
                      en: 'SkyTeam benefits: waitlist/seat selection at international airports; priority check-in & boarding; extra baggage (+1 piece or +10kg)',
                      vi: 'Ưu đãi SkyTeam: danh sách chờ/chọn ghế tại sân bay quốc tế; làm thủ tục & lên máy bay ưu tiên; thêm hành lý (+1 kiện hoặc +10kg)',
                    },
                  ],
                },
                next_tier: {
                  type: 'string',
                  example: null,
                },
                previous_tier: {
                  type: 'string',
                  example: 'silver',
                },
                maintain_points: {
                  type: 'number',
                  example: 1000,
                },
                points_reward: {
                  type: 'number',
                  example: 1,
                },
                reward_ratio: {
                  type: 'string',
                  example: '5.00',
                },
              },
            },
            first_name: {
              type: 'string',
              example: 'tin',
            },
            last_name: {
              type: 'string',
              example: 'Khaiiiii',
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
              example: '14 Đường Apollo',
            },
            city: {
              type: 'string',
              example: 'Thành phố Hồ Chí Minh',
            },
            state: {
              type: 'string',
              example: 'Thành phố Thủ Đức',
            },
            zip: {
              type: 'string',
              example: '10001',
            },
            country: {
              type: 'string',
              example: 'VietNam',
            },
            phone_numbers: {
              type: 'string',
              example: '0976793792',
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
                  example: 9998,
                },
                used_points: {
                  type: 'number',
                  example: 0,
                },
                balance_points: {
                  type: 'number',
                  example: 9998,
                },
                available_points: {
                  type: 'number',
                  example: 9998,
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
            district: {
              type: 'string',
              example: 'Thành phố Thủ Đức',
            },
            ward: {
              type: 'string',
              example: 'Phường Long Bình',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              example: '2025-08-15T03:19:27.023Z',
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              example: '2025-08-20T00:55:46.552Z',
            },
          },
        },
        statistics: {
          type: 'object',
          properties: {
            total_accumulated_points: {
              type: 'number',
              example: 10176,
            },
            total_spent_points: {
              type: 'number',
              example: 0,
            },
            current_balance: {
              type: 'number',
              example: 9998,
            },
            total_transactions: {
              type: 'number',
              example: 9,
            },
            monthly_transactions: {
              type: 'number',
              example: 9,
            },
            monthly_earned_points: {
              type: 'number',
              example: 10176,
            },
            monthly_spent_points: {
              type: 'number',
              example: 0,
            },
            total_manual_requests: {
              type: 'number',
              example: 12,
            },
            pending_manual_requests: {
              type: 'number',
              example: 4,
            },
            processed_manual_requests: {
              type: 'number',
              example: 6,
            },
            rejected_manual_requests: {
              type: 'number',
              example: 2,
            },
            monthly_manual_requests: {
              type: 'number',
              example: 12,
            },
            total_manual_approved_points: {
              type: 'number',
              example: 5825,
            },
            membership_duration_days: {
              type: 'number',
              example: 7,
            },
          },
        },
      },
    },
    timestamp: {
      type: 'string',
      format: 'date-time',
      example: '2025-08-22T04:24:38.909Z',
    },
  },
};

export const AdminUpdateUserSchema = {
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
        created_at: {
          type: 'string',
          format: 'date-time',
          example: '2025-08-15T03:19:27.023Z',
        },
        updated_at: {
          type: 'string',
          format: 'date-time',
          example: '2025-08-22T00:36:58.939Z',
        },
        first_name: {
          type: 'string',
          example: 'tin',
        },
        last_name: {
          type: 'string',
          example: 'Khaiiiii',
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
          example: '14 Đường Apollo',
        },
        city: {
          type: 'string',
          example: 'Thành phố Hồ Chí Minh',
        },
        state: {
          type: 'string',
          example: 'Thành phố Thủ Đức',
        },
        zip: {
          type: 'string',
          example: '10001',
        },
        country: {
          type: 'string',
          example: 'VietNam',
        },
        phone_numbers: {
          type: 'string',
          example: '0976793792',
        },
        user_number: {
          type: 'string',
          example: 'KN6-HDW-NMV',
        },
        district: {
          type: 'string',
          example: 'Thành phố Thủ Đức',
        },
        ward: {
          type: 'string',
          example: 'Phường Long Bình',
        },
        status: {
          type: 'string',
          example: 'inactive',
        },
      },
    },
    timestamp: {
      type: 'string',
      format: 'date-time',
      example: '2025-08-22T07:56:31.133Z',
    },
  },
};

export const AdminUpdateUserSchemaError = {
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
          type: 'array',
          items: {
            type: 'string',
          },
          example: ['User status must be either active or inactive'],
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
      example: '2025-08-22T07:55:37.266Z',
    },
  },
};

export const AdminGetDetailUserSchemaError = {
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
          example: 'Validation failed (uuid is expected)',
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
      example: '2025-08-22T08:03:21.977Z',
    },
  },
};
