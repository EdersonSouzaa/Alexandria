const { z } = require('zod')

const registerSchema = z.object({
  name: z.string().min(1, 'O nome é obrigatório.'),
  email: z.string().min(1, 'O e-mail é obrigatório.').email('E-mail inválido.'),
  password: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres.'),
})

const loginSchema = z.object({
  email: z.string().min(1, 'O e-mail é obrigatório.').email('E-mail inválido.'),
  password: z.string().min(1, 'A senha é obrigatória.'),
})

const updateProfileSchema = z.object({
  name: z.string().min(1, 'O nome é obrigatório.'),
  email: z.string().min(1, 'O e-mail é obrigatório.').email('E-mail inválido.'),
})

const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'O e-mail é obrigatório.').email('E-mail inválido.'),
})

const resetPasswordSchema = z.object({
  token: z.string().min(1, 'O token é obrigatório.'),
  novaSenha: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres.'),
})

module.exports = { registerSchema, loginSchema, updateProfileSchema, forgotPasswordSchema, resetPasswordSchema }
