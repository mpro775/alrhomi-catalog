# Migration Guide: Express.js to NestJS

This guide explains the migration from Express.js to NestJS and the key differences.

## API Compatibility

The NestJS version maintains **full API compatibility** with the Express.js version. All endpoints remain the same, so no frontend changes are required.

## Key Changes

### 1. Project Structure

**Express.js:**
```
src/
├── routes/
├── controllers/
├── models/
├── middleware/
└── app.js
```

**NestJS:**
```
src/
├── [module]/
│   ├── [module].controller.ts
│   ├── [module].service.ts
│   ├── [module].module.ts
│   └── dto/
├── database/
│   └── schemas/
├── common/
└── main.ts
```

### 2. Routing

**Express.js:**
```javascript
router.get('/products', authenticate, listProducts);
```

**NestJS:**
```typescript
@Get()
@UseGuards(JwtAuthGuard)
async findAll() {
  return this.productsService.findAll();
}
```

### 3. Middleware → Guards

**Express.js:**
```javascript
export function authenticate(req, res, next) {
  // JWT validation
  next();
}
```

**NestJS:**
```typescript
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // JWT validation
}
```

### 4. Models → Schemas

**Express.js:**
```javascript
const ProductSchema = new mongoose.Schema({...});
export default mongoose.model("Product", ProductSchema);
```

**NestJS:**
```typescript
@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  name: string;
}
export const ProductSchema = SchemaFactory.createForClass(Product);
```

### 5. Controllers → Services

**Express.js:**
```javascript
export async function listProducts(req, res) {
  const products = await ProductModel.find();
  res.json(products);
}
```

**NestJS:**
```typescript
@Injectable()
export class ProductsService {
  async findAll() {
    return this.productModel.find().exec();
  }
}

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}
  
  @Get()
  async findAll() {
    return this.productsService.findAll();
  }
}
```

### 6. Request Validation

**Express.js:**
- Manual validation in controllers

**NestJS:**
```typescript
export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
```

### 7. Error Handling

**Express.js:**
```javascript
try {
  // ...
} catch (err) {
  res.status(500).json({ error: '...' });
}
```

**NestJS:**
```typescript
// Automatic exception handling with filters
throw new NotFoundException('Product not found');
```

### 8. Configuration

**Express.js:**
```javascript
import dotenv from 'dotenv';
dotenv.config();
```

**NestJS:**
```typescript
// ConfigModule with type-safe config services
ConfigModule.forRoot({
  load: [databaseConfig, awsConfig],
})
```

## Endpoint Mapping

All endpoints remain the same:

| Method | Endpoint | Module |
|--------|----------|--------|
| POST | `/api/auth/register` | Auth |
| POST | `/api/auth/login` | Auth |
| GET | `/api/products` | Products |
| POST | `/api/products` | Products |
| GET | `/api/images` | Images |
| POST | `/api/images/upload` | Images |
| GET | `/api/admin/users` | Admin Users |
| GET | `/api/admin/stats` | Admin Stats |

## Environment Variables

Environment variables remain the same. Copy your `.env` file to the new NestJS project.

## Database

No database migration needed. The schemas are compatible and use the same MongoDB database.

## Testing

The NestJS version includes test infrastructure:

```bash
npm test          # Unit tests
npm run test:e2e  # E2E tests
```

## Benefits of Migration

1. **Type Safety** - Full TypeScript support with type checking
2. **Better Architecture** - Modular structure with dependency injection
3. **Automatic Validation** - Request validation with DTOs
4. **Enhanced Documentation** - Better Swagger/OpenAPI support
5. **Error Handling** - Comprehensive exception handling
6. **Testing** - Built-in testing utilities
7. **Scalability** - Better structure for large applications

## Deployment

The deployment process remains similar:

1. Build: `npm run build`
2. Start: `npm run start:prod`

Ensure all environment variables are set correctly.

