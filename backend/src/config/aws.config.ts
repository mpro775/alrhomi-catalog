export interface AwsConfig {
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
}

export default (): { aws: AwsConfig } => ({
  aws: {
    region: process.env.AWS_REGION || '',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    bucket: process.env.S3_BUCKET || '',
  },
});
