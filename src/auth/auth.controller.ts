import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginBusinessDto } from './dto/login-business.dto';
import { RegisterBusinessDto } from './dto/register-business.dto';

@Controller('auth') //todas las rutas de este controlador van a empezar con /auth
export class AuthController {
     //inyectamos el service de auttenticación
     constructor(private readonly authService: AuthService) {}

     @Post('register') //auth/register
     @HttpCode(HttpStatus.CREATED) //codigo que retorna al crear un negocio
     async register(@Body() registerDto: RegisterBusinessDto) {
          const business = await this.authService.register(registerDto);
          return { message: 'Business registered successfully', data: business };
     }

     @Post('login') // auth/login
     @HttpCode(HttpStatus.OK) //código que retorna al iniciar sesión
     async login(@Body() loginDto: LoginBusinessDto) {
          const result = await this.authService.login(loginDto);
          return { message: 'Business logged in successfully', data: result };
     }
}
