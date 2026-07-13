const test = require('node:test')
const assert = require('node:assert/strict')
const { exportarAvaliacoes } = require('../src/services/csvExportService')

test('gera cabeçalho e uma linha por avaliação', () => {
  const csv = exportarAvaliacoes([
    {
      livro: { titulo: 'Dom Casmurro', autor: 'Machado de Assis' },
      nota: 5,
      resenha: 'Ótimo livro, com "reviravoltas" inesperadas.',
      criadoEm: new Date('2026-01-01T00:00:00.000Z'),
    },
  ])

  const linhas = csv.trim().split('\n')
  assert.equal(linhas[0], 'Livro,Autor,Nota,Resenha,Data')
  assert.match(linhas[1], /^"Dom Casmurro","Machado de Assis",5,"Ótimo livro, com ""reviravoltas"" inesperadas\."/)
})

test('lida com avaliações sem valores opcionais', () => {
  const csv = exportarAvaliacoes([])
  assert.equal(csv.trim(), 'Livro,Autor,Nota,Resenha,Data')
})
