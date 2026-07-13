const express = require('express')
const livroService = require('../services/livroService')
const { requireAuth } = require('../middleware/auth')
const { asyncHandler } = require('../lib/asyncHandler')

const router = express.Router()
router.use(requireAuth)

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
  '/google/:id',
  asyncHandler(async (req, res) => {
    res.json(await livroService.detalhar(req.params.id))
  }),
)

module.exports = router
