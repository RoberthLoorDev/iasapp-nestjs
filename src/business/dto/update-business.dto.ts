import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateBusinessDto {
     @IsString()
     @IsOptional()
     name: string;

     @IsEmail()
     @IsOptional()
     email: string;

     @IsString()
     @IsOptional()
     firstName: string;

     @IsString()
     @IsOptional()
     lastName: string;

     @IsString()
     @IsOptional()
     address: string;

     @IsString()
     @IsOptional()
     phoneNumber: string;
}
