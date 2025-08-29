/**
 * New Relic Agent Configuration cho Lotus Miles API
 * Cấu hình monitoring cho hệ thống microservices NestJS
 *
 * Hướng dẫn sử dụng:
 * 1. Cài đặt: npm install newrelic
 * 2. Import ở đầu main.ts: import 'newrelic'
 * 3. Thiết lập environment variables trong .env
 * 4. Khởi chạy với: node --experimental-loader=newrelic/esm-loader.js dist/main.js
 */

'use strict';

/**
 * Cấu hình New Relic Agent
 * Tất cả cấu hình có thể được override bằng environment variables
 */
exports.config = {
  /**
   * Tên ứng dụng - sẽ hiển thị trên New Relic dashboard
   * Có thể thiết lập khác nhau cho từng microservice:
   * - lotus-api-gateway
   * - lotus-ms-auth
   * - lotus-ms-user
   * - lotus-ms-loyalty
   * - lotus-ms-rewards
   */
  app_name: [process.env.NEW_RELIC_APP_NAME || 'lotus-miles-api'],

  /**
   * License key từ New Relic account
   * QUAN TRỌNG: Không hardcode license key, luôn sử dụng environment variable
   */
  license_key: process.env.NEW_RELIC_LICENSE_KEY,

  /**
   * Cấu hình Logging
   * Điều chỉnh mức độ log và output destination
   */
  logging: {
    /**
     * Mức độ log: 'fatal', 'error', 'warn', 'info', 'debug', 'trace'
     * Production: 'info' hoặc 'warn'
     * Development: 'debug'
     */
    level: process.env.NEW_RELIC_LOG_LEVEL || 'info',

    /**
     * File path để ghi log
     * null = ghi ra stdout
     */
    filepath: process.env.NEW_RELIC_LOG_FILE || null,

    /**
     * Bật/tắt logging
     */
    enabled: process.env.NEW_RELIC_LOG_ENABLED !== 'false',
  },

  /**
   * Cấu hình Distributed Tracing
   * Quan trọng cho hệ thống microservices để theo dõi request qua các service
   */
  distributed_tracing: {
    /**
     * Bật distributed tracing
     */
    enabled: true,

    /**
     * Exclude headers khỏi tracing (bảo mật)
     */
    exclude_request_uri: ['/health', '/metrics', '/favicon.ico'],
  },

  /**
   * Cấu hình Error Collection
   * Thu thập và phân tích lỗi trong ứng dụng
   */
  error_collector: {
    /**
     * Bật thu thập lỗi
     */
    enabled: true,

    /**
     * Bỏ qua các HTTP status codes
     * 404 thường không phải lỗi nghiêm trọng
     */
    ignore_status_codes: [404],

    /**
     * Bỏ qua các loại lỗi cụ thể
     */
    ignore_classes: ['ValidationError', 'UnauthorizedException'],

    /**
     * Capture attributes từ request
     */
    attributes: {
      enabled: true,
      include: [
        'request.headers.userAgent',
        'request.headers.referer',
        'request.method',
        'request.uri',
      ],
      exclude: [
        'request.headers.authorization',
        'request.headers.cookie',
        'request.headers.x-api-key',
      ],
    },
  },

  /**
   * Cấu hình Database Monitoring
   * Theo dõi performance của database queries
   */
  datastore_tracer: {
    /**
     * Bật database tracing
     */
    database_name_reporting: {
      enabled: true,
    },

    /**
     * Bật instance reporting (host, port)
     */
    instance_reporting: {
      enabled: true,
    },
  },

  /**
   * Cấu hình Slow SQL Queries
   * Capture các query chậm để tối ưu hóa
   */
  slow_sql: {
    enabled: true,
    /**
     * Threshold để coi là slow query (milliseconds)
     */
    max_samples: 10,
  },

  /**
   * Cấu hình Transaction Tracer
   * Theo dõi chi tiết các transaction chậm
   */
  transaction_tracer: {
    /**
     * Bật transaction tracing
     */
    enabled: true,

    /**
     * Threshold để capture transaction (seconds)
     * Transaction chậm hơn 0.5s sẽ được capture
     */
    transaction_threshold: 0.5,

    /**
     * Capture SQL trong transaction traces
     */
    record_sql: 'obfuscated', // 'off', 'raw', 'obfuscated'

    /**
     * Explain plans cho slow queries
     */
    explain_threshold: 500, // milliseconds
  },

  /**
   * Cấu hình Custom Attributes
   * Thêm metadata tùy chỉnh cho monitoring
   */
  attributes: {
    /**
     * Bật custom attributes
     */
    enabled: true,

    /**
     * Attributes được include trong tất cả destinations
     */
    include: ['request.*', 'response.*'],

    /**
     * Attributes bị exclude (bảo mật)
     */
    exclude: [
      'request.headers.authorization',
      'request.headers.cookie',
      'request.headers.x-api-key',
      'request.body.password',
      'request.body.token',
    ],
  },

  /**
   * Cấu hình Browser Monitoring
   * Nếu có frontend integration
   */
  browser_monitoring: {
    /**
     * Tắt browser monitoring cho API-only services
     */
    enable: false,
  },

  /**
   * Cấu hình Application Performance Monitoring (APM)
   */
  apdex_t: 0.1, // Apdex threshold (seconds) - 100ms cho API response

  /**
   * Cấu hình Rules cho URL grouping
   * Tránh metric explosion với dynamic URLs
   */
  rules: {
    /**
     * Ignore các routes không quan trọng
     */
    ignore: ['^/health$', '^/metrics$', '^/favicon.ico$'],

    /**
     * Normalize dynamic URLs
     * VD: /api/users/123 -> /api/users/*
     */
    name: [
      {
        pattern: '/api/users/[0-9]+',
        name: '/api/users/*',
      },
      {
        pattern: '/api/loyalty/members/[0-9]+',
        name: '/api/loyalty/members/*',
      },
      {
        pattern: '/api/rewards/[0-9]+',
        name: '/api/rewards/*',
      },
    ],
  },

  /**
   * Cấu hình Security
   * Bảo vệ thông tin nhạy cảm
   */
  security: {
    /**
     * Bật security agent
     */
    agent: {
      enabled: process.env.NODE_ENV === 'production',
    },

    /**
     * Cấu hình detection modes
     */
    detection: {
      rci: {
        enabled: true,
      },
      rxss: {
        enabled: true,
      },
    },
  },

  /**
   * Cấu hình Labels
   * Metadata để phân loại và filter trong New Relic
   */
  labels: {
    environment: process.env.NODE_ENV || 'development',
    service: process.env.NEW_RELIC_APP_NAME || 'lotus-miles-api',
    version: process.env.APP_VERSION || '1.0.0',
    region: process.env.AWS_REGION || 'ap-southeast-1',
    team: 'lotus-miles',
  },

  /**
   * Cấu hình High Security Mode
   * Bật trong production để tăng cường bảo mật
   */
  high_security: process.env.NEW_RELIC_HIGH_SECURITY === 'true',

  /**
   * Cấu hình Custom Events
   * Gửi custom metrics và events
   */
  custom_insights_events: {
    enabled: true,
    max_samples_stored: 10000,
  },

  /**
   * Cấu hình cho NestJS Framework
   * Tối ưu hóa cho NestJS decorators và modules
   */
  feature_flag: {
    /**
     * Bật support cho async/await
     */
    await_support: true,

    /**
     * Bật support cho Promise
     */
    promise_segments: true,
  },

  /**
   * Cấu hình Infinite Tracing (nếu có Pro/Enterprise plan)
   */
  infinite_tracing: {
    trace_observer: {
      host: process.env.NEW_RELIC_INFINITE_TRACING_TRACE_OBSERVER_HOST || '',
      port: process.env.NEW_RELIC_INFINITE_TRACING_TRACE_OBSERVER_PORT || 443,
    },
  },

  /**
   * Cấu hình cho từng microservice
   * Sử dụng environment variables để differentiate
   */
  ...(process.env.NEW_RELIC_APP_NAME === 'lotus-api-gateway' && {
    // Cấu hình đặc biệt cho API Gateway
    web_transactions_apdex: {
      '/api/auth/*': 0.2,
      '/api/loyalty/*': 0.15,
      '/api/rewards/*': 0.15,
    },
  }),

  ...(process.env.NEW_RELIC_APP_NAME === 'lotus-ms-loyalty' && {
    // Cấu hình đặc biệt cho MS-Loyalty
    transaction_tracer: {
      transaction_threshold: 0.3, // Loyalty service có thể chậm hơn
    },
  }),
};

