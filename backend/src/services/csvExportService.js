const { escapeCsvField } = require('../lib/sanitize')

const CABECALHO = ['Livro', 'Autor', 'Nota', 'Resenha', 'Data']

function campo(valor) {
  return escapeCsvField(valor)
}

function exportarAvaliacoes(avaliacoes) {
  const linhas = [CABECALHO.join(',')]

  for (const avaliacao of avaliacoes) {
    linhas.push(
      [
        campo(avaliacao.livro.titulo),
        campo(avaliacao.livro.autor),
        avaliacao.nota,
        campo(avaliacao.resenha),
        campo(avaliacao.criadoEm.toISOString()),
      ].join(','),
    )
  }

  return linhas.join('\n') + '\n'
}

module.exports = { exportarAvaliacoes }
