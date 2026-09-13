import confetti from 'canvas-confetti';

export function fireCelebrationConfetti() {
  try {
    const colors = ['#3B82F6', '#F59E0B', '#10B981', '#EF4444', '#8B5CF6', '#06B6D4'];

    // Burst from center-bottom
    confetti({
      particleCount: 70,
      spread: 80,
      origin: { y: 0.65 },
      colors,
      disableForReducedMotion: true,
      zIndex: 2000,
    });

    // Side cannons after slight delay
    setTimeout(() => {
      confetti({
        particleCount: 40,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors,
        disableForReducedMotion: true,
        zIndex: 2000,
      });
      confetti({
        particleCount: 40,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors,
        disableForReducedMotion: true,
        zIndex: 2000,
      });
    }, 200);
  } catch {
    // Ignore if canvas-confetti fails
  }
}
