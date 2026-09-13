export type CellColor = string | null;

export type BoardGrid = CellColor[][];

export interface PieceShape {
  id: string;
  name: string;
  matrix: number[][]; // 2D array of 0 and 1
  color: string;
  accentColor?: string;
  width: number;
  height: number;
}

export interface TrayPiece {
  id: string;
  shape: PieceShape;
  isPlaced: boolean;
}

export interface Position {
  row: number;
  col: number;
}

export interface FloatingScore {
  id: string;
  points: number;
  comboCount: number;
  linesCount: number;
  isAllClear?: boolean;
  x: number;
  y: number;
}

export interface GameStats {
  gamesPlayed: number;
  bestScore: number;
  totalLinesCleared: number;
  maxCombo: number;
  totalBoardClears: number;
  unlockedThemeIds: string[];
}

export interface Settings {
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  activeThemeId: string;
  dragSensitivity: number; // 0.3 to 1.0 (default 0.85)
  fingerOffset: number;    // 20 to 140 (default 70)
}

export interface GameProgress {
  board: BoardGrid;
  trayPieces: TrayPiece[];
  score: number;
  combo: number;
  linesClearedThisGame: number;
  maxComboThisGame: number;
  isGameOver: boolean;
  savedAt: number;
}
