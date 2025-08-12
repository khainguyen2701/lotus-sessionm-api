import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { ConfigModule } from '@nestjs/config';
import { HttpClientService } from './services/http.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  providers: [CommonService, HttpClientService],
  exports: [CommonService, HttpClientService],
})
export class CommonModule {}
