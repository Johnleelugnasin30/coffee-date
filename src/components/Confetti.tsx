import { useReducedMotion } from "../lib/motion";

const COLORS = ["#9e3d4a", "#f3cfc9", "#8a6248", "#fffaf6", "#e7b7ae"];

export function Confetti({ count = 26 }: { count?: number }) {
  const reduced = useReducedMotion();
  if (reduced) return null;

  return (
    <div className="float-layer confetti" aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        <span
          key={index}
          className="confetti-piece"
          style={{
            left: `${(index * 17) % 100}%`,
            background: COLORS[index % COLORS.length],
            animationDelay: `${(index % 8) * 0.08}s`,
            animationDuration: `${2.4 + (index % 5) * 0.28}s`,
            width: index % 3 === 0 ? 7 : 9,
            height: index % 2 === 0 ? 12 : 8,
            borderRadius: index % 4 === 0 ? "999px" : "2px",
          }}
        />
      ))}
    </div>
  );
}
