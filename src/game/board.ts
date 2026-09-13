import type { BoardGrid, PieceShape, TrayPiece } from './types';

export const BOARD_SIZE = 8;

export function createEmptyBoard(): BoardGrid {
  return Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => null)
  );
}

export function canPlacePiece(
  shape: PieceShape,
  board: BoardGrid,
  startRow: number,
  startCol: number
): boolean {
  for (let r = 0; r < shape.matrix.length; r++) {
    for (let c = 0; c < shape.matrix[r].length; c++) {
      if (shape.matrix[r][c] === 1) {
        const targetRow = startRow + r;
        const targetCol = startCol + c;

        // Out of bounds check
        if (
          targetRow < 0 ||
          targetRow >= BOARD_SIZE ||
          targetCol < 0 ||
          targetCol >= BOARD_SIZE
        ) {
          return false;
        }

        // Cell already occupied
        if (board[targetRow][targetCol] !== null) {
          return false;
        }
      }
    }
  }
  return true;
}

export function canPlacePieceOnBoard(
  shape: PieceShape,
  board: BoardGrid
): boolean {
  for (let r = 0; r <= BOARD_SIZE - shape.height; r++) {
    for (let c = 0; c <= BOARD_SIZE - shape.width; c++) {
      if (canPlacePiece(shape, board, r, c)) {
        return true;
      }
    }
  }
  return false;
}

export function placePiece(
  shape: PieceShape,
  board: BoardGrid,
  startRow: number,
  startCol: number
): BoardGrid {
  const newBoard = board.map(row => [...row]);
  for (let r = 0; r < shape.matrix.length; r++) {
    for (let c = 0; c < shape.matrix[r].length; c++) {
      if (shape.matrix[r][c] === 1) {
        newBoard[startRow + r][startCol + c] = shape.color;
      }
    }
  }
  return newBoard;
}

export interface LineClearResult {
  rows: number[];
  cols: number[];
  clearedCells: { row: number; col: number }[];
}

export function findCompletedLines(board: BoardGrid): LineClearResult {
  const fullRows: number[] = [];
  const fullCols: number[] = [];

  // Check rows
  for (let r = 0; r < BOARD_SIZE; r++) {
    if (board[r].every(cell => cell !== null)) {
      fullRows.push(r);
    }
  }

  // Check columns
  for (let c = 0; c < BOARD_SIZE; c++) {
    let colFull = true;
    for (let r = 0; r < BOARD_SIZE; r++) {
      if (board[r][c] === null) {
        colFull = false;
        break;
      }
    }
    if (colFull) {
      fullCols.push(c);
    }
  }

  // Build unique cleared cell coordinate set
  const cellSet = new Set<string>();
  const clearedCells: { row: number; col: number }[] = [];

  fullRows.forEach(r => {
    for (let c = 0; c < BOARD_SIZE; c++) {
      const key = `${r},${c}`;
      if (!cellSet.has(key)) {
        cellSet.add(key);
        clearedCells.push({ row: r, col: c });
      }
    }
  });

  fullCols.forEach(c => {
    for (let r = 0; r < BOARD_SIZE; r++) {
      const key = `${r},${c}`;
      if (!cellSet.has(key)) {
        cellSet.add(key);
        clearedCells.push({ row: r, col: c });
      }
    }
  });

  return {
    rows: fullRows,
    cols: fullCols,
    clearedCells,
  };
}

export function clearLines(
  board: BoardGrid,
  rows: number[],
  cols: number[]
): BoardGrid {
  const newBoard = board.map(row => [...row]);

  rows.forEach(r => {
    for (let c = 0; c < BOARD_SIZE; c++) {
      newBoard[r][c] = null;
    }
  });

  cols.forEach(c => {
    for (let r = 0; r < BOARD_SIZE; r++) {
      newBoard[r][c] = null;
    }
  });

  return newBoard;
}

export function isGameOver(
  trayPieces: TrayPiece[],
  board: BoardGrid
): boolean {
  const remainingPieces = trayPieces.filter(p => !p.isPlaced);
  if (remainingPieces.length === 0) {
    return false;
  }

  return !remainingPieces.some(p => canPlacePieceOnBoard(p.shape, board));
}

export function isBoardCompletelyEmpty(board: BoardGrid): boolean {
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r][c] !== null) {
        return false;
      }
    }
  }
  return true;
}
