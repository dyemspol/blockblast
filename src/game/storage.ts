import type { GameStats, Settings, GameProgress } from './types';

export const CURRENT_STORAGE_VERSION = '3';

export const STORAGE_KEYS = {
  VERSION: 'blockblast_storage_version',
  HIGH_SCORE: 'blockblast_high_score',
  SETTINGS: 'blockblast_settings',
  THEMES: 'blockblast_themes',
  PROGRESS: 'blockblast_progress',
  STATS: 'blockblast_stats',
  // Legacy keys for safe migration
  LEGACY_STATS_V2: 'blockblast_stats_v2',
  LEGACY_SETTINGS_V2: 'blockblast_settings_v2',
  LEGACY_STATS_V1: 'blockblast_stats_v1',
  LEGACY_BEST_SCORE: 'blockblast_best_score',
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

// --- Safe LocalStorage Utilities ---

function safeGetItem<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined' || !window.localStorage) {
    return fallback;
  }
  try {
    const raw = localStorage.getItem(key);
    if (raw === null || raw === undefined) {
      return fallback;
    }
    const parsed = JSON.parse(raw);
    return parsed !== null && parsed !== undefined ? parsed : fallback;
  } catch (err) {
    console.warn(`[Storage] Failed to read key "${key}":`, err);
    return fallback;
  }
}

function safeSetItem(key: string, value: unknown): boolean {
  if (typeof window === 'undefined' || !window.localStorage) {
    return false;
  }
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.warn(`[Storage] Failed to write key "${key}":`, err);
    return false;
  }
}

function safeRemoveItem(key: string): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.warn(`[Storage] Failed to remove key "${key}":`, err);
  }
}

// --- Versioned Data Migration System ---

