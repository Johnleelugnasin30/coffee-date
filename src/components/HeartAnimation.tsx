import { useReducedMotion } from "../lib/motion";

const HEARTS = ["♥", "♡", "❤"];

export function HeartAnimation({
  count = 8,
  celebrate = false,
}: {
  count?: number;
  celebrate?: boolean;
}) {
  const reduced = useReducedMotion();
  if (reduced) return null;

  return (
    <div className={celebrate ? "float-layer celebrate" : "float-layer"} aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        <span
          key={index}
          className="floater heart"
          style={{
            left: `${(index * 13 + (celebrate ? 4 : 8)) % 100}%`,
            animationDelay: `${(index * 0.55) % 6}s`,
            animationDuration: `${(celebrate ? 4.2 : 9) + (index % 4)}s`,
            fontSize: `${celebrate ? 14 + (index % 5) * 3 : 12 + (index % 3) * 2}px`,
          }}
        >
          {HEARTS[index % HEARTS.length]}
        </span>
      ))}
    </div>
  );
}
