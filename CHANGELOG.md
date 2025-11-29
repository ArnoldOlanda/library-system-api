# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-11-29

### Added

#### Authentication & Authorization
- JWT authentication with access tokens and refresh tokens
- Refresh tokens stored in httpOnly cookies for enhanced security
- Google OAuth 2.0 integration for social login
- Email verification system with unique tokens
- Password recovery with temporary email tokens
- Password change functionality for authenticated users
- Role-based access control (RBAC) with granular permissions
- Custom decorators for authentication and authorization (`@Auth()`, `@Permissions()`, `@RoleProtected()`)
- Guards for role and permission validation

#### User Management
- Complete CRUD operations for users with pagination
- Soft delete functionality for users
- Role assignment and removal for users
- User activation via email verification

#### Roles & Permissions
- Complete CRUD for roles
- Complete CRUD for permissions
- Permission assignment to roles
- Granular permission system (CREATE, READ, UPDATE, DELETE, MANAGE)

#### Infrastructure
- Docker and Docker Compose configuration
- Multi-stage Dockerfile for optimized production builds
- Automatic database migrations on container startup
- Health check endpoint (`/health`) for monitoring
- Environment variable validation on application startup
- PostgreSQL database integration with TypeORM
- Redis integration for BullMQ job queues

#### Communication
- Email sending with Handlebars templates
- Asynchronous email queue with BullMQ
- Email templates for verification and password recovery

#### Documentation
- Complete Swagger/OpenAPI documentation
- Bilingual README (Spanish and English)
- Docker deployment guides
- Troubleshooting documentation
- Migration guides

#### Code Quality
- Structured logging with NestJS Logger
- TypeScript with strict typing
- ESLint and Prettier configuration
- Input validation with class-validator
- DTO transformations with class-transformer

### Security
- Rate limiting with @nestjs/throttler (protection against brute force attacks)
- Password hashing with bcrypt
- HttpOnly cookies for refresh tokens
- CORS configuration for development and production
- Environment variable validation
- SQL injection protection via TypeORM

### Changed
- Replaced all `console.log` statements with structured NestJS Logger
- Improved error handling with proper logging
- Enhanced Docker configuration for production readiness

### Fixed
- Import paths in entity files (removed absolute paths with `src/`)
- TypeORM migration execution in Docker containers
- Environment variable loading in different environments

## [0.1.0] - 2025-11-27

### Added
- Initial project setup with NestJS
- Basic authentication structure
- Database configuration with TypeORM
- Docker Compose for development

---

[1.0.0]: https://github.com/your-repo/nest-rest-base/releases/tag/v1.0.0
[0.1.0]: https://github.com/your-repo/nest-rest-base/releases/tag/v0.1.0
