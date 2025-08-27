import { Body, Controller, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BusinessService } from './business.service';
import { UpdateWhatsappConfigDto } from './dto/update-whatsapp-config.dto';
import { CreateBusinessDto } from './dto/create-business.dto';

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
}
