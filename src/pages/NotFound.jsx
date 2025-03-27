import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, ArrowLeft } from 'lucide-react'

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md mx-auto"
      >
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary blur-lg opacity-20 rounded-full"></div>
          <div className="relative">
            <h1 className="text-9xl font-bold text-primary">404</h1>
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-32 h-2 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold mb-4">Oops! Maze Dead End</h2>
        <p className="text-surface-600 dark:text-surface-400 mb-8">
          Looks like you've hit a wall in our maze! The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-primary w-full sm:w-auto"
            >
              <Home className="mr-2 h-5 w-5" />
              Back to Home
            </motion.button>
          </Link>
          <button 
            onClick={() => window.history.back()}
            className="btn bg-surface-200 dark:bg-surface-700 hover:bg-surface-300 dark:hover:bg-surface-600 w-full sm:w-auto"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Go Back
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default NotFound