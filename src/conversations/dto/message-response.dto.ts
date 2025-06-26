import { Expose, Transform } from 'class-transformer';

// Este DTO sirve para formatear la salida de los mensajes
export class MessageResponseDto {
     @Expose()
     id: string;

     @Expose()
     businessId: string;

     @Expose()
     conversationId: string;

     @Expose()
     senderWhatsappNumber: string | null;

     @Expose()
     customerWhatsappNumber: string;

     @Expose()
     content: string;

     @Expose()
     type: string; // 'incoming' o 'outgoing'

     @Expose()
     @Transform(({ value }: { value: Date }) => value.toISOString())
     createdAt: Date;

     // Constructor para usar con ClassSerializerInterceptor si es necesario
     constructor(partial: Partial<MessageResponseDto>) {
          Object.assign(this, partial);
     }
}
