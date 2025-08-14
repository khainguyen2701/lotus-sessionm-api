export default () => ({
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development',
  database: {
    database: process.env.DATABASE_NAME || 'my_database',
    host: process.env.DATABASE_HOST || 'localhost',
    port: process.env.DATABASE_PORT,
    username: process.env.DATABASE_USER || 'user',
    password: process.env.DATABASE_PASSWORD || 'password',
    // database_ssl: process.env.DATABASE_SSL === 'true' ? true : false,
    // database_max_connections: process.env.DATABASE_CONNECT_LIMIT,
    type: 'postgres',
    synchronize: process.env.DATABASE_SYNC === 'true',
    ssl: process.env.DATABASE_SSL === 'true' ? true : false,
    maxConnections: process.env.DATABASE_CONNECT_LIMIT
      ? parseInt(process.env.DATABASE_CONNECT_LIMIT, 10)
      : 10, // Default to 10 if not set
    ca_cert: process.env.DATABASE_CA_CERT || '',
  },
  auth: {
    saltRounds: process.env.AUTH_SALT_ROUNDS
      ? parseInt(process.env.AUTH_SALT_ROUNDS, 10)
      : 12, // Default to 12 rounds for security
    jwtSecret: process.env.JWT_SECRET || 'default-secret-key',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
    refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
  },
  //SESSIONM
  sessionm: {
    apiKey: process.env.SESSIONM_API_KEY || 'default-api-key',
    endpoint: process.env.SESSIONM_ENDPOINT || 'default-endpoint',
    secretKey: process.env.SESSIONM_SECRET_KEY || 'default-secret-key',
  },
  // Github
  github: {
    token: process.env.GITHUB_TOKEN || 'default-token',
    owner: process.env.GITHUB_OWNER || 'default-owner',
    repo: process.env.GITHUB_REPO || 'default-repo',
  },
  // Assets
  assets: {
    url: process.env.ASSETS_URL || 'default-url',
  },
});
