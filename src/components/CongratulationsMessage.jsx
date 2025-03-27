import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Award, RefreshCw } from 'lucide-react';

const CongratulationsMessage = ({ 
  moves, 
  collectedItems, 
  totalCollectibles, 
  onPlayAgain, 
  onChangeDifficulty, 
  currentDifficulty 
}) => {
  const [confetti, setConfetti] = useState([]);
  
  // Generate confetti pieces on mount
  useEffect(() => {
    const colors = ['bg-yellow-400', 'bg-primary', 'bg-green-500', 'bg-accent', 'bg-purple-500', 'bg-secondary'];
    const shapes = ['rounded-full', 'rounded-sm', 'rounded'];
    const newConfetti = [];
    
    for (let i = 0; i < 50; i++) {
      newConfetti.push({
        id: i,
        color: colors[Math.floor(Math.random() * colors.length)],
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        x: Math.random() * 100,
        y: -20 - Math.random() * 100,
        size: 5 + Math.random() * 15,
        rotation: Math.random() * 360,
      });
    }
    
    setConfetti(newConfetti);
  }, []);

  // Determine the performance message based on moves and collected items
  const getPerformanceMessage = () => {
    const collectionRatio = collectedItems / totalCollectibles;
    
    if (collectionRatio === 1 && moves < 50) {
      return "Amazing! You're a maze master!";
    } else if (collectionRatio > 0.7) {
      return "Great job! You're a star collector!";
    } else if (collectionRatio > 0.4) {
      return "Good work! Keep practicing!";
    } else {
      return "You completed the maze! Try collecting more stars next time!";
    }
  };

  const nextDifficulty = currentDifficulty === 'easy' ? 'Medium' : currentDifficulty === 'medium' ? 'Hard' : 'Easy';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4 overflow-hidden"
    >
      {/* Confetti animation */}
      {confetti.map((piece) => (
        <motion.div
          key={piece.id}
          className={`absolute ${piece.color} ${piece.shape}`}
          initial={{ 
            x: `${piece.x}vw`, 
            y: `${piece.y}vh`, 
            rotate: 0,
            opacity: 1
          }}
          animate={{ 
            y: '120vh', 
            x: `${piece.x - 10 + Math.random() * 20}vw`,
            rotate: piece.rotation,
            opacity: 0
          }}
          transition={{ 
            duration: 4 + Math.random() * 3,
            ease: "easeOut",
            delay: Math.random() * 0.5
          }}
          style={{ 
            width: piece.size, 
            height: piece.size
          }}
        />
      ))}

      <motion.div
        initial={{ scale: 0.8, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 20 }}
        className="bg-surface-50 dark:bg-surface-800 rounded-2xl p-8 max-w-md w-full shadow-lg relative overflow-hidden"
      >
        <div className="text-center relative z-10">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ duration: 0.6, type: "spring" }}
            className="w-24 h-24 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
          >
            <Trophy className="w-12 h-12 text-white" />
          </motion.div>
          
          <motion.h2 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold mb-2 text-glow bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
          >
            Congratulations!
          </motion.h2>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <p className="text-surface-700 dark:text-surface-300 mb-3 font-medium">
              {getPerformanceMessage()}
            </p>
            
            <div className="flex justify-center items-center space-x-2 mb-6">
              <div className="flex items-center bg-surface-200 dark:bg-surface-700 px-4 py-2 rounded-full">
                <Award className="w-5 h-5 mr-2 text-accent" />
                <span>{moves} moves</span>
              </div>
              
              <div className="flex items-center bg-surface-200 dark:bg-surface-700 px-4 py-2 rounded-full">
                <Star className="w-5 h-5 mr-2 text-yellow-500" />
                <span>{collectedItems} of {totalCollectibles}</span>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onPlayAgain}
              className="btn btn-primary"
            >
              <RefreshCw className="mr-2 h-5 w-5" />
              Play Again
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onChangeDifficulty}
              className="btn btn-secondary"
            >
              Try {nextDifficulty} Level
            </motion.button>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-6 text-sm text-surface-500 dark:text-surface-400"
          >
            Keep exploring to improve your maze-solving skills!
          </motion.div>
        </div>
        
        {/* Background decoration elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-2 -right-2 w-16 h-16 bg-yellow-400 opacity-20 rounded-full"></div>
          <div className="absolute bottom-10 -left-4 w-20 h-20 bg-primary opacity-10 rounded-full"></div>
          <div className="absolute bottom-4 right-8 w-8 h-8 bg-secondary opacity-20 rounded-full"></div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CongratulationsMessage;