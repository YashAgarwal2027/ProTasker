import React from 'react';
import { Link } from 'react-router-dom';

function Navbar({ onToggleDark }) {
  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md p-4 flex justify-between items-center transition-colors">
      <h1 className="text-2xl font-bold text-blue-600 dark:text-white">ProTasker</h1>

      <div className="flex items-center space-x-4">
        <Link to="/" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
          Home
        </Link>
        <Link to="/login" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
          Login
        </Link>
        <Link to="/register" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
          Register
        </Link>

        {/* Dark mode toggle button */}
        <button
          onClick={onToggleDark}
          className="bg-gray-200 dark:bg-gray-700 text-sm text-gray-800 dark:text-white px-3 py-1 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        >
          Toggle Dark Mode
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
