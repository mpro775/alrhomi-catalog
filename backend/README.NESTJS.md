# Product Catalog API - NestJS

This is the NestJS version of the Product Catalog API, migrated from Express.js.

## Features

- **TypeScript** - Full type safety
- **NestJS** - Modern, scalable Node.js framework
- **MongoDB** - Database with Mongoose ODM
- **JWT Authentication** - Secure authentication with role-based access control
- **AWS S3** - Image storage
- **Bull Queue** - Background job processing for image watermarking
- **Swagger/OpenAPI** - Complete API documentation
- **Validation** - Request validation with class-validator
- **Error Handling** - Comprehensive error handling with custom filters

## Project Structure

```
backend/
├── src/
│   ├── main.ts                    # Application entry point
│   ├── app.module.ts              # Root module
│   ├── config/                    # Configuration modules
│   │   ├── config.module.ts
│   │   ├── database.config.ts
│   │   ├── aws.config.ts
│   │   ├── redis.config.ts
│   │   └── jwt.config.ts
│   ├── database/                  # Database setup and schemas
│   │   ├── database.module.ts
│   │   └── schemas/
│   ├── common/                    # Shared components
│   │   ├── decorators/
│   │   ├── filters/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   └── interfaces/
│   ├── auth/                       # Authentication module
│   ├── categories/              # Categories module
│   ├── products/                # Products module
│   ├── images/                  # Images module
│   ├── admin/                   # Admin modules
│   │   ├── admin-users/
│   │   ├── admin-images/
│   │   └── admin-stats/
│   ├── storage/                 # S3 storage service
│   ├── queue/                   # Bull queue module
│   └── job-status/              # Job status module
├── test/                        # E2E tests
├── tsconfig.json                # TypeScript configuration
├── nest-cli.json                # NestJS CLI configuration
└── package.json                 # Dependencies
```

## Installation

1. **Install dependencies:**

```bash
npm install
```

2. **Set up environment variables:**

Copy `.env.example` to `.env` and fill in your configuration:

```bash
cp .env.example .env
```

3. **Configure environment variables:**

Edit `.env` file with your actual values:
- MongoDB connection string
- JWT secret key
- AWS S3 credentials
- Redis connection URL

## Running the Application

### Development

```bash
npm run start:dev
```

The application will be available at `http://localhost:5000`
Swagger documentation at `http://localhost:5000/api-docs`

### Production

```bash
npm run build
npm run start:prod
```

## API Documentation

Swagger documentation is available at `/api-docs` endpoint when the application is running.

## Authentication

Most endpoints require JWT authentication. To authenticate:

1. Register a new user at `POST /api/auth/register`
2. Login at `POST /api/auth/login` to get a JWT token
3. Include the token in the Authorization header: `Bearer <token>`

## Environment Variables

See `.env.example` for all required environment variables.

### Required Variables

- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `AWS_REGION` - AWS region for S3
- `AWS_ACCESS_KEY_ID` - AWS access key
- `AWS_SECRET_ACCESS_KEY` - AWS secret key
- `S3_BUCKET` - S3 bucket name
- `REDIS_URL` - Redis connection URL for Bull queue

### Optional Variables

- `PORT` - Server port (default: 5000)
- `JWT_EXPIRES_IN` - JWT token expiration (default: 15m)
- `REFRESH_TOKEN_EXPIRES_IN` - Refresh token expiration (default: 7d)

## Key Modules

### Auth Module
- User registration and login
- JWT token generation
- Role-based access control

### Products Module
- CRUD operations for products
- Search and pagination
- Category association

### Images Module
- Image upload to S3
- Background watermark processing with Bull
- Image download with presigned URLs

### Admin Modules
- User management
- Image management
- Category management
- Statistics

## Migration Notes

This NestJS version maintains API compatibility with the Express.js version, so the frontend should work without changes. Key improvements:

1. **Type Safety** - Full TypeScript support
2. **Better Structure** - Modular architecture with clear separation of concerns
3. **Validation** - Automatic request validation with DTOs
4. **Documentation** - Enhanced Swagger documentation
5. **Error Handling** - Comprehensive error handling
6. **Testing** - Ready for unit and E2E tests

## Scripts

- `npm run start:dev` - Start in development mode with hot reload
- `npm run build` - Build for production
- `npm run start:prod` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm test` - Run unit tests
- `npm run test:e2e` - Run E2E tests

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`

### Redis Connection Issues
- Ensure Redis is running
- Check `REDIS_URL` in `.env`
- For TLS connections, use `rediss://` protocol

### AWS S3 Issues
- Verify AWS credentials
- Check bucket permissions
- Ensure bucket exists in the specified region

## License

ISC

