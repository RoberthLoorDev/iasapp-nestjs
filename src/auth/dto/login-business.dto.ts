import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginBusinessDto {
     @IsEmail()
     @IsNotEmpty()
     email: string;

     @IsString()
     @IsNotEmpty()
     password: string;
}
