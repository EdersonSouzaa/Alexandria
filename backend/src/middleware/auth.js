const { verifyToken } = require('../lib/jwt')

function requireAuth(req, res, next) {
  const header = req.headers.authorization

  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ status: 401, mensagem: 'Credenciais ausentes ou inválidas.' })
  }

  const payload = verifyToken(header.substring('Bearer '.length))
  if (!payload) {
    return res.status(401).json({ status: 401, mensagem: 'Credenciais ausentes ou inválidas.' })
  }

  req.usuarioId = payload.userId
  next()
}

module.exports = { requireAuth }
