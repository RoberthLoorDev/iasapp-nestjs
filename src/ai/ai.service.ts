import { GenerativeModel, GoogleGenerativeAI } from '@google/generative-ai';
import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ProductsService } from 'src/products/products.service';
import { WhatsappApiService } from '../whatsapp/whatsapp-api/whatsapp-api.service';
import { FoundProduct, ProductParams } from 'src/products/products.types';

@Injectable()
export class AiService {
     private readonly logger = new Logger(AiService.name);
     private generativeModel: GenerativeModel;
     private readonly GEMINI_API_KEY: string;

     constructor(
          private readonly configService: ConfigService,
          private readonly productService: ProductsService,
          private readonly whatsappApiService: WhatsappApiService,
     ) {
          this.GEMINI_API_KEY = this.configService.get<string>('GEMINI_API_KEY') ?? '';

          if (!this.GEMINI_API_KEY) {
               throw new InternalServerErrorException('GEMINI_API_KEY is not defined in the environment variables');
          }

          const genAI = new GoogleGenerativeAI(this.GEMINI_API_KEY);

          //modelo
          this.generativeModel = genAI.getGenerativeModel({ model: 'gemma-3-4b-it' });
     }

     //logica principal para procesar los mensajes de whatsapp
     async processUserMessage(
          messageText: string,
          toPhoneNumber: string,
          phoneNumberId: string,
          accessToken: string,
     ): Promise<void> {
          try {
               //validar el mensaje de entrada (saludos, preguntas fuera de contexto, etc.)
               const initialResponse = await this.validateAndExtractIntent(messageText);

               //si la ia decide que es un saldo o fuera de contexto, envia una respuesta directa
               if (initialResponse.responseType === 'greeting') {
                    await this.whatsappApiService.sendTextMessage(
                         toPhoneNumber,
                         initialResponse.message,
                         phoneNumberId,
                         accessToken,
                    );
                    return; // terminamos aqui la ejecucion
               }

               //si la ia identifico que es una pregunta de un producto, extrae los parametros
               const productsParams: ProductParams = await this.extractProductParameters(messageText);

               //consultar en la base de datos los productos que coincidan con los parametros extraidos
               let dbProducts;
               if (Object.keys(productsParams).length > 0) {
                    dbProducts = await this.productService.getProductsByParams(productsParams);
               } else {
                    dbProducts = [];
               }

               //maquillar la respuesta de la base de datos
               const finalIAMessage = await this.generateFinalResponse(productsParams, dbProducts);

               await this.whatsappApiService.sendTextMessage(toPhoneNumber, finalIAMessage, phoneNumberId, accessToken);
          } catch (error) {
               this.logger.error('Error processing user message', error);
               throw new InternalServerErrorException('Error processing user message');
          }
     }

     //logica para validar el mensaje de entrada y extraer la intención
     private async validateAndExtractIntent(message: string): Promise<{ responseType: string; message: string }> {
          //prompt inciial para validacion y saludo
          const prompt = `
          Eres un asistente de ventas de una tienda de telefonos. Tu única función es proporcionar información sobre los productos disponibles en la tienda.
               Reglas:
               - Si el usuario saluda, responde amablemente y luego pregunta en qué puedes ayudar con los productos.
               - Si el usuario hace una pregunta que NO está relacionada con productos (ej. "¿Cómo estás?", "Dime un chiste", "Cuál es la capital de Francia"), debes decirle que si podría especificar su solicitud.
               - Si el usuario pregunta sobre productos, responde 'QUERY'.
               - Formatea tu respuesta como un JSON con las claves "responseType" (puede ser "greeting", "out_of_context", "query") y "message" (la respuesta directa o "QUERY").

               Ejemplos:
               Usuario: Hola
               Respuesta: {"responseType": "greeting", "message": "¡Hola!. ¿En qué puedo ayudarte?"}

               Usuario: Qué hora es?
               Respuesta: {"responseType": "out_of_context", "message": "Lo siento, mi función es ayudarte con información sobre nuestros productos electrónicos. No puedo responder a esa pregunta."}

               Usuario: Tienes el xiaomi redmi note 12?
               Respuesta: {"responseType": "query", "message": "QUERY"}

               Usuario: ${message}`;

          try {
               const result = await this.generativeModel.generateContent(prompt);
               const text = result.response.text();
               this.logger.debug(`Initial intent response from Gemini: ${text}`);

               //eliminar los backticks y la etiqueta de idioma
               const cleanJsonString = text.replace(/```json\n|```/g, '').trim();

               const parsed = JSON.parse(cleanJsonString) as { responseType: string; message: string };
               return parsed;
          } catch (error) {
               this.logger.error('Error validating intent with gemini', error);
               throw new InternalServerErrorException('Error validating intent with gemini');
          }
     }

