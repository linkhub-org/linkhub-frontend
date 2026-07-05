import { useParams, useSearchParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../context/AuthContext'
import Header from '../components/Header'
import { getFollowers, getFollowing } from '../services/social'

export default function Followers() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const type = searchParams.get('type') || 'followers'
  const { user: me } = useAuth()

  const { data: users, isLoading } = useQuery({
    queryKey: ['followers-list', id, type],
    queryFn: () =>
      (type === 'following' ? getFollowing(id) : getFollowers(id)).then(
        (res) => res.data
      ),
  })

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="max-w-2xl mx-auto mt-8 px-4 pb-12">
        <h1 className="text-xl font-bold text-gray-800 mb-6">
          {type === 'following' ? 'Seguindo' : 'Seguidores'}
        </h1>

        {isLoading ? (
          <p className="text-gray-500 text-sm text-center">Carregando...</p>
        ) : users?.length === 0 ? (
          <p className="text-gray-500 text-sm text-center">
            {type === 'following' ? 'Ainda não segue ninguém.' : 'Ainda não tem seguidores.'}
          </p>
        ) : (
          <div className="space-y-3">
            {users.map((u) => (
              <Link
                key={u.id}
                to={u.id === me?.id ? '/profile' : `/users/${u.id}`}
                className="flex items-center gap-4 bg-white rounded-xl shadow p-4 hover:shadow-md transition"
              >
                {u.avatar_url ? (
                  <img
                    src={u.avatar_url}
                    alt={u.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                    {u.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{u.name}</p>
                  {u.course && <p className="text-xs text-gray-500">{u.course}</p>}
                  {u.id === me?.id && (
                    <p className="text-xs text-blue-500">Você</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}