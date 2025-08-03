import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/database/prisma/prisma.service';
import { normalizePhoneNumber } from 'src/utils/phone-number.utils';
import { UpdateWhatsappConfigDto } from './dto/update-whatsapp-config.dto';

@Injectable()
export class BusinessService {
     constructor(private readonly prisma: PrismaService) {}

     //Obtener negocio por medio del whatappPhoneNumber
     async getBusinessByWhatsappPhoneNumber(whatsappPhoneNumber: string) {
          const normalizeNumber = normalizePhoneNumber(whatsappPhoneNumber, 'EC');
          if (!normalizeNumber) {
               return null;
          }

          return this.prisma.business.findUnique({
               where: {
                    whatsappPhoneNumber: normalizeNumber,
               },
          });
     }

     //actualizar la configuracion de whatsapp del negocio
     async updateWhatsappConfiguration(businessId: string, dto: UpdateWhatsappConfigDto) {
          let whatsappPhoneNumberToUpdate: string | undefined;

          if (dto.whatsappPhoneNumber) {
               const normalized = normalizePhoneNumber(dto.whatsappPhoneNumber, 'EC');
               whatsappPhoneNumberToUpdate = normalized === null ? undefined : normalized;

               if (!whatsappPhoneNumberToUpdate) {
                    throw new BadRequestException('Invalid WhatsApp phone number format');
               }

               const exitstingBusiness = await this.prisma.business.findUnique({
                    where: {
                         whatsappPhoneNumber: whatsappPhoneNumberToUpdate,
                    },
               });

               if (exitstingBusiness && exitstingBusiness.id !== businessId) {
                    throw new ConflictException('WhatsApp phone number already in use by another business');
               }

               const updateData: {
                    whatsappPhoneNumber?: string;
                    whatsappApiConfig?: any;
               } = {};

               if (whatsappPhoneNumberToUpdate !== undefined) {
                    updateData.whatsappPhoneNumber = whatsappPhoneNumberToUpdate;
               }

               if (dto.whatsappApiConfig !== undefined) {
                    updateData.whatsappApiConfig = dto.whatsappApiConfig;
               }

               const updatedBusiness = await this.prisma.business.update({
                    where: {
                         id: businessId,
                    },
                    data: updateData,
                    select: {
                         id: true,
                         name: true,
                         email: true,
                         whatsappPhoneNumber: true,
                         whatsappApiConfig: true,
                    },
               });

               if (!updatedBusiness) {
                    throw new NotFoundException('Business not found');
               }

               return updatedBusiness;
          }
     }

     // Obtener informacion del negocio por medio de su id
     async getBusinessById(businessId: string) {
          if (!businessId) {
               throw new BadRequestException('Business ID is required');
          }
          const business = await this.prisma.business.findUnique({
               where: { id: businessId },
          });

          if (!business) {
               throw new NotFoundException('Business not found');
          }

          return business;
     }

     // Obtener informacion del negocio por medio del whatsappPhoneNumberId
     async getBusinessByPhoneNumberId(phoneNumberId: string) {
          if (!phoneNumberId) {
               throw new BadRequestException('Phone number ID is required');
          }

          const business = await this.prisma.business.findFirst({
               where: { whatsappPhoneNumberId: phoneNumberId },
          });

          if (!business) {
               throw new NotFoundException('Business not found');
          }

          return business;
     }
}
