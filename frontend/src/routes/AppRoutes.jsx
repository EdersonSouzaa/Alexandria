import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import LandingPage from '../pages/LandingPage'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import InicioPage from '../pages/InicioPage'
import ExplorarPage from '../pages/ExplorarPage'
import LivroDetalhePage from '../pages/LivroDetalhePage'
import MinhaBibliotecaPage from '../pages/MinhaBibliotecaPage'
import MinhasAvaliacoesPage from '../pages/MinhasAvaliacoesPage'
import ComunidadePage from '../pages/ComunidadePage'
import ConquistasPage from '../pages/ConquistasPage'
import PerfilPage from '../pages/PerfilPage'
import NotFoundPage from '../pages/NotFoundPage'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/cadastro" element={<RegisterPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/inicio" element={<InicioPage />} />
        <Route path="/explorar" element={<ExplorarPage />} />
        <Route path="/livros/:id" element={<LivroDetalhePage />} />
        <Route path="/biblioteca" element={<MinhaBibliotecaPage />} />
        <Route path="/avaliacoes" element={<MinhasAvaliacoesPage />} />
        <Route path="/comunidade" element={<ComunidadePage />} />
        <Route path="/conquistas" element={<ConquistasPage />} />
        <Route path="/perfil" element={<PerfilPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
