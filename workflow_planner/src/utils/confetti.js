import confetti from 'canvas-confetti';

export const triggerCompletionConfetti = () => {
  confetti({
    particleCount: 50,
    spread: 60,
    origin: { y: 0.7 },
    colors: ['#6366F1', '#A855F7', '#10B981', '#F59E0B', '#06B6D4'],
    disableForReducedMotion: true
  });
};

export const triggerAllDoneConfetti = () => {
  const end = Date.now() + 1.2 * 1000;
  const colors = ['#6366F1', '#A855F7', '#10B981', '#F59E0B'];

  (function frame() {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: colors
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: colors
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
};

