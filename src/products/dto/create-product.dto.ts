import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateProductDto {
     @IsString()
     @IsNotEmpty()
     brand: string;

     @IsString()
     @IsNotEmpty()
     model: string;

     @IsOptional()
     @IsString()
     variant?: string;

     @IsString()
     @IsNotEmpty()
     ram: string;

     @IsString()
     @IsNotEmpty()
     storage: string;

     @IsOptional()
     @IsString()
     processor?: string;

     @IsOptional()
     @IsString()
     display?: string;

     @IsOptional()
     @IsInt()
     @Min(0)
     @Type(() => Number) //Necesario para trandsformar el valor a number
     mainCameraMp?: number;

     @IsOptional()
     @IsInt()
     @Min(0)
     frontCameraMp?: number;

     @IsOptional()
     @IsInt()
     @Min(0)
     batteryMah?: number;

     @IsOptional()
     @IsString()
     features?: string;

     @IsNumber()
     @IsNotEmpty()
     @Min(0)
     @Type(() => Number)
     price: number; //usamos number, prisma lo mapeara a Float

     @IsInt()
     @IsNotEmpty()
     @Min(0)
     @Type(() => Number) //Necesario para trandsformar el valor a number
     stock: number;

     @IsOptional()
     @IsString()
     description?: string;

     @IsOptional()
     @IsString()
     imageUrl?: string;
}

// Este DTO se usa para crear un producto, y contiene las validaciones necesarias para cada campo.
