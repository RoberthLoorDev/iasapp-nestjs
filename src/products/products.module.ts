import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { DatabaseModule } from 'src/common/database/database.module';

@Module({
     imports: [DatabaseModule],
     providers: [ProductsService],
     controllers: [ProductsController],
     exports: [ProductsService], // Exporting ProductsService to be used in other modules
})
export class ProductsModule {}
