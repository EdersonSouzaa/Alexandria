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

function requireNumericId(paramName = 'id') {
  return (req, res, next) => {
    const valor = req.params[paramName]
    if (!/^\d+$/.test(valor)) {
      return next(new ValidationError({ [paramName]: 'Identificador inválido.' }))
    }
    next()
  }
}

function requireOpenLibraryId(paramName = 'id') {
  return (req, res, next) => {
    const valor = req.params[paramName]
    if (typeof valor !== 'string' || valor.length > 64 || !/^OL\d+W$/.test(valor)) {
      return next(new ValidationError({ [paramName]: 'Identificador de livro inválido.' }))
    }
    next()
  }
}

module.exports = { validateBody, requireNumericId, requireOpenLibraryId }
