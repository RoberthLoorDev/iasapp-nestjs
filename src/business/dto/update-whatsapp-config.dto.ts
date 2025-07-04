import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class UpdateWhatsappConfigDto {
     @IsOptional()
     @IsString()
     @IsNotEmpty()
     whatsappPhoneNumber?: string;

     @IsOptional()
     @IsObject()
     whatsappApiConfig?: Record<string, any>;
}
