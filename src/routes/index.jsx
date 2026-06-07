import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Pages
import Login from '../pages/Login'
import Register from '../pages/Register'
import Feed from '../pages/Feed'
import ProjectDetail from '../pages/ProjectDetail'
import CreateProject from '../pages/CreateProject'
import Profile from '../pages/Profile'
import EditProfile from '../pages/EditProfile'
import PublicProfile from '../pages/PublicProfile'

// Rota protegida — redireciona para login se não autenticado
function PrivateRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-gray-500 text-lg">Carregando...</p>
      </div>
    )
  }

  return user ? children : <Navigate to="/login" replace />
}

// Rota pública — redireciona para feed se já autenticado
function PublicRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <p className="text-gray-500 text-lg">Carregando...</p>
      </div>
    )
  }

  return !user ? children : <Navigate to="/feed" replace />
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

        {/* Rotas protegidas */}
        <Route path="/feed" element={<PrivateRoute><Feed /></PrivateRoute>} />
        <Route path="/projects/:id" element={<PrivateRoute><ProjectDetail /></PrivateRoute>} />
        <Route path="/projects/new" element={<PrivateRoute><CreateProject /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/profile/edit" element={<PrivateRoute><EditProfile /></PrivateRoute>} />
        <Route path="/users/:id" element={<PrivateRoute><PublicProfile /></PrivateRoute>} />

        {/* Redireciona raiz para feed */}
        <Route path="/" element={<Navigate to="/feed" replace />} />

        {/* Rota não encontrada */}
        <Route path="*" element={<Navigate to="/feed" replace />} />
      </Routes>
    </BrowserRouter>
  )
}