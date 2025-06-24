import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { Business } from '@prisma/client';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { AuthGuard } from '@nestjs/passport';

//extiende el tipo Request para incluir el usuario autenticado
interface AuthenticatedRequest extends Request {
     user: Business;
}

@Controller('products')
@UseGuards(AuthGuard('jwt')) // Protege las rutas con el guard de autenticación JWT
export class ProductsController {
     constructor(private readonly productService: ProductsService) {}

     @Post()
     @HttpCode(HttpStatus.CREATED)
     createProduct(@Req() req: AuthenticatedRequest, @Body() createProductDto: CreateProductDto) {
          //obtenemos el id del negocio autenticado
          const businessId = req.user.id;
          return this.productService.createProduct(businessId, createProductDto);
     }

     @Get(':id') // /products/:id
     getProductById(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
          const businessId = req.user.id;
          return this.productService.getProductById(businessId, id);
     }

     @Get() // /products
     getAllProductsByBusinessId(@Req() req: AuthenticatedRequest) {
          const businessId = req.user.id;
          return this.productService.getProductsByBusinessId(businessId);
     }

     @Patch(':id') // /products/:id
     updateProduct(@Req() req: AuthenticatedRequest, @Param('id') id: string, @Body() updateProductDto: CreateProductDto) {
          const businessId = req.user.id;
          return this.productService.updateProduct(businessId, id, updateProductDto);
     }

     @Delete(':id') // /products/:id
     @HttpCode(HttpStatus.NO_CONTENT) // 204 NO no content para eliminaciones exitosas
     deleteProduct(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
          const businessId = req.user.id;
          return this.productService.deleteProduct(businessId, id);
     }
}
