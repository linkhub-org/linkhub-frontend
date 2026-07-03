import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../services/api'

export default function VerifyEmail() {
  const { uid, token } = useParams()
  const [status, setStatus] = useState('loading') // loading | success | error

  useEffect(() => {
    api.get(`/auth/verify-email/${uid}/${token}/`)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'))
  }, [uid, token])

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow p-8 w-full max-w-md text-center">

        {status === 'loading' && (
          <>
            <p className="text-gray-500 text-lg">Verificando seu e-mail...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="text-green-500 text-5xl mb-4">✓</div>
            <h1 className="text-xl font-bold text-gray-800 mb-2">
              E-mail confirmado!
            </h1>
            <p className="text-gray-500 text-sm mb-6">
              Sua conta foi ativada com sucesso. Agora você pode fazer login.
            </p>
            <Link
              to="/login"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
            >
              Fazer login
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="text-red-500 text-5xl mb-4">✕</div>
            <h1 className="text-xl font-bold text-gray-800 mb-2">
              Link inválido ou expirado
            </h1>
            <p className="text-gray-500 text-sm mb-6">
              Solicite um novo link de confirmação abaixo.
            </p>
            <Link
              to="/resend-verification"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
            >
              Reenviar e-mail
            </Link>
          </>
        )}
      </div>
    </div>
  )
}