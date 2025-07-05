import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from 'src/products/products.module';
import { WhatsappModule } from 'src/whatsapp/whatsapp.module';
import { AiService } from './ai.service';

@Module({
     imports: [ConfigModule, ProductsModule, WhatsappModule, ProductsModule],
     providers: [AiService],
     exports: [AiService], // Exporting AiService to be used in other modules
})
export class AiModule {}
