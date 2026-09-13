import type { PieceShape } from './types';

export interface ScoreCalculationResult {
  placementPoints: number;
  clearPoints: number;
  totalPoints: number;
  linesCount: number;
  comboCount: number;
  comboMultiplier: number;
}

const LINE_BASE_SCORES: Record<number, number> = {
  1: 100,
  2: 300,
  3: 600,
  4: 1000,
  5: 1500,
  6: 2100,
};

export function calculatePlacementPoints(shape: PieceShape): number {
  const cellCount = shape.matrix.flat().filter(v => v === 1).length;
  return cellCount * 10;
}

export function calculateScore(
  shape: PieceShape,
  linesCount: number,
  currentCombo: number
): ScoreCalculationResult {
  const placementPoints = calculatePlacementPoints(shape);

  if (linesCount === 0) {
    return {
      placementPoints,
      clearPoints: 0,
      totalPoints: placementPoints,
      linesCount: 0,
      comboCount: 0, // resets combo on non-clearing move
      comboMultiplier: 1.0,
    };
  }

  const newCombo = currentCombo + 1;
  const basePoints =
    LINE_BASE_SCORES[linesCount] || (linesCount * 350);

  // Combo multiplier: 1 -> 1.0x, 2 -> 1.5x, 3 -> 2.0x, etc.
  const comboMultiplier = newCombo === 1 ? 1.0 : 1.0 + (newCombo - 1) * 0.5;
  const clearPoints = Math.round(basePoints * comboMultiplier);

  return {
    placementPoints,
    clearPoints,
    totalPoints: placementPoints + clearPoints,
    linesCount,
    comboCount: newCombo,
    comboMultiplier,
  };
}
