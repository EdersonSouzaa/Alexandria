const rateLimit = require('express-rate-limit')

function resposta(mensagem) {
  return (req, res) => {
    res.status(429).json({
      timestamp: new Date().toISOString(),
      status: 429,
      mensagem,
    })
  }
}

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
  handler: resposta('Muitas requisições. Tente novamente em instantes.'),
})

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  handler: resposta('Muitas tentativas. Aguarde alguns minutos antes de tentar novamente.'),
})

module.exports = { apiLimiter, authLimiter }
