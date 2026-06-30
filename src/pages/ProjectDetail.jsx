import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../context/AuthContext'
import { getRecommendedProfiles } from '../services/recommendations'
import Header from '../components/Header'
import ApplicationModal from '../components/ApplicationModal'
import api from '../services/api'
import { saveProject, unsaveProject } from '../services/social'

function getStatusStyle(status) {
  switch (status) {
    case 'open': return 'bg-green-100 text-green-700'
    case 'in_progress': return 'bg-blue-100 text-blue-700'
    case 'completed': return 'bg-gray-100 text-gray-600'
    case 'cancelled': return 'bg-red-100 text-red-600'
    default: return 'bg-gray-100 text-gray-600'
  }
}

export default function ProjectDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [showModal, setShowModal] = useState(false)
  const [applied, setApplied] = useState(false)
  const [loadingSave, setLoadingSave] = useState(false)

  const handleSave = async () => {
    setLoadingSave(true)
    try {
      if (project.is_saved) {
        await unsaveProject(id)
      } else {
        await saveProject(id)
      }
      queryClient.invalidateQueries(['project', id])
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingSave(false)
    }
  }

  const { data: project, isLoading, isError } = useQuery({
    queryKey: ['project', id],
    queryFn: () => api.get(`/projects/${id}/`).then((res) => res.data),
  })

  const isOwner = project?.owner_name === user?.name

  // ✅ hook antes de qualquer return condicional
  const { data: recommendations, isLoading: loadingRecs } = useQuery({
    queryKey: ['recommend-profiles', id],
    queryFn: () => getRecommendedProfiles(id),
    enabled: isOwner && !isLoading, // só busca quando projeto já carregou e é dono
    staleTime: 1000 * 60 * 5,
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">Carregando projeto...</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Projeto não encontrado.</p>
          <Link to="/feed" className="text-blue-600 hover:underline text-sm">
            Voltar ao feed
          </Link>
        </div>
      </div>
    )
  }

  const isOpen = project.status === 'open'

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="max-w-2xl mx-auto mt-8 px-4 pb-12">
        <div className="bg-white rounded-xl shadow p-6">

          {/* Cabeçalho */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-xl font-bold text-gray-800">{project.title}</h1>
              <p className="text-sm text-gray-500 mt-1">
                por{' '}
                <Link
                  to={isOwner ? '/profile' : `/users/${project.owner_id}`}
                  className="hover:text-blue-600 hover:underline"
                >
                  {project.owner_name}
                </Link>
                {' '}· {project.institution_name}
              </p>
            </div>
            <span className={`text-xs px-3 py-1 rounded-full font-semibold ${getStatusStyle(project.status)}`}>
              {project.status_display}
            </span>
          </div>

          {/* Categoria */}
          <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
            {project.category_display}
          </span>

          {/* Descrição */}
          <div className="mt-4">
            <h2 className="text-sm font-semibold text-gray-600">Descrição</h2>
            <p className="text-gray-800 text-sm mt-1">{project.description}</p>
          </div>

          {/* Perfil buscado */}
          {project.looking_for && (
            <div className="mt-4">
              <h2 className="text-sm font-semibold text-gray-600">Perfil buscado</h2>
              <p className="text-gray-800 text-sm mt-1">{project.looking_for}</p>
            </div>
          )}

          {/* Membros */}
          {project.members?.length > 0 && (
            <div className="mt-4">
              <h2 className="text-sm font-semibold text-gray-600">
                Membros ({project.members.length})
              </h2>
              <div className="flex flex-wrap gap-2 mt-2">
                {project.members.map((m, i) => (
                  <span
                    key={i}
                    className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full"
                  >
                    {m.user_name} · {m.user_course}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Perfis recomendados — apenas para o criador */}
          {isOwner && (
            <div className="mt-6">
              <h2 className="text-sm font-semibold text-gray-600 mb-3">
                ✨ Perfis recomendados pela IA
              </h2>
              {loadingRecs ? (
                <p className="text-sm text-gray-400">Buscando recomendações...</p>
              ) : recommendations?.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {recommendations.map((rec) => (
                    <div
                      key={rec.user_id}
                      className="border border-gray-200 rounded-lg p-3 flex justify-between items-start gap-4"
                    >
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{rec.name}</p>
                        <p className="text-xs text-gray-500 mt-1">{rec.reason}</p>
                      </div>
                      <Link
                        to={`/users/${rec.user_id}`}
                        className="text-xs text-blue-600 border border-blue-300 rounded-lg px-3 py-1 hover:bg-blue-50 transition whitespace-nowrap"
                      >
                        Ver perfil
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400">Nenhuma recomendação disponível no momento.</p>
              )}
            </div>
          )}

          {/* Ações */}
          <div className="mt-6 flex gap-3 justify-end">
            <button
              onClick={handleSave}
              disabled={loadingSave}
              className={`px-4 py-2 text-sm rounded-lg font-semibold transition disabled:opacity-50 ${
                project.is_saved
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  : 'border border-blue-300 text-blue-600 hover:bg-blue-50'
              }`}
            >
              {loadingSave ? '...' : project.is_saved ? '★ Salvo' : '☆ Salvar'}
            </button>
            
            {isOwner ? (
              <>
                <Link
                  to={`/projects/${id}/applications`}
                  className="px-4 py-2 text-sm text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition"
                >
                  Ver candidaturas
                </Link>
                <Link
                  to={`/projects/${id}/edit`}
                  className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
                >
                  Editar projeto
                </Link>
              </>
            ) : isOpen && !applied ? (
              <button
                onClick={() => setShowModal(true)}
                className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
              >
                Quero participar
              </button>
            ) : applied ? (
              <span className="text-sm text-green-600 font-semibold">
                ✓ Candidatura enviada
              </span>
            ) : null}
          </div>
        </div>
      </main>

      {showModal && (
        <ApplicationModal
          projectId={id}
          projectTitle={project.title}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setApplied(true)
            queryClient.invalidateQueries(['project', id])
          }}
        />
      )}
    </div>
  )
}