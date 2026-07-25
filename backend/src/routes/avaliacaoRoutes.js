const express = require('express')
const avaliacaoService = require('../services/avaliacaoService')
const { requireAuth } = require('../middleware/auth')
const { validateBody, requireNumericId } = require('../middleware/validate')
const { asyncHandler } = require('../lib/asyncHandler')
const { criarAvaliacaoSchema, atualizarAvaliacaoSchema } = require('../schemas/avaliacaoSchemas')

const router = express.Router()
router.use(requireAuth)

router.post(
  '/',
  validateBody(criarAvaliacaoSchema),
  asyncHandler(async (req, res) => {
    res.json(await avaliacaoService.criar(req.usuarioId, req.body))
  }),
)

router.get(
  '/',
  asyncHandler(async (req, res) => {
    res.json(await avaliacaoService.listar(req.usuarioId))
  }),
)

router.get(
  '/export',
  asyncHandler(async (req, res) => {
    const csv = await avaliacaoService.exportarCsv(req.usuarioId)
    res.set('Content-Type', 'text/csv')
    res.set('Content-Disposition', 'attachment; filename="avaliacoes.csv"')
    res.send(csv)
  }),
)

router.put(
  '/:id',
  requireNumericId(),
  validateBody(atualizarAvaliacaoSchema),
  asyncHandler(async (req, res) => {
    res.json(await avaliacaoService.atualizar(req.usuarioId, Number(req.params.id), req.body))
  }),
)

router.delete(
  '/:id',
  requireNumericId(),
  asyncHandler(async (req, res) => {
    await avaliacaoService.remover(req.usuarioId, Number(req.params.id))
    res.status(204).send()
  }),
)

module.exports = router
