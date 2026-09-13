import React, { useEffect } from 'react';
import type { GameTheme } from '../game/themes';
import confetti from 'canvas-confetti';

interface ThemeUnlockCelebrationProps {
  theme: GameTheme;
  onDismiss: () => void;
}

export const ThemeUnlockCelebration: React.FC<ThemeUnlockCelebrationProps> = ({
  theme,
  onDismiss,
}) => {
  useEffect(() => {
    // Launch theme-colored celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.55 },
        colors: theme.blockColors.slice(0, 6),
        disableForReducedMotion: true,
        zIndex: 3000,
      });
    } catch {
      // Ignore
    }

    // Auto-dismiss after 1.8 seconds
    const timer = setTimeout(() => {
      onDismiss();
    }, 1800);

    return () => clearTimeout(timer);
  }, [theme, onDismiss]);

  return (
    <div
      className="theme-unlock-backdrop"
      onClick={onDismiss}
      role="dialog"
      aria-modal="true"
      aria-label={`New Theme Unlocked: ${theme.name}`}
    >
      <div className="theme-unlock-card" onClick={(e) => e.stopPropagation()}>
        <div className="theme-unlock-badge">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2l2.4 7.4 7.6.2-6 4.8 2.3 7.6-6.3-4.6-6.3 4.6 2.3-7.6-6-4.8 7.6-.2z" />
          </svg>
          <span>NEW THEME UNLOCKED</span>
        </div>

        <h2 className="theme-unlock-title">{theme.name}</h2>
        <p className="theme-unlock-subtitle">{theme.subtitle}</p>

        {/* Color Palette Preview Bar */}
        <div className="theme-palette-preview">
          {theme.blockColors.slice(0, 6).map((col, idx) => (
            <div
              key={idx}
              className="theme-palette-dot"
              style={{ backgroundColor: col }}
            />
          ))}
        </div>

        <p className="theme-unlock-desc">{theme.description}</p>

        <button className="theme-unlock-continue-btn" onClick={onDismiss} autoFocus>
          CONTINUE
        </button>
      </div>
    </div>
  );
};
