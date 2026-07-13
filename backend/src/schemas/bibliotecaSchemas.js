const { z } = require('zod')

const STATUS_VALORES = ['QUERO_LER', 'LENDO', 'LIDO', 'ABANDONADO']

const adicionarLivroSchema = z.object({
  identificadorExterno: z.string().min(1, 'O identificador do livro é obrigatório.'),
  statusLeitura: z.enum(STATUS_VALORES).optional(),
})

const atualizarStatusSchema = z.object({
  statusLeitura: z.enum(STATUS_VALORES, { message: 'O status de leitura é obrigatório.' }),
})

module.exports = { adicionarLivroSchema, atualizarStatusSchema, STATUS_VALORES }
