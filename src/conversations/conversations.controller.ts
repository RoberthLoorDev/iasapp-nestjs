import { Controller, Get, HttpCode, HttpStatus, Param, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Business } from '@prisma/client';
import { Request } from 'express';
import { ConversationsService } from './conversations.service';

// extiende el tipo Request de express para incluir la propiedad user
interface AuthenticatedRequest extends Request {
     user: Business;
}

@Controller('conversations')
@UseGuards(AuthGuard('jwt')) // Protege todas las rutas de este controlador con el guard de autenticación JWT
export class ConversationsController {
     //constructor
     constructor(private readonly conversationService: ConversationsService) {}

     @Get() // /conversations
     @HttpCode(HttpStatus.OK) // Respuesta 200 OK
     async getAllConversations(@Req() req: AuthenticatedRequest) {
          const businessId = req.user.id;
          return this.conversationService.getAllConversations(businessId);
     }

     //conversacion especifica por id
     @Get(':conversationId') // /conversations/:conversationId
     @HttpCode(HttpStatus.OK) // Respuesta 200 OK
     async getConversationById(@Req() req: AuthenticatedRequest, @Param('conversationId') conversationId: string) {
          const businessId = req.user.id;
          return this.conversationService.getConversationById(businessId, conversationId);
     }
}
