# NestJS Migration - Setup Instructions

## Quick Start

1. **Install Dependencies**

```bash
npm install
```

2. **Copy Environment Variables**

Copy your existing `.env` file or use the `.env.example` template.

3. **Build and Run**

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

## Package.json Migration

The NestJS version uses a new `package.json` structure. If you have an existing `package.json`, you can:

1. Backup your current `package.json`
2. Use the `package.nestjs.json` as a reference
3. Merge dependencies as needed

Or use the new structure directly:

```bash
cp package.nestjs.json package.json
npm install
```

## Key Files Created

### Configuration Files
- `tsconfig.json` - TypeScript configuration
- `tsconfig.build.json` - Build configuration
- `nest-cli.json` - NestJS CLI configuration
- `.eslintrc.js` - ESLint configuration
- `.prettierrc` - Prettier configuration
- `.env.example` - Environment variables template

### Source Code Structure
- `src/main.ts` - Application entry point
- `src/app.module.ts` - Root module
- All module files in `src/[module]/` directories

### Documentation
- `README.NESTJS.md` - Main documentation
- `MIGRATION_GUIDE.md` - Migration details
- `NESTJS_SETUP.md` - This file

### Testing
- `test/` - E2E test files
- `*.spec.ts` - Unit test files

## Next Steps

1. **Install Dependencies**: Run `npm install`
2. **Update Environment Variables**: Ensure all required variables are set
3. **Test the Application**: Run `npm run start:dev` and test endpoints
4. **Review Documentation**: Check Swagger docs at `/api-docs`
5. **Run Tests**: Execute `npm test` and `npm run test:e2e`

## Common Issues

### TypeScript Errors
- Ensure all dependencies are installed
- Check `tsconfig.json` paths configuration

### MongoDB Connection
- Verify `MONGODB_URI` is correct
- Ensure MongoDB is running

### Redis Connection
- Verify `REDIS_URL` is correct
- Ensure Redis is running (for Bull queue)

### AWS S3
- Verify AWS credentials
- Check bucket permissions
- Ensure bucket exists in the specified region

## Migration Checklist

- [x] Install NestJS dependencies
- [x] Configure TypeScript
- [x] Set up configuration modules
- [x] Convert database schemas
- [x] Create common module (guards, decorators, filters)
- [x] Convert auth module
- [x] Convert products module
- [x] Convert images module
- [x] Convert admin modules
- [x] Set up Swagger documentation
- [x] Create test infrastructure
- [ ] Install and test locally
- [ ] Deploy to production

## Support

For issues or questions:
1. Check the documentation files
2. Review the migration guide
3. Check Swagger documentation at `/api-docs`

