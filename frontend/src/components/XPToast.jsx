import { useGamificacao } from '../context/GamificacaoContext'
import './XPToast.css'

export default function XPToast() {
  const { xpGanho } = useGamificacao()

  if (xpGanho === null) {
    return null
  }

  return (
    <div className="xp-toast" role="status">
      <span className="xp-toast__icon">✦</span>
      <span>
        Você ganhou <strong>+{xpGanho} XP</strong>!
      </span>
    </div>
  )
}
