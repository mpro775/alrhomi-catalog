import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Query,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { diskStorage } from 'multer';
import * as path from 'path';
import { ImagesService } from './images.service';
import { UploadImageDto } from './dto/upload-image.dto';
import { ImageQueryDto } from './dto/image-query.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Images')
@Controller('images')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: 'uploads/',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
        },
      }),
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'رفع صورة جديدة' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
        productId: {
          type: 'string',
        },
      },
      required: ['file'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'تم رفع الصورة بنجاح',
  })
  async upload(@UploadedFile() file: Express.Multer.File, @Body() uploadDto: UploadImageDto) {
    if (!file) {
      throw new BadRequestException('لم يتم رفع ملف');
    }
    console.log(`[${new Date().toISOString()}] Upload started: ${file.originalname} (${file.size} bytes)`);
    try {
      const result = await this.imagesService.upload(file, uploadDto);
      console.log(
        `[${new Date().toISOString()}] Upload completed: ${file.originalname}, Image ID: ${result.id}, Job ID: ${result.jobId}`,
      );
      return result;
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Upload failed: ${file.originalname}`, error);
      if (error instanceof Error) {
        console.error('Error details:', error.message, error.stack);
      }
      throw error;
    }
  }

  @Get()
  @ApiOperation({ summary: 'جلب قائمة الصور' })
  @ApiResponse({
    status: 200,
    description: 'قائمة الصور',
  })
  async findAll(@Query() queryDto: ImageQueryDto) {
    return this.imagesService.findAll(queryDto);
  }

  @Get(':id/download-url')
  @ApiOperation({ summary: 'الحصول على رابط التحميل المؤقت' })
  @ApiResponse({
    status: 200,
    description: 'رابط التحميل المؤقت',
  })
  async getDownloadUrl(@Param('id') id: string) {
    return this.imagesService.getDownloadUrl(id);
  }

  @Patch(':id/watermark-toggle')
  @UseGuards(RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'تبديل حالة العلامة المائية' })
  @ApiResponse({
    status: 200,
    description: 'تم تبديل الحالة',
  })
  async toggleWatermark(@Param('id') id: string) {
    return this.imagesService.toggleWatermark(id);
  }
}