     //logica para extraer los parametros del producto del mensaje del usuario
     private async extractProductParameters(message: string): Promise<ProductParams> {
          //prompt para extraer los parametros del producto
          const prompt = `
          Dado el siguiente mensaje del usuario: '${message}'.
          Tu tarea es extraer los detalles de productos mencionados (marca, modelo, RAM, almacenamiento, procesador, cámara principal, cámara frontal, batería, precio mínimo/máximo, etc.).
          Considera posibles errores tipográficos y sugiere una corrección si es obvia, por ejemplo "ciaomi" -> "Xiaomi".
          Formatea tu respuesta como un objeto JSON con las claves para cada propiedad (ej. "brand", "model", "ram", "storage", "price").
          Para precios, usa "priceGte" para mayor o igual, "priceLte" para menor o igual.
          Si encuentras una posible corrección a un nombre (ej. "ciaomi" -> "Xiaomi"), incluye un campo "corrected_query" con la sugerencia.
          Si una propiedad no se menciona o no se identifica, omítela del JSON.

          Ejemplos:
          Mensaje: "Quiero el telefono xiaomi redmi note 10 pro de 128gb"
          Respuesta: {"brand": "Xiaomi", "model": "Redmi Note 10 Pro", "storage": "128GB"}

          Mensaje: "Celulares con camara de 48mp"
          Respuesta: {"mainCameraMp": 48}

          Mensaje: "Celulares por debajo de 400 dolares"
          Respuesta: {"priceLte": 400}

          Mensaje: "Tienes el ciaomi redmi note 14 por plus?"
          Respuesta: {"brand": "Xiaomi", "model": "Redmi Note 14 Pro Plus", "corrected_query": "Quizás quisiste decir Xiaomi Redmi Note 14 Pro Plus."}

          Mensaje: "${message}"`;

          try {
               const result = await this.generativeModel.generateContent(prompt);
               const text = result.response.text();

               const cleanJsonString = text.replace(/```json\n|```/g, '').trim();

               this.logger.debug(`Product parameters response from Gemini: ${cleanJsonString}`);
               const parsed = JSON.parse(cleanJsonString) as Record<string, unknown>;
               return parsed;
          } catch (error) {
               this.logger.error('Error extracting product parameters with gemini', error);
               return {}; // Return an empty object if there's an error
          }
     }

     //logica para generar la respuesta final
     private async generateFinalResponse(productParams: ProductParams, products: FoundProduct[]): Promise<string> {
          //prompt para maquillar y generar la respuesta final
          let productsInfo: string;
          if (products.length > 0) {
               productsInfo = products
                    .map((p) => {
                         // Construye una cadena descriptiva para cada producto
                         let description = `- Marca: ${p.brand}, Modelo: ${p.model}`;
                         if (p.variant) {
                              description += ` ${p.variant}`;
                         }
                         description += `, RAM: ${p.ram}, Almacenamiento: ${p.storage}`;
                         if (p.mainCameraMp) {
                              description += `, Cámara principal: ${p.mainCameraMp}MP`;
                         }
                         if (p.batteryMah) {
                              description += `, Batería: ${p.batteryMah}mAh`;
                         }
                         description += `, Precio: $${p.price.toFixed(2)}, Stock: ${p.stock} unidades.`; // Formatear el precio a 2 decimales
                         return description;
                    })
                    .join('\n'); // Unir las descripciones de los productos con saltos de línea
               this.logger.debug(`Formatted products info for Gemini: \n${productsInfo}`);
          } else {
               productsInfo = 'No se encontraron productos.';
          }

          let initialCorrection = '';
          if (productParams.corrected_query) {
               initialCorrection = `${productParams.corrected_query}\n`;
          }

          const prompt = `
            Eres un asistente de ventas amigable y servicial de una tienda de celulares.
            Dada la siguiente información de productos encontrados en la base de datos:
            ${productsInfo}

            Genera una respuesta concisa y amigable para el cliente de WhatsApp.
            Si se encontraron productos:
            - Menciona los productos encontrados.
            - Si hay un solo producto, proporciona todos los detalles disponibles (marca, modelo, variante, RAM, almacenamiento, cámaras, batería, precio).
            - Si hay varios productos, resume las características clave que los diferencian (ej. por qué uno es más caro que otro, como RAM, almacenamiento, variante).
            - Siempre termina preguntando si necesitas algo más o si tienes otra consulta.

            Si NO se encontraron productos:
            - Indica amablemente que no se encontraron productos con esas características.
            - Si había una sugerencia de corrección en el query inicial, puedes mencionarla (ej. "Quizás quisiste decir X").
            - Ofrece buscar otros productos o preguntar por otras características.

            Ejemplos de cómo diferenciar si hay varios productos:
            Productos:
            - Marca: Xiaomi, Modelo: Redmi Note 13 4G, RAM: 6GB, Almacenamiento: 128GB, Precio: $249.99.
            - Marca: Xiaomi, Modelo: Redmi Note 13 Pro 5G, RAM: 8GB, Almacenamiento: 256GB, Precio: $329.99.
            Respuesta sugerida: "¡Claro! Encontramos dos variantes del Xiaomi Redmi Note 13. El modelo 4G con 6GB de RAM y 128GB de almacenamiento está en $249.99. Y el Redmi Note 13 Pro 5G con 8GB de RAM y 256GB de almacenamiento está en $329.99 ¿Cuál te interesa más o tienes alguna otra consulta?"

            Productos: No se encontraron productos.
            Respuesta sugerida: "Lo siento, no encontramos productos con esas características. ¿Te gustaría buscar algo más o con otras especificaciones?"

            Genera la respuesta para el cliente basado en los datos proporcionados:
            ${initialCorrection}
        `;

          try {
               const result = await this.generativeModel.generateContent(prompt);
               const text = result.response.text();
               // Eliminar los backticks y la etiqueta de idioma
               const cleanText = text.replace(/```text\n|```/g, '').trim();
               this.logger.debug(`Final response from Gemini: ${cleanText}`);
               return cleanText;
          } catch (error) {
               this.logger.error('Error generating final response with gemini', error);
               throw new InternalServerErrorException('Error generating final response with gemini');
          }
     }
}
