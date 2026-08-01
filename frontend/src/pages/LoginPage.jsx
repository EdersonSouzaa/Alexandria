import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Input from '../components/Input'
import Button from '../components/Button'
import AuthLayout from '../components/AuthLayout'
import { IconMail, IconChave, IconOlho, IconOlhoFechado } from '../components/AuthIcons'
import '../styles/auth.css'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  function irParaDestino() {
    const destino = location.state?.from?.pathname ?? '/inicio'
    navigate(destino, { replace: true })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setErro('')
    setCarregando(true)
    try {
      await login(email, password)
      irParaDestino()
    } catch (error) {
      setErro(error.response?.data?.mensagem ?? 'Não foi possível entrar. Verifique suas credenciais.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <AuthLayout active="login" title="Bem-vindo de volta" subtitle="Entre para continuar sua jornada de leitura.">
      {erro && <div className="auth-card__message auth-card__message--error">{erro}</div>}

      <form onSubmit={handleSubmit}>
        <Input
          id="email"
          label="E-mail"
          type="email"
          placeholder="voce@email.com"
          autoComplete="email"
          icon={<IconMail />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          id="password"
          label="Senha"
          type={mostrarSenha ? 'text' : 'password'}
          placeholder="Sua senha"
          autoComplete="current-password"
          icon={<IconChave />}
          suffix={
            <button
              type="button"
              onClick={() => setMostrarSenha((v) => !v)}
              aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {mostrarSenha ? <IconOlhoFechado /> : <IconOlho />}
            </button>
          }
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Button type="submit" loading={carregando}>
          Entrar
        </Button>
      </form>

      <p className="auth-split__footer">
        Ainda não tem conta? <Link to="/cadastro">Criar conta</Link>
      </p>
    </AuthLayout>
  )
}
