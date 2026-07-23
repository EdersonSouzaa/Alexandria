import api from './api'

export const livroService = {
  buscar: (params) => api.get('/api/livros/buscar', { params }).then((r) => r.data),
  tendencias: () => api.get('/api/livros/tendencias').then((r) => r.data),
  detalhar: (identificadorExterno) => api.get(`/api/livros/openlibrary/${identificadorExterno}`).then((r) => r.data),
}
