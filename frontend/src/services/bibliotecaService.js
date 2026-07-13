import api from './api'

export const bibliotecaService = {
  listar: (params) => api.get('/api/biblioteca', { params }).then((r) => r.data),
  adicionar: (data) => api.post('/api/biblioteca', data).then((r) => r.data),
  atualizarStatus: (id, statusLeitura) =>
    api.patch(`/api/biblioteca/${id}/status`, { statusLeitura }).then((r) => r.data),
  alternarFavorito: (id) => api.patch(`/api/biblioteca/${id}/favorito`).then((r) => r.data),
  remover: (id) => api.delete(`/api/biblioteca/${id}`).then((r) => r.data),
}
