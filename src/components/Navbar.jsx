
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-gradient-to-r from-blue-700 to-blue-900 text-white px-6 py-4 shadow-lg flex justify-between items-center rounded-b-xl">
      <h1 className="text-2xl font-semibold tracking-wide">
        <Link to="/" className="hover:text-gray-200 transition-colors duration-200">
          📆 EventHub
        </Link>
      </h1>
      <div className="space-x-4">
        <Link
          to="/"
          className="px-3 py-1 rounded hover:bg-green-500 transition duration-200 font-medium"
        >
          Home
        </Link>
        <Link
          to="/admin"
          className="px-3 py-1 rounded hover:bg-green-500 transition duration-200 font-medium"
        >
          Admin
        </Link>
      </div>
    </nav>
  );
}
