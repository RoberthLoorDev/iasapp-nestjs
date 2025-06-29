import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';
import { DatabaseModule } from 'src/common/database/database.module';
import { ConfigModule } from '@nestjs/config';

@Module({
     imports: [
          DatabaseModule, //necesario para la conexión a la base de datos
          ConfigModule, //necesario para la configuración de variables de entorno
     ],
     controllers: [WebhookController],
     providers: [WebhookService],
})
export class WebhookModule {}
