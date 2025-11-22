<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# nest-rest-base — API de Autenticación y Gestión de Usuarios

API REST completa para autenticación, autorización y gestión de usuarios con sistema de roles y permisos granulares. Implementada con NestJS, TypeScript, TypeORM y PostgreSQL.

## 📋 Tabla de Contenidos

- [Características Principales](#-características-principales)
- [Stack Tecnológico](#-stack-tecnológico)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Instalación y Configuración](#-instalación-y-configuración)
- [Variables de Entorno](#-variables-de-entorno)
- [Comandos Disponibles](#-comandos-disponibles)
- [API Endpoints](#-api-endpoints)
- [Sistema de Permisos](#-sistema-de-permisos)
- [Autenticación con Google OAuth](#-autenticación-con-google-oauth)
- [Documentación Swagger](#-documentación-swagger)
- [Testing](#-testing)
- [Docker Compose](#-docker-compose)
- [Troubleshooting](#-troubleshooting)

## ✨ Características Principales

### Autenticación y Seguridad
- ✅ **Autenticación JWT** con access tokens y refresh tokens
- ✅ **Refresh tokens** almacenados en cookies httpOnly para mayor seguridad
- ✅ **Google OAuth 2.0** para login social
- ✅ **Rate limiting** con Throttler (protección contra ataques de fuerza bruta)
- ✅ **Validación de datos** con class-validator y class-transformer
- ✅ **CORS** configurado para desarrollo y producción

### Gestión de Usuarios
- ✅ **Registro de usuarios** con verificación por email
- ✅ **Verificación de email** mediante tokens únicos
- ✅ **Recuperación de contraseña** con tokens temporales por email
- ✅ **Cambio de contraseña** para usuarios autenticados
- ✅ **CRUD completo** de usuarios con paginación
- ✅ **Soft delete** para usuarios eliminados
- ✅ **Asignación y remoción de roles** a usuarios

### Sistema de Roles y Permisos
- ✅ **Roles personalizables** con CRUD completo
- ✅ **Permisos granulares** (CREATE, READ, UPDATE, DELETE, MANAGE)
- ✅ **Guards personalizados** para protección de rutas
- ✅ **Decoradores** para control de acceso basado en roles y permisos
- ✅ **Asignación múltiple** de permisos a roles

### Comunicaciones
- ✅ **Envío de emails** con plantillas Handlebars
- ✅ **Cola de emails** con BullMQ y Redis para procesamiento asíncrono
- ✅ **Plantillas de email** para verificación, recuperación de contraseña, etc.

### Desarrollo y Testing
- ✅ **Tests unitarios** con mocks completos
- ✅ **Tests de integración** con base de datos de prueba
- ✅ **Documentación Swagger/OpenAPI** automática
- ✅ **Interceptores** para formateo de respuestas
- ✅ **Filtros de excepciones** personalizados
- ✅ **Logging** con Morgan

## 🛠 Stack Tecnológico

### Core
- **NestJS** v11 - Framework backend progresivo
- **TypeScript** v5.7 - Tipado estático
- **TypeORM** v0.3 - ORM para PostgreSQL
- **PostgreSQL** - Base de datos relacional

### Autenticación y Seguridad
- **Passport JWT** - Estrategia de autenticación
- **Passport Google OAuth 2.0** - Login social
- **bcrypt** - Hashing de contraseñas
- **@nestjs/throttler** - Rate limiting

### Comunicaciones
- **@nestjs-modules/mailer** - Envío de emails
- **Handlebars** - Motor de plantillas para emails
- **BullMQ** - Cola de trabajos con Redis
- **Redis** - Almacenamiento en caché y colas

### Documentación y Validación
- **@nestjs/swagger** - Documentación OpenAPI
- **class-validator** - Validación de DTOs
- **class-transformer** - Transformación de objetos

### Testing
- **Jest** v30 - Framework de testing
- **Supertest** - Testing de endpoints HTTP
- **ts-jest** - Soporte de TypeScript para Jest

## 📁 Estructura del Proyecto

```
src/
├── auth/                          # Módulo de autenticación
│   ├── controllers/               # Controladores de auth, roles y permisos
│   │   ├── auth.controller.ts     # Login, registro, recuperación de contraseña
│   │   ├── role.controller.ts     # CRUD de roles
│   │   └── permission.controller.ts # CRUD de permisos
│   ├── decorators/                # Decoradores personalizados
│   │   ├── auth.decorator.ts      # Decorador combinado de autenticación
│   │   ├── permissions.decorator.ts # Decorador de permisos
│   │   ├── roleProtected.decorator.ts # Decorador de roles
│   │   └── user.decorator.ts      # Decorador para obtener usuario
│   ├── dto/                       # Data Transfer Objects
│   ├── entities/                  # Entidades de base de datos
│   │   ├── role.entity.ts         # Entidad de roles
│   │   ├── permission.entity.ts   # Entidad de permisos
│   │   ├── emailVerification.entity.ts # Tokens de verificación
│   │   └── passwordResetToken.entity.ts # Tokens de reseteo
│   ├── enums/                     # Enumeraciones
│   │   ├── permissions.enum.ts    # Permisos disponibles
│   │   ├── validRoles.enum.ts     # Roles válidos
│   │   └── socialProvider.enum.ts # Proveedores sociales
│   ├── guard/                     # Guards de autorización
│   │   ├── permissions.guard.ts   # Guard de permisos
│   │   └── userRole.guard.ts      # Guard de roles
│   ├── services/                  # Servicios de negocio
│   │   ├── auth.service.ts        # Lógica de autenticación
│   │   ├── role.service.ts        # Lógica de roles
│   │   ├── permission.service.ts  # Lógica de permisos
│   │   ├── emailVerification.service.ts # Verificación de email
│   │   └── passwordResetToken.service.ts # Reseteo de contraseña
│   └── strategies/                # Estrategias de Passport
│       ├── jwt.strategy.ts        # Estrategia JWT
│       └── google.strategy.ts     # Estrategia Google OAuth
├── users/                         # Módulo de usuarios
│   ├── dto/                       # DTOs de usuarios
│   ├── entities/                  # Entidad User
│   ├── users.controller.ts        # CRUD de usuarios
│   └── users.service.ts           # Lógica de usuarios
├── queue/                         # Módulo de colas
│   └── email.processor.ts         # Procesador de emails
├── config/                        # Configuración
│   ├── dataSource.ts              # Configuración de TypeORM
│   └── cors.ts                    # Configuración de CORS
├── mails/                         # Plantillas de email
├── interceptors/                  # Interceptores globales
├── exceptionFilters/              # Filtros de excepciones
├── utils/                         # Utilidades
├── app.module.ts                  # Módulo principal
└── main.ts                        # Punto de entrada

test/                              # Tests
├── auth/                          # Tests de autenticación
├── users/                         # Tests de usuarios
├── seed-test-data.ts              # Seed para tests
└── jest-setup.ts                  # Configuración de Jest
```

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js >= 20
- PostgreSQL >= 17
- Redis >= 7
- pnpm (recomendado) o npm

### Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd nest-rest-base
```

2. **Instalar dependencias**
```bash
pnpm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
```

Edita el archivo `.env` con tus configuraciones (ver sección [Variables de Entorno](#-variables-de-entorno))

4. **Levantar servicios con Docker (opcional)**
```bash
docker-compose up -d
```

5. **Ejecutar migraciones (si aplica)**
```bash
pnpm run migration:run
```

6. **Iniciar el servidor**
```bash
pnpm run start:dev
```

El servidor estará disponible en `http://localhost:3000` (o el puerto configurado en `.env`)

## 🔐 Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```bash
# Servidor
PORT=3000

# Base de datos PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name

# JWT Secrets
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
REFRESH_TOKEN_SECRET=your_super_secret_refresh_token_key_change_this

# Frontend URL (para redirecciones OAuth)
FRONTEND_URL=http://localhost:3000

# Configuración de Email (ejemplo con Mailtrap)
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USER=your_mailtrap_user
MAIL_PASS=your_mailtrap_password

# Rate Limiting
THROTTLE_TTL=60000        # Tiempo en ms (60 segundos)
THROTTLE_LIMIT=10         # Número de requests permitidos

# Redis (para BullMQ)
REDIS_HOST=localhost
REDIS_PORT=6379

# Google OAuth (opcional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/v1/auth/google/callback
```

### Configuración de Email

Para desarrollo, puedes usar [Mailtrap](https://mailtrap.io/) que captura los emails sin enviarlos realmente.

Para producción, configura un servicio SMTP real como:
- Gmail SMTP
- SendGrid
- AWS SES
- Mailgun

## 📝 Comandos Disponibles

### Desarrollo
```bash
pnpm run start          # Iniciar en modo producción
pnpm run start:dev      # Iniciar en modo desarrollo (watch mode)
pnpm run start:debug    # Iniciar en modo debug
pnpm run build          # Compilar el proyecto
```

### Linting y Formato
```bash
pnpm run lint           # Ejecutar ESLint
pnpm run format         # Formatear código con Prettier
```

### Migraciones
```bash
pnpm run migration:generate   # Generar migración
pnpm run migration:run        # Ejecutar migraciones
pnpm run migration:rollback   # Revertir última migración
```

### Testing
```bash
pnpm run test           # Ejecutar tests unitarios
pnpm run test:watch     # Ejecutar tests en modo watch
pnpm run test:cov       # Ejecutar tests con cobertura
pnpm run test:e2e       # Ejecutar tests end-to-end
pnpm run test:debug     # Ejecutar tests en modo debug
```

### Docker Compose (Testing)
```bash
pnpm run test:db-up     # Levantar base de datos de pruebas
pnpm run test:db-down   # Bajar base de datos de pruebas
```

## 🌐 API Endpoints

La API está disponible en `http://localhost:3000/api/v1`

### Autenticación (`/auth`)

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Registrar nuevo usuario | No |
| POST | `/auth/login` | Iniciar sesión | No |
| POST | `/auth/refresh-token` | Renovar access token | No |
| GET | `/auth/google` | Iniciar login con Google | No |
| GET | `/auth/google/callback` | Callback de Google OAuth | No |
| PATCH | `/auth/activate?token=xxx` | Activar cuenta por email | No |
| GET | `/auth/resend-email-verification?email=xxx` | Reenviar email de verificación | No |
| POST | `/auth/forgot-password` | Solicitar reseteo de contraseña | No |
| GET | `/auth/validate-reset-token/:token` | Validar token de reseteo | No |
| POST | `/auth/reset-password` | Resetear contraseña | No |
| PATCH | `/auth/change-password` | Cambiar contraseña | Sí (JWT) |

### Usuarios (`/users`)

| Método | Endpoint | Descripción | Permisos Requeridos |
|--------|----------|-------------|---------------------|
| GET | `/users` | Listar usuarios (paginado) | `READ_USER` |
| GET | `/users/:id` | Obtener usuario por ID | `READ_USER` |
| POST | `/users` | Crear usuario | `CREATE_USER` |
| PATCH | `/users/:id` | Actualizar usuario | `UPDATE_USER` |
| DELETE | `/users/:id` | Eliminar usuario (soft delete) | `DELETE_USER` |
| POST | `/users/:id/roles` | Asignar rol a usuario | `UPDATE_USER` |
| DELETE | `/users/:id/roles` | Remover rol de usuario | `UPDATE_USER` |

### Roles (`/roles`)

| Método | Endpoint | Descripción | Permisos Requeridos |
|--------|----------|-------------|---------------------|
| GET | `/roles` | Listar todos los roles | `READ_ROLE` |
| GET | `/roles/:id` | Obtener rol por ID | `READ_ROLE` |
| POST | `/roles` | Crear nuevo rol | `CREATE_ROLE` |
| PATCH | `/roles/:id` | Actualizar rol | `UPDATE_ROLE` |
| DELETE | `/roles/:id` | Eliminar rol | `DELETE_ROLE` |
| GET | `/roles/:id/permissions` | Obtener permisos del rol | `READ_ROLE` |
| POST | `/roles/:id/permissions` | Asignar permisos al rol | `UPDATE_ROLE` |
| DELETE | `/roles/:id/permissions` | Remover permisos del rol | `UPDATE_ROLE` |

### Permisos (`/permissions`)

| Método | Endpoint | Descripción | Permisos Requeridos |
|--------|----------|-------------|---------------------|
| GET | `/permissions` | Listar todos los permisos | `READ_PERMISSION` |
| GET | `/permissions/:id` | Obtener permiso por ID | `READ_PERMISSION` |
| POST | `/permissions` | Crear nuevo permiso | `CREATE_PERMISSION` |
| PATCH | `/permissions/:id` | Actualizar permiso | `UPDATE_PERMISSION` |
| DELETE | `/permissions/:id` | Eliminar permiso | `DELETE_PERMISSION` |

## 🔒 Sistema de Permisos

El proyecto implementa un sistema de control de acceso basado en permisos granulares (RBAC - Role-Based Access Control).

### Permisos Disponibles

```typescript
enum Permission {
  // Usuarios
  MANAGE_USER = 'manage:user',      // Super admin
  CREATE_USER = 'create:user',
  READ_USER = 'read:user',
  UPDATE_USER = 'update:user',
  DELETE_USER = 'delete:user',

  // Roles
  MANAGE_ROLE = 'manage:role',      // Super admin
  CREATE_ROLE = 'create:role',
  READ_ROLE = 'read:role',
  UPDATE_ROLE = 'update:role',
  DELETE_ROLE = 'delete:role',

  // Permisos
  MANAGE_PERMISSION = 'manage:permission',  // Super admin
  CREATE_PERMISSION = 'create:permission',
  READ_PERMISSION = 'read:permission',
  UPDATE_PERMISSION = 'update:permission',
  DELETE_PERMISSION = 'delete:permission',
}
```

### Uso del Decorador `@Auth()`

El decorador `@Auth()` combina autenticación JWT con verificación de permisos:

```typescript
// Requiere autenticación JWT y permiso específico
@Auth({ permissions: [Permission.CREATE_USER] })
@Post()
create(@Body() createUserDto: CreateUserDto) {
  return this.usersService.create(createUserDto);
}

// Requiere autenticación JWT y múltiples permisos
@Auth({ permissions: [Permission.UPDATE_USER, Permission.READ_USER] })
@Patch(':id')
update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  return this.usersService.update(id, updateUserDto);
}
```

### Flujo de Autorización

1. El usuario se autentica y recibe un JWT
2. El JWT contiene el ID del usuario
3. En cada request protegido, el `JwtStrategy` valida el token
4. El `PermissionsGuard` verifica que el usuario tenga los permisos requeridos
5. Si tiene permisos, la request procede; si no, retorna 403 Forbidden

## 🔑 Autenticación con Google OAuth

### Configuración

1. **Crear proyecto en Google Cloud Console**
   - Ve a [Google Cloud Console](https://console.cloud.google.com/)
   - Crea un nuevo proyecto o selecciona uno existente
   - Habilita la API de Google+

2. **Crear credenciales OAuth 2.0**
   - Ve a "Credenciales" → "Crear credenciales" → "ID de cliente de OAuth"
   - Tipo de aplicación: "Aplicación web"
   - URIs de redirección autorizados: `http://localhost:3000/api/v1/auth/google/callback`

3. **Configurar variables de entorno**
```bash
GOOGLE_CLIENT_ID=tu_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=tu_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/v1/auth/google/callback
```

### Flujo de Autenticación

1. El usuario hace clic en "Login with Google"
2. Redirige a `GET /api/v1/auth/google`
3. Google autentica al usuario
4. Redirige a `/api/v1/auth/google/callback`
5. El backend crea o actualiza el usuario
6. Redirige al frontend con el token JWT en la URL

### Ejemplo de Integración Frontend

```javascript
// Iniciar login con Google
window.location.href = 'http://localhost:3000/api/v1/auth/google';

// Capturar el callback
const urlParams = new URLSearchParams(window.location.hash.substring(1));
const token = urlParams.get('token');
const email = urlParams.get('email');
const name = urlParams.get('name');

if (token) {
  // Guardar token y redirigir
  localStorage.setItem('access_token', token);
  // Redirigir al dashboard
}
```

## 📚 Documentación Swagger

La API incluye documentación interactiva generada automáticamente con Swagger/OpenAPI.

### Acceder a Swagger UI

Una vez que el servidor esté corriendo, accede a:

```
http://localhost:3000/api/v1/docs
```

### Características de Swagger

- ✅ Documentación de todos los endpoints
- ✅ Modelos de datos (DTOs)
- ✅ Ejemplos de request/response
- ✅ Autenticación Bearer Token
- ✅ Prueba de endpoints directamente desde el navegador

### Usar Autenticación en Swagger

1. Haz login en `/auth/login` para obtener el token
2. Copia el `access_token` de la respuesta
3. Haz clic en el botón "Authorize" (🔒) en la parte superior
4. Ingresa: `Bearer <tu_token>`
5. Ahora puedes probar endpoints protegidos

### Documento JSON

El documento OpenAPI en formato JSON está disponible en:

```
http://localhost:3000/api/v1/docs-json
```

## 🧪 Testing

El proyecto incluye tests unitarios y de integración completos.

### Tipos de Tests

#### Tests Unitarios
- Usan **mocks** para repositorios, servicios y dependencias externas
- No requieren base de datos ni Redis
- Más rápidos y aislados
- Ubicación: `*.spec.ts` junto a cada archivo

#### Tests de Integración (E2E)
- Usan una **base de datos real** de pruebas
- Incluyen seed de datos de prueba
- Prueban el flujo completo de la aplicación
- Ubicación: `test/*.e2e-spec.ts`

### Ejecutar Tests

```bash
# Tests unitarios
pnpm run test

# Tests en modo watch
pnpm run test:watch

# Tests con cobertura
pnpm run test:cov

# Tests E2E
pnpm run test:e2e
```

### Configuración de Tests

#### Jest Setup (`test/jest-setup.ts`)
- Mockea el módulo `uuid` para evitar problemas ESM
- Genera UUIDs válidos para tests

#### Seed de Datos (`test/seed-test-data.ts`)
- Crea usuarios, roles y permisos de prueba
- Se ejecuta antes de cada suite de tests de integración
- Limpia la base de datos con `synchronize(true)`

### Ejemplo de Test Unitario

```typescript
describe('AuthService', () => {
  let service: AuthService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
            verifyAsync: jest.fn(),
          },
        },
        // ... más mocks
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
```

## 🐳 Docker Compose

El proyecto incluye `docker-compose.test.yml` para facilitar el testing local.

### Servicios Incluidos

- **postgres-test**: PostgreSQL 17 en puerto `5434`
- **redis-test**: Redis 7 en puerto `6379`

### Uso

```bash
# Levantar servicios
pnpm run test:db-up

# Verificar que estén corriendo
docker ps

# Ejecutar tests
pnpm run test

# Bajar servicios
pnpm run test:db-down
```

### Configuración de Base de Datos de Pruebas

Las credenciales por defecto son:

```bash
DB_HOST=localhost
DB_PORT=5434
DB_USER=test_user
DB_PASSWORD=test_password
DB_NAME=test_db
```

Asegúrate de que tu archivo `.env.test` tenga estas configuraciones.

### Docker Compose Manual

```bash
# Levantar en modo detached
docker-compose -f docker-compose.test.yml up -d

# Ver logs
docker-compose -f docker-compose.test.yml logs -f

# Bajar y eliminar volúmenes
docker-compose -f docker-compose.test.yml down -v
```

## 🔧 Troubleshooting

### Error: `ECONNREFUSED ::1:6379`

**Causa**: Redis no está corriendo

**Solución**:
```bash
# Opción 1: Levantar Redis con Docker
docker run -d -p 6379:6379 redis:7-alpine

# Opción 2: Instalar Redis localmente
# En macOS
brew install redis
brew services start redis

# En Ubuntu
sudo apt-get install redis-server
sudo systemctl start redis
```

### Error: `relation "users" does not exist`

**Causa**: Las tablas no se han creado en la base de datos

**Solución**:
```bash
# Opción 1: Habilitar sincronización automática (solo desarrollo)
# En dataSource.ts, asegúrate de tener:
synchronize: true

# Opción 2: Ejecutar migraciones
pnpm run migration:run
```

### Error: `this.jwtService.signAsync is not a function`

**Causa**: Mock incompleto de JwtService en tests

**Solución**:
```typescript
{
  provide: JwtService,
  useValue: {
    signAsync: jest.fn().mockResolvedValue('mock-token'),
    verifyAsync: jest.fn().mockResolvedValue({ id: 'user-id' }),
    sign: jest.fn().mockReturnValue('mock-token'),
    verify: jest.fn().mockReturnValue({ id: 'user-id' }),
  },
}
```

### Error: `duplicate key value violates unique constraint`

**Causa**: Intentando insertar datos duplicados (email, etc.)

**Solución**:
```typescript
// En tests, limpia la base de datos antes de cada test
beforeEach(async () => {
  await dataSource.synchronize(true); // Drop y recrear esquema
  await seedTestData(dataSource);
});
```

### Error: `Cannot find module 'uuid'` en tests

**Causa**: Problema con módulos ESM en Jest

**Solución**: El proyecto ya incluye `test/jest-setup.ts` que mockea uuid. Asegúrate de que `jest.config.js` tenga:

```javascript
module.exports = {
  setupFilesAfterEnv: ['<rootDir>/test/jest-setup.ts'],
  // ...
};
```

### Emails no se envían

**Causa**: Configuración incorrecta de SMTP o BullMQ

**Solución**:
1. Verifica las variables de entorno `MAIL_*`
2. Asegúrate de que Redis esté corriendo
3. Revisa los logs de la cola:
```typescript
// En desarrollo, puedes ver los jobs en la consola
console.log('Email job added to queue:', job.id);
```

### Rate Limiting muy restrictivo

**Causa**: Configuración de Throttler demasiado estricta

**Solución**: Ajusta las variables de entorno:
```bash
THROTTLE_TTL=60000      # 60 segundos
THROTTLE_LIMIT=100      # 100 requests por minuto
```

O desactiva el throttling en desarrollo:
```typescript
// En app.module.ts, comenta el ThrottlerGuard
// {
//   provide: APP_GUARD,
//   useClass: ThrottlerGuard
// }
```

## 📄 Licencia

Este proyecto es privado y no tiene licencia pública.

## 👤 Autor

**Artidev**

---

**¿Necesitas ayuda?** Abre un issue en el repositorio o contacta al equipo de desarrollo.
