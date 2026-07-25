const { z } = require('zod')
const { sanitizeText } = require('../lib/sanitize')

const comentarioSchema = z.object({
  conteudo: z
    .string()
    .min(1, 'O comentário não pode ser vazio.')
    .max(1000, 'O comentário deve ter no máximo 1000 caracteres.')
    .transform(sanitizeText)
    .refine((v) => v.length > 0, 'O comentário não pode ser vazio.'),
})

module.exports = { comentarioSchema }
