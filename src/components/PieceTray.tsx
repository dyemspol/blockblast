import React from 'react';
import type { TrayPiece, BoardGrid } from '../game/types';
import { canPlacePieceOnBoard } from '../game/board';

interface PieceTrayProps {
  pieces: TrayPiece[];
  board: BoardGrid;
  activeDragPieceId: string | null;
  onStartDrag: (piece: TrayPiece, event: React.PointerEvent<HTMLDivElement>) => void;
}

export const PieceTray: React.FC<PieceTrayProps> = ({
  pieces,
  board,
  activeDragPieceId,
  onStartDrag,
}) => {
  return (
    <section className="piece-tray-container" aria-label="Available Pieces Tray">
      {pieces.map((piece, index) => {
        if (piece.isPlaced) {
          return <div key={piece.id || index} className="tray-slot" />;
        }

        const isCurrentlyDragged = activeDragPieceId === piece.id;
        const fits = canPlacePieceOnBoard(piece.shape, board);

        return (
          <div key={piece.id} className="tray-slot">
            <div
              className={`tray-piece-wrapper ${!fits ? 'unfit' : ''} ${
                isCurrentlyDragged ? 'fade-out' : ''
              }`}
              onPointerDown={(e) => onStartDrag(piece, e)}
              role="button"
              tabIndex={0}
              aria-label={`Piece ${piece.shape.name}, ${fits ? 'playable' : 'cannot fit'}`}
              style={{
                touchAction: 'none',
              }}
            >
              <div
                className="piece-matrix"
                style={{
                  gridTemplateColumns: `repeat(${piece.shape.width}, 26px)`,
                  gridTemplateRows: `repeat(${piece.shape.height}, 26px)`,
                }}
              >
                {piece.shape.matrix.map((row, r) =>
                  row.map((val, c) => {
                    if (val === 0) {
                      return <div key={`${r}-${c}`} style={{ width: 26, height: 26 }} />;
                    }
                    return (
                      <div
                        key={`${r}-${c}`}
                        className="piece-tile"
                        style={{
                          width: 26,
                          height: 26,
                          backgroundColor: piece.shape.color,
                        }}
                      />
                    );
                  })
                )}
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
};
