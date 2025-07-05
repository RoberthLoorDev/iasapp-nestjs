/** Lo que extraemos del prompt de extracción de la IA */
export interface ProductParams {
     brand?: string;
     model?: string;
     variant?: string; // Nuevo: Añadido desde tu modelo Product
     ram?: string;
     storage?: string;
     processor?: string;
     display?: string; // Nuevo: Añadido desde tu modelo Product
     mainCameraMp?: number;
     frontCameraMp?: number;
     batteryMah?: number;
     features?: string; // Nuevo: Añadido desde tu modelo Product (si la IA lo puede inferir)
     price?: number; // Opcional: si se busca un precio exacto
     priceGte?: number; // Precio mayor o igual (para rangos)
     priceLte?: number; // Precio menor o igual (para rangos)
     stockGte?: number; // Opcional: para buscar un mínimo de stock (aunque lo forcemos a > 0 por defecto)
     corrected_query?: string; // Para la sugerencia de corrección de la IA
}

/** Lo que mostramos al cliente en la respuesta final de la IA */
export interface FoundProduct {
     brand: string;
     model: string;
     variant: string | null;
     ram: string | null;
     storage: string | null;
     price: number;
     stock: number;
     mainCameraMp: number | null;
     batteryMah: number | null;
}

/** Reutilizable para filtros de texto “contains” insensible */
export interface TextFilter {
     contains: string;
     mode: 'insensitive';
}

/** Rango numérico (mínimo/máximo) */
export interface RangeFilter {
     gte?: number;
     lte?: number;
}

/** Filtro de stock mínimo/estricto */
export interface StockFilter {
     gte?: number;
     gt?: number;
}

/** Construye el WHERE dinámico para Prisma según los parámetros extraídos */
export interface ProductWhereClause {
     brand?: TextFilter;
     model?: TextFilter;
     variant?: TextFilter;
     ram?: TextFilter;
     storage?: TextFilter;
     processor?: TextFilter;
     display?: TextFilter;
     features?: TextFilter;
     mainCameraMp?: number;
     frontCameraMp?: number;
     batteryMah?: number;
     /** Precio exacto o rango */
     price?: number | RangeFilter;
     /** Stock mínimo o “mayor que” */
     stock?: StockFilter;
}
