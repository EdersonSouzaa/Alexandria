const bcrypt = require('bcryptjs')
const prisma = require('../lib/prisma')
const { generateToken } = require('../lib/jwt')
const { DuplicateError, InvalidCredentialsError, NotFoundError } = require('../lib/errors')

async function register({ name, email, password }) {
  const existente = await prisma.user.findUnique({ where: { email } })
  if (existente) {
    throw new DuplicateError('Já existe uma conta cadastrada com este e-mail.')
  }

  const hash = await bcrypt.hash(password, 10)

  const user = await prisma.$transaction(async (tx) => {
    const created = await tx.user.create({ data: { name, email, password: hash } })
    await tx.gamificacao.create({ data: { usuarioId: created.id } })
    return created
  })

  const token = generateToken(user.id, user.email)
  return { token, id: user.id, name: user.name, email: user.email }
}

async function login({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user || !user.password) {
    throw new InvalidCredentialsError('E-mail ou senha inválidos.')
  }

  const senhaValida = await bcrypt.compare(password, user.password)
  if (!senhaValida) {
    throw new InvalidCredentialsError('E-mail ou senha inválidos.')
  }

  const token = generateToken(user.id, user.email)
  return { token, id: user.id, name: user.name, email: user.email }
}

async function getProfile(usuarioId) {
  const user = await buscarUsuarioOuFalhar(usuarioId)
  return toProfileResponse(user)
}

async function updateProfile(usuarioId, { name, email }) {
  const user = await buscarUsuarioOuFalhar(usuarioId)

  if (user.email.toLowerCase() !== email.toLowerCase()) {
    const existente = await prisma.user.findUnique({ where: { email } })
    if (existente) {
      throw new DuplicateError('Já existe uma conta cadastrada com este e-mail.')
    }
  }

  const atualizado = await prisma.user.update({ where: { id: usuarioId }, data: { name, email } })
  return toProfileResponse(atualizado)
}

async function buscarUsuarioOuFalhar(usuarioId) {
  const user = await prisma.user.findUnique({ where: { id: usuarioId } })
  if (!user) {
    throw new NotFoundError('Usuário não encontrado.')
  }
  return user
}

function toProfileResponse(user) {
  return { id: user.id, name: user.name, email: user.email, criadoEm: user.criadoEm }
}

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
}
