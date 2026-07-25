const { z } = require('zod')
const { sanitizeText } = require('../lib/sanitize')

const resenhaField = z
  .string()
  .min(1, 'A resenha é obrigatória.')
  .max(5000, 'A resenha deve ter no máximo 5000 caracteres.')
  .transform(sanitizeText)
  .refine((v) => v.length > 0, 'A resenha é obrigatória.')

const identificadorExternoField = z
  .string()
  .min(1, 'O identificador do livro é obrigatório.')
  .max(64, 'Identificador do livro inválido.')
  .regex(/^OL\d+W$/, 'Identificador do livro inválido.')

const notaField = z
  .number({ message: 'A nota é obrigatória.' })
  .int()
  .min(1, 'A nota mínima é 1.')
  .max(5, 'A nota máxima é 5.')

const criarAvaliacaoSchema = z.object({
  identificadorExterno: identificadorExternoField,
  nota: notaField,
  resenha: resenhaField,
})

const atualizarAvaliacaoSchema = z.object({
  nota: notaField,
  resenha: resenhaField,
})

module.exports = { criarAvaliacaoSchema, atualizarAvaliacaoSchema }
