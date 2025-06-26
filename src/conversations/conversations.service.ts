import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PrismaService } from 'src/common/database/prisma/prisma.service';
import { ConversationResponseDto } from './dto/conversation-response.dto';

@Injectable()
export class ConversationsService {
     //constructor
     constructor(private readonly prisma: PrismaService) {}

     //lista de todas las conversaciones, unicamente el ultimo mensaje para visualizar en la lista
     async getAllConversations(businessId: string): Promise<ConversationResponseDto[]> {
          if (!businessId) {
               throw new Error('Business ID is required');
          }

          const conversations = await this.prisma.conversation.findMany({
               where: {
                    businessId: businessId,
               },
               orderBy: {
                    updatedAt: 'desc',
               },
               include: {
                    messages: {
                         orderBy: {
                              createdAt: 'asc',
                         },
                         take: 1,
                    },
               },
          });

          //formatear la respyesta de prisma a instancias dto de MessageResponseDto, pasandole el dto y el array del tipo de datos
          return plainToInstance(ConversationResponseDto, conversations);
     }

     //obtener una conversacion especifica por medio del id y el id del negocio
     async getConversationById(businessId: string, conversationId: string): Promise<ConversationResponseDto> {
          const conversation = await this.prisma.conversation.findFirst({
               where: {
                    id: conversationId,
                    businessId: businessId, // verificar que la conversación pertenece al negocio
               },
               include: {
                    messages: {
                         orderBy: {
                              createdAt: 'asc', //ordenamos los mensajes cronológicamente
                         },
                    },
               },
          });

          if (!conversation) {
               throw new NotFoundException(`Conversation with id ${conversationId} not found in business ${businessId}`);
          }

          //formatemaos la respuesta de prisma a instancias dto de ConversationResponseDto
          return plainToInstance(ConversationResponseDto, conversation);
     }
}
