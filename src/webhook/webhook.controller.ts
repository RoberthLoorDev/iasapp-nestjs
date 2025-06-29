import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { WebhookService } from './webhook.service';
import { WebhookPayload } from './webhook.types';

@Controller('webhook')
export class WebhookController {
     constructor(private readonly webhookService: WebhookService) {}

     @Get()
     async verifyWebhook(
          @Query('hub.mode') mode: string,
          @Query('hub.verify_token') token: string,
          @Query('hub.challenge') challenge: string,
          @Res() res: Response,
     ) {
          try {
               const response = await this.webhookService.verifyWebhook(mode, token, challenge);
               res.status(HttpStatus.OK).send(response);
          } catch (error: unknown) {
               if (error instanceof Error) {
                    res.status(HttpStatus.FORBIDDEN).send(error.message);
               } else {
                    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('An unexpected error occurred');
               }
          }
     }

     @Post()
     @HttpCode(HttpStatus.OK)
     async handleWebhookEvent(@Body() body: WebhookPayload) {
          await this.webhookService.handleWebhookEvent(body);
     }
}
