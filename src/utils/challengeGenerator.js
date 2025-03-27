// Generate a random daily challenge based on the current date
export const generateDailyChallenge = () => {
  const today = new Date()
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()
  
  // Use the seed to generate pseudo-random values
  const seedRandom = (max, offset = 0) => {
    const x = Math.sin(seed + offset) * 10000
    return Math.floor((x - Math.floor(x)) * max)
  }

  // Challenge title options
  const titlePrefixes = [
    "Mystic", "Explorer's", "Treasure", "Hidden", "Secret", "Crystal", 
    "Enchanted", "Royal", "Dragon's", "Ancient", "Magical", "Jungle"
  ]
  
  const titleSuffixes = [
    "Maze", "Labyrinth", "Puzzle", "Challenge", "Quest", "Journey", 
    "Adventure", "Path", "Expedition", "Trail", "Voyage"
  ]

  // Generate title
  const title = `${titlePrefixes[seedRandom(titlePrefixes.length, 1)]} ${titleSuffixes[seedRandom(titleSuffixes.length, 2)]}`
  
  // Generate difficulty (1-5)
  const difficulty = (seedRandom(5, 3) + 1)
  
  // Estimated time based on difficulty
  const times = ["3 min", "5 min", "8 min", "10 min", "15 min"]
  const estimatedTime = times[difficulty - 1]
  
  // Objective pools
  const objectives = [
    "Complete the maze in the shortest time possible",
    "Collect all gems before reaching the exit",
    "Find the hidden key before unlocking the exit",
    "Navigate the maze without touching any walls",
    "Solve the puzzle with minimal moves",
    "Collect treasures in the correct order",
    "Find the secret passage to unlock bonus points",
    "Complete the maze while avoiding moving obstacles",
    "Reach the exit with at least 3 power-ups remaining",
    "Discover all hidden areas in the maze"
  ]
  
  // Select 2-3 objectives based on difficulty
  const numObjectives = Math.min(difficulty, 3)
  const selectedObjectives = []
  
  for (let i = 0; i < numObjectives; i++) {
    let objectiveIndex = seedRandom(objectives.length, 4 + i)
    while (selectedObjectives.includes(objectives[objectiveIndex])) {
      objectiveIndex = (objectiveIndex + 1) % objectives.length
    }
    selectedObjectives.push(objectives[objectiveIndex])
  }
  
  // Generate reward points based on difficulty
  const rewardPoints = 50 * difficulty + seedRandom(50, 7)
  
  // Generate description
  const descriptions = [
    `Today's special maze adventure with increasing challenges.`,
    `A unique puzzle that will test your navigation skills.`,
    `Can you master this tricky labyrinth before time runs out?`,
    `A clever maze with surprising twists and turns.`,
    `Navigate carefully through this challenging puzzle maze.`
  ]
  
  return {
    title,
    description: descriptions[seedRandom(descriptions.length, 8)],
    difficulty,
    estimatedTime,
    objectives: selectedObjectives,
    rewardPoints,
    date: today.toDateString()
  }
}