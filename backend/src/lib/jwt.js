const jwt = require('jsonwebtoken')

const SECRET = process.env.JWT_SECRET
const EXPIRATION_MS = 24 * 60 * 60 * 1000

function generateToken(userId, email) {
  return jwt.sign({ email }, SECRET, {
    subject: String(userId),
    expiresIn: Math.floor(EXPIRATION_MS / 1000),
  })
}

function verifyToken(token) {
  try {
    const payload = jwt.verify(token, SECRET)
    return { userId: Number(payload.sub), email: payload.email }
  } catch {
    return null
  }
}

module.exports = { generateToken, verifyToken }
