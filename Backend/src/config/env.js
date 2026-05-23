const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  port: process.env.PORT || 3005,
  db: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 5418),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  }
};