import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import Header from '../components/Header'

export default function Profile() {
  const { user } = useAuth()

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="max-w-2xl mx-auto mt-8 px-4">
        <div className="bg-white rounded-xl shadow p-6">

          <div className="flex items-center gap-4 mb-6">
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user.name}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold">
                {user.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h1 className="text-xl font-bold text-gray-800">{user.name}</h1>
              <p className="text-sm text-gray-500">{user.email}</p>
              <p className="text-sm text-gray-500">{user.institution_name}</p>
            </div>
          </div>

          {user.course && (
            <div className="mb-4">
              <span className="text-sm font-semibold text-gray-600">Curso</span>
              <p className="text-gray-800">{user.course}</p>
            </div>
          )}

          {user.bio && (
            <div className="mb-4">
              <span className="text-sm font-semibold text-gray-600">Bio</span>
              <p className="text-gray-800">{user.bio}</p>
            </div>
          )}

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

          <div className="flex items-center justify-between mt-6">
            <span
              className={`text-xs px-3 py-1 rounded-full font-semibold ${
                user.is_available
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              {user.is_available ? 'Disponível para projetos' : 'Indisponível'}
            </span>
            <Link
              to="/profile/edit"
              className="text-sm text-blue-600 hover:underline"
            >
              Editar perfil
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}