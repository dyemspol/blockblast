import React, { useState, useRef } from 'react';
import type { Settings, GameStats } from '../game/types';
import { THEMES, getThemeById, applyTheme } from '../game/themes';
import { sound } from '../game/audio';

interface SettingsModalProps {
  settings: Settings;
  stats: GameStats;
  onUpdateSettings: (newSettings: Settings) => void;
  onTriggerTestUnlock: () => void;
  onResetStats: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  stats,
  onUpdateSettings,
  onTriggerTestUnlock,
  onResetStats,
  onClose,
}) => {
  // Test area interactive state
  const [testBlockPos, setTestBlockPos] = useState<{ x: number; y: number } | null>(null);
  const [isDraggingTest, setIsDraggingTest] = useState(false);
  const testBoxRef = useRef<HTMLDivElement>(null);

  const toggleSound = () => {
    const updated = { ...settings, soundEnabled: !settings.soundEnabled };
    onUpdateSettings(updated);
    if (updated.soundEnabled) sound.playClick();
  };

  const toggleHaptics = () => {
    const updated = { ...settings, hapticsEnabled: !settings.hapticsEnabled };
    onUpdateSettings(updated);
    sound.playClick();
  };

  const setSensitivity = (val: number) => {
    onUpdateSettings({ ...settings, dragSensitivity: val });
  };

  const setOffset = (val: number) => {
    onUpdateSettings({ ...settings, fingerOffset: val });
  };

  const selectTheme = (themeId: string) => {
    if (!stats.unlockedThemeIds.includes(themeId)) return;
    const chosenTheme = getThemeById(themeId);
    applyTheme(chosenTheme);
    onUpdateSettings({ ...settings, activeThemeId: themeId });
    sound.playClick();
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset your high score and all game statistics?')) {
      onResetStats();
      sound.playClick();
    }
  };

  // Test Area Drag Handlers
  const handleTestPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!testBoxRef.current) return;
    const boxRect = testBoxRef.current.getBoundingClientRect();
    const isTouch = e.pointerType === 'touch';
    const offset = isTouch ? settings.fingerOffset : Math.min(settings.fingerOffset, 25);

    setIsDraggingTest(true);
    setTestBlockPos({
      x: e.clientX - boxRect.left,
      y: e.clientY - boxRect.top - offset,
    });
    sound.playPickup();
  };

  const handleTestPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingTest || !testBoxRef.current) return;
    e.preventDefault();
    const boxRect = testBoxRef.current.getBoundingClientRect();
    const isTouch = e.pointerType === 'touch';
    const offset = isTouch ? settings.fingerOffset : Math.min(settings.fingerOffset, 25);

    setTestBlockPos({
      x: e.clientX - boxRect.left,
      y: e.clientY - boxRect.top - offset,
    });
  };

  const handleTestPointerUp = () => {
    if (isDraggingTest) {
      setIsDraggingTest(false);
      setTestBlockPos(null);
      sound.playPlace();
    }
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="settings-title">
      <div className="modal-content settings-modal-content">
        <div className="modal-header">
          <h2 id="settings-title" className="modal-title">SETTINGS</h2>
          <button className="close-btn" onClick={onClose} aria-label="Close settings">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="settings-list">
          {/* Sound Toggle */}
          <div className="settings-row">
            <div className="settings-row-label">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                {settings.soundEnabled && (
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                )}
              </svg>
              <span>Sound Effects</span>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={settings.soundEnabled}
                onChange={toggleSound}
              />
              <span className="slider" />
            </label>
          </div>

          {/* Haptics Toggle */}
          <div className="settings-row">
            <div className="settings-row-label">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8a6 6 0 0 1 0 8M6 8a6 6 0 0 0 0 8M2 10a10 10 0 0 0 0 4M22 10a10 10 0 0 1 0 4" />
                <rect x="9" y="5" width="6" height="14" rx="2" />
              </svg>
              <span>Haptic Vibration</span>
            </div>
            <label className="switch">
              <input
                type="checkbox"
                checked={settings.hapticsEnabled}
                onChange={toggleHaptics}
              />
              <span className="slider" />
            </label>
          </div>
        </div>

        {/* CONTROLS & ERGONOMICS SECTION */}
        <div className="settings-section">
          <div className="settings-section-header">
            <span className="settings-section-title">TOUCH & DRAG CONTROLS</span>
          </div>

          {/* Drag Sensitivity */}
          <div className="settings-control-card">
            <div className="control-card-header">
              <span className="control-card-label">Drag Sensitivity</span>
              <span className="control-card-value">{Math.round(settings.dragSensitivity * 100)}%</span>
            </div>

            <div className="control-presets-row">
              <button
                type="button"
                className={`preset-chip ${settings.dragSensitivity === 0.55 ? 'active' : ''}`}
                onClick={() => setSensitivity(0.55)}
              >
                Low
              </button>
              <button
                type="button"
                className={`preset-chip ${settings.dragSensitivity === 0.85 ? 'active' : ''}`}
                onClick={() => setSensitivity(0.85)}
              >
                Medium
              </button>
              <button
                type="button"
                className={`preset-chip ${settings.dragSensitivity === 1.0 ? 'active' : ''}`}
                onClick={() => setSensitivity(1.0)}
              >
                High
              </button>
            </div>

            <input
              type="range"
              min="0.30"
              max="1.00"
              step="0.05"
              value={settings.dragSensitivity}
              onChange={(e) => setSensitivity(parseFloat(e.target.value))}
              className="settings-slider"
              aria-label="Drag Sensitivity Slider"
            />
          </div>

          {/* Finger Offset */}
          <div className="settings-control-card">
            <div className="control-card-header">
              <span className="control-card-label">Finger-to-Block Gap (Offset)</span>
              <span className="control-card-value">{settings.fingerOffset} px</span>
            </div>

            <div className="control-presets-row">
              <button
                type="button"
                className={`preset-chip ${settings.fingerOffset === 40 ? 'active' : ''}`}
                onClick={() => setOffset(40)}
              >
                Small (40px)
              </button>
              <button
                type="button"
                className={`preset-chip ${settings.fingerOffset === 70 ? 'active' : ''}`}
                onClick={() => setOffset(70)}
              >
                Medium (70px)
              </button>
              <button
                type="button"
                className={`preset-chip ${settings.fingerOffset === 100 ? 'active' : ''}`}
                onClick={() => setOffset(100)}
              >
                Large (100px)
              </button>
            </div>

            <input
              type="range"
              min="20"
              max="140"
              step="5"
              value={settings.fingerOffset}
              onChange={(e) => setOffset(parseInt(e.target.value, 10))}
              className="settings-slider"
              aria-label="Finger Offset Slider"
            />
          </div>

          {/* Live Interactive Drag Test Area */}
          <div
            className="interactive-drag-pad"
            ref={testBoxRef}
            onPointerDown={handleTestPointerDown}
            onPointerMove={handleTestPointerMove}
            onPointerUp={handleTestPointerUp}
            onPointerCancel={handleTestPointerUp}
          >
            {!isDraggingTest && (
              <div className="drag-pad-hint">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 9l4-4 4 4M9 5v14M19 15l-4 4-4-4M15 19V5" />
                </svg>
                <span>Touch & drag here to test sensitivity & gap</span>
              </div>
            )}

            {/* Test Block */}
            <div
              className={`test-draggable-block ${isDraggingTest ? 'dragging' : ''}`}
              style={{
                left: testBlockPos ? `${testBlockPos.x}px` : '50%',
                top: testBlockPos ? `${testBlockPos.y}px` : '50%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div className="test-block-tile" />
              <div className="test-block-tile" />
            </div>
          </div>
        </div>

        {/* Dynamic Themes Gallery */}
        <div className="themes-section">
          <div className="themes-section-header">
            <span className="themes-section-title">THEMES</span>
            <span className="themes-section-count">
              {stats.unlockedThemeIds.length} / {THEMES.length} Unlocked
            </span>
          </div>

          <div className="themes-grid">
            {THEMES.map(theme => {
              const isUnlocked = stats.unlockedThemeIds.includes(theme.id);
              const isActive = settings.activeThemeId === theme.id;

              return (
                <div
                  key={theme.id}
                  className={`theme-card ${isActive ? 'active' : ''} ${!isUnlocked ? 'locked' : ''}`}
                  onClick={() => isUnlocked && selectTheme(theme.id)}
                  role="button"
                  tabIndex={isUnlocked ? 0 : -1}
                  aria-label={`${theme.name} Theme, ${isActive ? 'Active' : isUnlocked ? 'Unlocked' : 'Locked'}`}
                >
                  <div className="theme-card-header">
                    <div className="theme-card-info">
                      <span className="theme-card-name">{theme.name}</span>
                      <span className="theme-card-sub">{theme.subtitle}</span>
                    </div>

                    <div className="theme-card-status">
                      {isActive ? (
                        <span className="theme-active-tag">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ display: 'inline-block', verticalAlign: '-1px', marginRight: '3px' }}>
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          ACTIVE
                        </span>
                      ) : isUnlocked ? (
                        <span className="theme-unlocked-tag">UNLOCKED</span>
                      ) : (
                        <span className="theme-locked-tag">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ display: 'inline-block', verticalAlign: '-1px', marginRight: '3px' }}>
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                          </svg>
                          LOCKED
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Swatches */}
                  <div className="theme-card-swatches">
                    <div className="swatch-bg" style={{ backgroundColor: theme.background }} title="Background" />
                    <div className="swatch-board" style={{ backgroundColor: theme.board }} title="Board" />
                    {theme.blockColors.slice(0, 4).map((c, i) => (
                      <div key={i} className="swatch-block" style={{ backgroundColor: c }} />
                    ))}
                  </div>

                  {!isUnlocked && (
                    <div className="theme-unlock-hint">
                      {theme.unlockRequirement}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Developer / Testing Milestone Trigger */}
        <div className="dev-test-box">
          <button
            className="dev-unlock-button"
            onClick={onTriggerTestUnlock}
            title="Simulates an achievement to unlock the next progressive theme"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ display: 'inline-block', verticalAlign: '-2px', marginRight: '5px' }}>
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            Test Next Theme Unlock
          </button>
        </div>

        {/* How to play card */}
        <div className="rules-card">
          <strong>HOW TO PLAY & UNLOCK THEMES</strong>
          <ul>
            <li>Drag blocks onto the 8×8 grid to clear lines.</li>
            <li><strong>ALL CLEAR</strong>: Clear every block on the board for a +1,000 pt bonus and an instant theme unlock!</li>
            <li>Reach milestone scores to unlock progressive themes.</li>
          </ul>
        </div>

        <button className="danger-button" onClick={handleReset}>
          Reset High Score & Stats ({stats.gamesPlayed} games played)
        </button>
      </div>
    </div>
  );
};
