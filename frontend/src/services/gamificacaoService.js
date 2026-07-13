import api from './api'

export const gamificacaoService = {
  consultar: () => api.get('/api/gamificacao').then((r) => r.data),
}
