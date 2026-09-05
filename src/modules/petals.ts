/**
 * Falling Romantic Petals Canvas Visual Effect
 */
export function initPetals(canvasId: string) {
  const canvas = document.getElementById(canvasId) as HTMLCanvasElement | null;
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  interface Petal {
    x: number;
    y: number;
    size: number;
    speedX: number;
    speedY: number;
    rotation: number;
    rotationSpeed: number;
    opacity: number;
    color: string;
  }

  const petals: Petal[] = [];
  const petalCount = window.innerWidth < 768 ? 22 : 36;
  const colors = [
    'rgba(244, 214, 186, ', // Champagne peach
    'rgba(235, 188, 172, ', // Rose gold
    'rgba(255, 230, 210, ', // Soft warm cream
    'rgba(212, 175, 55, '   // Subtle gold luster
  ];

  for (let i = 0; i < petalCount; i++) {
    petals.push(createPetal(true));
  }

  function createPetal(randomY: boolean = false): Petal {
    return {
      x: Math.random() * width,
      y: randomY ? Math.random() * height : -20,
      size: Math.random() * 8 + 6,
      speedX: (Math.random() - 0.5) * 1.2 + 0.4,
      speedY: Math.random() * 1.2 + 0.8,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.03,
      opacity: Math.random() * 0.4 + 0.25,
      color: colors[Math.floor(Math.random() * colors.length)]
    };
  }

  let animationFrameId: number;

  function render() {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < petals.length; i++) {
      const p = petals[i];
      p.x += p.speedX;
      p.y += p.speedY;
      p.rotation += p.rotationSpeed;

      // Draw petal shape
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.beginPath();
      ctx.fillStyle = `${p.color}${p.opacity})`;
      // Realistic curved petal curve
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-p.size / 2, -p.size, -p.size, p.size / 2, 0, p.size);
      ctx.bezierCurveTo(p.size, p.size / 2, p.size / 2, -p.size, 0, 0);
      ctx.fill();
      ctx.restore();

      // Reset when falling beyond viewport
      if (p.y > height + 20 || p.x < -30 || p.x > width + 30) {
        petals[i] = createPetal(false);
      }
    }

    animationFrameId = requestAnimationFrame(render);
  }

  render();

  // Clean up if needed
  return () => {
    cancelAnimationFrame(animationFrameId);
  };
}
