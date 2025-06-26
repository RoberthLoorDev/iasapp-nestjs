import { Message } from '@prisma/client';
import { Expose, Transform } from 'class-transformer';
import { MessageResponseDto } from './message-response.dto';

export class ConversationResponseDto {
     @Expose()
     id: string;

     @Expose()
     businessId: string;

     @Expose()
     customerWhatsappNumber: string;

     @Expose()
     context: Record<string, any> | null;

     @Expose()
     @Transform(({ value }: { value: Date }) => value.toISOString()) // <-- Añade el tipo { value: Date }
     createdAt: Date;

     @Expose()
     @Transform(({ value }: { value: Date }) => value.toISOString()) // <-- Añade el tipo { value: Date }
     updatedAt: Date;

     @Expose()
     @Transform(({ value }: { value: Message[] }) =>
          value.map((msg: Message) => new MessageResponseDto({ ...msg, id: msg.id.toString() })),
     ) // Convierte id de bigint a string
     messages: MessageResponseDto[];
}
