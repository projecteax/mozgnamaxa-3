const fs = require('fs');
const path = require('path');

// Read app/page.tsx
const filePath = path.join(__dirname, 'app', 'page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// List of game components that need the isGameCompleted prop
const gamesList = [
  'connect',
  'sorting',
  'category-sorting',
  'memory',
  'spot-difference',
  'easter-basket',
  'easter-sequence',
  'maze',
  'sorting-2',
  'memory-5',
  'memory-3',
  'puzzle-assembly-2',
  'spot-difference-5',
  'memory-7',
  'category-sorting-3',
  'sequence-2',
  'find-missing',
  'sequential-order-2',
  'memory-4',
  'memory-match',
  'maze-3',
  'find-missing-half',
  'find-flipped-rabbit',
  'branch-sequence',
  'find-6-differences',
  'birds-puzzle',
  'memory-match-2x4',
  'sudoku',
  'pattern-completion',
  'find-incorrect-ladybug',
  'sequential-order-3'
];

// Update each game component call to include isGameCompleted prop
gamesList.forEach(gameName => {
  // Pattern to match the component call and add the prop before the closing />
  const pattern = new RegExp(
    `(currentGame === "${gameName}"[^}]+currentSeason={selectedSeason})([^}]*})`,
    'gs'
  );
  
  if (pattern.test(content)) {
    content = content.replace(pattern, `$1\n          isGameCompleted={isCurrentGameCompleted()}$2`);
    console.log(`Updated ${gameName} game component`);
  } else {
    console.log(`Pattern not found for ${gameName}`);
  }
});

// Write the updated content back
fs.writeFileSync(filePath, content);
console.log('Finished updating app/page.tsx');