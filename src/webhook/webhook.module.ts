import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';
import { DatabaseModule } from 'src/common/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { BusinessService } from 'src/business/business.service';
import { AiModule } from 'src/ai/ai.module';

@Module({
     imports: [
          DatabaseModule, //necesario para la conexión a la base de datos
          ConfigModule, //necesario para la configuración de variables de entorno
          AiModule,
     ],
     controllers: [WebhookController],
     providers: [WebhookService, BusinessService],
})
export class WebhookModule {}
