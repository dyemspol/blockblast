import React, { useState, useEffect, useRef, useCallback } from 'react';
import type {
  BoardGrid,
  TrayPiece,
  FloatingScore,
  Settings,
  GameStats,
} from './game/types';
import {
  createEmptyBoard,
  canPlacePiece,
  placePiece,
  findCompletedLines,
  clearLines,
  isGameOver,
  isBoardCompletelyEmpty,
  BOARD_SIZE,
} from './game/board';
import { generateThreePieces } from './game/pieces';
import { calculateScore } from './game/scoring';
import { sound } from './game/audio';
import { haptics } from './game/haptics';
import {
  loadStats,
  loadSettings,
  saveSettings,
  updateBestScore,
  incrementBoardClears,
  unlockThemeInStorage,
  resetAllStats,
} from './game/storage';
import { THEMES, getThemeById, getNextLockedTheme, applyTheme } from './game/themes';
import type { GameTheme } from './game/themes';
import { Header } from './components/Header';
import { ScorePanel } from './components/ScorePanel';
import { GameBoard } from './components/GameBoard';
import { PieceTray } from './components/PieceTray';
import { DraggingPieceOverlay } from './components/DraggingPieceOverlay';
import { FloatingScoreEffect } from './components/FloatingScoreEffect';
import { GameOverModal } from './components/GameOverModal';
import { SettingsModal } from './components/SettingsModal';
import { ThemeUnlockCelebration } from './components/ThemeUnlockCelebration';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';
import { UpdateManager } from './components/UpdateManager';

import './styles/main.css';
import './styles/board.css';
import './styles/modal.css';

