import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BusinessService } from './business.service';
import { UpdateWhatsappConfigDto } from './dto/update-whatsapp-config.dto';

@Controller('business')
export class BusinessController {
     constructor(private readonly businessService: BusinessService) {}

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
