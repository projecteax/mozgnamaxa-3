const fs = require('fs');
const path = require('path');

// List of game components that need the isGameCompleted prop
const gameComponents = [
  'connect-game',
  'sorting-game', 
  'category-sorting-game',
  'memory-game',
  'spot-difference-game',
  'easter-basket-game',
  'easter-sequence-game',
  'maze-game',
  'sorting-game-2',
  'memory-game-5',
  'memory-game-3',
  'puzzle-assembly-game-2',
  'spot-difference-game-5',
  'memory-game-7',
  'category-sorting-game-3',
  'sequence-game-2',
  'find-missing-game',
  'sequential-order-game-2',
  'memory-game-4',
  'memory-match-game',
  'maze-game-3',
  'find-missing-half-game',
  'find-flipped-rabbit-game',
  'branch-sequence-game',
  'find-6-differences-game',
  'birds-puzzle-game',
  'memory-match-game-2x4',
  'sudoku-game',
  'pattern-completion-game',
  'find-incorrect-ladybug-game',
  'sequential-order-game-3'
];

// Map component file names to their interface names
const interfaceMap = {
  'connect-game': 'ConnectGameProps',
  'sorting-game': 'SortingGameProps',
  'category-sorting-game': 'CategorySortingGameProps',
  'memory-game': 'MemoryGameProps',
  'spot-difference-game': 'SpotDifferenceGameProps',
  'easter-basket-game': 'EasterBasketGameProps',
  'easter-sequence-game': 'EasterSequenceGameProps',
  'maze-game': 'MazeGameProps',
  'sorting-game-2': 'SortingGame2Props',
  'memory-game-5': 'MemoryGame5Props',
  'memory-game-3': 'MemoryGame3Props',
  'puzzle-assembly-game-2': 'PuzzleAssemblyGame2Props',
  'spot-difference-game-5': 'SpotDifferenceGame5Props',
  'memory-game-7': 'MemoryGame7Props',
  'category-sorting-game-3': 'CategorySortingGame3Props',
  'sequence-game-2': 'SequenceGame2Props',
  'find-missing-game': 'FindMissingGameProps',
  'sequential-order-game-2': 'SequentialOrderGame2Props',
  'memory-game-4': 'MemoryGame4Props',
  'memory-match-game': 'MemoryMatchGameProps',
  'maze-game-3': 'MazeGame3Props',
  'find-missing-half-game': 'FindMissingHalfGameProps',
  'find-flipped-rabbit-game': 'FindFlippedRabbitGameProps',
  'branch-sequence-game': 'BranchSequenceGameProps',
  'find-6-differences-game': 'Find6DifferencesGameProps',
  'birds-puzzle-game': 'BirdsPuzzleGameProps',
  'memory-match-game-2x4': 'MemoryMatchGame2x4Props',
  'sudoku-game': 'SudokuGameProps',
  'pattern-completion-game': 'PatternCompletionGameProps',
  'find-incorrect-ladybug-game': 'FindIncorrectLadybugGameProps',
  'sequential-order-game-3': 'SequentialOrderGame3Props'
};

function updateGameComponent(componentName) {
  const filePath = path.join(__dirname, 'components', `${componentName}.tsx`);
  
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return false;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Get the interface name
  const interfaceName = interfaceMap[componentName];
  if (!interfaceName) {
    console.log(`No interface mapping found for ${componentName}`);
    return false;
  }

  // Add isGameCompleted prop to interface
  const interfaceRegex = new RegExp(`(interface ${interfaceName}\\s*{[^}]*currentSeason\\?:\\s*string)`, 'g');
  if (interfaceRegex.test(content)) {
    content = content.replace(interfaceRegex, '$1\n  isGameCompleted?: boolean');
    modified = true;
  }

  // Update function signature
  const functionRegex = new RegExp(`(export default function \\w+\\([^)]*currentSeason = "wiosna")([^}]*})`, 'g');
  if (functionRegex.test(content)) {
    content = content.replace(functionRegex, '$1, isGameCompleted = false$2');
    modified = true;
  }

  // Update DALEJ button logic - find various patterns used in different components
  const dalejPatterns = [
    /(\(userLoggedIn && !)(isCompleted|gameCompleted|allMatched|completed)(\) \? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:scale-105')/g,
    /(\(userLoggedIn && !)(isCompleted|gameCompleted|allMatched|completed)(\) \? undefined : onNext)/g
  ];

  dalejPatterns.forEach(pattern => {
    if (pattern.test(content)) {
      content = content.replace(pattern, '$1isGameCompleted$3');
      modified = true;
    }
  });

  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`Updated ${componentName}.tsx`);
    return true;
  } else {
    console.log(`No changes needed for ${componentName}.tsx`);
    return false;
  }
}

// Update all game components
console.log('Updating game components with isGameCompleted prop...');
gameComponents.forEach(componentName => {
  updateGameComponent(componentName);
});

console.log('Finished updating game components.');