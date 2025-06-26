import { Module } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { ConversationsController } from './conversations.controller';
import { DatabaseModule } from 'src/common/database/database.module';

@Module({
     imports: [DatabaseModule],
     providers: [ConversationsService],
     controllers: [ConversationsController],
})
export class ConversationsModule {}
