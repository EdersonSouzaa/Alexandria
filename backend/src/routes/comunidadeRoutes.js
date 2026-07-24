const express = require('express')
const comunidadeService = require('../services/comunidadeService')
const { requireAuth } = require('../middleware/auth')
const { validateBody } = require('../middleware/validate')
const { asyncHandler } = require('../lib/asyncHandler')
const { comentarioSchema } = require('../schemas/comunidadeSchemas')

const router = express.Router()
router.use(requireAuth)

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const pagina = Number(req.query.pagina ?? 0)
    const tamanhoPagina = Number(req.query.tamanhoPagina ?? 20)
    res.json(await comunidadeService.listarFeed(req.usuarioId, pagina, tamanhoPagina, req.query.livro))
  }),
)

router.post(
  '/:id/curtir',
  asyncHandler(async (req, res) => {
    res.json(await comunidadeService.curtir(req.usuarioId, Number(req.params.id)))
  }),
)

router.get(
  '/:id/comentarios',
  asyncHandler(async (req, res) => {
    res.json(await comunidadeService.listarComentarios(Number(req.params.id)))
  }),
)

router.post(
  '/:id/comentarios',
  validateBody(comentarioSchema),
  asyncHandler(async (req, res) => {
    res.json(await comunidadeService.comentar(req.usuarioId, Number(req.params.id), req.body))
  }),
)

module.exports = router
