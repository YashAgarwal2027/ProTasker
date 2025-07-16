import React, { useState, useEffect } from 'react'; // import useState and useEffect
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 dark:text-white transition-colors">
        <Navbar onToggleDark={() => setDarkMode(!darkMode)}/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
        <footer className="text-center text-sm text-gray-500 dark:text-gray-400 p-4">
          © {new Date().getFullYear()} Made with ❤️ by Yash Kumar Agarwal
        </footer>
      </div>
    </Router>
  );
}

export default App;

