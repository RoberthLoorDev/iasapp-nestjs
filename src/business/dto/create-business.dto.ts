import { IsString, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';

export class CreateBusinessDto {
     @IsString()
     @IsNotEmpty()
     firstName: string;

     @IsString()
     @IsNotEmpty()
     @IsOptional()
     lastName: string;

     @IsString()
     @IsNotEmpty()
     name: string;

     @IsString()
     @IsNotEmpty()
     @IsEmail()
     email: string;

     @IsString()
     @IsNotEmpty()
     password: string;
}