export function runStorageMigrations(): void {
  if (typeof window === 'undefined' || !window.localStorage) return;

  try {
    const currentVersion = localStorage.getItem(STORAGE_KEYS.VERSION);

    // If already version 3 or later, ensure required keys exist from any partial states
    if (currentVersion === CURRENT_STORAGE_VERSION) {
      // Sync high score key if missing
      if (localStorage.getItem(STORAGE_KEYS.HIGH_SCORE) === null) {
        const stats = safeGetItem<GameStats>(STORAGE_KEYS.STATS, DEFAULT_STATS);
        safeSetItem(STORAGE_KEYS.HIGH_SCORE, stats.bestScore || 0);
      }
      return;
    }

    console.log(`[Storage] Running data migration to storage version ${CURRENT_STORAGE_VERSION}...`);

    // 1. Gather all potential legacy data safely
    let legacyStats: Partial<GameStats> = {};
    let legacySettings: Partial<Settings> = {};
    let legacyHighScore = 0;

    // Try reading legacy stats v2
    const rawStatsV2 = localStorage.getItem(STORAGE_KEYS.LEGACY_STATS_V2);
    if (rawStatsV2) {
      try {
        legacyStats = { ...legacyStats, ...JSON.parse(rawStatsV2) };
      } catch (e) {
        console.warn('[Storage] Corrupted legacy stats v2, recovering:', e);
      }
    }

    // Try reading legacy stats v1
    const rawStatsV1 = localStorage.getItem(STORAGE_KEYS.LEGACY_STATS_V1);
    if (rawStatsV1 && Object.keys(legacyStats).length === 0) {
      try {
        legacyStats = { ...legacyStats, ...JSON.parse(rawStatsV1) };
      } catch (e) {
        console.warn('[Storage] Corrupted legacy stats v1, recovering:', e);
      }
    }

    // Try reading legacy high score directly
    const rawLegacyBest = localStorage.getItem(STORAGE_KEYS.LEGACY_BEST_SCORE);
    if (rawLegacyBest) {
      try {
        const parsed = parseInt(rawLegacyBest, 10);
        if (!isNaN(parsed) && parsed > legacyHighScore) {
          legacyHighScore = parsed;
        }
      } catch {
        // Ignore
      }
    }

    // Try reading legacy settings v2
    const rawSettingsV2 = localStorage.getItem(STORAGE_KEYS.LEGACY_SETTINGS_V2);
    if (rawSettingsV2) {
      try {
        legacySettings = { ...legacySettings, ...JSON.parse(rawSettingsV2) };
      } catch (e) {
        console.warn('[Storage] Corrupted legacy settings v2, recovering:', e);
      }
    }

    // Determine resolved high score
    const resolvedHighScore = Math.max(
      legacyHighScore,
      typeof legacyStats.bestScore === 'number' ? legacyStats.bestScore : 0
    );

    // Determine resolved unlocked themes
    const resolvedThemes = Array.isArray(legacyStats.unlockedThemeIds) && legacyStats.unlockedThemeIds.length > 0
      ? Array.from(new Set(['midnight', ...legacyStats.unlockedThemeIds]))
      : ['midnight'];

    // 2. Migrate to new namespaced keys without overwriting existing non-default data
    if (localStorage.getItem(STORAGE_KEYS.HIGH_SCORE) === null) {
      safeSetItem(STORAGE_KEYS.HIGH_SCORE, resolvedHighScore);
    }

    if (localStorage.getItem(STORAGE_KEYS.THEMES) === null) {
      safeSetItem(STORAGE_KEYS.THEMES, resolvedThemes);
    }

    if (localStorage.getItem(STORAGE_KEYS.STATS) === null) {
      const mergedStats: GameStats = {
        gamesPlayed: legacyStats.gamesPlayed || 0,
        bestScore: resolvedHighScore,
        totalLinesCleared: legacyStats.totalLinesCleared || 0,
        maxCombo: legacyStats.maxCombo || 0,
        totalBoardClears: legacyStats.totalBoardClears || 0,
        unlockedThemeIds: resolvedThemes,
      };
      safeSetItem(STORAGE_KEYS.STATS, mergedStats);
    }

    if (localStorage.getItem(STORAGE_KEYS.SETTINGS) === null) {
      const mergedSettings: Settings = {
        soundEnabled: legacySettings.soundEnabled ?? DEFAULT_SETTINGS.soundEnabled,
        hapticsEnabled: legacySettings.hapticsEnabled ?? DEFAULT_SETTINGS.hapticsEnabled,
        activeThemeId: legacySettings.activeThemeId || DEFAULT_SETTINGS.activeThemeId,
        dragSensitivity: typeof legacySettings.dragSensitivity === 'number' ? legacySettings.dragSensitivity : DEFAULT_SETTINGS.dragSensitivity,
        fingerOffset: typeof legacySettings.fingerOffset === 'number' ? legacySettings.fingerOffset : DEFAULT_SETTINGS.fingerOffset,
      };
      safeSetItem(STORAGE_KEYS.SETTINGS, mergedSettings);
    }

    // Mark current version
    localStorage.setItem(STORAGE_KEYS.VERSION, CURRENT_STORAGE_VERSION);
    console.log(`[Storage] Data migration completed successfully.`);
  } catch (err) {
    console.error('[Storage] Error during storage migration:', err);
  }
}

// Execute migration once on module load
runStorageMigrations();

// --- High Score Persistence ---

export function loadHighScore(): number {
  const score = safeGetItem<number>(STORAGE_KEYS.HIGH_SCORE, 0);
  if (typeof score === 'number' && !isNaN(score)) {
    return score;
  }
  // Fallback to stats
  const stats = loadStats();
  return stats.bestScore || 0;
}

export function saveHighScore(score: number): void {
  if (typeof score !== 'number' || isNaN(score) || score < 0) return;
  safeSetItem(STORAGE_KEYS.HIGH_SCORE, score);
  // Also keep stats in sync
  const stats = loadStats();
  if (score > stats.bestScore) {
    stats.bestScore = score;
    saveStats(stats);
  }
}

// --- Themes Persistence ---

export function loadUnlockedThemes(): string[] {
  const themes = safeGetItem<string[]>(STORAGE_KEYS.THEMES, ['midnight']);
  if (Array.isArray(themes) && themes.length > 0) {
    return Array.from(new Set(['midnight', ...themes]));
  }
  return ['midnight'];
}

