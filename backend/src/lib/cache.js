const TTL_MS = 60 * 60 * 1000

class TtlCache {
  constructor() {
    this.store = new Map()
  }

  get(key) {
    const entry = this.store.get(key)
    if (!entry) return undefined
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key)
      return undefined
    }
    return entry.value
  }

  set(key, value) {
    this.store.set(key, { value, expiresAt: Date.now() + TTL_MS })
  }

  async wrap(key, loader) {
    const cached = this.get(key)
    if (cached !== undefined) return cached
    const value = await loader()
    this.set(key, value)
    return value
  }
}

module.exports = { buscaLivrosCache: new TtlCache(), detalheLivroCache: new TtlCache() }
