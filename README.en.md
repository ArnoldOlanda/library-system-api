<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# nest-rest-base — Authentication and User Management API

Complete REST API for authentication, authorization, and user management with role-based access control and granular permissions. Built with NestJS, TypeScript, TypeORM, and PostgreSQL.

## 📋 Table of Contents

- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation and Setup](#-installation-and-setup)
- [Environment Variables](#-environment-variables)
- [Available Commands](#-available-commands)
- [API Endpoints](#-api-endpoints)
- [Permission System](#-permission-system)
- [Google OAuth Authentication](#-google-oauth-authentication)
- [Swagger Documentation](#-swagger-documentation)
- [Testing](#-testing)
- [Docker Compose](#-docker-compose)
- [Troubleshooting](#-troubleshooting)

## ✨ Key Features

### Authentication and Security
- ✅ **JWT Authentication** with access tokens and refresh tokens
- ✅ **Refresh tokens** stored in httpOnly cookies for enhanced security
- ✅ **Google OAuth 2.0** for social login
- ✅ **Rate limiting** with Throttler (brute force attack protection)
- ✅ **Data validation** with class-validator and class-transformer
- ✅ **CORS** configured for development and production

### User Management
- ✅ **User registration** with email verification
- ✅ **Email verification** via unique tokens
- ✅ **Password recovery** with temporary email tokens
- ✅ **Password change** for authenticated users
- ✅ **Complete CRUD** for users with pagination
- ✅ **Soft delete** for removed users
- ✅ **Role assignment and removal** for users

### Role and Permission System
- ✅ **Customizable roles** with complete CRUD
- ✅ **Granular permissions** (CREATE, READ, UPDATE, DELETE, MANAGE)
- ✅ **Custom guards** for route protection
- ✅ **Decorators** for role and permission-based access control
- ✅ **Multiple permission assignment** to roles

### Communications
- ✅ **Email sending** with Handlebars templates
- ✅ **Email queue** with BullMQ and Redis for async processing
- ✅ **Email templates** for verification, password recovery, etc.

### Development and Testing
- ✅ **Unit tests** with complete mocks
- ✅ **Integration tests** with test database
- ✅ **Swagger/OpenAPI documentation** automatic
- ✅ **Interceptors** for response formatting
- ✅ **Custom exception filters**
- ✅ **Logging** with Morgan

## 🛠 Tech Stack

### Core
- **NestJS** v11 - Progressive backend framework
- **TypeScript** v5.7 - Static typing
- **TypeORM** v0.3 - ORM for PostgreSQL
- **PostgreSQL** - Relational database

### Authentication and Security
- **Passport JWT** - Authentication strategy
- **Passport Google OAuth 2.0** - Social login
- **bcrypt** - Password hashing
- **@nestjs/throttler** - Rate limiting

### Communications
- **@nestjs-modules/mailer** - Email sending
- **Handlebars** - Email template engine
- **BullMQ** - Job queue with Redis
- **Redis** - Caching and queues

### Documentation and Validation
- **@nestjs/swagger** - OpenAPI documentation
- **class-validator** - DTO validation
- **class-transformer** - Object transformation

### Testing
- **Jest** v30 - Testing framework
- **Supertest** - HTTP endpoint testing
- **ts-jest** - TypeScript support for Jest

## 📁 Project Structure

```
src/
├── auth/                          # Authentication module
│   ├── controllers/               # Auth, roles, and permissions controllers
│   │   ├── auth.controller.ts     # Login, register, password recovery
│   │   ├── role.controller.ts     # Role CRUD
│   │   └── permission.controller.ts # Permission CRUD
│   ├── decorators/                # Custom decorators
│   │   ├── auth.decorator.ts      # Combined authentication decorator
│   │   ├── permissions.decorator.ts # Permissions decorator
│   │   ├── roleProtected.decorator.ts # Roles decorator
│   │   └── user.decorator.ts      # User retrieval decorator
│   ├── dto/                       # Data Transfer Objects
│   ├── entities/                  # Database entities
│   │   ├── role.entity.ts         # Role entity
│   │   ├── permission.entity.ts   # Permission entity
│   │   ├── emailVerification.entity.ts # Verification tokens
│   │   └── passwordResetToken.entity.ts # Reset tokens
│   ├── enums/                     # Enumerations
│   │   ├── permissions.enum.ts    # Available permissions
│   │   ├── validRoles.enum.ts     # Valid roles
│   │   └── socialProvider.enum.ts # Social providers
│   ├── guard/                     # Authorization guards
│   │   ├── permissions.guard.ts   # Permissions guard
│   │   └── userRole.guard.ts      # Roles guard
│   ├── services/                  # Business services
│   │   ├── auth.service.ts        # Authentication logic
│   │   ├── role.service.ts        # Role logic
│   │   ├── permission.service.ts  # Permission logic
│   │   ├── emailVerification.service.ts # Email verification
│   │   └── passwordResetToken.service.ts # Password reset
│   └── strategies/                # Passport strategies
│       ├── jwt.strategy.ts        # JWT strategy
│       └── google.strategy.ts     # Google OAuth strategy
├── users/                         # Users module
│   ├── dto/                       # User DTOs
│   ├── entities/                  # User entity
│   ├── users.controller.ts        # User CRUD
│   └── users.service.ts           # User logic
├── queue/                         # Queue module
│   └── email.processor.ts         # Email processor
├── config/                        # Configuration
│   ├── dataSource.ts              # TypeORM configuration
│   └── cors.ts                    # CORS configuration
├── mails/                         # Email templates
├── interceptors/                  # Global interceptors
├── exceptionFilters/              # Exception filters
├── utils/                         # Utilities
├── app.module.ts                  # Main module
└── main.ts                        # Entry point

test/                              # Tests
├── auth/                          # Authentication tests
├── users/                         # User tests
├── seed-test-data.ts              # Test seed
└── jest-setup.ts                  # Jest configuration
```

## 🚀 Installation and Setup

### Prerequisites

- Node.js >= 20
- PostgreSQL >= 17
- Redis >= 7
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd nest-rest-base
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit the `.env` file with your configurations (see [Environment Variables](#-environment-variables) section)

4. **Start services with Docker (optional)**
```bash
docker-compose up -d
```

5. **Run migrations (if applicable)**
```bash
pnpm run migration:run
```

6. **Start the server**
```bash
pnpm run start:dev
```

The server will be available at `http://localhost:3000` (or the port configured in `.env`)

## 🔐 Environment Variables

Create a `.env` file in the project root with the following variables:

```bash
# Server
PORT=3000

# PostgreSQL Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name

# JWT Secrets
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
REFRESH_TOKEN_SECRET=your_super_secret_refresh_token_key_change_this

# Frontend URL (for OAuth redirects)
FRONTEND_URL=http://localhost:3000

# Email Configuration (example with Mailtrap)
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USER=your_mailtrap_user
MAIL_PASS=your_mailtrap_password

# Rate Limiting
THROTTLE_TTL=60000        # Time in ms (60 seconds)
THROTTLE_LIMIT=10         # Number of allowed requests

# Redis (for BullMQ)
REDIS_HOST=localhost
REDIS_PORT=6379

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/v1/auth/google/callback
```

### Email Configuration

For development, you can use [Mailtrap](https://mailtrap.io/) which captures emails without actually sending them.

For production, configure a real SMTP service like:
- Gmail SMTP
- SendGrid
- AWS SES
- Mailgun

## 📝 Available Commands

### Development
```bash
pnpm run start          # Start in production mode
pnpm run start:dev      # Start in development mode (watch mode)
pnpm run start:debug    # Start in debug mode
pnpm run build          # Build the project
```

### Linting and Formatting
```bash
pnpm run lint           # Run ESLint
pnpm run format         # Format code with Prettier
```

### Migrations
```bash
pnpm run migration:generate   # Generate migration
pnpm run migration:run        # Run migrations
pnpm run migration:rollback   # Rollback last migration
```

### Testing
```bash
pnpm run test           # Run unit tests
pnpm run test:watch     # Run tests in watch mode
pnpm run test:cov       # Run tests with coverage
pnpm run test:e2e       # Run end-to-end tests
pnpm run test:debug     # Run tests in debug mode
```

### Docker Compose (Testing)
```bash
pnpm run test:db-up     # Start test database
pnpm run test:db-down   # Stop test database
```

## 🌐 API Endpoints

The API is available at `http://localhost:3000/api/v1`

### Authentication (`/auth`)

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | Login | No |
| POST | `/auth/refresh-token` | Refresh access token | No |
| GET | `/auth/google` | Start Google login | No |
| GET | `/auth/google/callback` | Google OAuth callback | No |
| PATCH | `/auth/activate?token=xxx` | Activate account via email | No |
| GET | `/auth/resend-email-verification?email=xxx` | Resend verification email | No |
| POST | `/auth/forgot-password` | Request password reset | No |
| GET | `/auth/validate-reset-token/:token` | Validate reset token | No |
| POST | `/auth/reset-password` | Reset password | No |
| PATCH | `/auth/change-password` | Change password | Yes (JWT) |

### Users (`/users`)

| Method | Endpoint | Description | Required Permissions |
|--------|----------|-------------|---------------------|
| GET | `/users` | List users (paginated) | `READ_USER` |
| GET | `/users/:id` | Get user by ID | `READ_USER` |
| POST | `/users` | Create user | `CREATE_USER` |
| PATCH | `/users/:id` | Update user | `UPDATE_USER` |
| DELETE | `/users/:id` | Delete user (soft delete) | `DELETE_USER` |
| POST | `/users/:id/roles` | Assign role to user | `UPDATE_USER` |
| DELETE | `/users/:id/roles` | Remove role from user | `UPDATE_USER` |

### Roles (`/roles`)

| Method | Endpoint | Description | Required Permissions |
|--------|----------|-------------|---------------------|
| GET | `/roles` | List all roles | `READ_ROLE` |
| GET | `/roles/:id` | Get role by ID | `READ_ROLE` |
| POST | `/roles` | Create new role | `CREATE_ROLE` |
| PATCH | `/roles/:id` | Update role | `UPDATE_ROLE` |
| DELETE | `/roles/:id` | Delete role | `DELETE_ROLE` |
| GET | `/roles/:id/permissions` | Get role permissions | `READ_ROLE` |
| POST | `/roles/:id/permissions` | Assign permissions to role | `UPDATE_ROLE` |
| DELETE | `/roles/:id/permissions` | Remove permissions from role | `UPDATE_ROLE` |

### Permissions (`/permissions`)

| Method | Endpoint | Description | Required Permissions |
|--------|----------|-------------|---------------------|
| GET | `/permissions` | List all permissions | `READ_PERMISSION` |
| GET | `/permissions/:id` | Get permission by ID | `READ_PERMISSION` |
| POST | `/permissions` | Create new permission | `CREATE_PERMISSION` |
| PATCH | `/permissions/:id` | Update permission | `UPDATE_PERMISSION` |
| DELETE | `/permissions/:id` | Delete permission | `DELETE_PERMISSION` |

## 🔒 Permission System

The project implements a granular permission-based access control system (RBAC - Role-Based Access Control).

### Available Permissions

```typescript
enum Permission {
  // Users
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

  // Permissions
  MANAGE_PERMISSION = 'manage:permission',  // Super admin
  CREATE_PERMISSION = 'create:permission',
  READ_PERMISSION = 'read:permission',
  UPDATE_PERMISSION = 'update:permission',
  DELETE_PERMISSION = 'delete:permission',
}
```

### Using the `@Auth()` Decorator

The `@Auth()` decorator combines JWT authentication with permission verification:

```typescript
// Requires JWT authentication and specific permission
@Auth({ permissions: [Permission.CREATE_USER] })
@Post()
create(@Body() createUserDto: CreateUserDto) {
  return this.usersService.create(createUserDto);
}

// Requires JWT authentication and multiple permissions
@Auth({ permissions: [Permission.UPDATE_USER, Permission.READ_USER] })
@Patch(':id')
update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  return this.usersService.update(id, updateUserDto);
}
```

### Authorization Flow

1. User authenticates and receives a JWT
2. JWT contains the user's ID
3. On each protected request, the `JwtStrategy` validates the token
4. The `PermissionsGuard` verifies the user has the required permissions
5. If authorized, the request proceeds; otherwise, returns 403 Forbidden

## 🔑 Google OAuth Authentication

### Configuration

1. **Create project in Google Cloud Console**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the Google+ API

2. **Create OAuth 2.0 credentials**
   - Go to "Credentials" → "Create credentials" → "OAuth client ID"
   - Application type: "Web application"
   - Authorized redirect URIs: `http://localhost:3000/api/v1/auth/google/callback`

3. **Configure environment variables**
```bash
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/v1/auth/google/callback
```

### Authentication Flow

1. User clicks "Login with Google"
2. Redirects to `GET /api/v1/auth/google`
3. Google authenticates the user
4. Redirects to `/api/v1/auth/google/callback`
5. Backend creates or updates the user
6. Redirects to frontend with JWT token in URL

### Frontend Integration Example

```javascript
// Start Google login
window.location.href = 'http://localhost:3000/api/v1/auth/google';

// Capture the callback
const urlParams = new URLSearchParams(window.location.hash.substring(1));
const token = urlParams.get('token');
const email = urlParams.get('email');
const name = urlParams.get('name');

if (token) {
  // Save token and redirect
  localStorage.setItem('access_token', token);
  // Redirect to dashboard
}
```

## 📚 Swagger Documentation

The API includes interactive documentation automatically generated with Swagger/OpenAPI.

### Access Swagger UI

Once the server is running, access:

```
http://localhost:3000/api/v1/docs
```

### Swagger Features

- ✅ Documentation of all endpoints
- ✅ Data models (DTOs)
- ✅ Request/response examples
- ✅ Bearer Token authentication
- ✅ Test endpoints directly from browser

### Using Authentication in Swagger

1. Login at `/auth/login` to get the token
2. Copy the `access_token` from the response
3. Click the "Authorize" button (🔒) at the top
4. Enter: `Bearer <your_token>`
5. Now you can test protected endpoints

### JSON Document

The OpenAPI document in JSON format is available at:

```
http://localhost:3000/api/v1/docs-json
```

## 🧪 Testing

The project includes comprehensive unit and integration tests.

### Test Types

#### Unit Tests
- Use **mocks** for repositories, services, and external dependencies
- Don't require database or Redis
- Faster and isolated
- Location: `*.spec.ts` next to each file

#### Integration Tests (E2E)
- Use a **real test database**
- Include test data seeding
- Test the complete application flow
- Location: `test/*.e2e-spec.ts`

### Running Tests

```bash
# Unit tests
pnpm run test

# Tests in watch mode
pnpm run test:watch

# Tests with coverage
pnpm run test:cov

# E2E tests
pnpm run test:e2e
```

### Test Configuration

#### Jest Setup (`test/jest-setup.ts`)
- Mocks the `uuid` module to avoid ESM issues
- Generates valid UUIDs for tests

#### Data Seed (`test/seed-test-data.ts`)
- Creates test users, roles, and permissions
- Runs before each integration test suite
- Cleans database with `synchronize(true)`

### Unit Test Example

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
        // ... more mocks
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

The project includes `docker-compose.test.yml` to facilitate local testing.

### Included Services

- **postgres-test**: PostgreSQL 17 on port `5434`
- **redis-test**: Redis 7 on port `6379`

### Usage

```bash
# Start services
pnpm run test:db-up

# Verify they're running
docker ps

# Run tests
pnpm run test

# Stop services
pnpm run test:db-down
```

### Test Database Configuration

Default credentials are:

```bash
DB_HOST=localhost
DB_PORT=5434
DB_USER=test_user
DB_PASSWORD=test_password
DB_NAME=test_db
```

Make sure your `.env.test` file has these configurations.

### Manual Docker Compose

```bash
# Start in detached mode
docker-compose -f docker-compose.test.yml up -d

# View logs
docker-compose -f docker-compose.test.yml logs -f

# Stop and remove volumes
docker-compose -f docker-compose.test.yml down -v
```

## 🔧 Troubleshooting

### Error: `ECONNREFUSED ::1:6379`

**Cause**: Redis is not running

**Solution**:
```bash
# Option 1: Start Redis with Docker
docker run -d -p 6379:6379 redis:7-alpine

# Option 2: Install Redis locally
# On macOS
brew install redis
brew services start redis

# On Ubuntu
sudo apt-get install redis-server
sudo systemctl start redis
```

### Error: `relation "users" does not exist`

**Cause**: Tables haven't been created in the database

**Solution**:
```bash
# Option 1: Enable auto-sync (development only)
# In dataSource.ts, make sure you have:
synchronize: true

# Option 2: Run migrations
pnpm run migration:run
```

### Error: `this.jwtService.signAsync is not a function`

**Cause**: Incomplete JwtService mock in tests

**Solution**:
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

**Cause**: Attempting to insert duplicate data (email, etc.)

**Solution**:
```typescript
// In tests, clean database before each test
beforeEach(async () => {
  await dataSource.synchronize(true); // Drop and recreate schema
  await seedTestData(dataSource);
});
```

### Error: `Cannot find module 'uuid'` in tests

**Cause**: Issue with ESM modules in Jest

**Solution**: The project already includes `test/jest-setup.ts` that mocks uuid. Make sure `jest.config.js` has:

```javascript
module.exports = {
  setupFilesAfterEnv: ['<rootDir>/test/jest-setup.ts'],
  // ...
};
```

### Emails not being sent

**Cause**: Incorrect SMTP or BullMQ configuration

**Solution**:
1. Verify `MAIL_*` environment variables
2. Make sure Redis is running
3. Check queue logs:
```typescript
// In development, you can see jobs in console
console.log('Email job added to queue:', job.id);
```

### Rate limiting too restrictive

**Cause**: Throttler configuration too strict

**Solution**: Adjust environment variables:
```bash
THROTTLE_TTL=60000      # 60 seconds
THROTTLE_LIMIT=100      # 100 requests per minute
```

Or disable throttling in development:
```typescript
// In app.module.ts, comment out ThrottlerGuard
// {
//   provide: APP_GUARD,
//   useClass: ThrottlerGuard
// }
```

## 📄 License

This project is private and has no public license.

## 👤 Author

**Artidev**

---

**Need help?** Open an issue in the repository or contact the development team.
