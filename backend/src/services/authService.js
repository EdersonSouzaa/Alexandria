const bcrypt = require('bcryptjs')
const crypto = require('node:crypto')
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

async function forgotPassword({ email }) {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    throw new NotFoundError('Não existe conta cadastrada com este e-mail.')
  }

  const token = crypto.randomUUID()
  const expiry = new Date(Date.now() + 60 * 60 * 1000)

  await prisma.user.update({
    where: { id: user.id },
    data: { resetPasswordToken: token, resetPasswordExpiry: expiry },
  })

  console.log(`Token de redefinição de senha gerado para o usuário ${user.email}: ${token}`)

  return {
    mensagem:
      'Um token de redefinição foi gerado. Em produção ele seria enviado por e-mail; ' +
      'neste ambiente de desenvolvimento ele é retornado diretamente.',
    resetToken: token,
  }
}

async function resetPassword({ token, novaSenha }) {
  const user = await prisma.user.findUnique({ where: { resetPasswordToken: token } })
  if (!user) {
    throw new InvalidCredentialsError('Token de redefinição inválido.')
  }

  if (!user.resetPasswordExpiry || user.resetPasswordExpiry.getTime() < Date.now()) {
    throw new InvalidCredentialsError('Token de redefinição expirado.')
  }

  const hash = await bcrypt.hash(novaSenha, 10)
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hash, resetPasswordToken: null, resetPasswordExpiry: null },
  })
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
  forgotPassword,
  resetPassword,
}
