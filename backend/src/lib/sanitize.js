const TAG_REGEX = /<[^>]*>/g
const CONTROL_CHARS_REGEX = /[\x00-\x08\x0b\x0c\x0e-\x1f]/g
const CSV_FORMULA_TRIGGER_REGEX = /^[=+\-@\t\r]/

function sanitizeText(value) {
  if (typeof value !== 'string') return value
  return value.replace(TAG_REGEX, '').replace(CONTROL_CHARS_REGEX, '').trim()
}

function escapeCsvField(valor) {
  if (valor === null || valor === undefined) return ''
  let texto = String(valor)
  if (CSV_FORMULA_TRIGGER_REGEX.test(texto)) {
    texto = `'${texto}`
  }
  return `"${texto.replace(/"/g, '""')}"`
}

module.exports = { sanitizeText, escapeCsvField }
