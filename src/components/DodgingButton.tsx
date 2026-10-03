import { useCallback, useEffect, useRef, useState, type RefObject } from "react";

type Point = { x: number; y: number };

export type DodgingButtonProps = {
  text: string;
  onClick: () => void;
  maxDodges?: number;
  enabled?: boolean;
  mobileEnabled?: boolean;
  lines?: string[];
  avoidRef?: RefObject<HTMLElement | null>;
  onSettledChange?: (settled: boolean) => void;
  resetKey?: number;
};

const REST: Point = { x: 0, y: 0 };

function reducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function DodgingButton({
  text,
  onClick,
  maxDodges = 5,
  enabled = true,
  mobileEnabled = true,
  lines,
  avoidRef,
  onSettledChange,
  resetKey = 0,
}: DodgingButtonProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const offsetRef = useRef<Point>(REST);
  const countRef = useRef(0);
  const cooling = useRef(false);
  const suppressClick = useRef(false);
  const enabledRef = useRef(enabled);
  const mobileRef = useRef(mobileEnabled);
  const maxRef = useRef(maxDodges);
  const settledCb = useRef(onSettledChange);
  const avoid = useRef(avoidRef);
  const timers = useRef<number[]>([]);

  enabledRef.current = enabled;
  mobileRef.current = mobileEnabled;
  maxRef.current = maxDodges;
  settledCb.current = onSettledChange;
  avoid.current = avoidRef;

  const [offset, setOffset] = useState<Point>(REST);
  const [count, setCount] = useState(0);
  const [tilt, setTilt] = useState(0);
  const [scale, setScale] = useState(1);

  const sequence = lines && lines.length > 0 ? lines : [text];
  const settled = !enabled || count >= maxDodges;
  const visible = sequence[Math.min(count, sequence.length - 1)] ?? text;

  const later = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timers.current.push(id);
  }, []);

  useEffect(() => {
    countRef.current = 0;
    offsetRef.current = REST;
    setCount(0);
    setOffset(REST);
    setTilt(0);
    setScale(1);
    settledCb.current?.(false);
  }, [resetKey]);

  useEffect(() => {
    const pending = timers.current;
    return () => {
      pending.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  const nudge = useCallback(
    (kind: "mouse" | "touch") => {
      if (!enabledRef.current || countRef.current >= maxRef.current || cooling.current) {
        return;
      }
      const stage = stageRef.current;
      const button = buttonRef.current;
      if (!stage || !button) return;

      const rect = button.getBoundingClientRect();
      const stageRect = stage.getBoundingClientRect();
      const reach = kind === "touch" ? 46 : 92;
      let dx = (Math.random() * 2 - 1) * reach;
      const dy =
        (Math.random() < 0.45 ? -1 : 1) *
        (kind === "touch" ? 26 + Math.random() * 22 : 34 + Math.random() * 46);
      if (Math.abs(dx) < 16) dx += dx < 0 ? -20 : 20;

      let nextLeft = rect.left + dx;
      let nextTop = rect.top + dy;
      const margin = 10;
      nextLeft = Math.min(Math.max(nextLeft, margin), window.innerWidth - margin - rect.width);
      nextTop = Math.min(Math.max(nextTop, margin), window.innerHeight - margin - rect.height);

      const minLeft = stageRect.left + 6;
      const maxLeft = stageRect.right - 6 - rect.width;
      const minTop = stageRect.top + 6;
      const maxTop = stageRect.bottom - 6 - rect.height;
      if (maxTop < minTop) return;

      nextLeft = Math.min(Math.max(nextLeft, minLeft), Math.max(minLeft, maxLeft));
      nextTop = Math.min(Math.max(nextTop, minTop), maxTop);

      const blocker = avoid.current?.current?.getBoundingClientRect();
      if (blocker) {
        const overlaps =
          nextLeft < blocker.right + 10 &&
          nextLeft + rect.width > blocker.left - 10 &&
          nextTop < blocker.bottom + 10 &&
          nextTop + rect.height > blocker.top - 10;
        if (overlaps) {
          const below = blocker.bottom + 12;
          if (below <= maxTop) nextTop = below;
          else return;
        }
      }

      const appliedX = nextLeft - rect.left;
      const appliedY = nextTop - rect.top;
      if (Math.hypot(appliedX, appliedY) < 12) return;

      const next = {
        x: offsetRef.current.x + appliedX,
        y: offsetRef.current.y + appliedY,
      };
      const nextCount = countRef.current + 1;
      countRef.current = nextCount;
      offsetRef.current = next;
      setOffset(next);
      setCount(nextCount);
      const calm = reducedMotion();
      setTilt(calm ? 0 : Math.round((Math.random() * 14 - 7) * 10) / 10);
      setScale(calm ? 1 : nextCount % 2 === 0 ? 0.96 : 1.05);
      cooling.current = true;
      later(() => {
        cooling.current = false;
      }, kind === "touch" ? 260 : 340);

      if (nextCount >= maxRef.current) {
        later(() => {
          offsetRef.current = REST;
          setOffset(REST);
          setTilt(0);
          setScale(1);
        }, calm ? 0 : 380);
        settledCb.current?.(true);
      }
    },
    [later],
  );

  useEffect(() => {
    if (!enabled || settled) return;
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const button = buttonRef.current;
      if (!button) return;
      const rect = button.getBoundingClientRect();
      const distance = Math.hypot(
        event.clientX - (rect.left + rect.width / 2),
        event.clientY - (rect.top + rect.height / 2),
      );
      const threshold = Math.min(rect.width * 0.42, 88) + 34;
      if (distance < threshold) nudge("mouse");
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [enabled, settled, nudge]);

  function handlePointerDown(event: React.PointerEvent<HTMLButtonElement>) {
    if (event.pointerType === "mouse") return;
    if (!mobileRef.current || !enabledRef.current || countRef.current >= maxRef.current) {
      return;
    }
    suppressClick.current = true;
    event.preventDefault();
    nudge("touch");
    later(() => {
      suppressClick.current = false;
    }, 420);
  }

  function handleClick() {
    if (suppressClick.current) {
      suppressClick.current = false;
      return;
    }
    onClick();
  }

  return (
    <div className="dodge-stage" ref={stageRef}>
      <button
        ref={buttonRef}
        type="button"
        className={settled ? "btn btn-no dodge-btn is-settled" : "btn btn-no dodge-btn"}
        style={{
          transform: `translate(calc(-50% + ${offset.x}px), ${offset.y}px) rotate(${tilt}deg) scale(${scale})`,
        }}
        onPointerDown={handlePointerDown}
        onClick={handleClick}
        aria-label="No"
      >
        {visible}
      </button>
    </div>
  );
}
