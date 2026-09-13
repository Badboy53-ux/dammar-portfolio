import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import contactRoutes from './routes/contactRoutes.js'
import projectRoutes from './routes/projectRoutes.js'
import portfolioRoutes from './routes/portfolioRoutes.js'
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
)
app.use(express.json({ limit: '1mb' }))

app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Dammar B.K. portfolio backend is running.',
  })
})

app.use('/api/contact', contactRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/portfolio', portfolioRoutes)

app.use(notFoundHandler)
app.use(errorHandler)

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend running on http://localhost:${PORT}`)
})
