const { z } = require('zod')
const { sanitizeText } = require('../lib/sanitize')

const nameField = z
  .string()
  .min(1, 'O nome é obrigatório.')
  .max(120, 'O nome deve ter no máximo 120 caracteres.')
  .transform(sanitizeText)
  .refine((v) => v.length > 0, 'O nome é obrigatório.')

const registerSchema = z.object({
  name: nameField,
  email: z.string().min(1, 'O e-mail é obrigatório.').email('E-mail inválido.').max(254, 'E-mail inválido.'),
  password: z.string().min(8, 'A senha deve ter no mínimo 8 caracteres.').max(72, 'A senha deve ter no máximo 72 caracteres.'),
})

const loginSchema = z.object({
  email: z.string().min(1, 'O e-mail é obrigatório.').email('E-mail inválido.').max(254, 'E-mail inválido.'),
  password: z.string().min(1, 'A senha é obrigatória.').max(72, 'A senha deve ter no máximo 72 caracteres.'),
})

const updateProfileSchema = z.object({
  name: nameField,
  email: z.string().min(1, 'O e-mail é obrigatório.').email('E-mail inválido.').max(254, 'E-mail inválido.'),
})

module.exports = {
  registerSchema,
  loginSchema,
  updateProfileSchema,
}
