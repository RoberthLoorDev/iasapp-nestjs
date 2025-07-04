import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class WhatsappApiService {
     private readonly logger = new Logger(WhatsappApiService.name);
     private readonly WHATSAPP_API_URL: string;

     constructor(private readonly configService: ConfigService) {
          this.WHATSAPP_API_URL = this.configService.get<string>('WHATSAPP_API_URL', 'https://graph.facebook.com/v19.0');
     }

     //enviar un mensaje de texto a un numero de whatsapp
     async sendTextMessage(to: string, message: string, phoneNumberId: string, accessToken: string): Promise<any> {
          if (!to || !message || !phoneNumberId || !accessToken) {
               throw new BadRequestException('Missing required parameters');
          }

          //construir la URL para enviar el mensaje
          const url = `${this.WHATSAPP_API_URL}/${phoneNumberId}/messages`;

          //cabeceras de la solicitud
          const headers = {
               Authorization: `Bearer ${accessToken}`,
               'Content-Type': 'application/json',
          };

          //cuerpo de la solicitud
          const data = {
               messaging_product: 'whatsapp', // especifica que es un mensaje de WhatsApp
               to: to, // número de teléfono del destinatario en formato internacional
               type: 'text',
               text: {
                    body: message,
               },
          };

          //envio de la solicitud usando axios
          try {
               this.logger.log(`Sending WhatsApp message to ${to} from phone number ID ${phoneNumberId}`);

               const response = await axios.post(url, data, { headers });

               //si la respuesta es exitosa, registraos la respuesta de meta
               this.logger.log(`WhatsApp message sent successfully to ${to}. Response: ${JSON.stringify(response.data)}`);

               //devolvemos la respuesta de la api
               return response.data;
          } catch (error) {
               this.logger.error(`Failed to send WhatsApp message to ${to}: ${(error as Error).message}`);
               throw new InternalServerErrorException(`Failed to send WhatsApp message: ${(error as Error).message}`);
          }
     }
}
