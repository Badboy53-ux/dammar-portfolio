import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

const databaseConfig = {
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_CONNECTION_LIMIT || 10),
  queueLimit: 0,
}

if (process.env.DATABASE_URL) {
  databaseConfig.uri = process.env.DATABASE_URL
} else {
  Object.assign(databaseConfig, {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'dammar_portfolio',
    port: Number(process.env.DB_PORT || 3306),
  })
}

if (process.env.DB_SSL === 'true') {
  databaseConfig.ssl = { rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false' }
}

const pool = mysql.createPool(databaseConfig.uri || databaseConfig)

export default pool