export function saveUnlockedThemes(themeIds: string[]): void {
  const sanitized = Array.from(new Set(['midnight', ...themeIds]));
  safeSetItem(STORAGE_KEYS.THEMES, sanitized);
  // Also keep stats in sync
  const stats = loadStats();
  stats.unlockedThemeIds = sanitized;
  saveStats(stats);
}

// --- Stats Persistence ---

export function loadStats(): GameStats {
  const stats = safeGetItem<GameStats>(STORAGE_KEYS.STATS, DEFAULT_STATS);
  const highScore = safeGetItem<number>(STORAGE_KEYS.HIGH_SCORE, stats.bestScore || 0);
  const themes = loadUnlockedThemes();

  return {
    ...DEFAULT_STATS,
    ...stats,
    bestScore: Math.max(stats.bestScore || 0, highScore),
    unlockedThemeIds: themes,
  };
}

export function saveStats(stats: GameStats) {
  try {
    const sanitized: GameStats = {
      gamesPlayed: Math.max(0, stats.gamesPlayed || 0),
      bestScore: Math.max(0, stats.bestScore || 0),
      totalLinesCleared: Math.max(0, stats.totalLinesCleared || 0),
      maxCombo: Math.max(0, stats.maxCombo || 0),
      totalBoardClears: Math.max(0, stats.totalBoardClears || 0),
      unlockedThemeIds: Array.isArray(stats.unlockedThemeIds) && stats.unlockedThemeIds.length > 0
        ? stats.unlockedThemeIds
        : ['midnight'],
    };
    safeSetItem(STORAGE_KEYS.STATS, sanitized);
    // Sync high score key
    safeSetItem(STORAGE_KEYS.HIGH_SCORE, sanitized.bestScore);
    // Sync themes key
    safeSetItem(STORAGE_KEYS.THEMES, sanitized.unlockedThemeIds);
  } catch (err) {
    console.warn('[Storage] Failed to save stats:', err);
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
    saveHighScore(currentScore);
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
  saveUnlockedThemes(stats.unlockedThemeIds);
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
    safeRemoveItem(STORAGE_KEYS.HIGH_SCORE);
    safeRemoveItem(STORAGE_KEYS.STATS);
    safeRemoveItem(STORAGE_KEYS.PROGRESS);
    safeSetItem(STORAGE_KEYS.THEMES, ['midnight']);
  } catch {
    // Ignore
  }
  return DEFAULT_STATS;
}

// --- Settings Persistence ---

export function loadSettings(): Settings {
  const settings = safeGetItem<Settings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
  return {
    ...DEFAULT_SETTINGS,
    ...settings,
    activeThemeId: settings.activeThemeId || 'midnight',
    dragSensitivity: typeof settings.dragSensitivity === 'number'
      ? Math.min(Math.max(settings.dragSensitivity, 0.3), 1.0)
      : 0.85,
    fingerOffset: typeof settings.fingerOffset === 'number'
      ? Math.min(Math.max(settings.fingerOffset, 20), 140)
      : 70,
  };
}

export function saveSettings(settings: Settings) {
  safeSetItem(STORAGE_KEYS.SETTINGS, settings);
}

// --- In-Progress Game Session Persistence ---

export function loadGameProgress(): GameProgress | null {
  const progress = safeGetItem<GameProgress | null>(STORAGE_KEYS.PROGRESS, null);
  if (!progress) return null;

  // Validate structural integrity of progress
  if (
    !progress.board ||
    !Array.isArray(progress.board) ||
    progress.board.length !== 8 ||
    !Array.isArray(progress.trayPieces) ||
    progress.trayPieces.length !== 3 ||
    typeof progress.score !== 'number'
  ) {
    console.warn('[Storage] Corrupted game progress detected, discarding.');
    clearGameProgress();
    return null;
  }

  // Discard progress if game was already over
  if (progress.isGameOver) {
    clearGameProgress();
    return null;
  }

  return progress;
}

export function saveGameProgress(progress: GameProgress): void {
  safeSetItem(STORAGE_KEYS.PROGRESS, progress);
}

export function clearGameProgress(): void {
  safeRemoveItem(STORAGE_KEYS.PROGRESS);
}
