const prisma = require('../lib/prisma')
const { NotFoundError } = require('../lib/errors')

const XP_POR_NIVEL = 100

const XP = {
  LIVRO_ADICIONADO: { xp: 5, descricao: 'Livro adicionado à biblioteca' },
  LIVRO_LIDO: { xp: 20, descricao: 'Livro marcado como lido' },
  AVALIACAO_CRIADA: { xp: 15, descricao: 'Avaliação publicada' },
  COMENTARIO_CRIADO: { xp: 5, descricao: 'Comentário publicado' },
  CURTIDA_DADA: { xp: 2, descricao: 'Curtida em uma publicação' },
}

const CONQUISTAS = [
  {
    codigo: 'PRIMEIRO_LIVRO',
    nome: 'Primeiro Livro',
    descricao: 'Adicione o primeiro livro à sua biblioteca.',
    criterio: (g) => g.totalLivros >= 1,
  },
  {
    codigo: 'LEITOR_INICIANTE',
    nome: 'Leitor Iniciante',
    descricao: 'Marque 5 livros como lidos.',
    criterio: (g) => g.totalLidos >= 5,
  },
  {
    codigo: 'LEITOR_VORAZ',
    nome: 'Leitor Voraz',
    descricao: 'Marque 20 livros como lidos.',
    criterio: (g) => g.totalLidos >= 20,
  },
  {
    codigo: 'CRITICO_LITERARIO',
    nome: 'Crítico Literário',
    descricao: 'Escreva 5 avaliações.',
    criterio: (g) => g.totalAvaliacoes >= 5,
  },
  {
    codigo: 'RESENHISTA',
    nome: 'Resenhista',
    descricao: 'Escreva 20 avaliações.',
    criterio: (g) => g.totalAvaliacoes >= 20,
  },
  {
    codigo: 'COLECIONADOR',
    nome: 'Colecionador',
    descricao: 'Marque 10 livros como favoritos.',
    criterio: (g) => g.totalFavoritos >= 10,
  },
  {
    codigo: 'SOCIAVEL',
    nome: 'Sociável',
    descricao: 'Gere 5 publicações na comunidade.',
    criterio: (g) => g.totalPosts >= 5,
  },
  {
    codigo: 'EXPLORADOR',
    nome: 'Explorador',
    descricao: 'Adicione 50 livros à sua biblioteca.',
    criterio: (g) => g.totalLivros >= 50,
  },
  {
    codigo: 'LENDARIO',
    nome: 'Lendário',
    descricao: 'Acumule 1000 pontos de experiência.',
    criterio: (g) => g.xp >= 1000,
  },
]

const CAMPO_POR_STATUS = {
  QUERO_LER: 'totalQueroLer',
  LENDO: 'totalLendo',
  LIDO: 'totalLidos',
  ABANDONADO: 'totalAbandonados',
}

async function obterOuFalhar(usuarioId) {
  const g = await prisma.gamificacao.findUnique({ where: { usuarioId } })
  if (!g) throw new NotFoundError('Dados de gamificação não encontrados.')
  return g
}

function aplicarAtividade(dados, tipo) {
  const atividade = XP[tipo]
  dados.xp = (dados.xp ?? 0) + atividade.xp

  const historico = JSON.parse(dados.historico ?? '[]')
  historico.push({ data: new Date().toISOString(), tipo, descricao: atividade.descricao, xpGanho: atividade.xp })
  dados.historico = JSON.stringify(historico.slice(-100))
}

function aplicarConquistas(dados) {
  const desbloqueadas = new Set(JSON.parse(dados.conquistasDesbloqueadas ?? '[]'))
  for (const conquista of CONQUISTAS) {
    if (!desbloqueadas.has(conquista.codigo) && conquista.criterio(dados)) {
      desbloqueadas.add(conquista.codigo)
    }
  }
  dados.conquistasDesbloqueadas = JSON.stringify([...desbloqueadas])
}

async function salvar(usuarioId, dados) {
  aplicarConquistas(dados)
  const { id, usuario, ...campos } = dados
  await prisma.gamificacao.update({ where: { usuarioId }, data: campos })
}

