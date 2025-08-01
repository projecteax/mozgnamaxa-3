const fs = require('fs');
const path = require('path');

// Function to update a congratulations page
function updateCongratulationsPage(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace SoundButton import with SoundButtonEnhanced
  content = content.replace(
    /import SoundButton from "\.\/sound-button"/g,
    'import SoundButtonEnhanced from "./sound-button-enhanced"'
  );
  
  // Add getThemeColors import
  content = content.replace(
    /const \{ selectedSeason \} = useSeason\(\)/g,
    'const { selectedSeason, getThemeColors } = useSeason()\n  const theme = getThemeColors()'
  );
  
  // Replace SoundButton with SoundButtonEnhanced
  content = content.replace(
    /<SoundButton /g,
    '<SoundButtonEnhanced '
  );
  
  // Replace hardcoded sound icon with theme.soundIcon
  content = content.replace(
    /soundIcon="\/images\/sound_icon_dragon_page\.svg"/g,
    'soundIcon={theme.soundIcon}'
  );
  
  // Replace hardcoded button color with theme.buttonColor
  content = content.replace(
    /<span className="text-\[#539e1b\] font-bold text-2xl">START<\/span>/g,
    '<span className="font-bold text-2xl" style={{ color: theme.buttonColor }}>START</span>'
  );
  
  // Fix background color to use style instead of className
  content = content.replace(
    /className=\{`w-full h-screen \${\w+\.bgColor} flex items-center justify-center px-12 overflow-hidden`\}/g,
    'className="w-full h-screen flex items-center justify-center px-12 overflow-hidden"\n      style={{ backgroundColor: seasonContent.bgColor }}'
  );
  
  fs.writeFileSync(filePath, content);
  console.log(`Updated ${filePath}`);
}

// Update all congratulations pages
const congratulationsPages = [
  'components/congratulations-page-4.tsx',
  'components/congratulations-page-5.tsx',
  'components/congratulations-page-6.tsx',
  'components/congratulations-page-7.tsx',
  'components/congratulations-page-8.tsx',
  'components/congratulations-page-9.tsx',
  'components/congratulations-page-10.tsx',
  'components/congratulations-page-11.tsx',
  'components/congratulations-page-12.tsx',
  'components/congratulations-page-13.tsx'
];

congratulationsPages.forEach(page => {
  if (fs.existsSync(page)) {
    updateCongratulationsPage(page);
  }
});

console.log('All congratulations pages updated!'); 