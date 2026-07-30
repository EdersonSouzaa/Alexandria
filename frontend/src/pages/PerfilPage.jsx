import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useGamificacao } from '../context/GamificacaoContext'
import { bibliotecaService } from '../services/bibliotecaService'
import Input from '../components/Input'
import Button from '../components/Button'
import DashboardShell from '../components/DashboardShell'
import { iniciais } from '../components/DashboardIcons'
import { BookGridSkeleton } from '../components/Skeleton'
import { ICONES_CONQUISTA, ICONES_HISTORICO, IconCadeado, IconTrofeu, tituloAtual } from '../components/AchievementIcons'
import '../styles/dashboard.css'
import '../styles/book-grid.css'
import '../styles/perfil.css'

export default function PerfilPage() {
  const { user, updateProfile } = useAuth()
  const { status, refresh } = useGamificacao()
  const navigate = useNavigate()

  const [name, setName] = useState(user?.name ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [mensagem, setMensagem] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [favoritos, setFavoritos] = useState([])
  const [carregandoFavoritos, setCarregandoFavoritos] = useState(true)
  const [termoBusca, setTermoBusca] = useState('')

  useEffect(() => {
    refresh()
    bibliotecaService
      .listar({ favorito: true })
      .then(setFavoritos)
      .finally(() => setCarregandoFavoritos(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleBuscar(event) {
    event.preventDefault()
    navigate(`/explorar?termo=${encodeURIComponent(termoBusca)}`)
  }

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

  const conquistasDesbloqueadas = useMemo(() => status?.conquistas.filter((c) => c.desbloqueada) ?? [], [status])
  const proximaConquista = useMemo(() => status?.conquistas.find((c) => !c.desbloqueada) ?? null, [status])
  const titulo = status ? tituloAtual(status.nivel) : null

  return (
    <div className="dash">
      <DashboardShell
        active="/perfil"
        searchValue={termoBusca}
        onSearchChange={setTermoBusca}
        onSearchSubmit={handleBuscar}
        searchPlaceholder="Buscar na sua biblioteca…"
      >
        <div className="dash__page-head">
          <div>
            <h1>Meu perfil</h1>
            <p>Seus dados, sua jornada e sua estante em um só lugar.</p>
          </div>
        </div>

        <section className="dash__profile-header">
          <span className="dash__profile-avatar">{iniciais(user?.name)}</span>
          <div className="dash__profile-header-info">
            <h2>{user?.name}</h2>
            <p className="dash__profile-email">{user?.email}</p>
            <div className="dash__level-chips">
              {titulo && (
                <span className="dash__level-chip">
                  <IconTrofeu width={15} height={15} /> {titulo.titulo}
                </span>
              )}
              {user?.criadoEm && (
                <span className="dash__level-chip dash__level-chip--muted">
                  Membro desde {new Date(user.criadoEm).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                </span>
              )}
            </div>
          </div>
        </section>

        {status && (
          <div className="dash__stats">
            <div className="dash__stat-tile">
              <span>
                <strong>{status.estatisticas.totalLivros}</strong>
                <span>Livros na estante</span>
              </span>
            </div>
            <div className="dash__stat-tile">
              <span>
                <strong>{status.estatisticas.totalAvaliacoes}</strong>
                <span>Avaliações escritas</span>
              </span>
            </div>
            <div className="dash__stat-tile">
              <span>
                <strong>
                  {conquistasDesbloqueadas.length}/{status.conquistas.length}
                </strong>
                <span>Conquistas</span>
              </span>
            </div>
            <div className="dash__stat-tile">
              <span>
                <strong>Nível {status.nivel}</strong>
                <span>{status.xpParaProximoNivel} XP para o próximo</span>
              </span>
            </div>
          </div>
        )}

        <div className="dash__profile-layout">
          <div className="dash__profile-col">
            <div className="dash__card dash__profile-form-card">
              <h3>Editar perfil</h3>
              {mensagem && <div className="dash__profile-message">{mensagem}</div>}
              {erro && <div className="dash__profile-message dash__profile-message--error">{erro}</div>}
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

            {status && (
              <div className="dash__card">
                <div className="dash__card-head">
                  <h3>Atividade recente</h3>
                  <Link to="/conquistas">Ver tudo →</Link>
                </div>
                {status.historico.length === 0 ? (
                  <p className="dash__empty-inline">Nenhuma atividade registrada ainda.</p>
                ) : (
                  <div className="dash__timeline dash__timeline--compact">
                    {status.historico.slice(0, 5).map((item, index) => {
                      const Icone = ICONES_HISTORICO[item.tipo]
                      return (
                        <div className="dash__timeline-item" key={index}>
                          <span className="dash__timeline-icon">
                            {Icone ? <Icone /> : <IconTrofeu width={16} height={16} />}
                          </span>
                          <span className="dash__timeline-desc">{item.descricao}</span>
                          <span className="dash__timeline-meta">+{item.xpGanho} XP</span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="dash__profile-col dash__profile-col--wide">
            <div className="dash__section-head-row">
              <h3 className="dash__section-title">Estante em destaque</h3>
              <Link to="/biblioteca" className="dash__filter-toggle">
                Ver estante →
              </Link>
            </div>
            {carregandoFavoritos ? (
              <BookGridSkeleton count={6} compact />
            ) : favoritos.length === 0 ? (
              <div className="dash__empty">
                Você ainda não marcou nenhum livro como favorito.{' '}
                <Link to="/biblioteca">Marque seus preferidos</Link> para exibi-los aqui.
              </div>
            ) : (
              <div className="dash__book-grid dash__book-grid--compact">
                {favoritos.slice(0, 6).map((item) => (
                  <Link to={`/livros/${item.livro.identificadorExterno}`} className="dash__book" key={item.id}>
                    <div className="dash__book-cover">
                      {item.livro.capa ? (
                        <img src={item.livro.capa} alt={`Capa de ${item.livro.titulo}`} loading="lazy" />
                      ) : (
                        <span className="dash__book-placeholder">{item.livro.titulo?.[0]}</span>
                      )}
                    </div>
                    <div className="dash__book-ledge" />
                    <div className="dash__book-info">
                      <h3>{item.livro.titulo}</h3>
                      {item.livro.autor && <p className="dash__book-author">{item.livro.autor}</p>}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {status && conquistasDesbloqueadas.length > 0 && (
          <section className="dash__profile-badges">
            <div className="dash__profile-badges-head">
              <h3>Conquistas em destaque</h3>
              <Link to="/conquistas">Ver todas →</Link>
            </div>
            <div className="dash__profile-badges-row">
              {conquistasDesbloqueadas.slice(0, 6).map((conquista) => {
                const Icone = ICONES_CONQUISTA[conquista.codigo]
                return (
                  <div className="dash__profile-badge" key={conquista.codigo} title={conquista.descricao}>
                    <span className="dash__profile-badge-icon">{Icone ? <Icone /> : <IconTrofeu />}</span>
                    <span>{conquista.nome}</span>
                  </div>
                )
              })}
              {proximaConquista && (
                <div className="dash__profile-badge dash__profile-badge--locked" title={proximaConquista.descricao}>
                  <span className="dash__profile-badge-icon">
                    <IconCadeado width={22} height={22} />
                  </span>
                  <span>{proximaConquista.nome}</span>
                </div>
              )}
            </div>
          </section>
        )}
      </DashboardShell>
    </div>
  )
}
