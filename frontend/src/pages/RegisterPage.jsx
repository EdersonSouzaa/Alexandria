import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Input from '../components/Input'
import Button from '../components/Button'
import AuthLayout from '../components/AuthLayout'
import { IconUsuario, IconMail, IconChave, IconOlho, IconOlhoFechado } from '../components/AuthIcons'
import '../styles/auth.css'

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setErro('')
    setCarregando(true)
    try {
      await register(name, email, password)
      navigate('/inicio', { replace: true, state: { cadastroSucesso: true } })
    } catch (error) {
      setErro(error.response?.data?.mensagem ?? 'Não foi possível criar sua conta.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <AuthLayout active="register" title="Comece sua jornada" subtitle="Crie sua conta gratuita e monte sua estante pessoal.">
      {erro && <div className="auth-card__message auth-card__message--error">{erro}</div>}

      <form onSubmit={handleSubmit}>
        <Input
          id="name"
          label="Nome"
          placeholder="Seu nome"
          autoComplete="name"
          icon={<IconUsuario />}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
          placeholder="Crie uma senha"
          autoComplete="new-password"
          minLength={8}
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
          Criar conta
        </Button>
      </form>

      <p className="auth-split__footer">
        Já tem conta? <Link to="/login">Entrar</Link>
      </p>
    </AuthLayout>
  )
}
