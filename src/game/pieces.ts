import type { PieceShape, TrayPiece, BoardGrid } from './types';
import { canPlacePieceOnBoard } from './board';

export const PIECE_DEFINITIONS: Omit<PieceShape, 'id'>[] = [
  // 1x1 Dot
  {
    name: 'dot',
    matrix: [[1]],
    color: '#06B6D4', // Cyan
    width: 1,
    height: 1,
  },
  // 1x2 and 2x1 Lines
  {
    name: 'line-2-h',
    matrix: [[1, 1]],
    color: '#3B82F6', // Sapphire Blue
    width: 2,
    height: 1,
  },
  {
    name: 'line-2-v',
    matrix: [[1], [1]],
    color: '#3B82F6',
    width: 1,
    height: 2,
  },
  // 1x3 and 3x1 Lines
  {
    name: 'line-3-h',
    matrix: [[1, 1, 1]],
    color: '#10B981', // Emerald
    width: 3,
    height: 1,
  },
  {
    name: 'line-3-v',
    matrix: [[1], [1], [1]],
    color: '#10B981',
    width: 1,
    height: 3,
  },
  // 1x4 and 4x1 Lines
  {
    name: 'line-4-h',
    matrix: [[1, 1, 1, 1]],
    color: '#8B5CF6', // Purple
    width: 4,
    height: 1,
  },
  {
    name: 'line-4-v',
    matrix: [[1], [1], [1], [1]],
    color: '#8B5CF6',
    width: 1,
    height: 4,
  },
  // 1x5 and 5x1 Lines
  {
    name: 'line-5-h',
    matrix: [[1, 1, 1, 1, 1]],
    color: '#EC4899', // Pink
    width: 5,
    height: 1,
  },
  {
    name: 'line-5-v',
    matrix: [[1], [1], [1], [1], [1]],
    color: '#EC4899',
    width: 1,
    height: 5,
  },
  // 2x2 Square
  {
    name: 'square-2',
    matrix: [
      [1, 1],
      [1, 1],
    ],
    color: '#F59E0B', // Amber
    width: 2,
    height: 2,
  },
  // 3x3 Square
  {
    name: 'square-3',
    matrix: [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ],
    color: '#EF4444', // Coral Red
    width: 3,
    height: 3,
  },
  // 2x2 Small Corner / L (4 rotations)
  {
    name: 'corner-2-tl',
    matrix: [
      [1, 1],
      [1, 0],
    ],
    color: '#F97316', // Orange
    width: 2,
    height: 2,
  },
  {
    name: 'corner-2-tr',
    matrix: [
      [1, 1],
      [0, 1],
    ],
    color: '#F97316',
    width: 2,
    height: 2,
  },
  {
    name: 'corner-2-bl',
    matrix: [
      [1, 0],
      [1, 1],
    ],
    color: '#F97316',
    width: 2,
    height: 2,
  },
  {
    name: 'corner-2-br',
    matrix: [
      [0, 1],
      [1, 1],
    ],
    color: '#F97316',
    width: 2,
    height: 2,
  },
  // 3x3 Big Corner (4 rotations)
  {
    name: 'corner-3-tl',
    matrix: [
      [1, 1, 1],
      [1, 0, 0],
      [1, 0, 0],
    ],
    color: '#6366F1', // Indigo
    width: 3,
    height: 3,
  },
  {
    name: 'corner-3-tr',
    matrix: [
      [1, 1, 1],
      [0, 0, 1],
      [0, 0, 1],
    ],
    color: '#6366F1',
    width: 3,
    height: 3,
  },
  {
    name: 'corner-3-bl',
    matrix: [
      [1, 0, 0],
      [1, 0, 0],
      [1, 1, 1],
    ],
    color: '#6366F1',
    width: 3,
    height: 3,
  },
  {
    name: 'corner-3-br',
    matrix: [
      [0, 0, 1],
      [0, 0, 1],
      [1, 1, 1],
    ],
    color: '#6366F1',
    width: 3,
    height: 3,
  },
  // Standard L-shape 3x2 (4 rotations)
  {
    name: 'l-shape-1',
    matrix: [
      [1, 0],
      [1, 0],
      [1, 1],
    ],
    color: '#14B8A6', // Teal
    width: 2,
    height: 3,
  },
  {
    name: 'l-shape-2',
    matrix: [
      [0, 1],
      [0, 1],
      [1, 1],
    ],
    color: '#14B8A6',
    width: 2,
    height: 3,
  },
  {
    name: 'l-shape-3',
    matrix: [
      [1, 1, 1],
      [1, 0, 0],
    ],
    color: '#14B8A6',
    width: 3,
    height: 2,
  },
  {
    name: 'l-shape-4',
    matrix: [
      [1, 1, 1],
      [0, 0, 1],
    ],
    color: '#14B8A6',
    width: 3,
    height: 2,
  },
  // T-shapes 3x2 (4 rotations)
  {
    name: 't-shape-up',
    matrix: [
      [0, 1, 0],
      [1, 1, 1],
    ],
    color: '#A855F7', // Violet
    width: 3,
    height: 2,
  },
  {
    name: 't-shape-down',
    matrix: [
      [1, 1, 1],
      [0, 1, 0],
    ],
    color: '#A855F7',
    width: 3,
    height: 2,
  },
  {
    name: 't-shape-left',
    matrix: [
      [0, 1],
      [1, 1],
      [0, 1],
    ],
    color: '#A855F7',
    width: 2,
    height: 3,
  },
  {
    name: 't-shape-right',
    matrix: [
      [1, 0],
      [1, 1],
      [1, 0],
    ],
    color: '#A855F7',
    width: 2,
    height: 3,
  },
];

