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
});
