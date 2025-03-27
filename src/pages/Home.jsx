import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Star, Zap, Heart } from 'lucide-react'
import MainFeature from '../components/MainFeature'
import DailyChallenge from '../components/DailyChallenge'

const Home = () => {
  const [showIntro, setShowIntro] = useState(true)
  
  const startGame = () => {
    setShowIntro(false)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AnimatePresence mode="wait">
        {showIntro ? (
          <motion.div 
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center min-h-screen px-4 py-12 text-center"
          >
            <motion.div
              initial={{ y: -50 }}
              animate={{ y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className="mb-8"
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                MazeQuest
              </h1>
              <p className="text-xl md:text-2xl text-surface-600 dark:text-surface-300 max-w-2xl mx-auto">
                Embark on exciting maze adventures! Navigate through colorful mazes, collect treasures, and find your way to the exit.
              </p>
            </motion.div>
            
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, staggerChildren: 0.1 }}
            >
              {[
                { icon: <Zap className="w-8 h-8 text-primary" />, title: "Fun Challenges", description: "Exciting mazes with increasing difficulty" },
                { icon: <Star className="w-8 h-8 text-secondary" />, title: "Collect Treasures", description: "Find hidden gems along your journey" },
                { icon: <Trophy className="w-8 h-8 text-accent" />, title: "Earn Achievements", description: "Complete levels to unlock rewards" },
                { icon: <Heart className="w-8 h-8 text-red-500" />, title: "Kid-Friendly", description: "Designed for children of all ages" }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 rounded-bubble bg-surface-100 dark:bg-surface-800 shadow-neu-light dark:shadow-neu-dark"
                >
                  <div className="mb-4 flex justify-center">{feature.icon}</div>
                  <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                  <p className="text-surface-600 dark:text-surface-400">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startGame}
              className="btn btn-primary text-xl px-10 py-4 rounded-xl"
            >
              Start Adventure!
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 w-full max-w-6xl mx-auto px-4 py-12"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <MainFeature />
              </div>
              <div className="lg:col-span-1">
                <DailyChallenge />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Home