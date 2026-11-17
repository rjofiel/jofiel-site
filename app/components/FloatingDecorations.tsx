import { Decoration } from './Decoration';
import { useHydrated } from '@/lib/useHydrated';

interface FloatingDecorationsProps {
  count?: number;
}

export const FloatingDecorations = ({ count = 10 }: FloatingDecorationsProps) => {
  if (!useHydrated()) return null;
  return <RandomDecorations count={count} />;
};

const RandomDecorations = ({ count }: { count: number }) => {
  const random = (min: number, max: number) => Math.random() * (max - min) + min;

  const MIN_DISTANCE = 20;
  const usedTops: number[] = [];
  const usedStarts: number[] = [];

  const decorations: {
    startX: string;
    endX: string;
    top: string;
    duration: string;
    delay: string;
  }[] = [];

  const generateUnique = (used: number[], min: number, max: number) => {
    let value: number;
    let tries = 0;
    do {
      value = random(min, max);
      tries++;
      if (tries > 100) break;
    } while (used.some(v => Math.abs(v - value) < MIN_DISTANCE));
    used.push(value);
    return value;
  };

  for (let i = 0; i < count; i++) {
    const startX = generateUnique(usedStarts, -20, 30);
    const endX = random(50, 100);
    const top = generateUnique(usedTops, 2, 95);
    const duration = `${random(16, 40)}s`;
    const delay = `${random(-10, -2)}s`;

    decorations.push({
      startX: `${startX}vw`,
      endX: `${endX}vw`,
      top: `${top}%`,
      duration,
      delay
    });
  }

  return (
    <div className='fixed inset-0 overflow-hidden pointer-events-none select-none'>
      {decorations.map((dec, i) => (
        <Decoration key={i} startX={dec.startX} endX={dec.endX} top={dec.top} duration={dec.duration} delay={dec.delay} />
      ))}
    </div>
  );
};
