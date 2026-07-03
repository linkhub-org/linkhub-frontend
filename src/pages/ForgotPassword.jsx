import { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/auth/password-reset/', { email })
      setSent(true)
    } catch {
      setSent(true) // não revelamos se o e-mail existe
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow p-8 w-full max-w-md">
        <h1 className="text-xl font-bold text-gray-800 mb-2 text-center">
          Recuperar senha
        </h1>
        <p className="text-gray-500 text-sm text-center mb-6">
          Digite seu e-mail institucional para receber o link de redefinição.
        </p>

        {sent ? (
          <div className="text-center">
            <div className="text-green-500 text-4xl mb-4">✓</div>
            <p className="text-gray-600 text-sm mb-4">
              Se este e-mail estiver cadastrado, você receberá as instruções em breve.
            </p>
            <Link to="/login" className="text-blue-600 text-sm hover:underline">
              Voltar ao login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-600">
                E-mail institucional
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="seuemail@ufrn.br"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Enviando...' : 'Enviar link'}
            </button>
            <Link
              to="/login"
              className="text-center text-sm text-gray-500 hover:underline"
            >
              Voltar ao login
            </Link>
          </form>
        )}
      </div>
    </div>
  )
}