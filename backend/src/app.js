require('dotenv').config()

const express = require('express')
const cors = require('cors')

const authRoutes = require('./routes/authRoutes')
const livroRoutes = require('./routes/livroRoutes')
const bibliotecaRoutes = require('./routes/bibliotecaRoutes')
const avaliacaoRoutes = require('./routes/avaliacaoRoutes')
const comunidadeRoutes = require('./routes/comunidadeRoutes')
const gamificacaoRoutes = require('./routes/gamificacaoRoutes')
const healthRoutes = require('./routes/healthRoutes')
const { errorHandler } = require('./middleware/errorHandler')

const app = express()

const allowedOrigins = (process.env.FRONTEND_URL || '')
  .split(',')
  .map((url) => url.trim().replace(/\/$/, ''))
  .filter(Boolean)

app.use(
  cors({
    origin(origin, callback) {
      const isAllowed = !origin || allowedOrigins.includes(origin)
      if (!isAllowed) {
        console.warn(
          `CORS bloqueado para origem "${origin}". Origens permitidas (FRONTEND_URL): ${allowedOrigins.join(', ') || '(nenhuma configurada)'}`,
        )
      }
      callback(null, isAllowed)
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Authorization', 'Content-Type'],
    exposedHeaders: ['Content-Disposition'],
  }),
)
app.use(express.json())

app.use('/api/health', healthRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/livros', livroRoutes)
app.use('/api/biblioteca', bibliotecaRoutes)
app.use('/api/avaliacoes', avaliacaoRoutes)
app.use('/api/comunidade/posts', comunidadeRoutes)
app.use('/api/gamificacao', gamificacaoRoutes)

app.use((req, res) => {
  res.status(404).json({ status: 404, mensagem: 'Recurso não encontrado.' })
})

app.use(errorHandler)

module.exports = app
