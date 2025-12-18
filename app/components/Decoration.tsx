interface DecorationProps {
  className?: string;
  startX?: string;
  endX?: string;
  duration?: string;
  delay?: string;
  top?: string;    // opcional para posición vertical
  bottom?: string; // opcional
  left?: string;   // opcional
  right?: string;  // opcional
}

export const Decoration = ({
  className = "",
  startX = "0vw",
  endX = "100vw",
  duration = "10s",
  delay = "0s",
  top,
  bottom,
  left,
  right,
}: DecorationProps) => {
  return (
    <span
      className={`decoration-symbol text-muted-foreground text-decoration float-decoration translation-x-decoration text-lg ${className}`}
      style={{
        '--start-x': startX,
        '--end-x': endX,
        '--duration': duration,
        '--delay': delay,
        top,
        bottom,
        left,
        right,
      } as React.CSSProperties}
    >
      {"><>"}
    </span>
  );
};
