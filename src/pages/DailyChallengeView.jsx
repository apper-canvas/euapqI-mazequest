import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Calendar, Award, Clock, ArrowLeft, Star, Trophy, Zap } from 'lucide-react'
import { useDailyChallenge } from '../context/DailyChallengeContext'

const DailyChallengeView = () => {
  const navigate = useNavigate()
  const { todayChallenge, streakCount, isCompleted, completeChallenge, loadChallenge } = useDailyChallenge()
  const [showCelebration, setShowCelebration] = useState(false)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)

  useEffect(() => {
    loadChallenge()
  }, [loadChallenge])

  useEffect(() => {
    let timer
    if (isPlaying) {
      timer = setInterval(() => {
        setTimeElapsed(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [isPlaying])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  const handleStart = () => {
    setHasStarted(true)
    setIsPlaying(true)
  }

  const handleComplete = () => {
    setIsPlaying(false)
    if (!isCompleted) {
      completeChallenge()
    }
    setShowCelebration(true)
  }

  // Placeholder for actual maze gameplay
  const renderMazeGame = () => (
    <div className="bg-surface-200 dark:bg-surface-800 rounded-xl p-4 h-80 flex items-center justify-center">
      {!hasStarted ? (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleStart}
          className="btn btn-primary"
        >
          Start Challenge
        </motion.button>
      ) : (
        <div className="text-center">
          <p className="mb-6">Maze gameplay would be here</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleComplete}
            className="btn btn-accent"
          >
            Complete Challenge
          </motion.button>
        </div>
      )}
    </div>
  )

  const renderCelebration = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-surface-100 dark:bg-surface-800 p-8 rounded-2xl text-center max-w-md mx-auto shadow-xl"
    >
      <div className="celebration-badge w-20 h-20 mx-auto mb-6">
        <Trophy className="w-10 h-10" />
      </div>
      
      <h2 className="text-2xl font-bold mb-3">Challenge Completed!</h2>
      <p className="text-surface-600 dark:text-surface-300 mb-6">
        You've successfully completed today's challenge!
      </p>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-surface-200 dark:bg-surface-700 p-3 rounded-lg">
          <p className="text-xs text-surface-500 dark:text-surface-400">Time</p>
          <p className="text-lg font-bold">{formatTime(timeElapsed)}</p>
        </div>
        <div className="bg-surface-200 dark:bg-surface-700 p-3 rounded-lg">
          <p className="text-xs text-surface-500 dark:text-surface-400">Points</p>
          <p className="text-lg font-bold">{todayChallenge?.rewardPoints || 100}</p>
        </div>
      </div>
      
      <div className="flex justify-center space-x-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
          className="btn btn-secondary"
        >
          Return Home
        </motion.button>
      </div>
    </motion.div>
  )

  return (
    <div className="min-h-screen pt-16 pb-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <button 
            onClick={() => navigate('/')}
            className="flex items-center text-surface-600 dark:text-surface-400 hover:text-primary dark:hover:text-primary transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            <span>Back to Home</span>
          </button>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="daily-challenge-badge w-12 h-12 mr-4">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Daily Challenge</h1>
                <p className="text-surface-600 dark:text-surface-400">
                  {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>
            
            {streakCount > 0 && (
              <div className="streak-counter py-2 px-4">
                <Award className="w-5 h-5 mr-2" />
                <span className="text-base">{streakCount} day streak</span>
              </div>
            )}
          </div>
        </motion.div>
        
        {showCelebration ? (
          renderCelebration()
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-surface-100 dark:bg-surface-800 rounded-xl p-6 mb-6 shadow-lg">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold">{todayChallenge?.title || "Today's Challenge"}</h2>
                  <p className="text-surface-600 dark:text-surface-300">
                    {todayChallenge?.description || "A special maze with unique objectives"}
                  </p>
                </div>
                
                <div className="flex items-center">
                  <span className="text-sm text-surface-500 dark:text-surface-400 mr-2">Difficulty:</span>
                  <div className="flex">
                    {Array(todayChallenge?.difficulty || 3).fill(0).map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="bg-surface-200/50 dark:bg-surface-700/50 p-4 rounded-lg mb-4">
                <h3 className="font-bold text-sm mb-2 flex items-center">
                  <Zap className="w-4 h-4 mr-1 text-primary" />
                  Challenge Objectives:
                </h3>
                <ul className="space-y-2">
                  {todayChallenge?.objectives?.map((objective, index) => (
                    <li key={index} className="flex items-start text-sm">
                      <span className="inline-block w-5 h-5 bg-primary/10 dark:bg-primary/20 rounded-full text-primary text-xs flex items-center justify-center mr-2 mt-0.5">
                        {index + 1}
                      </span>
                      <span>{objective}</span>
                    </li>
                  )) || (
                    <>
                      <li className="flex items-start text-sm">
                        <span className="inline-block w-5 h-5 bg-primary/10 dark:bg-primary/20 rounded-full text-primary text-xs flex items-center justify-center mr-2 mt-0.5">
                          1
                        </span>
                        <span>Complete the maze in under 60 seconds</span>
                      </li>
                      <li className="flex items-start text-sm">
                        <span className="inline-block w-5 h-5 bg-primary/10 dark:bg-primary/20 rounded-full text-primary text-xs flex items-center justify-center mr-2 mt-0.5">
                          2
                        </span>
                        <span>Collect all gems in the maze</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>
              
              {isPlaying && (
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center">
                    <Trophy className="w-4 h-4 mr-1 text-amber-500" />
                    <span>Reward: {todayChallenge?.rewardPoints || 100} points</span>
                  </div>
                  <div className="flex items-center bg-surface-200 dark:bg-surface-700 py-1 px-3 rounded-full">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{formatTime(timeElapsed)}</span>
                  </div>
                </div>
              )}
            </div>
            
            {renderMazeGame()}
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default DailyChallengeView