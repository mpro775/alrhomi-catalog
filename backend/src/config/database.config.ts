export interface DatabaseConfig {
  uri: string;
  options: {
    useNewUrlParser: boolean;
    useUnifiedTopology: boolean;
  };
}

export default (): { database: DatabaseConfig } => ({
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/product-catalog',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
});
