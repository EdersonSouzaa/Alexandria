const { z } = require('zod')

const STATUS_VALORES = ['QUERO_LER', 'LENDO', 'LIDO', 'ABANDONADO']

const adicionarLivroSchema = z.object({
  identificadorExterno: z
    .string()
    .min(1, 'O identificador do livro é obrigatório.')
    .max(64, 'Identificador do livro inválido.')
    .regex(/^OL\d+W$/, 'Identificador do livro inválido.'),
  statusLeitura: z.enum(STATUS_VALORES).optional(),
})

const atualizarStatusSchema = z.object({
  statusLeitura: z.enum(STATUS_VALORES, { message: 'O status de leitura é obrigatório.' }),
})

module.exports = { adicionarLivroSchema, atualizarStatusSchema, STATUS_VALORES }
