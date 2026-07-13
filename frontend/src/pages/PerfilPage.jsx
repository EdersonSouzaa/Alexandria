import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import Input from '../components/Input'
import Button from '../components/Button'
import '../styles/perfil.css'

export default function PerfilPage() {
  const { user, updateProfile } = useAuth()

  const [name, setName] = useState(user?.name ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [mensagem, setMensagem] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setMensagem('')
    setErro('')
    setCarregando(true)
    try {
      await updateProfile({ name, email })
      setMensagem('Perfil atualizado com sucesso!')
    } catch (error) {
      setErro(error.response?.data?.mensagem ?? 'Não foi possível atualizar seu perfil.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="page container perfil">
      <span className="kicker">Perfil</span>
      <h1>Seus dados</h1>

      <div className="card perfil__card">
        {mensagem && <div className="auth-card__message">{mensagem}</div>}
        {erro && <div className="auth-card__message auth-card__message--error">{erro}</div>}

        <form onSubmit={handleSubmit}>
          <Input id="name" label="Nome" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input
            id="email"
            label="E-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit" loading={carregando}>
            Salvar alterações
          </Button>
        </form>
      </div>
    </div>
  )
}
