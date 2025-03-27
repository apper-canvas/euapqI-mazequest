import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RefreshCw, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Award, Star, Home } from 'lucide-react'
import CongratulationsMessage from './CongratulationsMessage'

// Maze generation algorithm (simplified for MVP)
const generateMaze = (width, height, difficulty) => {
  // Create empty maze filled with walls
  const maze = Array(height).fill().map(() => Array(width).fill(1));
  
  // Set start and end positions
  const startX = 1;
  const startY = 1;
  const endX = width - 2;
  const endY = height - 2;
  
  // Carve paths using recursive backtracking (simplified)
  const carvePath = (x, y) => {
    maze[y][x] = 0; // Mark as path
    
    // Directions: up, right, down, left
    const directions = [
      [0, -2], [2, 0], [0, 2], [-2, 0]
    ].sort(() => Math.random() - 0.5);
    
    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;
      
      if (nx > 0 && nx < width - 1 && ny > 0 && ny < height - 1 && maze[ny][nx] === 1) {
        maze[y + dy/2][x + dx/2] = 0; // Carve passage
        carvePath(nx, ny);
      }
    }
  };
  
  carvePath(startX, startY);
  
  // Ensure start and end are paths
  maze[startY][startX] = 0;
  maze[endY][endX] = 0;
  
  // Add collectibles based on difficulty
  const collectibles = [];
  const collectibleCount = difficulty === 'easy' ? 3 : difficulty === 'medium' ? 5 : 7;
  
  let placedCollectibles = 0;
  while (placedCollectibles < collectibleCount) {
    const x = Math.floor(Math.random() * (width - 2)) + 1;
    const y = Math.floor(Math.random() * (height - 2)) + 1;
    
    // Place collectible only on path cells, not at start or end
    if (maze[y][x] === 0 && !(x === startX && y === startY) && !(x === endX && y === endY)) {
      collectibles.push({ x, y });
      placedCollectibles++;
    }
  }
  
  return {
    grid: maze,
    start: { x: startX, y: startY },
    end: { x: endX, y: endY },
    collectibles
  };
};