/**
 * Custom Instrumentation cho NestJS
 * Thêm custom metrics và tracing
 */
if (typeof module !== 'undefined' && module.exports) {
  // Custom instrumentation sẽ được load sau khi New Relic agent khởi tạo
  const newrelic = require('newrelic');

  /**
   * Hàm helper để add custom attributes
   * Sử dụng trong controllers và services
   */
  global.addNewRelicAttribute = function (key, value) {
    try {
      newrelic.addCustomAttribute(key, value);
    } catch (error) {
      console.warn('Failed to add New Relic custom attribute:', error.message);
    }
  };

  /**
   * Hàm helper để record custom events
   * Sử dụng cho business metrics
   */
  global.recordNewRelicEvent = function (eventType, attributes) {
    try {
      newrelic.recordCustomEvent(eventType, attributes);
    } catch (error) {
      console.warn('Failed to record New Relic custom event:', error.message);
    }
  };

  /**
   * Hàm helper để set transaction name
   * Sử dụng trong dynamic routes
   */
  global.setNewRelicTransactionName = function (category, name) {
    try {
      newrelic.setTransactionName(category, name);
    } catch (error) {
      console.warn('Failed to set New Relic transaction name:', error.message);
    }
  };
}

/**
 * Environment Variables cần thiết:
 *
 * NEW_RELIC_APP_NAME=lotus-api-gateway (hoặc tên service tương ứng)
 * NEW_RELIC_LICENSE_KEY=your_license_key_here
 * NEW_RELIC_LOG_LEVEL=info
 * NEW_RELIC_HIGH_SECURITY=false
 * NODE_ENV=production
 * APP_VERSION=1.0.0
 * AWS_REGION=ap-southeast-1
 *
 * Cách sử dụng trong từng microservice:
 *
 * 1. API Gateway:
 *    NEW_RELIC_APP_NAME=lotus-api-gateway npm run start:prod
 *
 * 2. MS-Auth:
 *    NEW_RELIC_APP_NAME=lotus-ms-auth npm run start:prod
 *
 * 3. MS-User:
 *    NEW_RELIC_APP_NAME=lotus-ms-user npm run start:prod
 *
 * 4. MS-Loyalty:
 *    NEW_RELIC_APP_NAME=lotus-ms-loyalty npm run start:prod
 *
 * 5. MS-Rewards:
 *    NEW_RELIC_APP_NAME=lotus-ms-rewards npm run start:prod
 */
