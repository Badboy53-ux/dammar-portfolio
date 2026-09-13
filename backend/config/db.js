import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

/**
 * Build the mysql2 pool options from an environment object.
 * Kept pure (no dotenv, no pool creation) so it can be unit tested.
 * @param {NodeJS.ProcessEnv} env
 */
export const buildDatabaseConfig = (env = process.env) => {
  const databaseConfig = {
    waitForConnections: true,
    connectionLimit: Number(env.DB_CONNECTION_LIMIT || 10),
    queueLimit: 0,
  }

  if (env.DATABASE_URL) {
    databaseConfig.uri = env.DATABASE_URL
  } else {
    Object.assign(databaseConfig, {
      host: env.DB_HOST || 'localhost',
      user: env.DB_USER || 'root',
      password: env.DB_PASSWORD || '',
      database: env.DB_NAME || 'dammar_portfolio',
      port: Number(env.DB_PORT || 3306),
    })
  }

  if (env.DB_SSL === 'true') {
    databaseConfig.ssl = { rejectUnauthorized: env.DB_SSL_REJECT_UNAUTHORIZED !== 'false' }
  }

  return databaseConfig
}

const databaseConfig = buildDatabaseConfig()

const pool = mysql.createPool(databaseConfig.uri || databaseConfig)

export default pool
