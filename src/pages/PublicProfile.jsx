import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getPublicProfile } from '../services/users'

export default function PublicProfile() {
  const { id } = useParams()

  const { data: user, isLoading, isError } = useQuery({
    queryKey: ['public-profile', id],
    queryFn: () => getPublicProfile(id).then((res) => res.data),
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">Carregando perfil...</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Usuário não encontrado ou fora da sua instituição.</p>
          <Link to="/feed" className="text-blue-600 hover:underline text-sm">
            Voltar ao feed
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <Link to="/feed" className="text-blue-600 font-bold text-xl">Linkhub</Link>
        <Link to="/feed" className="text-sm text-gray-500 hover:underline">
          Voltar ao feed
        </Link>
      </header>

      <main className="max-w-2xl mx-auto mt-8 px-4">
        <div className="bg-white rounded-xl shadow p-6">

          {/* Avatar e nome */}
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