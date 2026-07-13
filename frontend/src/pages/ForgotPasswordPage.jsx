import { useState } from 'react'
import { Link } from 'react-router-dom'
import { authService } from '../services/authService'
import Input from '../components/Input'
import Button from '../components/Button'
import '../styles/auth.css'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [resultado, setResultado] = useState(null)
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setErro('')
    setResultado(null)
    setCarregando(true)
    try {
      const response = await authService.forgotPassword({ email })
      setResultado(response)
    } catch (error) {
      setErro(error.response?.data?.mensagem ?? 'Não foi possível gerar o token de redefinição.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card card">
        <span className="kicker">Recuperar acesso</span>
        <h1>Esqueci minha senha</h1>

        {erro && <div className="auth-card__message auth-card__message--error">{erro}</div>}

        {resultado ? (
          <>
            <div className="auth-card__message">{resultado.mensagem}</div>
            <div className="auth-card__message">
              Token: <strong>{resultado.resetToken}</strong>
            </div>
            <Button to={`/redefinir-senha?token=${encodeURIComponent(resultado.resetToken)}`}>
              Redefinir senha agora
            </Button>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <Input
              id="email"
              label="E-mail"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" loading={carregando}>
              Gerar token de redefinição
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
