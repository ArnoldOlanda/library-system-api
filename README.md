<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

API REST para aplicación de Autenticacion desarrollada con [NestJS](https://github.com/nestjs/nest), TypeScript y TypeORM.

## Features Implementadas

### 🔐 Autenticación y Autorización
- ✅ Login con JWT
- ✅ Refresh Token con cookies HTTP-only
- ✅ Recuperación de contraseña por correo electrónico
- ✅ Validación de tokens de reseteo
- ✅ Cambio de contraseña para usuarios autenticados
- ✅ Guards de autenticación basados en Passport JWT
- ✅ Sistema de roles y permisos granular
- ✅ Guards personalizados para roles y permisos

### 👥 Gestión de Usuarios
- ✅ CRUD completo de usuarios
- ✅ Paginación de listados
- ✅ Soft delete (eliminación lógica)
- ✅ Asignación de roles a usuarios
- ✅ Validación de datos con class-validator
- ✅ Encriptación de contraseñas con bcrypt

### 🔑 Gestión de Roles
- ✅ CRUD completo de roles
- ✅ Relación muchos a muchos con permisos
- ✅ Asignación múltiple de permisos a roles

### 🛡️ Gestión de Permisos
- ✅ CRUD completo de permisos
- ✅ Sistema de permisos granular por recurso y acción
- ✅ Validación de permisos en endpoints

### 📧 Notificaciones
- ✅ Envío de correos electrónicos con plantillas HTML
- ✅ Templates personalizados para recuperación de contraseña
- ✅ Integración con @nestjs-modules/mailer

### 📚 Documentación
- ✅ Documentación Swagger/OpenAPI
- ✅ Decoradores @ApiResponse en todos los endpoints
- ✅ Documentación de códigos de estado HTTP
- ✅ Bearer Authentication configurado

### 🛠️ Características Técnicas
- ✅ TypeORM para gestión de base de datos
- ✅ Migraciones de base de datos
- ✅ Variables de entorno con @nestjs/config
- ✅ Interceptor para formato de respuestas
- ✅ Manejo global de excepciones
- ✅ Validación de DTOs
- ✅ CORS configurado
- ✅ Timestamps localizados en respuestas

## Estructura del Proyecto

```
src/
├── auth/              # Módulo de autenticación
│   ├── decorators/    # Decoradores personalizados (@Auth, @RoleProtected, etc.)
│   ├── dto/           # DTOs para login, roles, permisos
│   ├── entities/      # Entidades de Role, Permission, PasswordResetToken
│   ├── enums/         # Enums de roles y permisos
│   ├── guard/         # Guards de roles y permisos
│   └── strategies/    # Estrategia JWT
├── users/             # Módulo de usuarios
│   ├── dto/           # DTOs para usuarios y paginación
│   └── entities/      # Entidad de User
├── config/            # Configuración de CORS y DataSource
├── interceptors/      # Interceptor de formato de respuestas
├── migrations/        # Migraciones de TypeORM
└── utils/             # Utilidades (encriptación, etc.)
```

## Project setup

```bash
$ pnpm install
```

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```
## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
