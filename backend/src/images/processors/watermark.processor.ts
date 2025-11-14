import { Processor, Process } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as sharp from 'sharp';
import * as fs from 'graceful-fs';
import * as path from 'path';
import { pipeline, finished } from 'stream/promises';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { ImageDocument } from '../../database/schemas/image.schema';
import { JobStatusDocument } from '../../database/schemas/job-status.schema';
import { StorageService } from '../../storage/storage.service';
import { Readable } from 'stream';

@Processor('image-processing')
export class WatermarkProcessor {
  private readonly logger = new Logger(WatermarkProcessor.name);
  private s3Client: S3Client;
  private bucket: string;

  constructor(
    @InjectModel('Image')
    private imageModel: Model<ImageDocument>,
    @InjectModel('JobStatus')
    private jobStatusModel: Model<JobStatusDocument>,
    private configService: ConfigService,
    private storageService: StorageService,
  ) {
    const awsConfig = this.configService.get('aws');
    this.bucket = awsConfig.bucket;

    this.s3Client = new S3Client({
      region: awsConfig.region,
      credentials: {
        accessKeyId: awsConfig.accessKeyId,
        secretAccessKey: awsConfig.secretAccessKey,
      },
    });
  }

  @Process()
  async handleWatermark(job: Job) {
    const {
      data: {
        metadata: { _id, s3Key },
      },
      id: jobId,
    } = job;

    const tmpDir = path.resolve(process.cwd(), 'tmp');
    fs.mkdirSync(tmpDir, { recursive: true });

    const ext = path.extname(s3Key);
    const origPath = path.join(tmpDir, `${_id}-orig${ext}`);
    const transparentP = path.join(tmpDir, `${_id}-trans.png`);
    const outPath = path.join(tmpDir, `${_id}-final.png`);
    const logoPath = path.resolve(process.cwd(), 'assets', 'logo.png');

    try {
      // Update job status
      await this.jobStatusModel.findOneAndUpdate(
        { jobId: jobId.toString() },
        { status: 'processing', startedAt: new Date() },
        { upsert: true },
      );

      await this.imageModel.findByIdAndUpdate(_id, {
        status: 'processing',
        jobId: jobId.toString(),
        progress: 0,
      });

      // Download image from S3
      const getObj = await this.s3Client.send(
        new GetObjectCommand({ Bucket: this.bucket, Key: s3Key }),
      );

      const ws = fs.createWriteStream(origPath);
      if (getObj.Body instanceof Readable) {
        await pipeline(getObj.Body, ws);
      } else if (getObj.Body) {
        await pipeline(Readable.from(getObj.Body as AsyncIterable<Uint8Array> | Buffer), ws);
      } else {
        throw new Error('S3 object body is empty');
      }
      await finished(ws);

      // Remove background
      await this.removeBackgroundBySampling(origPath, transparentP, 50);

      // Composite logo
      await this.compositeLogoWithSmallBadge(transparentP, logoPath, logoPath, outPath);

      // Upload watermarked image to S3
      const watermarkedKey = `watermarked/${_id}.png`;
      const fileStream = fs.createReadStream(outPath);
      await this.storageService.uploadFile(watermarkedKey, fileStream, 'image/png');

      const awsConfig = this.configService.get('aws');
      const watermarkedUrl = `https://${this.bucket}.s3.${awsConfig.region}.amazonaws.com/${watermarkedKey}`;

      // Update status
      await this.jobStatusModel.findOneAndUpdate(
        { jobId: jobId.toString() },
        { status: 'completed', progress: 100, finishedAt: new Date() },
      );

      await this.imageModel.findByIdAndUpdate(_id, {
        status: 'completed',
        isWatermarked: true,
        watermarkedUrl,
        progress: 100,
      });

      // Cleanup
      this.safeUnlink(origPath);
      this.safeUnlink(transparentP);
      this.safeUnlink(outPath);

      this.logger.log(`✅ Job ${jobId} completed. URL: ${watermarkedUrl}`);
    } catch (err) {
      await this.jobStatusModel.findOneAndUpdate(
        { jobId: jobId.toString() },
        { status: 'failed', finishedAt: new Date() },
      );
      await this.imageModel.findByIdAndUpdate(_id, { status: 'failed' });
      this.logger.error(`❌ Job ${jobId} failed:`, err);
      throw err;
    }
  }

  private async removeBackgroundBySampling(inputPath: string, outputPath: string, tolerance = 50) {
    const img = sharp(inputPath).ensureAlpha();
    const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
    const { width, height, channels } = info;

    let sumR = 0,
      sumG = 0,
      sumB = 0,
      count = 0;
    const sample = (x: number, y: number) => {
      const idx = (y * width + x) * channels;
      sumR += data[idx];
      sumG += data[idx + 1];
      sumB += data[idx + 2];
      count++;
    };

    for (let x = 0; x < width; x++) {
      sample(x, 0);
      sample(x, height - 1);
    }
    for (let y = 0; y < height; y++) {
      sample(0, y);
      sample(width - 1, y);
    }

    const Rb = sumR / count;
    const Gb = sumG / count;
    const Bb = sumB / count;

    for (let i = 0; i < data.length; i += channels) {
      const dr = data[i] - Rb;
      const dg = data[i + 1] - Gb;
      const db = data[i + 2] - Bb;
      const dist = Math.sqrt(dr * dr + dg * dg + db * db);
      if (dist <= tolerance) data[i + 3] = 0;
    }

    await sharp(data, { raw: { width, height, channels } }).png().toFile(outputPath);
  }

  private async compositeLogoWithSmallBadge(
    productPath: string,
    logoPath: string,
    badgePath: string,
    outputPath: string,
  ) {
    const prod = sharp(productPath);
    const meta = await prod.metadata();

    // Big logo كخلفية كاملة
    const maxDim = Math.min(meta.width || 0, meta.height || 0);

    // Small badge (10% of smallest dimension)
    const badgeMeta = await sharp(badgePath).metadata();
    const badgeSize = Math.round(maxDim * 0.1);
    const badgeW =
      (badgeMeta.width || 0) >= (badgeMeta.height || 0)
        ? badgeSize
        : Math.round(badgeSize * ((badgeMeta.width || 0) / (badgeMeta.height || 0)));
    const badgeH =
      (badgeMeta.width || 0) >= (badgeMeta.height || 0)
        ? Math.round(badgeSize * ((badgeMeta.height || 0) / (badgeMeta.width || 0)))
        : badgeSize;
    const badgeBuf = await sharp(badgePath).resize(badgeW, badgeH).png().ensureAlpha().toBuffer();
    const badgeTop = (meta.height || 0) - badgeH - 10;
    const badgeLeft = Math.floor(((meta.width || 0) - badgeW) / 2);

    // Composite مع الشعار كخلفية حقيقية
    await sharp(logoPath) // ابدأ بالشعار كقاعدة
      .resize(meta.width, meta.height, {
        // اجعل الشعار بحجم الصورة الكامل
        fit: 'cover',
        position: 'center',
      })
      .composite([
        { input: await prod.png().toBuffer(), blend: 'over' }, // الصورة الأصلية فوق الشعار
        { input: badgeBuf, top: badgeTop, left: badgeLeft, blend: 'over' }, // الشارة الصغيرة في الأعلى
      ])
      .png()
      .toFile(outputPath);
  }

  private safeUnlink(filePath: string, retries = 3) {
    for (let i = 0; i < retries; i++) {
      try {
        fs.rmSync(filePath, { force: true });
        return;
      } catch (error) {
        if (i === retries - 1) throw error;
      }
    }
  }
}
