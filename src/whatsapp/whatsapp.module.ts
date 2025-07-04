import { Module } from '@nestjs/common';
import { WhatsappApiService } from './whatsapp-api/whatsapp-api.service';
import { ConfigModule } from '@nestjs/config';

@Module({
     imports: [ConfigModule],
     providers: [WhatsappApiService],
     exports: [WhatsappApiService],
})
export class WhatsappModule {}
