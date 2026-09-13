import { describe, expect, it } from 'vitest'
import { buildDatabaseConfig } from './db.js'

describe('buildDatabaseConfig', () => {
  it('applies defaults when no environment variables are set', () => {
    const config = buildDatabaseConfig({})

    expect(config).toEqual({
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'dammar_portfolio',
      port: 3306,
    })
    expect(config.uri).toBeUndefined()
    expect(config.ssl).toBeUndefined()
  })

  it('uses discrete DB_* variables and coerces numeric values', () => {
    const config = buildDatabaseConfig({
      DB_HOST: 'db.example.com',
      DB_PORT: '3307',
      DB_USER: 'app_user',
      DB_PASSWORD: 'secret',
      DB_NAME: 'portfolio_prod',
      DB_CONNECTION_LIMIT: '25',
    })

    expect(config.host).toBe('db.example.com')
    expect(config.port).toBe(3307)
    expect(config.user).toBe('app_user')
    expect(config.password).toBe('secret')
    expect(config.database).toBe('portfolio_prod')
    expect(config.connectionLimit).toBe(25)
    expect(config.uri).toBeUndefined()
  })

  it('prefers DATABASE_URL and skips the discrete host fields', () => {
    const config = buildDatabaseConfig({
      DATABASE_URL: 'mysql://user:pass@host:3306/db',
      DB_HOST: 'ignored-host',
      DB_USER: 'ignored-user',
      DB_NAME: 'ignored-db',
    })

    expect(config.uri).toBe('mysql://user:pass@host:3306/db')
    expect(config.host).toBeUndefined()
    expect(config.user).toBeUndefined()
    expect(config.database).toBeUndefined()
    expect(config.port).toBeUndefined()
    expect(config.waitForConnections).toBe(true)
  })

  it('adds ssl options only when DB_SSL is "true"', () => {
    const withoutSsl = buildDatabaseConfig({ DB_SSL: 'false' })
    expect(withoutSsl.ssl).toBeUndefined()

    const withSsl = buildDatabaseConfig({ DB_SSL: 'true' })
    expect(withSsl.ssl).toEqual({ rejectUnauthorized: true })
  })

  it('disables certificate verification only for DB_SSL_REJECT_UNAUTHORIZED="false"', () => {
    const strict = buildDatabaseConfig({ DB_SSL: 'true', DB_SSL_REJECT_UNAUTHORIZED: 'true' })
    expect(strict.ssl).toEqual({ rejectUnauthorized: true })

    const relaxed = buildDatabaseConfig({ DB_SSL: 'true', DB_SSL_REJECT_UNAUTHORIZED: 'false' })
    expect(relaxed.ssl).toEqual({ rejectUnauthorized: false })

    const defaultValue = buildDatabaseConfig({ DB_SSL: 'true' })
    expect(defaultValue.ssl).toEqual({ rejectUnauthorized: true })
  })

  it('reads from process.env by default', () => {
    const config = buildDatabaseConfig()

    expect(config.waitForConnections).toBe(true)
    expect(config.connectionLimit).toBeGreaterThan(0)
  })
})
