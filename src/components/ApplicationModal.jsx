import { useState } from 'react'
import { applyToProject } from '../services/applications'

export default function ApplicationModal({ projectId, projectTitle, onClose, onSuccess }) {
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await applyToProject(projectId, message)
      onSuccess()
      onClose()
    } catch (err) {
      const detail = err.response?.data?.non_field_errors?.[0]
        || err.response?.data?.message?.[0]
        || 'Erro ao enviar candidatura.'
      setError(detail)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-1">Candidatar-se</h2>
        <p className="text-sm text-gray-500 mb-4">
          Projeto: <span className="font-semibold text-gray-700">{projectTitle}</span>
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-600">
              Mensagem de apresentação
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={4}
              placeholder="Apresente-se e conte por que quer participar deste projeto..."
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 hover:underline"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Enviando...' : 'Enviar candidatura'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}