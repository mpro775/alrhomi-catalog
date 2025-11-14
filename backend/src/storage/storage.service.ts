import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  PutObjectCommandInput,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import * as path from 'path';

@Injectable()
export class StorageService {
  private s3Client: S3Client;
  private bucket: string;
  private region: string;

  constructor(private configService: ConfigService) {
    const awsConfig = this.configService.get('aws');
    this.bucket = awsConfig.bucket;
    this.region = awsConfig.region;

    this.s3Client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: awsConfig.accessKeyId,
        secretAccessKey: awsConfig.secretAccessKey,
      },
    });
  }

  async uploadFile(
    key: string,
    body: Buffer | NodeJS.ReadableStream,
    contentType: string,
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: body as PutObjectCommandInput['Body'],
      ContentType: contentType,
    });

    await this.s3Client.send(command);

    return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;
  }

  async generatePresignedUrl(key: string, expiresIn = 300): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ResponseContentDisposition: `attachment; filename="${path.basename(key)}"`,
    });

    return getSignedUrl(this.s3Client, command, { expiresIn });
  }

  async downloadFile(key: string) {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    return this.s3Client.send(command);
  }
}
