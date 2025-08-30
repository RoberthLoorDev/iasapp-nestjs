import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BusinessService } from './business.service';
import { UpdateWhatsappConfigDto } from './dto/update-whatsapp-config.dto';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Controller('business')
export class BusinessController {
     constructor(private readonly businessService: BusinessService) {}

     //Crear un negocio
     @Post()
     async createBusiness(@Body() dto: CreateBusinessDto) {
          return this.businessService.createBusiness(dto);
     }

     // Actualizar la configuración de WhatsApp del negocio
     @UseGuards(AuthGuard('jwt'))
     @Patch(':businessId/whatsapp-config')
     async updateBusinessWhatsappConfig(
          @Param('businessId') businessId: string,
          @Body() updateWhatsappConfigDto: UpdateWhatsappConfigDto,
     ) {
          // Actualizar la configuración de WhatsApp del negocio
          return this.businessService.updateWhatsappConfiguration(businessId, updateWhatsappConfigDto);
     }

     // Actualizar informacion de un negocio
     @UseGuards(AuthGuard('jwt'))
     @Patch(':businessId')
     async updateBusiness(@Param('businessId') businessId: string, @Body() updateBusinessDto: UpdateBusinessDto) {
          return this.businessService.updateBusiness(businessId, updateBusinessDto);
     }

     // Obtener negocio por medio de id
     @UseGuards(AuthGuard('jwt'))
     @Get(':businessId')
     async getBusiness(@Param('businessId') businessId: string) {
          return this.businessService.getBusinessById(businessId);
     }

     // Controlador que actualiza la contraseña de un negocio
     @UseGuards(AuthGuard('jwt'))
     @Patch(':businessId/password')
     async updatePassword(@Param('businessId') businessId: string, @Body() dto: UpdatePasswordDto) {
          return this.businessService.updatePassword(businessId, dto);
     }
}
