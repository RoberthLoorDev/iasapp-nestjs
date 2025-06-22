# IasApp - AI-Powered Mobile Inventory Assistant

![NestJS](https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/postgresql-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![WhatsApp](https://img.shields.io/badge/WhatsApp-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)

## 📱 Descripción

IasApp es una solución innovadora de gestión de inventario impulsada por inteligencia artificial, diseñada específicamente para negocios de dispositivos móviles. La aplicación permite a los clientes consultar disponibilidad de productos a través de WhatsApp, utilizando un chatbot inteligente que procesa consultas en lenguaje natural y proporciona respuestas precisas sobre el inventario.

## 🚀 Características

- **Chat Inteligente**: Integración con WhatsApp Business API para comunicación directa con clientes
- **IA Avanzada**: Utiliza Google Gemini API para procesamiento de lenguaje natural
- **Consultas Flexibles**: Búsqueda por modelo, marca, capacidad, rango de precios y más
- **Respuestas Contextuales**: El AI maquilla las respuestas para ofrecer información clara y profesional
- **Base de Datos Robusta**: PostgreSQL con Prisma ORM para gestión eficiente de datos
- **Autenticación Segura**: JWT tokens y encriptación bcryptjs para seguridad

## 🛠️ Stack Tecnológico

### Backend

- **Framework**: NestJS
- **Lenguaje**: TypeScript
- **Base de Datos**: PostgreSQL
- **ORM**: Prisma
- **Autenticación**: JWT + Passport
- **Encriptación**: bcryptjs

### APIs Externas

- **IA**: Google Gemini API
- **Mensajería**: WhatsApp Business API / Twilio (opcional)

### Herramientas de Desarrollo

- **Gestor de Paquetes**: pnpm
- **Testing**: Jest
- **Linting**: ESLint + Prettier
- **Build**: SWC (Super fast TypeScript/JavaScript compiler)

## 📋 Prerequisitos

- Node.js (v18 o superior)
- pnpm
- PostgreSQL
- Cuenta de Google Cloud (para Gemini API)
- WhatsApp Business API credentials

## 🔧 Instalación

1. **Clonar el repositorio**

```bash
git clone https://github.com/RoberthLoorDev/iasapp-nestjs.git
cd iasapp-nestjs
```

2. **Instalar dependencias**

```bash
pnpm install
```

3. **Configurar variables de entorno**

```bash
cp .env.example .env
```

Editar `.env` con tus credenciales:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/iasapp"
JWT_SECRET="your-jwt-secret"
GEMINI_API_KEY="your-gemini-api-key"
WHATSAPP_API_TOKEN="your-whatsapp-token"
```

4. **Configurar base de datos**

```bash
# Generar cliente Prisma
pnpm prisma generate

# Ejecutar migraciones
pnpm prisma migrate dev

# (Opcional) Seed inicial
pnpm prisma db seed
```

5. **Ejecutar la aplicación**

```bash
# Desarrollo
pnpm start:dev

# Producción
pnpm build
pnpm start:prod
```

## 📡 Flujo de Trabajo

1. **Cliente envía mensaje** → WhatsApp
2. **Webhook recibe mensaje** → Backend NestJS
3. **Procesamiento IA** → Gemini extrae información (modelo, marca, precio, etc.)
4. **Consulta base de datos** → PostgreSQL vía Prisma
5. **Formateo de respuesta** → Gemini maquilla la respuesta
6. **Envío de respuesta** → WhatsApp al cliente

## 🗂️ Estructura del Proyecto

```
src/
├── auth/           # Autenticación y autorización
├── chat/           # Lógica del chatbot
├── inventory/      # Gestión de inventario
├── whatsapp/       # Integración WhatsApp
├── gemini/         # Servicios de IA
├── common/         # Utilidades compartidas
└── main.ts         # Punto de entrada
```

## 📝 Ejemplos de Uso

### Consultas Soportadas

```
👤 Cliente: "¿Tienen iPhone 15 Pro disponible?"
🤖 Bot: "¡Hola! Sí, tenemos iPhone 15 Pro disponible en las siguientes opciones:
- iPhone 15 Pro 128GB - $999
- iPhone 15 Pro 256GB - $1,099
¿Te interesa alguna capacidad específica?"

👤 Cliente: "Necesito un Samsung entre $300 y $500"
🤖 Bot: "Encontré estas opciones Samsung en tu rango de precio:
- Galaxy A54 256GB - $449
- Galaxy A34 128GB - $349
- Galaxy S23 FE 128GB - $499
¿Cuál te llama más la atención?"
```

## 🧪 Testing

```bash
# Tests unitarios
pnpm test

# Tests con coverage
pnpm test:cov

# Tests e2e
pnpm test:e2e

# Tests en modo watch
pnpm test:watch
```

## 🚀 Deployment

```bash
# Build para producción
pnpm build

# Ejecutar migraciones en producción
pnpm prisma migrate deploy

# Iniciar en producción
pnpm start:prod
```

## 📄 Scripts Disponibles

- `pnpm start:dev` - Desarrollo con hot reload
- `pnpm build` - Build para producción
- `pnpm start:prod` - Ejecutar en producción
- `pnpm test` - Ejecutar tests
- `pnpm lint` - Ejecutar linter
- `pnpm format` - Formatear código

## 🔒 Seguridad

- Encriptación de contraseñas con bcryptjs
- Autenticación JWT
- Validación de datos con class-validator
- Variables de entorno para credenciales sensibles

---

**Desarrollado con ❤️ por [RoberthLoorDev](https://github.com/RoberthLoorDev)**
