import { useState } from 'react'

export default function HeroCover({ capa, titulo }) {
  const [carregada, setCarregada] = useState(false)

  return (
    <div className="dash__hero-cover">
      {capa && (
        <img
          src={capa}
          alt=""
          className={`dash__hero-cover-img${carregada ? ' dash__hero-cover-img--pronta' : ''}`}
          onLoad={() => setCarregada(true)}
        />
      )}
      {capa && !carregada && <div className="dash__hero-cover-skeleton" aria-hidden="true" />}
      <span>{titulo}</span>
    </div>
  )
}
