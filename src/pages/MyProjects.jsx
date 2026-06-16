import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import Header from '../components/Header'
import { useAuth } from '../context/AuthContext'
import { getProjects } from '../services/projects'

function getStatusStyle(status) {
  switch (status) {
    case 'open': return 'bg-green-100 text-green-700'
    case 'in_progress': return 'bg-blue-100 text-blue-700'
    case 'completed': return 'bg-gray-100 text-gray-600'
    case 'cancelled': return 'bg-red-100 text-red-600'
    default: return 'bg-gray-100 text-gray-600'
  }
}

export default function MyProjects() {
  const { user } = useAuth()

  const { data: projects, isLoading } = useQuery({
    queryKey: ['my-projects', user?.id],
    queryFn: () => getProjects().then((res) => res.data),
    enabled: !!user,
  })

  const myProjects = projects?.filter((p) => p.owner_name === user?.name) ?? []

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="max-w-2xl mx-auto mt-8 px-4 pb-12">

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-bold text-gray-800">Meus Projetos</h1>
          <Link
            to="/projects/new"
            className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
          >
            + Novo projeto
          </Link>
        </div>

        {isLoading ? (
          <p className="text-gray-500 text-sm text-center">Carregando projetos...</p>
        ) : myProjects.length === 0 ? (
          <p className="text-gray-500 text-sm text-center">
            Você ainda não criou nenhum projeto.
          </p>
        ) : (
          <div className="space-y-4">
            {myProjects.map((project) => (
              <Link
                key={project.id}
                to={`/projects/${project.id}`}
                className="block bg-white rounded-xl shadow p-5 hover:shadow-md transition"
              >
                <div className="flex justify-between items-start">
                  <h2 className="text-lg font-bold text-gray-800">{project.title}</h2>
                  <span className={`text-xs px-3 py-1 rounded-full font-semibold ${getStatusStyle(project.status)}`}>
                    {project.status_display}
                  </span>
                </div>
                <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full inline-block mt-2">
                  {project.category_display}
                </span>
                <p className="text-sm text-gray-600 mt-3 line-clamp-2">
                  {project.description}
                </p>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}