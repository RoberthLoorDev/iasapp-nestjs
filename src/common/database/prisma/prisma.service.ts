import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
     async onModuleInit() {
          //esto se ejecuta cuando el modulo se inicializa
          await this.$connect();
          console.log('PrismaClient conectado a la base de datos');
     }
}
