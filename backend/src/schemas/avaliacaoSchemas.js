const { z } = require('zod')

const criarAvaliacaoSchema = z.object({
  identificadorExterno: z.string().min(1, 'O identificador do livro é obrigatório.'),
  nota: z
    .number({ message: 'A nota é obrigatória.' })
    .int()
    .min(1, 'A nota mínima é 1.')
    .max(5, 'A nota máxima é 5.'),
  resenha: z
    .string()
    .min(1, 'A resenha é obrigatória.')
    .max(5000, 'A resenha deve ter no máximo 5000 caracteres.'),
})

const atualizarAvaliacaoSchema = z.object({
  nota: z
    .number({ message: 'A nota é obrigatória.' })
    .int()
    .min(1, 'A nota mínima é 1.')
    .max(5, 'A nota máxima é 5.'),
  resenha: z
    .string()
    .min(1, 'A resenha é obrigatória.')
    .max(5000, 'A resenha deve ter no máximo 5000 caracteres.'),
})

module.exports = { criarAvaliacaoSchema, atualizarAvaliacaoSchema }
