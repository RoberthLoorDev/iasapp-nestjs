import { Module } from '@nestjs/common';
import { BusinessController } from './business.controller';
import { BusinessService } from './business.service';
import { PrismaService } from 'src/common/database/prisma/prisma.service';

@Module({
     imports: [],
     controllers: [BusinessController],
     providers: [BusinessService, PrismaService],
     exports: [BusinessService],
})
export class BusinessModule {}
