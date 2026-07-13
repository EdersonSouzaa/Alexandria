class AppError extends Error {
  constructor(status, message) {
    super(message)
    this.status = status
  }
}

class NotFoundError extends AppError {
  constructor(message) {
    super(404, message)
  }
}

class DuplicateError extends AppError {
  constructor(message) {
    super(409, message)
  }
}

class InvalidCredentialsError extends AppError {
  constructor(message) {
    super(401, message)
  }
}

class BusinessError extends AppError {
  constructor(message) {
    super(400, message)
  }
}

class ValidationError extends AppError {
  constructor(erros) {
    super(400, 'Dados inválidos.')
    this.erros = erros
  }
}

module.exports = { AppError, NotFoundError, DuplicateError, InvalidCredentialsError, BusinessError, ValidationError }
