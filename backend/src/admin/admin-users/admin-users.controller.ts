import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AdminUsersService } from './admin-users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Admin - Users')
@Controller('admin/users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@ApiBearerAuth()
export class AdminUsersController {
  constructor(private readonly adminUsersService: AdminUsersService) {}

  @Get()
  @ApiOperation({ summary: 'جلب قائمة جميع المستخدمين' })
  @ApiResponse({
    status: 200,
    description: 'قائمة المستخدمين',
  })
  async findAll() {
    return this.adminUsersService.findAll();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'إنشاء مستخدم جديد' })
  @ApiResponse({
    status: 201,
    description: 'تم إنشاء المستخدم بنجاح',
  })
  @ApiResponse({
    status: 400,
    description: 'بيانات غير صحيحة',
  })
  @ApiResponse({
    status: 409,
    description: 'المستخدم موجود مسبقاً',
  })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.adminUsersService.create(createUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'حذف مستخدم' })
  @ApiResponse({
    status: 200,
    description: 'تم حذف المستخدم بنجاح',
  })
  @ApiResponse({
    status: 404,
    description: 'المستخدم غير موجود',
  })
  async remove(@Param('id') id: string) {
    return this.adminUsersService.remove(id);
  }
}
