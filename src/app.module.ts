import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './common/database/database.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { ConversationsModule } from './conversations/conversations.module';

@Module({
     imports: [DatabaseModule, AuthModule, ProductsModule, ConversationsModule],
     controllers: [AppController],
     providers: [AppService],
})
export class AppModule {}
