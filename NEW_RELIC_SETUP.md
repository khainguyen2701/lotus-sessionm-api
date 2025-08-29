# Hướng dẫn thiết lập New Relic cho Lotus Miles API

## 1. Cài đặt New Relic Agent

```bash
# Cài đặt New Relic agent
pnpm add newrelic

# Hoặc sử dụng npm
npm install newrelic
```

## 2. Cấu hình Environment Variables

Tạo hoặc cập nhật file `.env` với các biến môi trường sau:

```env
# New Relic Configuration
NEW_RELIC_LICENSE_KEY=your_license_key_here
NEW_RELIC_APP_NAME=lotus-miles-api
NEW_RELIC_LOG_LEVEL=info
NEW_RELIC_HIGH_SECURITY=false
NEW_RELIC_LOG_ENABLED=true

# Application Info
APP_VERSION=1.0.0
AWS_REGION=ap-southeast-1
NODE_ENV=production
```

## 3. Cập nhật Main Files

### 3.1 API Gateway (apps/api-gateway/src/main.ts)

```typescript
// QUAN TRỌNG: Import New Relic ở đầu file, trước tất cả imports khác
import 'newrelic';

import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
// ... other imports

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);
  
  // Thêm custom attributes cho New Relic
  if (global.addNewRelicAttribute) {
    global.addNewRelicAttribute('service', 'api-gateway');
    global.addNewRelicAttribute('version', process.env.APP_VERSION || '1.0.0');
  }
  
  await app.listen(3000);
}
bootstrap();
```

### 3.2 MS-Auth (apps/ms-auth/src/main.ts)

```typescript
import 'newrelic';

import { NestFactory } from '@nestjs/core';
import { MsAuthModule } from './ms-auth.module';

async function bootstrap() {
  const app = await NestFactory.create(MsAuthModule);
  
  if (global.addNewRelicAttribute) {
    global.addNewRelicAttribute('service', 'ms-auth');
    global.addNewRelicAttribute('version', process.env.APP_VERSION || '1.0.0');
  }
  
  await app.listen(3001);
}
bootstrap();
```

### 3.3 Tương tự cho các microservices khác

- MS-User: port 3002
- MS-Loyalty: port 3003  
- MS-Rewards: port 3004

## 4. Cập nhật Package.json Scripts

Thêm các scripts mới vào `package.json`:

```json
{
  "scripts": {
    // Development với New Relic
    "start:dev:api-gateway:newrelic": "NEW_RELIC_APP_NAME=lotus-api-gateway nest start api-gateway --watch",
    "start:dev:ms-auth:newrelic": "NEW_RELIC_APP_NAME=lotus-ms-auth nest start ms-auth --watch",
    "start:dev:ms-user:newrelic": "NEW_RELIC_APP_NAME=lotus-ms-user nest start ms-user --watch",
    "start:dev:ms-loyalty:newrelic": "NEW_RELIC_APP_NAME=lotus-ms-loyalty nest start ms-loyalty --watch",
    "start:dev:ms-rewards:newrelic": "NEW_RELIC_APP_NAME=lotus-ms-rewards nest start ms-rewards --watch",
    
    // Production với New Relic
    "start:prod:api-gateway:newrelic": "NEW_RELIC_APP_NAME=lotus-api-gateway node dist/apps/api-gateway/main",
    "start:prod:ms-auth:newrelic": "NEW_RELIC_APP_NAME=lotus-ms-auth node dist/apps/ms-auth/main",
    "start:prod:ms-user:newrelic": "NEW_RELIC_APP_NAME=lotus-ms-user node dist/apps/ms-user/main",
    "start:prod:ms-loyalty:newrelic": "NEW_RELIC_APP_NAME=lotus-ms-loyalty node dist/apps/ms-loyalty/main",
    "start:prod:ms-rewards:newrelic": "NEW_RELIC_APP_NAME=lotus-ms-rewards node dist/apps/ms-rewards/main",
    
    // Start tất cả services với New Relic
    "start:all:newrelic": "concurrently \"npm run start:dev:api-gateway:newrelic\" \"npm run start:dev:ms-auth:newrelic\" \"npm run start:dev:ms-user:newrelic\" \"npm run start:dev:ms-loyalty:newrelic\" \"npm run start:dev:ms-rewards:newrelic\""
  }
}
```

## 5. Sử dụng Custom Monitoring trong Code

### 5.1 Trong Controllers

```typescript
import { Controller, Get, Post, Body } from '@nestjs/common';

@Controller('loyalty')
export class LoyaltyController {
  @Get('members/:id')
  async getMember(@Param('id') id: string) {
    // Thêm custom attributes
    if (global.addNewRelicAttribute) {
      global.addNewRelicAttribute('member.id', id);
      global.addNewRelicAttribute('operation', 'get_member');
    }
    
    try {
      const member = await this.loyaltyService.getMember(id);
      
      // Record custom event
      if (global.recordNewRelicEvent) {
        global.recordNewRelicEvent('MemberAccessed', {
          memberId: id,
          timestamp: new Date().toISOString(),
          success: true
        });
      }
      
      return member;
    } catch (error) {
      // Record error event
      if (global.recordNewRelicEvent) {
        global.recordNewRelicEvent('MemberAccessError', {
          memberId: id,
          error: error.message,
          timestamp: new Date().toISOString()
        });
      }
      throw error;
    }
  }
  
  @Post('points/calculate')
  async calculatePoints(@Body() request: any) {
    // Set custom transaction name
    if (global.setNewRelicTransactionName) {
      global.setNewRelicTransactionName('Custom', 'CalculatePoints');
    }
    
    // Add custom attributes
    if (global.addNewRelicAttribute) {
      global.addNewRelicAttribute('calculation.type', request.type);
      global.addNewRelicAttribute('calculation.amount', request.amount);
    }
    
    const result = await this.loyaltyService.calculatePoints(request);
    
    // Record business metric
    if (global.recordNewRelicEvent) {
      global.recordNewRelicEvent('PointsCalculated', {
        type: request.type,
        amount: request.amount,
        pointsEarned: result.points,
        timestamp: new Date().toISOString()
      });
    }
    
    return result;
  }
}
```

