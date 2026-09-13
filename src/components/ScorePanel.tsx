import React, { useEffect, useState } from 'react';

interface ScorePanelProps {
  score: number;
  bestScore: number;
  combo: number;
}

export const ScorePanel: React.FC<ScorePanelProps> = ({ score, bestScore, combo }) => {
  const [isBumping, setIsBumping] = useState(false);

  useEffect(() => {
    if (score > 0) {
      setIsBumping(true);
      const timer = setTimeout(() => setIsBumping(false), 260);
      return () => clearTimeout(timer);
    }
  }, [score]);

  return (
    <>
      <section className="score-panel" aria-label="Game Scores">
        <div className={`score-card ${isBumping ? 'bump' : ''}`}>
          <div className="score-label-row">
            <span className="score-label">SCORE</span>
          </div>
          <div className="score-value">{score.toLocaleString()}</div>
        </div>

        <div className="score-card">
          <div className="score-label-row">
            <svg className="trophy-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l2.4 4.8 5.3.8-3.8 3.7.9 5.3L12 16.1l-4.8 2.5.9-5.3-3.8-3.7 5.3-.8L12 2z" />
            </svg>
            <span className="score-label">BEST</span>
          </div>
          <div className="score-value best-score-value">{bestScore.toLocaleString()}</div>
        </div>
      </section>

      <div className="combo-indicator-bar" aria-live="polite">
        {combo > 1 && (
          <div className="combo-badge">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2c-.5 2.5-2 4.5-4 6-1.5 1.2-2.5 3-2.5 5 0 4.1 3.4 7.5 7.5 7.5s7.5-3.4 7.5-7.5c0-3.5-2.2-6.5-5-7.5.3 1.5-.5 3-1.8 3.5C13 8 13.5 4.5 12 2z" />
            </svg>
            <span>COMBO x{combo}</span>
          </div>
        )}
      </div>
    </>
  );
};
