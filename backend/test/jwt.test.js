process.env.JWT_SECRET = 'chave-de-teste-com-no-minimo-32-caracteres'

const test = require('node:test')
const assert = require('node:assert/strict')
const { generateToken, verifyToken } = require('../src/lib/jwt')

test('gera um token válido e extrai o usuário', () => {
  const token = generateToken(42, 'leitor@alexandria.com')
  const payload = verifyToken(token)

  assert.equal(payload.userId, 42)
  assert.equal(payload.email, 'leitor@alexandria.com')
})

test('considera um token adulterado como inválido', () => {
  const token = generateToken(1, 'leitor@alexandria.com')
  const adulterado = token.slice(0, -2) + 'xx'

  assert.equal(verifyToken(adulterado), null)
})

test('considera um token ausente/malformado como inválido', () => {
  assert.equal(verifyToken('token-invalido'), null)
})