### 5.2 Trong Services

```typescript
import { Injectable } from '@nestjs/common';

@Injectable()
export class LoyaltyService {
  async processLoyaltyTransaction(transaction: any) {
    const startTime = Date.now();
    
    try {
      // Business logic here
      const result = await this.performTransaction(transaction);
      
      // Record performance metric
      const duration = Date.now() - startTime;
      if (global.recordNewRelicEvent) {
        global.recordNewRelicEvent('TransactionProcessed', {
          transactionId: transaction.id,
          duration: duration,
          success: true,
          timestamp: new Date().toISOString()
        });
      }
      
      return result;
    } catch (error) {
      // Record error with context
      if (global.recordNewRelicEvent) {
        global.recordNewRelicEvent('TransactionError', {
          transactionId: transaction.id,
          error: error.message,
          duration: Date.now() - startTime,
          timestamp: new Date().toISOString()
        });
      }
      throw error;
    }
  }
}
```

## 6. Monitoring Dashboard Setup

### 6.1 Key Metrics để theo dõi

1. **Application Performance**
   - Response time (Apdex score)
   - Throughput (requests per minute)
   - Error rate

2. **Database Performance**
   - Query response time
   - Slow queries
   - Database connections

3. **Business Metrics**
   - Points calculated per hour
   - Member registrations
   - Transaction success rate

4. **Infrastructure**
   - CPU usage
   - Memory usage
   - Network I/O

### 6.2 Alerts Setup

Tạo alerts cho:
- Response time > 500ms
- Error rate > 5%
- Database query time > 1s
- Memory usage > 80%

## 7. Deployment với New Relic

### 7.1 Docker Configuration

```dockerfile
# Dockerfile
FROM node:20-alpine

# Install New Relic agent
RUN npm install -g newrelic

# Copy New Relic config
COPY newrelic.js /app/newrelic.js

# Set environment variables
ENV NEW_RELIC_APP_NAME=lotus-miles-api
ENV NEW_RELIC_LICENSE_KEY=${NEW_RELIC_LICENSE_KEY}

# Start application with New Relic
CMD ["node", "-r", "newrelic", "dist/main.js"]
```

### 7.2 Kubernetes Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: lotus-api-gateway
spec:
  template:
    spec:
      containers:
      - name: api-gateway
        image: lotus/api-gateway:latest
        env:
        - name: NEW_RELIC_APP_NAME
          value: "lotus-api-gateway"
        - name: NEW_RELIC_LICENSE_KEY
          valueFrom:
            secretKeyRef:
              name: newrelic-secret
              key: license-key
        - name: NEW_RELIC_LOG_LEVEL
          value: "info"
```

## 8. Troubleshooting

### 8.1 Common Issues

1. **Agent không kết nối được**
   - Kiểm tra license key
   - Kiểm tra network connectivity
   - Xem log: `NEW_RELIC_LOG_LEVEL=debug`

2. **Không thấy data trên dashboard**
   - Đợi 5-10 phút sau khi start
   - Kiểm tra app name có đúng không
   - Kiểm tra agent có được import đầu tiên không

3. **Performance impact**
   - New Relic overhead thường < 3%
   - Có thể tắt một số features nếu cần:
     ```javascript
     transaction_tracer: { enabled: false },
     slow_sql: { enabled: false }
     ```

### 8.2 Debug Commands

```bash
# Kiểm tra New Relic agent status
NEW_RELIC_LOG_LEVEL=debug npm run start:dev:api-gateway:newrelic

# Test connection
curl -H "Content-Type: application/json" \
     -H "Api-Key: YOUR_LICENSE_KEY" \
     https://api.newrelic.com/v2/applications.json
```

## 9. Best Practices

1. **Security**
   - Không hardcode license key
   - Sử dụng environment variables
   - Bật high security mode trong production

2. **Performance**
   - Chỉ enable cần thiết features
   - Sử dụng sampling cho high-traffic endpoints
   - Monitor New Relic overhead

3. **Monitoring**
   - Tạo custom dashboards cho business metrics
   - Setup alerts cho critical thresholds
   - Regular review và optimize queries

4. **Development**
   - Sử dụng different app names cho dev/staging/prod
   - Test monitoring trong development
   - Document custom events và attributes

## 10. Useful Links

- [New Relic Node.js Agent Documentation](https://docs.newrelic.com/docs/agents/nodejs-agent/)
- [NestJS Integration Guide](https://docs.newrelic.com/docs/agents/nodejs-agent/extend-your-instrumentation/nodejs-custom-instrumentation/)
- [Custom Events API](https://docs.newrelic.com/docs/insights/insights-data-sources/custom-data/insert-custom-events-new-relic-apm-agents/)