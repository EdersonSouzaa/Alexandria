const express = require('express')
const livroService = require('../services/livroService')
const { requireAuth } = require('../middleware/auth')
const { requireOpenLibraryId } = require('../middleware/validate')
const { asyncHandler } = require('../lib/asyncHandler')

const router = express.Router()
router.use(requireAuth)

router.get(
  '/tendencias',
  asyncHandler(async (req, res) => {
    res.json(await livroService.tendencias())
  }),
)

router.get(
  '/buscar',
  asyncHandler(async (req, res) => {
    const { termo, categoria, ordenar = 'relevancia', pagina = '0', tamanhoPagina = '20', qualidadeMinima = 'true' } =
      req.query
    res.json(
      await livroService.buscar(
        termo,
        categoria,
        ordenar,
        Number(pagina),
        Number(tamanhoPagina),
        qualidadeMinima !== 'false',
      ),
    )
  }),
)

router.get(
  '/openlibrary/:id',
  requireOpenLibraryId(),
  asyncHandler(async (req, res) => {
    res.json(await livroService.detalhar(req.params.id))
  }),
)

module.exports = router
