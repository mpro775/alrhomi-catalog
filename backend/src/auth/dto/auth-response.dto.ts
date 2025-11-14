import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({
    description: 'JWT Token',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NzhmMTIzNDU2Nzg5MDEyMzQ1Njc4OSIsInJvbGUiOiJyZXAiLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6MTcwMDAwOTAwMH0.xxxxx',
  })
  token: string;

  @ApiProperty({
    description: 'دور المستخدم',
    enum: ['rep', 'admin'],
    example: 'rep',
  })
  role: 'rep' | 'admin';
}
