export interface DatabaseConfig {
  uri: string;
  options: {
    useNewUrlParser: boolean;
    useUnifiedTopology: boolean;
  };
}

function buildMongoUri(): string {
  const providedUri = process.env.MONGODB_URI;
  const username = process.env.MONGO_ROOT_USERNAME;
  const password = process.env.MONGO_ROOT_PASSWORD;
  const host = process.env.MONGODB_HOST || 'localhost';
  const port = process.env.MONGODB_PORT || '27017';
  const database = process.env.MONGODB_DATABASE || 'product-catalog';

  // If URI is provided and already contains authentication, use it as-is
  if (providedUri && providedUri.includes('@')) {
    return providedUri;
  }

  // If URI is provided but lacks authentication, try to add it
  if (providedUri && username && password) {
    try {
      const uriMatch = providedUri.match(/^mongodb:\/\/([^\/]+)(\/.+)?(\?.+)?$/);
      if (uriMatch) {
        const hostPart = uriMatch[1];
        const dbPart = uriMatch[2] || `/${database}`;
        const queryPart = uriMatch[3] || '';
        const authSource = queryPart.includes('authSource') ? '' : '?authSource=admin';
        const separator = queryPart ? '&' : '?';
        return `mongodb://${encodeURIComponent(username)}:${encodeURIComponent(password)}@${hostPart}${dbPart}${queryPart}${authSource ? separator + 'authSource=admin' : ''}`;
      }
    } catch (error) {
      // If parsing fails, fall through to building from scratch
    }
  }

  // Build URI from components
  if (username && password) {
    return `mongodb://${encodeURIComponent(username)}:${encodeURIComponent(password)}@${host}:${port}/${database}?authSource=admin`;
  }

  // Fallback to URI without auth or default
  return providedUri || `mongodb://${host}:${port}/${database}`;
}

export default (): { database: DatabaseConfig } => ({
  database: {
    uri: buildMongoUri(),
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
});
