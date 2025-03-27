import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { ChevronUp, ChevronRight, ChevronDown, ChevronLeft, Star, RefreshCw } from 'lucide-react'

// Deterministic maze generation based on date seed
const generateDailyMaze = (width, height, difficulty, seed) => {
  // Create empty maze filled with walls
  const maze = Array(height).fill().map(() => Array(width).fill(1));
  
  // Seeded random function
  const seededRandom = (max, offset = 0) => {
    const x = Math.sin(seed + offset) * 10000;
    return Math.floor((x - Math.floor(x)) * max);
  };
  
  // Set start and end positions
  const startX = 1;
  const startY = 1;
  const endX = width - 2;
  const endY = height - 2;
  
  // Carve paths using recursive backtracking (seeded)
  const carvePath = (x, y, depth = 0) => {
    maze[y][x] = 0; // Mark as path
    
    // Directions: up, right, down, left
    const directions = [
      [0, -2], [2, 0], [0, 2], [-2, 0]
    ].sort(() => seededRandom(100, depth + x * y) / 100 - 0.5);
    
    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;
      
      if (nx > 0 && nx < width - 1 && ny > 0 && ny < height - 1 && maze[ny][nx] === 1) {
        maze[y + dy/2][x + dx/2] = 0; // Carve passage
        carvePath(nx, ny, depth + 1);
      }
    }
  };
  
  carvePath(startX, startY);
  
  // Ensure start and end are paths
  maze[startY][startX] = 0;
  maze[endY][endX] = 0;
  
  // Add collectibles based on difficulty
  const collectibles = [];
  const collectibleCount = difficulty === 1 ? 3 : difficulty === 2 ? 4 : difficulty === 3 ? 5 : difficulty === 4 ? 6 : 7;
  
  let placedCollectibles = 0;
  let attempts = 0;
  while (placedCollectibles < collectibleCount && attempts < 100) {
    attempts++;
    const x = seededRandom(width - 2, 500 + placedCollectibles) + 1;
    const y = seededRandom(height - 2, 600 + placedCollectibles) + 1;
    
    // Place collectible only on path cells, not at start or end
    if (maze[y][x] === 0 && !(x === startX && y === startY) && !(x === endX && y === endY)) {
      // Check if this position already has a collectible
      const alreadyExists = collectibles.some(item => item.x === x && item.y === y);
      if (!alreadyExists) {
        collectibles.push({ x, y });
        placedCollectibles++;
      }
    }
  }
  
  return {
    grid: maze,
    start: { x: startX, y: startY },
    end: { x: endX, y: endY },
    collectibles
  };
};

const DailyChallengeMaze = ({ difficulty = 3, onComplete }) => {
  const [maze, setMaze] = useState(null);
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0 });
  const [collectedItems, setCollectedItems] = useState([]);
  const [gameState, setGameState] = useState('ready'); // ready, playing, won
  const [moves, setMoves] = useState(0);
  const [mazeSize, setMazeSize] = useState({ width: 15, height: 15 });
  
  // Generate maze based on daily seed
  const initGame = useCallback(() => {
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    
    // Set maze size based on difficulty
    let size;
    switch(difficulty) {
      case 1: size = { width: 11, height: 11 }; break;
      case 2: size = { width: 13, height: 13 }; break;
      case 3: size = { width: 15, height: 15 }; break;
      case 4: size = { width: 17, height: 17 }; break;
      case 5: size = { width: 21, height: 21 }; break;
      default: size = { width: 15, height: 15 };
    }
    
    setMazeSize(size);
    const newMaze = generateDailyMaze(size.width, size.height, difficulty, seed);
    setMaze(newMaze);
    setPlayerPosition({ x: newMaze.start.x, y: newMaze.start.y });
    setCollectedItems([]);
    setMoves(0);
    setGameState('playing');
  }, [difficulty]);
  
  useEffect(() => {
    initGame();
  }, [initGame]);
  
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
        if (onComplete && typeof onComplete === 'function') {
          onComplete(moves, collectedItems.length, maze.collectibles.length);
        }
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

  if (!maze) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  const cellSize = Math.min(Math.floor(600 / mazeSize.width), 28);
  const playerSize = cellSize * 0.7;
  
  return (
    <div className="bg-surface-200 dark:bg-surface-800 rounded-xl p-4 overflow-hidden">
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
              width: playerSize, 
              height: playerSize,
              top: playerPosition.y * cellSize + (cellSize - playerSize) / 2,
              left: playerPosition.x * cellSize + (cellSize - playerSize) / 2
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
  );
};

export default DailyChallengeMaze;