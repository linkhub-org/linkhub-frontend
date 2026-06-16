import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import Header from '../components/Header'
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

const CATEGORIES = [
  { value: '', label: 'Todas as categorias' },
  { value: 'academic', label: 'Acadêmico' },
  { value: 'startup', label: 'Startup' },
  { value: 'open_source', label: 'Open Source' },
  { value: 'social', label: 'Social' },
  { value: 'other', label: 'Outros' },
]

const STATUSES = [
  { value: '', label: 'Todos os status' },
  { value: 'open', label: 'Aberto' },
  { value: 'in_progress', label: 'Em andamento' },
  { value: 'completed', label: 'Concluído' },
  { value: 'cancelled', label: 'Cancelado' },
]

export default function Feed() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [status, setStatus] = useState('')

  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects', search, category, status],
    queryFn: () =>
      getProjects({ search, category, status }).then((res) => res.data),
  })

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="max-w-2xl mx-auto mt-8 px-4 pb-12">

        {/* Filtros */}
        <div className="bg-white rounded-xl shadow p-4 mb-6 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Buscar por título..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        {/* Botão de criar projeto */}
        <div className="flex justify-end mb-4">
          <Link
            to="/projects/new"
            className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
          >
            + Novo projeto
          </Link>
        </div>

        {/* Lista de projetos */}
        {isLoading ? (
          <p className="text-gray-500 text-sm text-center">Carregando projetos...</p>
        ) : projects?.length === 0 ? (
          <p className="text-gray-500 text-sm text-center">Nenhum projeto encontrado.</p>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => (
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
                <p className="text-xs text-gray-400 mt-3">
                  por {project.owner_name}
                </p>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}