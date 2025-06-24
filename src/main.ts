import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { PrismaService } from './common/database/prisma/prisma.service';

async function bootstrap() {
     const app = await NestFactory.create(AppModule);

     //habilitar ValidationPipe, lo que valida automáticamente los DTOs
     app.useGlobalPipes(
          new ValidationPipe({
               whitelist: true, //elimina las propiedades que no están definidas en los DTOs
               forbidNonWhitelisted: true, //lanza un error si se envían propiedades no definidas en los DTOs
               transform: true, //transforma los datos entrantes a los tipos definidos en los DTOs
               skipMissingProperties: true, //lanza un error si faltan propiedades requeridas en los DTOs
          }),
     );

     app.enableShutdownHooks(); //habilita los hooks de apagado para cerrar la aplicación correctamente

     const prismaService = app.get(PrismaService);
     // Conectamos PrismaClient a la base de datos
     process.on('beforeExit', () => {
          prismaService
               .$disconnect()
               .then(() => {
                    console.log(' PrismaClient desconectado correctamente de la base de datos (main.ts)');
               })
               .catch((err) => {
                    console.error('Error al desconectar PrismaClient:', err);
               });
     });

     await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
