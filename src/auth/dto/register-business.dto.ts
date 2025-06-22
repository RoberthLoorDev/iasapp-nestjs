import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterBusinessDto {
     @IsString()
     @IsNotEmpty()
     @MinLength(3)
     @MaxLength(100)
     name: string;

     @IsEmail()
     @IsNotEmpty()
     email: string;

     @IsString()
     @IsNotEmpty()
     @MinLength(6)
     password: string;

     // Campos opcionales para el regisrtro de negocio
     @IsOptional()
     @IsString()
     @IsNotEmpty()
     firstName?: string;

     @IsOptional()
     @IsString()
     @IsNotEmpty()
     lastName?: string;

     @IsOptional()
     @IsString()
     @IsNotEmpty()
     address?: string;

     @IsOptional()
     @IsString()
     @IsNotEmpty()
     phoneNumber?: string;
}
