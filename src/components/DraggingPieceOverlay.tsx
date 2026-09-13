import React from 'react';
import type { PieceShape } from '../game/types';

interface DraggingPieceOverlayProps {
  shape: PieceShape;
  x: number;
  y: number;
  cellSize: number;
  grabOffset: { x: number; y: number };
}

export const DraggingPieceOverlay: React.FC<DraggingPieceOverlayProps> = ({
  shape,
  x,
  y,
  cellSize,
  grabOffset,
}) => {
  // Position piece top-left based on pointer minus grabOffset
  const left = x - grabOffset.x;
  const top = y - grabOffset.y;

  return (
    <div
      className="dragging-piece-overlay"
      style={{
        left: `${left}px`,
        top: `${top}px`,
        transform: 'none', // using absolute left and top
      }}
    >
      <div
        className="piece-matrix"
        style={{
          gridTemplateColumns: `repeat(${shape.width}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${shape.height}, ${cellSize}px)`,
          gap: '4px',
        }}
      >
        {shape.matrix.map((row, r) =>
          row.map((val, c) => {
            if (val === 0) {
              return (
                <div
                  key={`${r}-${c}`}
                  style={{ width: cellSize, height: cellSize }}
                />
              );
            }
            return (
              <div
                key={`${r}-${c}`}
                className="piece-tile"
                style={{
                  width: cellSize,
                  height: cellSize,
                  backgroundColor: shape.color,
                }}
              />
            );
          })
        )}
      </div>
    </div>
  );
};
