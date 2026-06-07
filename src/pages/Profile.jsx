import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

export default function Profile() {
  const { user, logout } = useAuth()

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <Link to="/feed" className="text-blue-600 font-bold text-xl">Linkhub</Link>
        <div className="flex gap-4">
          <Link to="/profile/edit" className="text-sm text-blue-600 hover:underline">
            Editar perfil
          </Link>
          <button
            onClick={logout}
            className="text-sm text-red-500 hover:underline"
          >
            Sair
          </button>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="max-w-2xl mx-auto mt-8 px-4">
        <div className="bg-white rounded-xl shadow p-6">

          {/* Avatar e nome */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">{user.name}</h1>
              <p className="text-sm text-gray-500">{user.email}</p>
              <p className="text-sm text-gray-500">{user.institution_name}</p>
            </div>
          </div>

          {/* Curso */}
          {user.course && (
            <div className="mb-4">
              <span className="text-sm font-semibold text-gray-600">Curso</span>
              <p className="text-gray-800">{user.course}</p>
            </div>
          )}

          {/* Bio */}
          {user.bio && (
            <div className="mb-4">
              <span className="text-sm font-semibold text-gray-600">Bio</span>
              <p className="text-gray-800">{user.bio}</p>
            </div>
          )}

          {/* Habilidades */}
          {user.skills?.length > 0 && (
            <div className="mb-4">
              <span className="text-sm font-semibold text-gray-600">Habilidades</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {user.skills.map((skill) => (
                  <span
                    key={skill}
                    className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Disponibilidade */}
          <div className="mt-4">
            <span
              className={`text-xs px-3 py-1 rounded-full font-semibold ${
                user.is_available
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              {user.is_available ? 'Disponível para projetos' : 'Indisponível'}
            </span>
          </div>
        </div>
      </main>
    </div>
  )
}