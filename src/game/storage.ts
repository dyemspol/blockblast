import type { GameStats, Settings } from './types';

const STORAGE_KEYS = {
  STATS: 'blockblast_stats_v2',
  SETTINGS: 'blockblast_settings_v2',
};

const DEFAULT_STATS: GameStats = {
  gamesPlayed: 0,
  bestScore: 0,
  totalLinesCleared: 0,
  maxCombo: 0,
  totalBoardClears: 0,
  unlockedThemeIds: ['midnight'],
};

const DEFAULT_SETTINGS: Settings = {
  soundEnabled: true,
  hapticsEnabled: true,
  activeThemeId: 'midnight',
  dragSensitivity: 0.85,
  fingerOffset: 70,
};

export function loadStats(): GameStats {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.STATS);
    if (!data) return DEFAULT_STATS;
    const parsed = JSON.parse(data);
    return {
      ...DEFAULT_STATS,
      ...parsed,
      unlockedThemeIds: Array.isArray(parsed.unlockedThemeIds) && parsed.unlockedThemeIds.length > 0
        ? parsed.unlockedThemeIds
        : ['midnight'],
    };
  } catch {
    return DEFAULT_STATS;
  }
}

export function saveStats(stats: GameStats) {
  try {
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
  } catch {
    // Ignore storage write errors
  }
}

export function updateBestScore(
  currentScore: number,
  linesCleared: number,
  combo: number
): { isNewBest: boolean; stats: GameStats } {
  const stats = loadStats();
  let isNewBest = false;

  if (currentScore > stats.bestScore) {
    stats.bestScore = currentScore;
    isNewBest = true;
  }

  stats.totalLinesCleared += linesCleared;
  if (combo > stats.maxCombo) {
    stats.maxCombo = combo;
  }

  saveStats(stats);
  return { isNewBest, stats };
}

export function incrementBoardClears(): GameStats {
  const stats = loadStats();
  stats.totalBoardClears = (stats.totalBoardClears || 0) + 1;
  saveStats(stats);
  return stats;
}

export function unlockThemeInStorage(themeId: string): { newlyUnlocked: boolean; stats: GameStats } {
  const stats = loadStats();
  if (stats.unlockedThemeIds.includes(themeId)) {
    return { newlyUnlocked: false, stats };
  }

  stats.unlockedThemeIds.push(themeId);
  saveStats(stats);
  return { newlyUnlocked: true, stats };
}

export function incrementGamesPlayed(): GameStats {
  const stats = loadStats();
  stats.gamesPlayed += 1;
  saveStats(stats);
  return stats;
}

export function resetAllStats(): GameStats {
  try {
    localStorage.removeItem(STORAGE_KEYS.STATS);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
  } catch {
    // Ignore
  }
  return DEFAULT_STATS;
}

export function loadSettings(): Settings {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!data) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(data);
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      activeThemeId: parsed.activeThemeId || 'midnight',
      dragSensitivity: typeof parsed.dragSensitivity === 'number' ? parsed.dragSensitivity : 0.85,
      fingerOffset: typeof parsed.fingerOffset === 'number' ? parsed.fingerOffset : 70,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: Settings) {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch {
    // Ignore
  }
}
