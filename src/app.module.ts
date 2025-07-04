import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BusinessModule } from './business/business.module';
import { DatabaseModule } from './common/database/database.module';
import { ConversationsModule } from './conversations/conversations.module';
import { ProductsModule } from './products/products.module';
import { WebhookModule } from './webhook/webhook.module';
import { WhatsappModule } from './whatsapp/whatsapp.module';

@Module({
     imports: [DatabaseModule, AuthModule, ProductsModule, ConversationsModule, WebhookModule, BusinessModule, WhatsappModule],
     controllers: [AppController],
     providers: [AppService],
})
export class AppModule {}
