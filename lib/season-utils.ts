/**
 * Utility functions for managing season order and unlocking logic
 */

export type Season = 'wiosna' | 'lato' | 'jesien' | 'zima'

export interface SeasonInfo {
  id: Season
  name: string
  englishName: string
  color: string
  description: string
}

export const SEASON_INFO: Record<Season, SeasonInfo> = {
  wiosna: {
    id: 'wiosna',
    name: 'WIOSNA',
    englishName: 'spring',
    color: '#539e1b',
    description: 'Czas na wiosenne odkrycia!'
  },
  lato: {
    id: 'lato',
    name: 'LATO',
    englishName: 'summer',
    color: '#ffc402',
    description: 'Czas na letnie przygody!'
  },
  jesien: {
    id: 'jesien',
    name: 'JESIEŃ',
    englishName: 'autumn',
    color: '#ed6b19',
    description: 'Czas na jesienne odkrycia!'
  },
  zima: {
    id: 'zima',
    name: 'ZIMA',
    englishName: 'winter',
    color: '#00abc6',
    description: 'Czas na zimowe odkrycia!'
  }
}

/**
 * Get the ordered list of seasons starting from the initial season
 * @param initialSeason - The season to start with
 * @returns Array of seasons in order
 */
export function getSeasonOrder(initialSeason: Season): Season[] {
  const seasons: Season[] = ['wiosna', 'lato', 'jesien', 'zima']
  const initialIndex = seasons.indexOf(initialSeason)
  
  if (initialIndex === -1) {
    // Fallback to default order if invalid season
    return seasons
  }
  
  // Reorder: start from initialSeason, then continue in natural order
  return [
    ...seasons.slice(initialIndex), // From initial season to end
    ...seasons.slice(0, initialIndex) // From beginning to initial season
  ]
}

/**
 * Get season info by season ID
 * @param seasonId - The season identifier
 * @returns Season information object
 */
export function getSeasonInfo(seasonId: Season): SeasonInfo {
  return SEASON_INFO[seasonId]
}

/**
 * Convert Polish season name to English for database storage
 * @param polishSeason - Polish season name
 * @returns English season name
 */
export function convertSeasonToEnglish(polishSeason: Season): string {
  return SEASON_INFO[polishSeason]?.englishName || 'spring'
}

/**
 * Convert English season name to Polish
 * @param englishSeason - English season name
 * @returns Polish season name
 */
export function convertSeasonToPolish(englishSeason: string): Season {
  const mapping: Record<string, Season> = {
    'spring': 'wiosna',
    'summer': 'lato',
    'autumn': 'jesien',
    'winter': 'zima'
  }
  return mapping[englishSeason] || 'wiosna'
}

/**
 * Check if a season should be unlocked based on completion progress
 * @param seasonOrder - Ordered array of seasons
 * @param currentSeasonIndex - Index of season to check
 * @param gameResults - Student's game completion data
 * @returns true if season should be unlocked
 */
export function shouldUnlockSeason(
  seasonOrder: Season[], 
  currentSeasonIndex: number, 
  gameResults: any
): boolean {
  // First season is always unlocked
  if (currentSeasonIndex === 0) {
    return true
  }
  
  // Check if previous season is completed
  const previousSeason = seasonOrder[currentSeasonIndex - 1]
  return isSeasonCompleted(previousSeason, gameResults)
}

/**
 * Check if a season is completed (has sufficient game completions)
 * @param season - Season to check
 * @param gameResults - Student's game completion data
 * @returns true if season is completed
 */
export function isSeasonCompleted(season: Season, gameResults: any): boolean {
  if (!gameResults) return false
  
  const englishSeason = convertSeasonToEnglish(season)
  let completedGamesCount = 0
  
  // Count completed games for this season
  Object.keys(gameResults).forEach(gameKey => {
    if (gameKey.endsWith(`-${englishSeason}`) && gameResults[gameKey]?.completed > 0) {
      completedGamesCount++
    }
  })
  
  // Consider a season completed if at least 30 games are completed (out of 36 total)
  const GAMES_REQUIRED_FOR_COMPLETION = 30
  return completedGamesCount >= GAMES_REQUIRED_FOR_COMPLETION
}

/**
 * Calculate which seasons should be unlocked for a student
 * @param seasonOrder - Ordered array of seasons for this student
 * @param gameResults - Student's game completion data
 * @returns Array of unlocked season IDs
 */
export function calculateUnlockedSeasons(seasonOrder: Season[], gameResults: any): Season[] {
  const unlockedSeasons: Season[] = []
  
  for (let i = 0; i < seasonOrder.length; i++) {
    const season = seasonOrder[i]
    
    if (shouldUnlockSeason(seasonOrder, i, gameResults)) {
      unlockedSeasons.push(season)
    } else {
      // Stop when we hit the first locked season
      break
    }
  }
  
  // Always ensure at least the first season is unlocked
  if (unlockedSeasons.length === 0 && seasonOrder.length > 0) {
    unlockedSeasons.push(seasonOrder[0])
  }
  
  return unlockedSeasons
}

/**
 * Get the next season that should be unlocked
 * @param seasonOrder - Ordered array of seasons
 * @param unlockedSeasons - Currently unlocked seasons
 * @returns Next season to unlock, or null if all are unlocked
 */
export function getNextSeasonToUnlock(seasonOrder: Season[], unlockedSeasons: Season[]): Season | null {
  for (const season of seasonOrder) {
    if (!unlockedSeasons.includes(season)) {
      return season
    }
  }
  return null // All seasons are unlocked
}

/**
 * Validate if a season ID is valid
 * @param seasonId - Season identifier to validate
 * @returns true if valid season
 */
export function isValidSeason(seasonId: string): seasonId is Season {
  return ['wiosna', 'lato', 'jesien', 'zima'].includes(seasonId)
}