let pieceCounter = 0;

export function createPieceInstance(
  def: Omit<PieceShape, 'id'>,
  themeBlockColors?: string[],
  colorIndex?: number
): PieceShape {
  pieceCounter++;
  let color = def.color;
  if (themeBlockColors && themeBlockColors.length > 0) {
    if (colorIndex !== undefined) {
      color = themeBlockColors[colorIndex % themeBlockColors.length];
    } else {
      color = themeBlockColors[pieceCounter % themeBlockColors.length];
    }
  }

  return {
    ...def,
    color,
    id: `${def.name}-${Date.now()}-${pieceCounter}`,
  };
}

/**
 * Returns a set of 3 balanced pieces.
 * Guarantees that at least one of the 3 pieces is placeable on the current board.
 */
export function generateThreePieces(
  board: BoardGrid,
  themeBlockColors?: string[]
): TrayPiece[] {
  const pieces: TrayPiece[] = [];
  
  // Calculate board density
  let occupiedCount = 0;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (board[r][c] !== null) occupiedCount++;
    }
  }
  const density = occupiedCount / 64;

  // Filter pool based on density
  let pool = [...PIECE_DEFINITIONS];
  if (density > 0.6) {
    // High density: favor smaller pieces (<= 4 cells)
    pool = pool.filter(p => {
      const cellCount = p.matrix.flat().filter(v => v === 1).length;
      return cellCount <= 4;
    });
  }

  // Pick 3 pieces randomly
  for (let i = 0; i < 3; i++) {
    const randomDef = pool[Math.floor(Math.random() * pool.length)];
    pieces.push({
      id: `tray-${i}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      shape: createPieceInstance(randomDef, themeBlockColors, i * 2 + 1),
      isPlaced: false,
    });
  }

  // Safety check: ensure at least one piece in the 3 can be placed on the current board
  const anyFit = pieces.some(p => canPlacePieceOnBoard(p.shape, board));
  if (!anyFit) {
    // Replace the first piece with a small piece that can fit, or a 1x1 dot
    const fittingDefs = PIECE_DEFINITIONS.filter(def => {
      const tempInstance = createPieceInstance(def, themeBlockColors, 0);
      return canPlacePieceOnBoard(tempInstance, board);
    });

    if (fittingDefs.length > 0) {
      const chosen = fittingDefs[Math.floor(Math.random() * fittingDefs.length)];
      pieces[0].shape = createPieceInstance(chosen, themeBlockColors, 0);
    } else {
      // If literally nothing fits, 1x1 dot is the last resort (if any empty cell exists)
      const dotDef = PIECE_DEFINITIONS.find(p => p.name === 'dot')!;
      pieces[0].shape = createPieceInstance(dotDef, themeBlockColors, 0);
    }
  }

  return pieces;
}
