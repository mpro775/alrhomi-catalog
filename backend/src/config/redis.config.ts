export interface RedisConfig {
  host: string;
  port: number;
  username?: string;
  password?: string;
  tls?: {
    servername: string;
  };
}

export default (): { redis: RedisConfig } => {
  const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
  const url = new URL(redisUrl);

  return {
    redis: {
      host: url.hostname,
      port: parseInt(url.port, 10) || 6379,
      username: url.username || undefined,
      password: url.password || undefined,
      tls:
        url.protocol === 'rediss:'
          ? {
              servername: url.hostname,
            }
          : undefined,
    },
  };
};
