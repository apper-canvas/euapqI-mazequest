import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Award, Clock, ArrowRight, Star } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useDailyChallenge } from '../context/DailyChallengeContext'

const DailyChallenge = () => {
  const navigate = useNavigate()
  const { todayChallenge, streakCount, isCompleted, loadChallenge } = useDailyChallenge()
  const [timeUntilNextChallenge, setTimeUntilNextChallenge] = useState('')

  useEffect(() => {
    loadChallenge()
    
    // Update the countdown timer every minute
    const updateCountdown = () => {
      const now = new Date()
      const tomorrow = new Date(now)
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(0, 0, 0, 0)
      
      const diff = tomorrow - now
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      
      setTimeUntilNextChallenge(`${hours}h ${minutes}m`)
    }

    updateCountdown()
    const intervalId = setInterval(updateCountdown, 60000)
    
    return () => clearInterval(intervalId)
  }, [loadChallenge])

  const handleStartChallenge = () => {
    navigate('/daily-challenge')
  }

  // Difficulty stars display
  const difficultyStars = Array(todayChallenge?.difficulty || 3).fill(0).map((_, i) => (
    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
  ))

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="daily-challenge-card"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="daily-challenge-badge w-10 h-10 mr-3 daily-pulse">
            <Calendar className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold">Daily Challenge</h2>
        </div>
        {streakCount > 0 && (
          <div className="streak-counter">
            <Award className="w-4 h-4 mr-1" />
            <span>{streakCount} day streak</span>
          </div>
        )}
      </div>

      <div className="bg-surface-200/50 dark:bg-surface-700/50 p-4 rounded-xl mb-4">
        <h3 className="font-bold text-lg mb-2">{todayChallenge?.title || "Today's Challenge"}</h3>
        <p className="text-surface-600 dark:text-surface-300 text-sm mb-3">
          {todayChallenge?.description || "A new maze challenge with special objectives!"}
        </p>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-xs text-surface-500 dark:text-surface-400 mr-1">Difficulty:</span>
            <div className="flex">{difficultyStars}</div>
          </div>
          
          {!isCompleted ? (
            <div className="flex items-center text-surface-500 dark:text-surface-400 text-xs">
              <Clock className="w-3 h-3 mr-1" />
              <span>~{todayChallenge?.estimatedTime || "5 min"}</span>
            </div>
          ) : (
            <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs py-1 px-2 rounded-full">
              Completed
            </div>
          )}
        </div>
      </div>

      {!isCompleted ? (
        <div className="mb-4">
          <h4 className="font-bold text-sm mb-2">Special Objectives:</h4>
          <ul className="text-sm space-y-2">
            {todayChallenge?.objectives?.map((objective, index) => (
              <li key={index} className="flex items-start">
                <span className="inline-block w-5 h-5 bg-primary/10 dark:bg-primary/20 rounded-full text-primary text-xs flex items-center justify-center mr-2 mt-0.5">
                  {index + 1}
                </span>
                <span>{objective}</span>
              </li>
            )) || (
              <>
                <li className="flex items-start">
                  <span className="inline-block w-5 h-5 bg-primary/10 dark:bg-primary/20 rounded-full text-primary text-xs flex items-center justify-center mr-2 mt-0.5">
                    1
                  </span>
                  <span>Complete the maze in under 60 seconds</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-5 h-5 bg-primary/10 dark:bg-primary/20 rounded-full text-primary text-xs flex items-center justify-center mr-2 mt-0.5">
                    2
                  </span>
                  <span>Collect all gems in the maze</span>
                </li>
              </>
            )}
          </ul>
        </div>
      ) : (
        <div className="mb-4 bg-surface-200/50 dark:bg-surface-700/50 p-4 rounded-xl text-center">
          <p className="text-sm mb-2">Great job completing today's challenge!</p>
          <div className="text-xs text-surface-500 dark:text-surface-400 flex items-center justify-center">
            <Clock className="w-3 h-3 mr-1" />
            <span>Next challenge in: {timeUntilNextChallenge}</span>
          </div>
        </div>
      )}

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleStartChallenge}
        className={`w-full flex items-center justify-center py-3 rounded-xl ${
          isCompleted ? 'bg-surface-300 dark:bg-surface-700 text-surface-600 dark:text-surface-300' : 'btn-secondary'
        }`}
      >
        {isCompleted ? 'View Results' : 'Start Challenge'}
        <ArrowRight className="w-4 h-4 ml-2" />
      </motion.button>
    </motion.div>
  )
}

export default DailyChallenge