const fs = require('fs');
const path = require('path');

// List of SVG files that should NOT have drop shadows (UI elements, backgrounds, etc.)
const excludeFromShadows = [
  // UI Elements
  'title_box_small.png', 'title_box_small_summer.svg', 'title_box_small_autumn.svg', 'title_box_small_winter.svg',
  'button_background.svg', 'button_dalej.svg', 'button_jeszcze_raz.svg', 'button_wroc_dalej.svg',
  'menu_background.svg', 'menu_button.svg',
  'sound_icon.svg', 'sound_button.svg',
  
  // Dragons and Characters
  'dragon_summer.svg', 'dragon_autumn.svg', 'dragon_winter.svg', 'dragon_spring.svg',
  'dragon_speech.svg', 'dragon_talking.svg',
  
  // Clouds and Speech
  'cloud_text.svg', 'cloud_speech.svg', 'speech_bubble.svg',
  
  // Puzzle and Maze specific
  'puzzle_piece.svg', 'puzzle_background.svg', 'puzzle_frame.svg',
  'maze_background.svg', 'maze_path.svg', 'maze_wall.svg',
  'sudoku_grid.svg', 'sudoku_cell.svg',
  
  // Backgrounds and Frames
  'background_summer.svg', 'background_autumn.svg', 'background_winter.svg', 'background_spring.svg',
  'frame.svg', 'border.svg', 'container.svg',
  
  // Navigation and UI
  'arrow_left.svg', 'arrow_right.svg', 'arrow_up.svg', 'arrow_down.svg',
  'close_button.svg', 'minimize_button.svg', 'maximize_button.svg',
  'progress_bar.svg', 'progress_fill.svg',
  
  // Seasonal UI elements
  'season_icon_summer.svg', 'season_icon_autumn.svg', 'season_icon_winter.svg', 'season_icon_spring.svg'
];

// Games to process
const gamesToProcess = [
  'matching-game', 'sequence-game', 'butterfly-pairs-game', 'odd-one-out-game', 'connect-game', 
  'sorting-game', 'category-sorting-game', 'memory-game', 'spot-difference-game', 'easter-basket-game', 
  'easter-sequence-game', 'maze-game', 'sorting-game-2', 'memory-game-5', 'memory-game-3', 'memory-game-7', 
  'category-sorting-game-3', 'sequence-game-2', 'sequential-order-game-2', 'memory-game-4', 'memory-match-game', 
  'maze-game-3', 'find-flipped-rabbit-game', 'branch-sequence-game', 'memory-match-game-2x4', 'sudoku-game', 
  'pattern-completion-game', 'find-incorrect-ladybug-game', 'sequential-order-game-3'
];

// Function to check if an SVG should be excluded from shadows
function shouldExcludeFromShadows(imagePath) {
  if (!imagePath) return true; // Exclude if no path
  
  const fileName = path.basename(imagePath);
  
  // Check exact matches
  if (excludeFromShadows.includes(fileName)) {
    return true;
  }
  
  // Check for patterns in filename
  const excludePatterns = [
    'box', 'title', 'button', 'menu', 'sound', 'dragon', 'cloud', 'puzzle', 'maze', 'sudoku',
    'background', 'frame', 'border', 'container', 'arrow', 'close', 'minimize', 'maximize',
    'progress', 'season_icon'
  ];
  
  return excludePatterns.some(pattern => fileName.toLowerCase().includes(pattern));
}

// Function to add drop-shadow CSS class to Image components
function addDropShadowToGame(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    let imagesProcessed = 0;
    let imagesUpdated = 0;
    
    // Pattern to match Image components with src attributes
    const imagePattern = /<Image\s+([^>]*?)src=["']([^"']*?)["']([^>]*?)>/g;
    
    content = content.replace(imagePattern, (match, beforeSrc, src, afterSrc) => {
      imagesProcessed++;
      
      // Skip if this SVG should be excluded from shadows
      if (shouldExcludeFromShadows(src)) {
        return match;
      }
      
      // Check if className already exists and has drop-shadow
      const fullMatch = beforeSrc + afterSrc;
      if (fullMatch.includes('className=')) {
        const classNamePattern = /className=["']([^"']*?)["']/;
        const classNameMatch = fullMatch.match(classNamePattern);
        
        if (classNameMatch) {
          const existingClasses = classNameMatch[1];
          if (!existingClasses.includes('drop-shadow')) {
            const newClasses = existingClasses + ' drop-shadow-lg';
            const newMatch = match.replace(classNamePattern, `className="${newClasses}"`);
            modified = true;
            imagesUpdated++;
            return newMatch;
          }
        }
      } else {
        // Add new className with drop-shadow
        const newMatch = match.replace('>', ' className="drop-shadow-lg">');
        modified = true;
        imagesUpdated++;
        return newMatch;
      }
      
      return match;
    });
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Updated: ${filePath} (${imagesUpdated}/${imagesProcessed} images)`);
      return { updated: true, processed: imagesProcessed, updated: imagesUpdated };
    } else {
      console.log(`⏭️  No changes needed: ${filePath} (${imagesProcessed} images checked)`);
      return { updated: false, processed: imagesProcessed, updated: 0 };
    }
    
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
    return { updated: false, processed: 0, updated: 0 };
  }
}

// Function to process all games
function processAllGames() {
  console.log('🎨 Adding drop shadows to game content SVG images...\n');
  console.log(`📋 Processing ${gamesToProcess.length} games`);
  console.log(`🚫 Excluding ${excludeFromShadows.length} specific UI elements + pattern-based exclusions\n`);
  
  let totalUpdated = 0;
  let totalProcessed = 0;
  let totalImagesProcessed = 0;
  let totalImagesUpdated = 0;
  
  gamesToProcess.forEach(gameName => {
    const filePath = path.join(__dirname, 'components', `${gameName}.tsx`);
    
    if (fs.existsSync(filePath)) {
      console.log(`📁 Processing: ${gameName}`);
      const result = addDropShadowToGame(filePath);
      if (result.updated) totalUpdated++;
      totalProcessed++;
      totalImagesProcessed += result.processed;
      totalImagesUpdated += result.updated;
    } else {
      console.log(`⚠️  File not found: ${filePath}`);
    }
  });
  
  console.log(`\n🎉 Processing complete!`);
  console.log(`📊 Summary:`);
  console.log(`   - Games processed: ${totalProcessed}`);
  console.log(`   - Games updated: ${totalUpdated}`);
  console.log(`   - Games unchanged: ${totalProcessed - totalUpdated}`);
  console.log(`   - Total images checked: ${totalImagesProcessed}`);
  console.log(`   - Total images updated: ${totalImagesUpdated}`);
  
  console.log(`\n💡 Note: Drop shadows were added to all SVG images EXCEPT:`);
  console.log(`   - UI elements (buttons, menus, dragons, clouds, etc.)`);
  console.log(`   - Backgrounds and frames`);
  console.log(`   - Navigation elements`);
  console.log(`   - Images that already have drop-shadow CSS classes`);
}

// Run the script
processAllGames();
