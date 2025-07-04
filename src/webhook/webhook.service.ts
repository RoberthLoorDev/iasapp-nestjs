import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/common/database/prisma/prisma.service';
import { WebhookPayload } from './webhook.types';
import { normalizePhoneNumber } from 'src/utils/phone-number.utils';
import { BusinessService } from 'src/business/business.service';

@Injectable()
export class WebhookService {
     constructor(
          private readonly configService: ConfigService,
          private readonly prisma: PrismaService,
          private readonly businessService: BusinessService,
     ) {}

     //verificaar el token del webhook de facebook
     async verifyWebhook(mode: string, token: string, challenge: string): Promise<string> {
          const VERIFY_TOKEN = this.configService.get<string>('VERIFY_TOKEN');

          // comprobar si el token y el modo son correctos
          if (mode === 'subscribe' && token === VERIFY_TOKEN) {
               console.log('Webhook verified successfully and subscribe to events.');
               return Promise.resolve(challenge); // responde el challenge para verificar el webhook
          }

          // si el token o el modo no son correctos, lanza un error
          throw new UnauthorizedException('Verification failed. Invalid mode or token.');
     }

     //procesa los eventos del webhook de whatsapp, por ahora solo guarda los mensajes en la base de datos
     async handleWebhookEvent(body: WebhookPayload): Promise<void> {
          console.log('Received webhook event', JSON.stringify(body, null, 2));

          //se analiza el cuerpo del evento para encontrar los mensajes
          const changes = body.entry?.[0].changes?.[0];
          if (changes?.field !== 'messages') {
               console.log('No messages found in the webhook event');
               return; // si no hay mensajes, no hacemos nada
          }

          const messages = changes.value?.messages;
          const metadata = changes.value?.metadata;

          if (!messages || !metadata) {
               console.log('No messages or metadata found in the webhook event');
               return; // si no hay mensajes, no hacemos nada
          }

          //recorremos los mensajes y los guardamos en la base de datos
          for (const message of messages) {
               if (message.type == 'text') {
                    const customerWhatsAppNumber = message.from;
                    const businessWhatsAppNumber = metadata.display_phone_number;
                    const content = message.text?.body;
                    const normalizeBusinessWhatsappNumber = normalizePhoneNumber(businessWhatsAppNumber); // Normalizamos el número de WhatsApp del negocio

                    // Guardar el mensaje en la base de datos
                    let business: { id: string } | null = null;
                    if (normalizeBusinessWhatsappNumber) {
                         business = await this.businessService.getBusinessByWhatsappPhoneNumber(normalizeBusinessWhatsappNumber);
                    }

                    if (!business) {
                         console.error(`Business not found for phone number: ${businessWhatsAppNumber}`);
                         continue; // si no se encuentra el negocio, saltamos al siguiente mensaje
                    }

                    let conversation = await this.prisma.conversation.findFirst({
                         where: {
                              businessId: business.id,
                              customerWhatsappNumber: customerWhatsAppNumber,
                         },
                    });

                    if (!conversation) {
                         conversation = await this.prisma.conversation.create({
                              data: {
                                   businessId: business.id,
                                   customerWhatsappNumber: customerWhatsAppNumber,
                              },
                         });
                    }

                    //guardmaos el mensaje en la conversación
                    await this.prisma.message.create({
                         data: {
                              businessId: business.id,
                              conversationId: conversation.id,
                              customerWhatsappNumber: customerWhatsAppNumber,
                              senderWhatsappNumber: customerWhatsAppNumber,
                              content: content || '',
                              type: 'incoming',
                         },
                    });

                    console.log(`Incoming message from ${customerWhatsAppNumber} saved successfully.`);
               }
          }
     }
}
