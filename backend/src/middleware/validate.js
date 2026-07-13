const { ValidationError } = require('../lib/errors')

function validateBody(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      const erros = {}
      for (const issue of result.error.issues) {
        erros[issue.path.join('.') || 'body'] = issue.message
      }
      return next(new ValidationError(erros))
    }
    req.body = result.data
    next()
  }
}

module.exports = { validateBody }
