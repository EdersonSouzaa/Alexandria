const { AppError } = require('../lib/errors')

function errorHandler(err, req, res, next) {
  if (err instanceof AppError) {
    const body = { timestamp: new Date().toISOString(), status: err.status, mensagem: err.message }
    if (err.erros) body.erros = err.erros
    return res.status(err.status).json(body)
  }

  if (err && err.code === 'P2002') {
    return res.status(409).json({
      timestamp: new Date().toISOString(),
      status: 409,
      mensagem: 'Este registro já existe.',
    })
  }

  console.error('Erro não tratado:', err)
  res.status(500).json({
    timestamp: new Date().toISOString(),
    status: 500,
    mensagem: 'Erro interno no servidor.',
  })
}

module.exports = { errorHandler }
