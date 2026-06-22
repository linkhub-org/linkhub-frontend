import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import Header from '../components/Header'
import { getMyProjects } from '../services/users'

function getStatusStyle(status) {
  switch (status) {
    case 'open': return 'bg-green-100 text-green-700'
    case 'in_progress': return 'bg-blue-100 text-blue-700'
    case 'completed': return 'bg-gray-100 text-gray-600'
    case 'cancelled': return 'bg-red-100 text-red-600'
    default: return 'bg-gray-100 text-gray-600'
  }
}

export default function Profile() {
  const { user } = useAuth()

  const { data: projects, isLoading: loadingProjects } = useQuery({
    queryKey: ['my-projects'],
    queryFn: () => getMyProjects().then((res) => res.data),
  })

  if (!user) return null

  const ownedProjects = projects?.filter((p) => p.owner_name === user.name) || []
  const memberProjects = projects?.filter((p) => p.owner_name !== user.name) || []

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="max-w-2xl mx-auto mt-8 px-4 pb-12">

        {/* Dados do perfil */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
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

          <div className="flex items-center justify-between mt-4">
            <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
              user.is_available
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-500'
            }`}>
              {user.is_available ? 'Disponível para projetos' : 'Indisponível'}
            </span>
            <Link to="/profile/edit" className="text-sm text-blue-600 hover:underline">
              Editar perfil
            </Link>
          </div>
        </div>

        {/* Meus projetos */}
        {loadingProjects ? (
          <p className="text-center text-gray-400">Carregando projetos...</p>
        ) : (
          <>
            {/* Projetos criados */}
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-gray-500 mb-3">
                Meus projetos ({ownedProjects.length})
              </h2>
              {ownedProjects.length === 0 ? (
                <div className="bg-white rounded-xl shadow p-5 text-center">
                  <p className="text-gray-400 text-sm">Você ainda não criou nenhum projeto.</p>
                  <Link
                    to="/projects/new"
                    className="text-blue-600 text-sm hover:underline mt-2 inline-block"
                  >
                    Criar projeto
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {ownedProjects.map((p) => (
                    <Link
                      key={p.id}
                      to={`/projects/${p.id}`}
                      className="bg-white rounded-xl shadow p-4 hover:shadow-md transition block"
                    >
                      <div className="flex justify-between items-start">
                        <p className="font-semibold text-gray-800">{p.title}</p>
                        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${getStatusStyle(p.status)}`}>
                          {p.status_display}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{p.category_display}</p>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Projetos que participa */}
            <div>
              <h2 className="text-sm font-semibold text-gray-500 mb-3">
                Projetos que participo ({memberProjects.length})
              </h2>
              {memberProjects.length === 0 ? (
                <div className="bg-white rounded-xl shadow p-5 text-center">
                  <p className="text-gray-400 text-sm">Você ainda não participa de nenhum projeto.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {memberProjects.map((p) => (
                    <Link
                      key={p.id}
                      to={`/projects/${p.id}`}
                      className="bg-white rounded-xl shadow p-4 hover:shadow-md transition block"
                    >
                      <div className="flex justify-between items-start">
                        <p className="font-semibold text-gray-800">{p.title}</p>
                        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${getStatusStyle(p.status)}`}>
                          {p.status_display}
                        </span>
                      </div>
                      <div className="flex justify-between mt-1">
                        <p className="text-xs text-gray-500">{p.category_display}</p>
                        <p className="text-xs text-gray-400">por {p.owner_name}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  )
}