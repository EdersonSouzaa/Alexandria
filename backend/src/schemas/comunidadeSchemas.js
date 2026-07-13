const { z } = require('zod')

const comentarioSchema = z.object({
  conteudo: z
    .string()
    .min(1, 'O comentário não pode ser vazio.')
    .max(1000, 'O comentário deve ter no máximo 1000 caracteres.'),
})

module.exports = { comentarioSchema }
