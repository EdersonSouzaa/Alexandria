import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { authService } from '../services/authService'
import Input from '../components/Input'
import Button from '../components/Button'
import '../styles/auth.css'

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const [token, setToken] = useState(searchParams.get('token') ?? '')
  const [novaSenha, setNovaSenha] = useState('')
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState(false)
  const [carregando, setCarregando] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setErro('')
    setCarregando(true)
    try {
      await authService.resetPassword({ token, novaSenha })
      setSucesso(true)
      setTimeout(() => navigate('/login', { replace: true }), 2000)
    } catch (error) {
      setErro(error.response?.data?.mensagem ?? 'Não foi possível redefinir sua senha.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <span className="kicker">Redefinir senha</span>
        <h1>Nova senha</h1>

        {erro && <div className="auth-card__message auth-card__message--error">{erro}</div>}
        {sucesso && <div className="auth-card__message">Senha redefinida! Redirecionando para o login…</div>}

        {!sucesso && (
          <form onSubmit={handleSubmit}>
            <Input
              id="token"
              label="Token de redefinição"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
            />
            <Input
              id="novaSenha"
              label="Nova senha"
              type="password"
              autoComplete="new-password"
              minLength={8}
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              required
            />
            <Button type="submit" loading={carregando}>
              Redefinir senha
            </Button>
          </form>
        )}

        <p className="auth-card__footer">
          <Link to="/login">Voltar para o login</Link>
        </p>
      </div>
    </div>
  )
}