async function livroAdicionado(usuarioId, statusInicial) {
  const g = await obterOuFalhar(usuarioId)
  g.totalLivros += 1
  g[CAMPO_POR_STATUS[statusInicial]] += 1
  aplicarAtividade(g, 'LIVRO_ADICIONADO')
  await salvar(usuarioId, g)
}

async function livroRemovido(usuarioId, statusAtual, favorito) {
  const g = await obterOuFalhar(usuarioId)
  g.totalLivros = Math.max(0, g.totalLivros - 1)
  g[CAMPO_POR_STATUS[statusAtual]] = Math.max(0, g[CAMPO_POR_STATUS[statusAtual]] - 1)
  if (favorito) g.totalFavoritos = Math.max(0, g.totalFavoritos - 1)
  await salvar(usuarioId, g)
}

async function statusAlterado(usuarioId, statusAntigo, statusNovo) {
  if (statusAntigo === statusNovo) return
  const g = await obterOuFalhar(usuarioId)
  g[CAMPO_POR_STATUS[statusAntigo]] = Math.max(0, g[CAMPO_POR_STATUS[statusAntigo]] - 1)
  g[CAMPO_POR_STATUS[statusNovo]] += 1
  if (statusNovo === 'LIDO') aplicarAtividade(g, 'LIVRO_LIDO')
  await salvar(usuarioId, g)
}

async function favoritoAlternado(usuarioId, novoFavorito) {
  const g = await obterOuFalhar(usuarioId)
  g.totalFavoritos = Math.max(0, g.totalFavoritos + (novoFavorito ? 1 : -1))
  await salvar(usuarioId, g)
}

async function avaliacaoCriada(usuarioId) {
  const g = await obterOuFalhar(usuarioId)
  g.totalAvaliacoes += 1
  aplicarAtividade(g, 'AVALIACAO_CRIADA')
  await salvar(usuarioId, g)
}

async function avaliacaoRemovida(usuarioId) {
  const g = await obterOuFalhar(usuarioId)
  g.totalAvaliacoes = Math.max(0, g.totalAvaliacoes - 1)
  await salvar(usuarioId, g)
}

async function postCriado(usuarioId) {
  const g = await obterOuFalhar(usuarioId)
  g.totalPosts += 1
  await salvar(usuarioId, g)
}

async function curtidaDada(usuarioId) {
  const g = await obterOuFalhar(usuarioId)
  aplicarAtividade(g, 'CURTIDA_DADA')
  await salvar(usuarioId, g)
}

async function comentarioCriado(usuarioId) {
  const g = await obterOuFalhar(usuarioId)
  aplicarAtividade(g, 'COMENTARIO_CRIADO')
  await salvar(usuarioId, g)
}

async function consultarStatus(usuarioId) {
  const g = await obterOuFalhar(usuarioId)

  const nivel = Math.floor(g.xp / XP_POR_NIVEL) + 1
  const xpParaProximoNivel = XP_POR_NIVEL - (g.xp % XP_POR_NIVEL)

  const desbloqueadas = new Set(JSON.parse(g.conquistasDesbloqueadas ?? '[]'))
  const conquistas = CONQUISTAS.map((c) => ({
    codigo: c.codigo,
    nome: c.nome,
    descricao: c.descricao,
    desbloqueada: desbloqueadas.has(c.codigo),
  }))

  const historico = JSON.parse(g.historico ?? '[]').slice().reverse()

  return {
    xp: g.xp,
    nivel,
    xpParaProximoNivel,
    conquistas,
    historico,
    estatisticas: {
      totalLivros: g.totalLivros,
      totalLidos: g.totalLidos,
      totalAvaliacoes: g.totalAvaliacoes,
      totalFavoritos: g.totalFavoritos,
      totalPosts: g.totalPosts,
      totalAbandonados: g.totalAbandonados,
      totalQueroLer: g.totalQueroLer,
      totalLendo: g.totalLendo,
    },
  }
}

module.exports = {
  livroAdicionado,
  livroRemovido,
  statusAlterado,
  favoritoAlternado,
  avaliacaoCriada,
  avaliacaoRemovida,
  postCriado,
  curtidaDada,
  comentarioCriado,
  consultarStatus,
}
