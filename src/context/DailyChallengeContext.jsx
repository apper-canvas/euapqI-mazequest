import { createContext, useContext, useState, useCallback } from 'react'
import { generateDailyChallenge } from '../utils/challengeGenerator'

const DailyChallengeContext = createContext()

export const useDailyChallenge = () => useContext(DailyChallengeContext)

export const DailyChallengeProvider = ({ children }) => {
  const [todayChallenge, setTodayChallenge] = useState(null)
  const [isCompleted, setIsCompleted] = useState(false)
  const [streakCount, setStreakCount] = useState(0)

  const loadChallenge = useCallback(() => {
    // Check if we already loaded the challenge today
    const today = new Date().toDateString()
    const savedData = localStorage.getItem('dailyChallengeData')
    
    if (savedData) {
      const parsedData = JSON.parse(savedData)
      
      if (parsedData.date === today) {
        setTodayChallenge(parsedData.challenge)
        setIsCompleted(parsedData.completed)
        setStreakCount(parsedData.streak || 0)
        return
      }
    }
    
    // It's a new day, generate new challenge
    const newChallenge = generateDailyChallenge()
    setTodayChallenge(newChallenge)
    setIsCompleted(false)
    
    // Check if the last completion was yesterday to maintain streak
    if (savedData) {
      const parsedData = JSON.parse(savedData)
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      
      if (parsedData.date === yesterday.toDateString() && parsedData.completed) {
        // Maintain streak
        setStreakCount(parsedData.streak || 0)
      } else if (parsedData.date !== today) {
        // Reset streak if more than one day has passed
        setStreakCount(0)
      }
    }
    
    // Save the new challenge data
    localStorage.setItem('dailyChallengeData', JSON.stringify({
      date: today,
      challenge: newChallenge,
      completed: false,
      streak: streakCount
    }))
  }, [streakCount])

  const completeChallenge = useCallback(() => {
    setIsCompleted(true)
    // Update streak count
    const newStreak = streakCount + 1
    setStreakCount(newStreak)
    
    // Save to localStorage
    const today = new Date().toDateString()
    localStorage.setItem('dailyChallengeData', JSON.stringify({
      date: today,
      challenge: todayChallenge,
      completed: true,
      streak: newStreak
    }))
  }, [streakCount, todayChallenge])

  const value = {
    todayChallenge,
    isCompleted,
    streakCount,
    loadChallenge,
    completeChallenge,
  }

  return (
    <DailyChallengeContext.Provider value={value}>
      {children}
    </DailyChallengeContext.Provider>
  )
}