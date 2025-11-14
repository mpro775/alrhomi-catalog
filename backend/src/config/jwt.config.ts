export interface JwtConfig {
  secret: string;
  expiresIn: string;
  refreshExpiresIn: string;
}

export default (): { jwt: JwtConfig } => ({
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
  },
});
