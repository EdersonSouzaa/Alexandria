import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Input from '../components/Input'
import Button from '../components/Button'
import AuthLayout from '../components/AuthLayout'
import '../styles/auth.css'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setErro('')
    setCarregando(true)
    try {
      await login(email, password)
      const destino = location.state?.from?.pathname ?? '/inicio'
      navigate(destino, { replace: true })
    } catch (error) {
      setErro(error.response?.data?.mensagem ?? 'Não foi possível entrar. Verifique suas credenciais.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <AuthLayout active="login">
      {erro && <div className="auth-card__message auth-card__message--error">{erro}</div>}

      <form onSubmit={handleSubmit}>
        <Input
          id="email"
          label="E-mail"
          type="email"
          placeholder="voce@email.com"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          id="password"
          label="Senha"
          type="password"
          placeholder="Sua senha"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" loading={carregando}>
          Entrar
        </Button>
      </form>

      <p className="auth-split__footer">
        <Link to="/esqueci-senha">Esqueci minha senha</Link>
      </p>
      <p className="auth-split__footer">
        Ainda não tem conta? <Link to="/cadastro">Criar conta</Link>
      </p>
    </AuthLayout>
  )
}
