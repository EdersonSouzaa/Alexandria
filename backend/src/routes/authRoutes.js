const express = require('express')
const authService = require('../services/authService')
const { requireAuth } = require('../middleware/auth')
const { validateBody } = require('../middleware/validate')
const { authLimiter } = require('../middleware/rateLimit')
const { asyncHandler } = require('../lib/asyncHandler')
const { registerSchema, loginSchema, updateProfileSchema } = require('../schemas/authSchemas')

const router = express.Router()

router.post(
  '/register',
  authLimiter,
  validateBody(registerSchema),
  asyncHandler(async (req, res) => {
    res.json(await authService.register(req.body))
  }),
)

router.post(
  '/login',
  authLimiter,
  validateBody(loginSchema),
  asyncHandler(async (req, res) => {
    res.json(await authService.login(req.body))
  }),
)

router.get(
  '/me',
  requireAuth,
  asyncHandler(async (req, res) => {
    res.json(await authService.getProfile(req.usuarioId))
  }),
)

router.put(
  '/me',
  requireAuth,
  validateBody(updateProfileSchema),
  asyncHandler(async (req, res) => {
    res.json(await authService.updateProfile(req.usuarioId, req.body))
  }),
)

module.exports = router