export function App() {
  // --- Persistent Storage State ---
  const [settings, setSettings] = useState<Settings>(loadSettings);
  const [stats, setStats] = useState<GameStats>(loadStats);

  // Active theme instance
  const activeTheme = getThemeById(settings.activeThemeId);

  // --- Game Session State ---
  const [board, setBoard] = useState<BoardGrid>(createEmptyBoard);
  const [trayPieces, setTrayPieces] = useState<TrayPiece[]>(() =>
    generateThreePieces(createEmptyBoard(), activeTheme.blockColors)
  );
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [linesClearedThisGame, setLinesClearedThisGame] = useState<number>(0);
  const [maxComboThisGame, setMaxComboThisGame] = useState<number>(0);
  const [isGameOverState, setIsGameOverState] = useState<boolean>(false);
  const [isNewBestRecord, setIsNewBestRecord] = useState<boolean>(false);

  // --- Theme Progression & Celebration State ---
  const [unlockedThemeToCelebrate, setUnlockedThemeToCelebrate] = useState<GameTheme | null>(null);

  // --- Visual & Animation States ---
  const [clearingCells, setClearingCells] = useState<{ row: number; col: number }[] | null>(null);
  const [floatingScores, setFloatingScores] = useState<FloatingScore[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  // --- Drag & Drop Pointer State ---
  const [activeDragPiece, setActiveDragPiece] = useState<TrayPiece | null>(null);
  const [isTouchDevice, setIsTouchDevice] = useState<boolean>(false);
  const [pointerPos, setPointerPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [grabOffset, setGrabOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [ghostPlacement, setGhostPlacement] = useState<{
    startRow: number;
    startCol: number;
    cells: { row: number; col: number; color: string }[];
  } | null>(null);
  const [imminentClears, setImminentClears] = useState<{ rows: number[]; cols: number[] } | null>(null);

  // DOM Refs
  const boardRef = useRef<HTMLDivElement>(null);
  const appContainerRef = useRef<HTMLDivElement>(null);

  // Apply audio, haptics, and active theme CSS variables
  useEffect(() => {
    sound.setEnabled(settings.soundEnabled);
    haptics.setEnabled(settings.hapticsEnabled);
    applyTheme(activeTheme);
  }, [settings, activeTheme]);

  // Sync high score and score milestones
  useEffect(() => {
    if (score > stats.bestScore) {
      setIsNewBestRecord(true);
      const { stats: updatedStats } = updateBestScore(score, 0, combo);
      setStats(updatedStats);
    }

    // Check score milestones for theme progression
    if (score > 0) {
      for (const theme of THEMES) {
        if (
          theme.milestoneScore > 0 &&
          score >= theme.milestoneScore &&
          !stats.unlockedThemeIds.includes(theme.id)
        ) {
          // Unlock this theme!
          const { newlyUnlocked, stats: updatedStats } = unlockThemeInStorage(theme.id);
          if (newlyUnlocked) {
            setStats(updatedStats);
            setSettings(prev => {
              const updated = { ...prev, activeThemeId: theme.id };
              saveSettings(updated);
              return updated;
            });
            applyTheme(theme);
            sound.playThemeUnlock();
            setUnlockedThemeToCelebrate(theme);
            break;
          }
        }
      }
    }
  }, [score, stats.bestScore, stats.unlockedThemeIds, combo]);

  // Cell size calculation helper
  const getBoardCellMetrics = useCallback(() => {
    if (!boardRef.current) return { cellSize: 40, boardRect: null };
    const rect = boardRef.current.getBoundingClientRect();
    const innerWidth = rect.width - 16;
    const cellSize = (innerWidth - 4 * (BOARD_SIZE - 1)) / BOARD_SIZE;
    return { cellSize, boardRect: rect };
  }, []);

  // Theme progression unlocker
  const triggerUnlockNextTheme = useCallback(() => {
    setIsSettingsOpen(false);
    const nextTheme = getNextLockedTheme(stats.unlockedThemeIds);
    if (nextTheme) {
      const { stats: updatedStats } = unlockThemeInStorage(nextTheme.id);
      setStats(updatedStats);
      setSettings(prev => {
        const updated = { ...prev, activeThemeId: nextTheme.id };
        saveSettings(updated);
        return updated;
      });
      applyTheme(nextTheme);
      sound.playThemeUnlock();
      haptics.clear();
      setUnlockedThemeToCelebrate(nextTheme);
      return nextTheme;
    }
    return null;
  }, [stats.unlockedThemeIds]);

  // Check Game Over Helper
  const checkAndHandleGameOver = useCallback(
    (currentTray: TrayPiece[], currentBoard: BoardGrid) => {
      const over = isGameOver(currentTray, currentBoard);
      if (over) {
        setIsGameOverState(true);
        sound.playGameOver();
        haptics.gameOver();
        const { isNewBest, stats: updatedStats } = updateBestScore(
          score,
          linesClearedThisGame,
          maxComboThisGame
        );
        if (isNewBest) {
          setIsNewBestRecord(true);
        }
        setStats(updatedStats);
      }
    },
    [score, linesClearedThisGame, maxComboThisGame]
  );

  // Restart Game
  const handleRestart = useCallback(() => {
    const freshBoard = createEmptyBoard();
    const freshTray = generateThreePieces(freshBoard, activeTheme.blockColors);
    setBoard(freshBoard);
    setTrayPieces(freshTray);
    setScore(0);
    setCombo(0);
    setLinesClearedThisGame(0);
    setMaxComboThisGame(0);
    setIsGameOverState(false);
    setIsNewBestRecord(false);
    setClearingCells(null);
    setFloatingScores([]);
    sound.playClick();
  }, [activeTheme]);

  // --- Drag & Drop Handlers ---
  const handleStartDrag = (piece: TrayPiece, e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    const isTouch = e.pointerType === 'touch';
    setIsTouchDevice(isTouch);

    const { cellSize } = getBoardCellMetrics();
    const piecePxWidth = piece.shape.width * cellSize;
    const piecePxHeight = piece.shape.height * cellSize;

    // Mobile finger offset: place piece 75px above touch point so thumb does not obscure it
    const touchYOffset = isTouch ? 75 : 20;

    setGrabOffset({
      x: piecePxWidth / 2,
      y: piecePxHeight / 2,
    });

    setPointerPos({
      x: e.clientX,
      y: e.clientY - touchYOffset,
    });

    setActiveDragPiece(piece);
    sound.playPickup();
    haptics.pickup();
  };

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      if (!activeDragPiece) return;
      e.preventDefault();

      const touchYOffset = isTouchDevice ? 75 : 20;
      const curX = e.clientX;
      const curY = e.clientY - touchYOffset;

      setPointerPos({ x: curX, y: curY });

      // Determine board coordinates
      const { cellSize, boardRect } = getBoardCellMetrics();
      if (!boardRect) {
        setGhostPlacement(null);
        setImminentClears(null);
        return;
      }

      // Top-left of the dragged piece in viewport coordinates
      const pieceLeft = curX - grabOffset.x;
      const pieceTop = curY - grabOffset.y;

      // Board inner top-left (accounting for 8px padding)
      const boardInnerLeft = boardRect.left + 8;
      const boardInnerTop = boardRect.top + 8;

      const col = Math.round((pieceLeft - boardInnerLeft) / (cellSize + 4));
      const row = Math.round((pieceTop - boardInnerTop) / (cellSize + 4));

      if (canPlacePiece(activeDragPiece.shape, board, row, col)) {
        // Build ghost cells
        const ghostCellsList: { row: number; col: number; color: string }[] = [];
        for (let r = 0; r < activeDragPiece.shape.matrix.length; r++) {
          for (let c = 0; c < activeDragPiece.shape.matrix[r].length; c++) {
            if (activeDragPiece.shape.matrix[r][c] === 1) {
              ghostCellsList.push({
                row: row + r,
                col: col + c,
                color: activeDragPiece.shape.color,
              });
            }
          }
        }

        setGhostPlacement({
          startRow: row,
          startCol: col,
          cells: ghostCellsList,
        });

        // Simulate hypothetical board to detect imminent clears
        const simBoard = placePiece(activeDragPiece.shape, board, row, col);
        const { rows, cols } = findCompletedLines(simBoard);
        if (rows.length > 0 || cols.length > 0) {
          setImminentClears({ rows, cols });
        } else {
          setImminentClears(null);
        }
      } else {
        setGhostPlacement(null);
        setImminentClears(null);
      }
    },
    [activeDragPiece, isTouchDevice, grabOffset, getBoardCellMetrics, board]
  );

  const handlePointerUp = useCallback(() => {
    if (!activeDragPiece) return;

    if (ghostPlacement && canPlacePiece(activeDragPiece.shape, board, ghostPlacement.startRow, ghostPlacement.startCol)) {
      // Valid placement!
      const nextBoard = placePiece(
        activeDragPiece.shape,
        board,
        ghostPlacement.startRow,
        ghostPlacement.startCol
      );

      sound.playPlace();
      haptics.place();

      // Check lines cleared
      const lineClears = findCompletedLines(nextBoard);
      const linesCount = lineClears.rows.length + lineClears.cols.length;

      // Calculate score and combo
      const scoreResult = calculateScore(activeDragPiece.shape, linesCount, combo);
      setScore(s => s + scoreResult.totalPoints);
      setCombo(scoreResult.comboCount);

      if (scoreResult.comboCount > maxComboThisGame) {
        setMaxComboThisGame(scoreResult.comboCount);
      }

      // Mark piece placed
      const updatedTray = trayPieces.map(p =>
        p.id === activeDragPiece.id ? { ...p, isPlaced: true } : p
      );

      // Check if tray is empty
      const allPlaced = updatedTray.every(p => p.isPlaced);

      if (linesCount > 0) {
        // Play clear sound and haptics
        sound.playClear(linesCount, scoreResult.comboCount);
        haptics.clear();
        setLinesClearedThisGame(l => l + linesCount);

        // Add floating score badge
        if (boardRef.current) {
          const bRect = boardRef.current.getBoundingClientRect();
          const newFloating: FloatingScore = {
            id: `score-${Date.now()}`,
            points: scoreResult.totalPoints,
            comboCount: scoreResult.comboCount,
            linesCount,
            x: bRect.left + bRect.width / 2,
            y: bRect.top + bRect.height / 2,
          };
          setFloatingScores(prev => [...prev, newFloating]);
          setTimeout(() => {
            setFloatingScores(prev => prev.filter(item => item.id !== newFloating.id));
          }, 850);
        }

        // Trigger dissolution animation on cleared cells
        setClearingCells(lineClears.clearedCells);

        // After animation completes, clear lines and check for ALL CLEAR
        setTimeout(() => {
          const clearedBoard = clearLines(nextBoard, lineClears.rows, lineClears.cols);
          setClearingCells(null);
          setBoard(clearedBoard);

          // Check if player cleared the entire board!
          const isAllClear = isBoardCompletelyEmpty(clearedBoard);
          if (isAllClear) {
            // 1,000 pt ALL CLEAR bonus!
            setScore(s => s + 1000);
            incrementBoardClears();
            sound.playAllClear();

            // Add ALL CLEAR floating badge
            if (boardRef.current) {
              const bRect = boardRef.current.getBoundingClientRect();
              const allClearFloating: FloatingScore = {
                id: `all-clear-${Date.now()}`,
                points: 1000,
                comboCount: scoreResult.comboCount,
                linesCount,
                isAllClear: true,
                x: bRect.left + bRect.width / 2,
                y: bRect.top + bRect.height / 2 - 30,
              };
              setFloatingScores(prev => [...prev, allClearFloating]);
              setTimeout(() => {
                setFloatingScores(prev => prev.filter(item => item.id !== allClearFloating.id));
              }, 1200);
            }

            // Trigger theme unlock celebration!
            triggerUnlockNextTheme();
          }

          let finalTray = updatedTray;
          if (allPlaced) {
            finalTray = generateThreePieces(clearedBoard, activeTheme.blockColors);
            setTrayPieces(finalTray);
          } else {
            setTrayPieces(updatedTray);
          }

          checkAndHandleGameOver(finalTray, clearedBoard);
        }, 280);
      } else {
        // No lines cleared
        setBoard(nextBoard);

        let finalTray = updatedTray;
        if (allPlaced) {
          finalTray = generateThreePieces(nextBoard, activeTheme.blockColors);
          setTrayPieces(finalTray);
        } else {
          setTrayPieces(updatedTray);
        }

        checkAndHandleGameOver(finalTray, nextBoard);
      }
    }

    // Reset drag state
    setActiveDragPiece(null);
    setGhostPlacement(null);
    setImminentClears(null);
  }, [
    activeDragPiece,
    ghostPlacement,
    board,
    combo,
    maxComboThisGame,
    trayPieces,
    activeTheme,
    checkAndHandleGameOver,
    triggerUnlockNextTheme,
  ]);

  // Global window pointer listeners while dragging
  useEffect(() => {
    if (activeDragPiece) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
      window.addEventListener('pointercancel', handlePointerUp);
      return () => {
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
        window.removeEventListener('pointercancel', handlePointerUp);
      };
    }
  }, [activeDragPiece, handlePointerMove, handlePointerUp]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isSettingsOpen) setIsSettingsOpen(false);
        if (unlockedThemeToCelebrate) setUnlockedThemeToCelebrate(null);
      } else if (e.key === 'r' || e.key === 'R') {
        if (!isSettingsOpen && !unlockedThemeToCelebrate) {
          handleRestart();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSettingsOpen, unlockedThemeToCelebrate, handleRestart]);

  // Settings Handlers
  const handleUpdateSettings = (newSettings: Settings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const handleResetStats = () => {
    const fresh = resetAllStats();
    setStats(fresh);
    setSettings(loadSettings());
  };

  const { cellSize } = getBoardCellMetrics();

  return (
    <div className="game-app-container" ref={appContainerRef}>
      {/* PWA Auto-Update Indicator */}
      <UpdateManager />

      {/* PWA Install Button */}
      <PWAInstallPrompt />

      {/* Floating Scores Overlay */}
      <FloatingScoreEffect scores={floatingScores} />

      {/* Header */}
      <Header
        onOpenSettings={() => setIsSettingsOpen(true)}
        onRestartGame={handleRestart}
      />

      {/* Score Panel */}
      <ScorePanel
        score={score}
        bestScore={stats.bestScore}
        combo={combo}
      />

      {/* Playfield Area */}
      <div className="playfield-wrapper">
        <GameBoard
          ref={boardRef}
          board={board}
          ghostCells={ghostPlacement ? ghostPlacement.cells : null}
          imminentClears={imminentClears}
          clearingCells={clearingCells}
        />
      </div>

      {/* Piece Tray */}
      <PieceTray
        pieces={trayPieces}
        board={board}
        activeDragPieceId={activeDragPiece ? activeDragPiece.id : null}
        onStartDrag={handleStartDrag}
      />

      {/* Dragging Piece Floating Overlay */}
      {activeDragPiece && (
        <DraggingPieceOverlay
          shape={activeDragPiece.shape}
          x={pointerPos.x}
          y={pointerPos.y}
          cellSize={cellSize}
          grabOffset={grabOffset}
        />
      )}

      {/* Theme Unlock Celebration Overlay */}
      {unlockedThemeToCelebrate && (
        <ThemeUnlockCelebration
          theme={unlockedThemeToCelebrate}
          onDismiss={() => setUnlockedThemeToCelebrate(null)}
        />
      )}

      {/* Game Over Modal */}
      {isGameOverState && (
        <GameOverModal
          score={score}
          bestScore={stats.bestScore}
          isNewBest={isNewBestRecord}
          linesCleared={linesClearedThisGame}
          maxCombo={maxComboThisGame}
          onRestart={handleRestart}
        />
      )}

      {/* Settings Modal */}
      {isSettingsOpen && (
        <SettingsModal
          settings={settings}
          stats={stats}
          onUpdateSettings={handleUpdateSettings}
          onTriggerTestUnlock={triggerUnlockNextTheme}
          onResetStats={handleResetStats}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
