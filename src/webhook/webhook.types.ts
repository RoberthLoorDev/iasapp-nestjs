export interface WebhookPayload {
     object: string;
     entry: WebhookEntry[];
}

export interface WebhookEntry {
     id: string;
     changes: WebhookChange[];
}

export interface WebhookChange {
     field: string;
     value: WebhookValue;
}

export interface WebhookValue {
     messaging_product: 'whatsapp';
     metadata: WebhookMetadata;
     contacts?: WebhookContact[];
     messages?: WebhookMessage[];
     statuses?: WebhookStatus[];
     errors?: WebhookError[];
}

export interface WebhookMetadata {
     display_phone_number: string;
     phone_number_id: string;
}

export interface WebhookContact {
     wa_id: string;
     profile: {
          name: string;
     };
     user_id?: string;
}

// Mensajes entrantes
export interface WebhookMessage {
     from: string;
     id: string;
     timestamp: string;
     type: WebhookMessageType;
     text?: { body: string };
     image?: WebhookMedia;
     video?: WebhookMedia;
     audio?: WebhookMedia;
     document?: WebhookDocument;
     sticker?: WebhookSticker;
     interactive?: WebhookInteractive;
     referral?: WebhookReferral;
     order?: WebhookOrder;
     context?: WebhookContext;
     system?: WebhookSystem;
     identity?: WebhookIdentity;
}

export type WebhookMessageType =
     | 'text'
     | 'image'
     | 'video'
     | 'audio'
     | 'document'
     | 'sticker'
     | 'interactive'
     | 'order'
     | 'system'
     | 'button'
     | 'unknown';

export interface WebhookMedia {
     id: string;
     mime_type: string;
     sha256?: string;
     caption?: string;
}

export interface WebhookDocument extends WebhookMedia {
     filename?: string;
}

export interface WebhookSticker {
     id: string;
     mime_type: string;
     sha256: string;
     animated: boolean;
}

export interface WebhookInteractive {
     type: 'button_reply' | 'list_reply';
     button_reply?: {
          id: string;
          title: string;
     };
     list_reply?: {
          id: string;
          title: string;
          description: string;
     };
}

export interface WebhookReferral {
     source_url?: string;
     source_type?: string;
     source_id?: string;
     headline?: string;
     body?: string;
     media_type?: string;
     image_url?: string;
     video_url?: string;
     thumbnail_url?: string;
     ctwa_clid?: string;
}

export interface WebhookOrder {
     catalog_id: string;
     text?: string;
     product_items: Array<{
          product_retailer_id: string;
          quantity: string;
          item_price: string;
          currency: string;
     }>;
}

export interface WebhookContext {
     forwarded?: boolean;
     frequently_forwarded?: boolean;
     from?: string;
     id?: string;
     referred_product?: {
          catalog_id: string;
          product_retailer_id: string;
     };
}

export interface WebhookSystem {
     body: string;
     identity?: string;
     new_wa_id?: string;
     wa_id?: string;
     type: 'customer_changed_number' | 'customer_identity_changed';
     customer?: string;
}

export interface WebhookIdentity {
     acknowledged?: boolean;
     created_timestamp?: string;
     hash?: string;
}

// Estados de mensajes (sent, delivered, read)
export interface WebhookStatus {
     id: string;
     status: 'sent' | 'delivered' | 'read';
     timestamp: string;
     recipient_id: string;
     conversation?: {
          id: string;
          origin: {
               type:
                    | 'authentication'
                    | 'authentication_international'
                    | 'marketing'
                    | 'utility'
                    | 'service'
                    | 'referral_conversion';
          };
          expiration_timestamp?: string;
     };
     pricing?: {
          billable?: boolean;
          category?: string;
          pricing_model?: string;
     };
     errors?: WebhookError[];
}

export interface WebhookError {
     code: number;
     title: string;
     message?: string;
     error_data?: {
          details: string;
     };
}
