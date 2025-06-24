import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/common/database/prisma/prisma.service';
import { DatabaseModule } from 'src/common/database/database.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
     imports: [
          DatabaseModule,
          PassportModule,
          JwtModule.register({
               secret: process.env.JWT_SECRET || 'defaultSecret',
               signOptions: { expiresIn: '8h' }, // Configura el tiempo de expiración del token
          }),
     ],
     providers: [AuthService, PrismaService, JwtStrategy], // strategy debe ser un proveedor para que nest la use
     controllers: [AuthController],
     exports: [AuthService], // Exportamos AuthService para que pueda ser usado en otros módulos
})
export class AuthModule {}
