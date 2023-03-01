const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || null;
const DB_NAME = process.env.DB_NAME || 'limadb';
const DB_PORT = process.env.DB_PORT || '3306';

module.exports = {
   development: {
      username: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      host: DB_HOST,
      dialect: 'mysql',
      port: DB_PORT,
   },
   test: {
      username: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      host: DB_HOST,
      dialect: 'mysql',
      port: DB_PORT,
   },
   production: {
      username: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      host: DB_HOST,
      dialect: 'mysql',
      port: DB_PORT,
   },
};
