//heredar y hacer todo opcional
import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';

//PartialType crea un DTO que hereda de CreateProductDto y hace todos los campos opcionales
export class UpdateProductDto extends PartialType(CreateProductDto) {}
