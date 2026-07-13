import api from './api'

export const comunidadeService = {
  listarFeed: (params) => api.get('/api/comunidade/posts', { params }).then((r) => r.data),
  curtir: (id) => api.post(`/api/comunidade/posts/${id}/curtir`).then((r) => r.data),
  listarComentarios: (id) => api.get(`/api/comunidade/posts/${id}/comentarios`).then((r) => r.data),
  comentar: (id, conteudo) =>
    api.post(`/api/comunidade/posts/${id}/comentarios`, { conteudo }).then((r) => r.data),
}
