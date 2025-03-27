import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Moon, Sun } from 'lucide-react'
import { motion } from 'framer-motion'
import Home from './pages/Home'
import NotFound from './pages/NotFound'

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode')
    return savedMode ? JSON.parse(savedMode) : 
      window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
  }, [darkMode])

  return (
    <div className="min-h-screen font-sans text-surface-800 dark:text-surface-100 transition-colors duration-300">
      <header className="fixed top-4 right-4 z-50">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-full bg-surface-200 dark:bg-surface-800 shadow-neu-light dark:shadow-neu-dark"
          aria-label="Toggle dark mode"
        >
          {darkMode ? (
            <Sun className="w-6 h-6 text-yellow-400" />
          ) : (
            <Moon className="w-6 h-6 text-primary" />
          )}
        </motion.button>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer className="py-4 text-center text-sm text-surface-500">
        <p>© {new Date().getFullYear()} MazeQuest - Fun Maze Adventures for Kids</p>
      </footer>
    </div>
  )
}

export default App