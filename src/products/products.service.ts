import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/database/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FoundProduct, ProductParams, ProductWhereClause } from './products.types';

@Injectable()
export class ProductsService {
     private readonly logger = new Logger(ProductsService.name);

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

     //obtener productos por parametros
     async getProductsByParams(params: ProductParams): Promise<FoundProduct[]> {
          const whereClause: ProductWhereClause = {};

          // Manejar campos de texto con búsqueda insensible a mayúsculas/minúsculas y parcial
          if (params.brand) {
               whereClause.brand = { contains: params.brand, mode: 'insensitive' };
          }
          if (params.model) {
               whereClause.model = { contains: params.model, mode: 'insensitive' };
          }
          if (params.variant) {
               whereClause.variant = { contains: params.variant, mode: 'insensitive' };
          }
          if (params.ram) {
               whereClause.ram = { contains: params.ram, mode: 'insensitive' };
          }
          if (params.storage) {
               whereClause.storage = { contains: params.storage, mode: 'insensitive' };
          }
          if (params.processor) {
               whereClause.processor = { contains: params.processor, mode: 'insensitive' };
          }
          if (params.display) {
               whereClause.display = { contains: params.display, mode: 'insensitive' };
          }
          if (params.features) {
               whereClause.features = { contains: params.features, mode: 'insensitive' };
          }
          if (params.mainCameraMp !== undefined && params.mainCameraMp !== null) {
               whereClause.mainCameraMp = params.mainCameraMp;
          }
          if (params.frontCameraMp !== undefined && params.frontCameraMp !== null) {
               whereClause.frontCameraMp = params.frontCameraMp;
          }
          if (params.batteryMah !== undefined && params.batteryMah !== null) {
               whereClause.batteryMah = params.batteryMah;
          }

          // Manejar rangos de precio
          if (params.priceGte !== undefined || params.priceLte !== undefined || params.price !== undefined) {
               whereClause.price = {}; // Inicializa como objeto si hay rangos o precio exacto
               if (params.priceGte !== undefined) {
                    whereClause.price.gte = params.priceGte;
               }
               if (params.priceLte !== undefined) {
                    whereClause.price.lte = params.priceLte;
               }
               if (params.price !== undefined) {
                    // Si hay un precio exacto
                    whereClause.price = params.price;
               }
          }

          if (params.stockGte === undefined) {
               whereClause.stock = { gt: 0 }; // Por defecto, buscar stock > 0
          } else {
               whereClause.stock = { gte: params.stockGte }; // Usar el stock mínimo especificado
          }

          this.logger.log(`Constructed Prisma where clause for products: ${JSON.stringify(whereClause)}`);

          try {
               const products = await this.prisma.product.findMany({
                    where: whereClause,
                    select: {
                         brand: true,
                         model: true,
                         variant: true,
                         ram: true,
                         storage: true,
                         price: true,
                         stock: true,
                         batteryMah: true,
                         mainCameraMp: true,
                    },
                    orderBy: { price: 'asc' },
               });

               if (products.length === 0) {
                    this.logger.warn(`No products found for the given criteria: ${JSON.stringify(params)}`);
               } else {
                    this.logger.log(`Found ${products.length} products with criteria.`);
               }

               // Aquí convertimos los productos de Prisma al tipo FoundProduct esperado por AIService
               // Prisma retorna Decimal para 'price', necesitamos convertirlo a number para FoundProduct
               return products.map((p) => ({
                    brand: p.brand,
                    model: p.model,
                    variant: p.variant,
                    ram: p.ram,
                    storage: p.storage,
                    price: p.price.toNumber(),
                    stock: p.stock,
                    batteryMah: p.batteryMah || null,
                    mainCameraMp: p.mainCameraMp || null,
               }));
          } catch (error) {
               this.logger.error(`Error in getProductsByParams for params: ${JSON.stringify(params)}`, error);
               throw new InternalServerErrorException('Error al buscar productos en la base de datos.');
          }
     }
}
