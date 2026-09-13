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
            <span className="floating-all-clear">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ display: 'inline-block', verticalAlign: '-1px', marginRight: '4px' }} aria-hidden="true">
                <path d="M12 2l2.4 7.4 7.6.2-6 4.8 2.3 7.6-6.3-4.6-6.3 4.6 2.3-7.6-6-4.8 7.6-.2z" />
              </svg>
              ALL CLEAR!
            </span>
          )}
          {s.comboCount > 1 && !s.isAllClear && (
            <span className="floating-combo">COMBO x{s.comboCount}!</span>
          )}
        </div>
      ))}
    </div>
  );
};
