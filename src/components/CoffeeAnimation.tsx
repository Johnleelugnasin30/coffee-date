import { useReducedMotion } from "../lib/motion";

export function CoffeeAnimation({ mode = "drift" }: { mode?: "drift" | "hero" }) {
  const reduced = useReducedMotion();

  if (mode === "hero") {
    return (
      <svg className={reduced ? "cup is-still" : "cup"} viewBox="0 0 86 78" aria-hidden="true">
        <path
          className="steam"
          d="M30 24c2.2-4 .2-6 2.2-10"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          className="steam delay"
          d="M42 22c2.2-4 .2-6 2.2-10"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M18 30h36l-3 26.5A9 9 0 0 1 42.1 65H29.4a9 9 0 0 1-8.9-8.5L18 30z"
          fill="#fffaf6"
          stroke="#2c1c16"
          strokeWidth="2.2"
        />
        <path
          d="M54 35h6.5a7 7 0 0 1 0 14H54"
          fill="none"
          stroke="#2c1c16"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d="M30 46c2 2.1 4 2.1 6 0 2 2.1 4 2.1 6 0"
          fill="none"
          stroke="#9e3d4a"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (reduced) return null;

  return (
    <div className="float-layer cups" aria-hidden="true">
      {Array.from({ length: 5 }, (_, index) => (
        <span
          key={index}
          className="floater cup-floater"
          style={{
            left: `${12 + index * 18}%`,
            animationDelay: `${index * 1.1}s`,
            animationDuration: `${11 + index}s`,
          }}
        >
          ☕
        </span>
      ))}
    </div>
  );
}
