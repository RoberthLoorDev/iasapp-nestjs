import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './common/database/database.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { ConversationsModule } from './conversations/conversations.module';
import { WebhookModule } from './webhook/webhook.module';
import { BusinessService } from './business/business.service';
import { BusinessModule } from './business/business.module';

@Module({
     imports: [DatabaseModule, AuthModule, ProductsModule, ConversationsModule, WebhookModule, BusinessModule],
     controllers: [AppController],
     providers: [AppService, BusinessService],
})
export class AppModule {}
