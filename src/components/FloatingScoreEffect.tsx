import React from 'react';
import type { FloatingScore } from '../game/types';

interface FloatingScoreEffectProps {
  scores: FloatingScore[];
}

export const FloatingScoreEffect: React.FC<FloatingScoreEffectProps> = ({ scores }) => {
  return (
    <div className="floating-scores-container" aria-hidden="true">
      {scores.map(s => (
        <div
          key={s.id}
          className="floating-score-item"
          style={{ left: `${s.x}px`, top: `${s.y}px` }}
        >
          <span className="floating-points">+{s.points}</span>
          {s.isAllClear && (
            <span className="floating-all-clear">🌟 ALL CLEAR!</span>
          )}
          {s.comboCount > 1 && !s.isAllClear && (
            <span className="floating-combo">COMBO x{s.comboCount}!</span>
          )}
        </div>
      ))}
    </div>
  );
};
