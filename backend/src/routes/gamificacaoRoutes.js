const express = require('express')
const gamificacaoService = require('../services/gamificacaoService')
const { requireAuth } = require('../middleware/auth')
const { asyncHandler } = require('../lib/asyncHandler')

const router = express.Router()

router.get(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    res.json(await gamificacaoService.consultarStatus(req.usuarioId))
  }),
)

module.exports = router
