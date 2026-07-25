const express = require('express')
const bibliotecaService = require('../services/bibliotecaService')
const { requireAuth } = require('../middleware/auth')
const { validateBody, requireNumericId } = require('../middleware/validate')
const { asyncHandler } = require('../lib/asyncHandler')
const { adicionarLivroSchema, atualizarStatusSchema } = require('../schemas/bibliotecaSchemas')

const router = express.Router()
router.use(requireAuth)

router.post(
  '/',
  validateBody(adicionarLivroSchema),
  asyncHandler(async (req, res) => {
    res.json(await bibliotecaService.adicionar(req.usuarioId, req.body))
  }),
)

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { status, favorito } = req.query
    res.json(
      await bibliotecaService.listar(req.usuarioId, {
        status,
        favorito: favorito === undefined ? undefined : favorito === 'true',
      }),
    )
  }),
)

router.patch(
  '/:id/status',
  requireNumericId(),
  validateBody(atualizarStatusSchema),
  asyncHandler(async (req, res) => {
    res.json(await bibliotecaService.atualizarStatus(req.usuarioId, Number(req.params.id), req.body.statusLeitura))
  }),
)

router.patch(
  '/:id/favorito',
  requireNumericId(),
  asyncHandler(async (req, res) => {
    res.json(await bibliotecaService.alternarFavorito(req.usuarioId, Number(req.params.id)))
  }),
)

router.delete(
  '/:id',
  requireNumericId(),
  asyncHandler(async (req, res) => {
    await bibliotecaService.remover(req.usuarioId, Number(req.params.id))
    res.status(204).send()
  }),
)

module.exports = router
