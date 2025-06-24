import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/common/database/prisma/prisma.service';

interface JwtPayload {
     sub: string; // ID del negocio
     email: string; // Email del negocio
     name: string; // Nombre del negocio
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
     // Define el nombre de la estrategia como 'jwt'
     constructor(private prisma: PrismaService) {
          super({
               // super es el constructor de PassportStrategy
               jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
               ignoreExpiration: false, // No ignorar la expiración del token
               secretOrKey: process.env.JWT_SECRET || 'defaultSecret', // Clave secreta para verificar el token
          });
     }

     // Método para validar el token JWT
     async validate(payload: JwtPayload) {
          const business = await this.prisma.business.findUnique({
               where: { id: payload.sub },
          });

          if (!business) {
               throw new UnauthorizedException('Invalid token');
          }

          return business;
     }
}
