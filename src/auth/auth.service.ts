import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/common/database/prisma/prisma.service';
import { RegisterBusinessDto } from './dto/register-business.dto';
import * as bcrypt from 'bcryptjs';
import { LoginBusinessDto } from './dto/login-business.dto';
import { JwtService } from '@nestjs/jwt';
import { normalizePhoneNumber } from 'src/utils/phone-number.utils';

@Injectable()
export class AuthService {
     //inyectamos prisma service
     constructor(
          private readonly prisma: PrismaService,
          private readonly jwtService: JwtService, // inyectamos JwtService para generar tokens JWT
     ) {}

     //metodo para registrar un usuario
     async register(registerDto: RegisterBusinessDto) {
          const { email, password, firstName, lastName, address, phoneNumber } = registerDto;

          //normalizar el numero de telefono del negocio
          const normalizedPhoneNumber = phoneNumber ? normalizePhoneNumber(phoneNumber, 'EC') : null;
          if (!normalizedPhoneNumber) throw new BadRequestException('Invalid phone number format');

          //verificar si el usuario ya existe por medio del email
          const existingBusiness = await this.prisma.business.findUnique({
               where: { email: email },
          });

          if (existingBusiness) {
               throw new ConflictException('A business with this email already exists');
          }

          // hasheamos la contraseña
          const hashedPassword = await bcrypt.hash(password, 10);

          //crear negocio en la base de datos
          const newBusiness = await this.prisma.business.create({
               data: {
                    name: registerDto.name,
                    email,
                    password: hashedPassword,
                    firstName,
                    lastName,
                    address,
                    phoneNumber: normalizedPhoneNumber,
               },

               //seleccionamos los campos que podemos retornar al crear el negocio
               select: {
                    id: true,
                    name: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    address: true,
                    phoneNumber: true,
                    createdAt: true,
                    updatedAt: true,
               },
          });

          return newBusiness;
     }

     //metodo para iniciar sesion
     async login(loginDto: LoginBusinessDto) {
          const { email, password } = loginDto;

          //buscar el negocio por email
          const business = await this.prisma.business.findUnique({
               where: { email: email },
          });
          if (!business) {
               throw new UnauthorizedException('Invalid credentials');
          }

          //comparacion de contraseña
          const isPasswordValid = await bcrypt.compare(password, business.password);
          if (!isPasswordValid) {
               throw new UnauthorizedException('Invalid credentials');
          }

          //agregar logica para la generacion del token JWT
          const payload = { sub: business.id, email: business.email, name: business.name }; // 'sub' es la convención para el subject (ID de usuario),
          //firmamos el payload con la clave secreta
          const accessToken = this.jwtService.sign(payload);

          //por ahora, solo devolver informacion basica
          return {
               id: business.id,
               name: business.name,
               email: business.email,
               firstName: business.firstName,
               lastName: business.lastName,
               isEmailVerified: business.isEmailVerified,
               accessToken, // devolvemos el token JWT
          };
     }
}
