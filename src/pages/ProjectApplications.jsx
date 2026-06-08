import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getProjectApplications, updateApplication } from '../services/applications'
import Header from '../components/Header'

export default function ProjectApplications() {
  const { id } = useParams()
  const queryClient = useQueryClient()

  const { data: applications, isLoading } = useQuery({
    queryKey: ['applications', id],
    queryFn: () => getProjectApplications(id).then((res) => res.data),
  })

  const mutation = useMutation({
    mutationFn: ({ applicationId, status }) =>
      updateApplication(applicationId, status),
    onSuccess: () => {
      queryClient.invalidateQueries(['applications', id])
    },
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">Carregando candidaturas...</p>
      </div>
    )
  }

  const pending = applications?.filter((a) => a.status === 'pending') || []
  const decided = applications?.filter((a) => a.status !== 'pending') || []

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="max-w-2xl mx-auto mt-8 px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800">Candidaturas recebidas</h2>
          <Link
            to={`/projects/${id}`}
            className="text-sm text-blue-600 hover:underline"
          >
            Voltar ao projeto
          </Link>
        </div>

        {/* Pendentes */}
        {pending.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-500 mb-2">
              Pendentes ({pending.length})
            </h3>
            <div className="flex flex-col gap-3">
              {pending.map((app) => (
                <div key={app.id} className="bg-white rounded-xl shadow p-4">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-semibold text-gray-800">{app.applicant_name}</p>
                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                      Pendente
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{app.message}</p>
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => mutation.mutate({ applicationId: app.id, status: 'rejected' })}
                      disabled={mutation.isPending}
                      className="px-3 py-1 text-sm text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition disabled:opacity-50"
                    >
                      Recusar
                    </button>
                    <button
                      onClick={() => mutation.mutate({ applicationId: app.id, status: 'accepted' })}
                      disabled={mutation.isPending}
                      className="px-3 py-1 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                    >
                      Aceitar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Decididas */}
        {decided.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-500 mb-2">
              Anteriores ({decided.length})
            </h3>
            <div className="flex flex-col gap-3">
              {decided.map((app) => (
                <div key={app.id} className="bg-white rounded-xl shadow p-4 opacity-75">
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-semibold text-gray-800">{app.applicant_name}</p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        app.status === 'accepted'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {app.status === 'accepted' ? 'Aceito' : 'Recusado'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{app.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {applications?.length === 0 && (
          <div className="bg-white rounded-xl shadow p-8 text-center">
            <p className="text-gray-400">Nenhuma candidatura recebida ainda.</p>
          </div>
        )}
      </main>
    </div>
  )
}