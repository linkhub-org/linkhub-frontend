import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Header from '../components/Header'
import { createProject } from '../services/projects'

const CATEGORIES = [
  { value: 'academic', label: 'Acadêmico' },
  { value: 'startup', label: 'Startup' },
  { value: 'open_source', label: 'Open Source' },
  { value: 'social', label: 'Social' },
  { value: 'other', label: 'Outros' },
]

export default function CreateProject() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    title: '',
    description: '',
    looking_for: '',
    category: 'academic',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await createProject(form)
      navigate(`/projects/${data.id}`)
    } catch (err) {
      setError('Erro ao criar projeto. Verifique os dados preenchidos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="max-w-2xl mx-auto mt-8 px-4 pb-12">
        <div className="bg-white rounded-xl shadow p-6">
          <h1 className="text-xl font-bold text-gray-800 mb-2">Criar novo projeto</h1>
          <p className="text-sm text-gray-500 mb-6">
            Descreva seu projeto e o perfil que você busca.
          </p>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-600">Título</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-600">Descrição</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                rows={4}
                className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-600">Perfil buscado</label>
              <textarea
                name="looking_for"
                value={form.looking_for}
                onChange={handleChange}
                rows={2}
                placeholder="Ex: Desenvolvedor React com experiência em Tailwind"
                className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-600">Categoria</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <Link
                to="/feed"
                className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? 'Criando...' : 'Criar projeto'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}