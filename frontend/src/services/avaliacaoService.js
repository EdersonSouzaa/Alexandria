import api from './api'

export const avaliacaoService = {
  listar: () => api.get('/api/avaliacoes').then((r) => r.data),
  criar: (data) => api.post('/api/avaliacoes', data).then((r) => r.data),
  atualizar: (id, data) => api.put(`/api/avaliacoes/${id}`, data).then((r) => r.data),
  remover: (id) => api.delete(`/api/avaliacoes/${id}`).then((r) => r.data),
  exportarCsv: () => api.get('/api/avaliacoes/export', { responseType: 'blob' }).then((r) => r.data),
}