const MainFeature = () => {
  const [difficulty, setDifficulty] = useState('easy');
  const [maze, setMaze] = useState(null);
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0 });
  const [collectedItems, setCollectedItems] = useState([]);
  const [gameState, setGameState] = useState('ready'); // ready, playing, won
  const [moves, setMoves] = useState(0);
  const [mazeSize, setMazeSize] = useState({ width: 11, height: 11 });
  
  // Initialize or reset the game
  const initGame = useCallback(() => {
    const sizes = {
      'easy': { width: 11, height: 11 },
      'medium': { width: 15, height: 15 },
      'hard': { width: 21, height: 21 }
    };
    
    setMazeSize(sizes[difficulty]);
    const newMaze = generateMaze(sizes[difficulty].width, sizes[difficulty].height, difficulty);
    setMaze(newMaze);
    setPlayerPosition({ x: newMaze.start.x, y: newMaze.start.y });
    setCollectedItems([]);
    setMoves(0);
    setGameState('playing');
  }, [difficulty]);
  
  useEffect(() => {
    initGame();
  }, [difficulty, initGame]);
  
  // Handle keyboard movement
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameState !== 'playing') return;
      
      let newX = playerPosition.x;
      let newY = playerPosition.y;
      
      switch (e.key) {
        case 'ArrowUp':
          newY--;
          break;
        case 'ArrowRight':
          newX++;
          break;
        case 'ArrowDown':
          newY++;
          break;
        case 'ArrowLeft':
          newX--;
          break;
        default:
          return;
      }
      
      movePlayer(newX, newY);
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playerPosition, maze, gameState]);
  
  // Handle player movement
  const movePlayer = (newX, newY) => {
    if (!maze || gameState !== 'playing') return;
    
    // Check if the new position is valid (not a wall)
    if (newX >= 0 && newX < mazeSize.width && newY >= 0 && newY < mazeSize.height && maze.grid[newY][newX] === 0) {
      setPlayerPosition({ x: newX, y: newY });
      setMoves(moves + 1);
      
      // Check for collectibles
      const collectibleIndex = maze.collectibles.findIndex(item => item.x === newX && item.y === newY);
      if (collectibleIndex !== -1 && !collectedItems.includes(collectibleIndex)) {
        setCollectedItems([...collectedItems, collectibleIndex]);
      }
      
      // Check if player reached the end
      if (newX === maze.end.x && newY === maze.end.y) {
        setGameState('won');
      }
    }
  };
  
  // Handle directional button clicks
  const handleDirectionClick = (direction) => {
    if (gameState !== 'playing') return;
    
    let newX = playerPosition.x;
    let newY = playerPosition.y;
    
    switch (direction) {
      case 'up':
        newY--;
        break;
      case 'right':
        newX++;
        break;
      case 'down':
        newY++;
        break;
      case 'left':
        newX--;
        break;
      default:
        return;
    }
    
    movePlayer(newX, newY);
  };

  const handleChangeDifficulty = () => {
    setDifficulty(difficulty === 'easy' ? 'medium' : difficulty === 'medium' ? 'hard' : 'easy');
    setTimeout(initGame, 100);
  };
  
  if (!maze) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  const cellSize = Math.min(Math.floor(600 / mazeSize.width), 40);
  
  return (
    <div className="flex flex-col items-center">
      <motion.h1 
        className="text-3xl md:text-4xl font-bold mb-6 text-center"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          MazeQuest Adventure
        </span>
      </motion.h1>
      
      <div className="w-full max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <div className="bg-surface-100 dark:bg-surface-800 rounded-2xl p-4 shadow-neu-light dark:shadow-neu-dark overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-accent" />
                <span className="font-medium">Collected: {collectedItems.length}/{maze.collectibles.length}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="font-medium">Moves: {moves}</span>
              </div>
            </div>
            
            <div className="flex justify-center mb-6">
              <div 
                className="relative border-4 border-surface-300 dark:border-surface-600 rounded-xl overflow-hidden"
                style={{ 
                  width: `${cellSize * mazeSize.width}px`, 
                  height: `${cellSize * mazeSize.height}px` 
                }}
              >
                {/* Render maze grid */}
                {maze.grid.map((row, y) => (
                  <div key={y} className="flex">
                    {row.map((cell, x) => {
                      const isStart = x === maze.start.x && y === maze.start.y;
                      const isEnd = x === maze.end.x && y === maze.end.y;
                      const isCollectible = maze.collectibles.some((item, index) => 
                        item.x === x && item.y === y && !collectedItems.includes(index)
                      );
                      
                      let cellClass = cell === 1 ? 'maze-wall' : 'maze-path';
                      if (isStart) cellClass = 'maze-start';
                      if (isEnd) cellClass = 'maze-end';
                      if (isCollectible) cellClass = 'maze-collectible';
                      
                      return (
                        <div 
                          key={`${x}-${y}`} 
                          className={`maze-cell ${cellClass}`}
                          style={{ width: cellSize, height: cellSize }}
                        ></div>
                      );
                    })}
                  </div>
                ))}
                
                {/* Player */}
                <motion.div 
                  className="maze-player absolute"
                  style={{ 
                    width: cellSize * 0.7, 
                    height: cellSize * 0.7,
                    top: playerPosition.y * cellSize + (cellSize * 0.15),
                    left: playerPosition.x * cellSize + (cellSize * 0.15)
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                ></motion.div>
              </div>
            </div>
            
            {/* Mobile controls */}
            <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
              <div></div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => handleDirectionClick('up')}
                className="p-3 bg-primary text-white rounded-xl flex justify-center"
                disabled={gameState !== 'playing'}
              >
                <ChevronUp className="w-6 h-6" />
              </motion.button>
              <div></div>
              
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => handleDirectionClick('left')}
                className="p-3 bg-primary text-white rounded-xl flex justify-center"
                disabled={gameState !== 'playing'}
              >
                <ChevronLeft className="w-6 h-6" />
              </motion.button>
              
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => initGame()}
                className="p-3 bg-accent text-surface-800 rounded-xl flex justify-center"
              >
                <RefreshCw className="w-6 h-6" />
              </motion.button>
              
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => handleDirectionClick('right')}
                className="p-3 bg-primary text-white rounded-xl flex justify-center"
                disabled={gameState !== 'playing'}
              >
                <ChevronRight className="w-6 h-6" />
              </motion.button>
              
              <div></div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => handleDirectionClick('down')}
                className="p-3 bg-primary text-white rounded-xl flex justify-center"
                disabled={gameState !== 'playing'}
              >
                <ChevronDown className="w-6 h-6" />
              </motion.button>
              <div></div>
            </div>
          </div>
        </div>
        
        <div>
          <div className="bg-surface-100 dark:bg-surface-800 rounded-2xl p-6 shadow-neu-light dark:shadow-neu-dark h-full">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Award className="w-5 h-5 mr-2 text-primary" />
              Game Settings
            </h2>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Difficulty</h3>
              <div className="flex flex-col space-y-2">
                {['easy', 'medium', 'hard'].map((level) => (
                  <button
                    key={level}
                    onClick={() => setDifficulty(level)}
                    className={`difficulty-btn ${difficulty === level ? 'difficulty-btn-active' : 'bg-surface-200 dark:bg-surface-700'}`}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2">Instructions</h3>
              <ul className="text-sm text-surface-600 dark:text-surface-400 space-y-2">
                <li>• Use arrow keys or buttons to move</li>
                <li>• Collect all stars for bonus points</li>
                <li>• Find your way to the red exit</li>
                <li>• Press the refresh button to restart</li>
              </ul>
            </div>
            
            <div className="text-sm text-surface-500 dark:text-surface-400 italic">
              Tip: Try different difficulty levels for bigger mazes and more challenges!
            </div>
          </div>
        </div>
      </div>
      
      {/* Win modal with enhanced congratulations message */}
      <AnimatePresence>
        {gameState === 'won' && (
          <CongratulationsMessage 
            moves={moves}
            collectedItems={collectedItems.length}
            totalCollectibles={maze.collectibles.length}
            onPlayAgain={initGame}
            onChangeDifficulty={handleChangeDifficulty}
            currentDifficulty={difficulty}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default MainFeature