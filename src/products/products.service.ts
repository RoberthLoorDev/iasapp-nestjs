import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/database/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
     //constructor
     constructor(private readonly prisma: PrismaService) {}

     //crear producto
     async createProduct(businessId: string, createProductDto: CreateProductDto) {
          //verificar que el negocio existe
          const business = await this.prisma.business.findUnique({
               where: { id: businessId },
          });

          if (!business) throw new NotFoundException(`Business with id ${businessId} not found`);

          const newProduct = await this.prisma.product.create({
               data: {
                    ...createProductDto,
                    business: {
                         connect: { id: businessId }, //conectar el producto al negocio
                    },
               },
          });

          return newProduct;
     }

     //obtener todos los productos de un negocio
     async getProductsByBusinessId(businessId: string) {
          return this.prisma.product.findMany({
               where: { businessId: businessId },
               orderBy: { createdAt: 'desc' },
          });
     }

     //obtener un producto por su id
     async getProductById(businessId: string, id: string) {
          const product = await this.prisma.product.findFirst({
               where: {
                    id,
                    businessId, // verificar que el producto pertenece al negocio
               },
          });
          if (!product) throw new NotFoundException(`Product with id ${id} not found in business ${businessId}`);

          return product;
     }

     //actualizar un producto
     async updateProduct(businessId: string, id: string, updateProductDto: UpdateProductDto) {
          //verificar que el negocio existe y que el producto pertenece al negocio
          await this.getProductById(businessId, id); // reusamos el método anterior para verificar

          const updateProduct = await this.prisma.product.update({
               where: { id },
               data: updateProductDto,
          });

          return updateProduct;
     }

     //eliminar un producto
     async deleteProduct(businessId: string, id: string) {
          //verificamos que el negocio existe y que el producto pertenece al negocio
          await this.getProductById(businessId, id);

          await this.prisma.product.delete({
               where: { id },
          });
     }
}
