import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Notifications from './Notifications'

export default function Header() {
  const { logout } = useAuth()

  return (
    <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <Link to="/feed" className="text-blue-600 font-bold text-xl">
        Linkhub
      </Link>

      <div className="flex items-center gap-4">
        <Link to="/feed" className="text-sm text-gray-600 hover:text-blue-600">
          Feed
        </Link>
        <Link to="/profile" className="text-sm text-gray-600 hover:text-blue-600">
          Perfil
        </Link>
        <Notifications />
        <button
          onClick={logout}
          className="text-sm text-red-500 hover:underline"
        >
          Sair
        </button>
      </div>
    </header>
  )
}