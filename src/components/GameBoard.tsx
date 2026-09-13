import { forwardRef } from 'react';
import type { BoardGrid } from '../game/types';
import { BOARD_SIZE } from '../game/board';

interface GameBoardProps {
  board: BoardGrid;
  ghostCells: { row: number; col: number; color: string }[] | null;
  imminentClears: { rows: number[]; cols: number[] } | null;
  clearingCells: { row: number; col: number }[] | null;
}

export const GameBoard = forwardRef<HTMLDivElement, GameBoardProps>(
  ({ board, ghostCells, imminentClears, clearingCells }, ref) => {
    // Helper to check if a cell is in ghost preview
    const getGhostColor = (r: number, c: number): string | null => {
      if (!ghostCells) return null;
      const match = ghostCells.find(cell => cell.row === r && cell.col === c);
      return match ? match.color : null;
    };

    // Helper to check if a cell will be cleared upon drop
    const willClear = (r: number, c: number): boolean => {
      if (!imminentClears) return false;
      return imminentClears.rows.includes(r) || imminentClears.cols.includes(c);
    };

    // Helper to check if cell is actively animating its clear
    const isActivelyClearing = (r: number, c: number): boolean => {
      if (!clearingCells) return false;
      return clearingCells.some(cell => cell.row === r && cell.col === c);
    };

    return (
      <div className="game-board-container" ref={ref} id="game-board" role="grid" aria-label="8 by 8 Game Board">
        <div className="game-board-grid">
          {Array.from({ length: BOARD_SIZE }).map((_, r) =>
            Array.from({ length: BOARD_SIZE }).map((_, c) => {
              const cellColor = board[r][c];
              const ghostColor = getGhostColor(r, c);
              const cellWillClear = willClear(r, c);
              const activelyClearing = isActivelyClearing(r, c);

              const isFilled = cellColor !== null;
              const isGhost = !isFilled && ghostColor !== null;

              let backgroundColor = undefined;
              if (isFilled) {
                backgroundColor = cellColor;
              } else if (isGhost) {
                backgroundColor = `${ghostColor}88`; // 50% opacity
              }

              const classes = [
                'board-cell',
                isFilled ? 'filled' : '',
                isGhost ? 'ghost' : '',
                cellWillClear ? 'will-clear' : '',
                activelyClearing ? 'clearing' : '',
              ]
                .filter(Boolean)
                .join(' ');

              return (
                <div
                  key={`${r}-${c}`}
                  className={classes}
                  style={{ backgroundColor }}
                  data-row={r}
                  data-col={c}
                  role="gridcell"
                  aria-label={`Row ${r + 1}, Column ${c + 1} ${isFilled ? 'filled' : 'empty'}`}
                />
              );
            })
          )}
        </div>
      </div>
    );
  }
);

GameBoard.displayName = 'GameBoard';
