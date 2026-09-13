import React, { useEffect } from 'react';
import { fireCelebrationConfetti } from './ConfettiEffect';

interface GameOverModalProps {
  score: number;
  bestScore: number;
  isNewBest: boolean;
  linesCleared: number;
  maxCombo: number;
  onRestart: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  score,
  bestScore,
  isNewBest,
  linesCleared,
  maxCombo,
  onRestart,
}) => {
  useEffect(() => {
    if (isNewBest) {
      fireCelebrationConfetti();
    }
  }, [isNewBest]);

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="game-over-title">
      <div className="modal-content">
        <div className="game-over-badge" aria-hidden="true">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l2.4 4.8 5.3.8-3.8 3.7.9 5.3L12 16.1l-4.8 2.5.9-5.3-3.8-3.7 5.3-.8L12 2z" />
          </svg>
        </div>

        <h2 id="game-over-title" className="game-over-title">GAME OVER</h2>

        {isNewBest && (
          <div className="new-record-pill">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2l2.4 4.8 5.3.8-3.8 3.7.9 5.3L12 16.1l-4.8 2.5.9-5.3-3.8-3.7 5.3-.8L12 2z" />
            </svg>
            <span>NEW BEST RECORD!</span>
          </div>
        )}

        <div className="game-over-score-card">
          <span className="game-over-score-label">FINAL SCORE</span>
          <span className="game-over-score-value">{score.toLocaleString()}</span>

          <div className="game-over-stats-grid">
            <div className="stat-item">
              <span className="stat-item-label">BEST SCORE</span>
              <span className="stat-item-value">{bestScore.toLocaleString()}</span>
            </div>
            <div className="stat-item">
              <span className="stat-item-label">LINES BLASTED</span>
              <span className="stat-item-value">{linesCleared}</span>
            </div>
            <div className="stat-item">
              <span className="stat-item-label">MAX COMBO</span>
              <span className="stat-item-value">x{maxCombo}</span>
            </div>
            <div className="stat-item">
              <span className="stat-item-label">STATUS</span>
              <span className="stat-item-value">{isNewBest ? 'VICTORY' : 'GOOD TRY'}</span>
            </div>
          </div>
        </div>

        <button className="primary-cta-button" onClick={onRestart} autoFocus>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
          <span>PLAY AGAIN</span>
        </button>
      </div>
    </div>
  );
};
