import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { invitation } from "../config/invitation";
import { useReducedMotion } from "../lib/motion";
import { CoffeeAnimation } from "./CoffeeAnimation";
import { DodgingButton } from "./DodgingButton";
import { InvitationCard } from "./InvitationCard";

type QuestionScreenProps = {
  resetKey: number;
  onYes: () => void;
  onNo: () => void;
};

export function QuestionScreen({ resetKey, onYes, onNo }: QuestionScreenProps) {
  const reduced = useReducedMotion();
  const yesRef = useRef<HTMLButtonElement>(null);
  const cardRef = useRef<HTMLElement>(null);
  const lastWhisper = useRef(0);
  const [stopped, setStopped] = useState(false);
  const [whisperIndex, setWhisperIndex] = useState(0);
  const [cursorWhisper, setCursorWhisper] = useState<{
    id: number;
    text: string;
    x: number;
    y: number;
  } | null>(null);

  const { question, coffeeMessage, emoji, customMessages, whispers, senderName } = invitation;
  const heading = question.includes(emoji.coffee) ? question : `${question} ${emoji.coffee}`;

  useEffect(() => {
    setStopped(false);
  }, [resetKey]);

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => {
      setWhisperIndex((current) => (current + 1) % whispers.length);
    }, 4200);
    return () => window.clearInterval(id);
  }, [reduced, whispers.length]);

  useEffect(() => {
    if (!cursorWhisper) return;
    const id = window.setTimeout(() => setCursorWhisper(null), 1700);
    return () => window.clearTimeout(id);
  }, [cursorWhisper]);

  function handlePointerMove(event: ReactPointerEvent<HTMLElement>) {
    if (reduced || event.pointerType !== "mouse") return;
    const target = event.target;
    if (target instanceof Element && target.closest("button")) return;
    const now = Date.now();
    if (now - lastWhisper.current < 2600) return;
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    lastWhisper.current = now;
    setCursorWhisper({
      id: now,
      text: whispers[Math.floor(Math.random() * whispers.length)] ?? whispers[0],
      x: Math.min(Math.max(event.clientX - rect.left, 72), rect.width - 72),
      y: Math.min(Math.max(event.clientY - rect.top, 28), rect.height - 28),
    });
  }

  return (
    <InvitationCard>
      <article ref={cardRef} onPointerMove={handlePointerMove}>
        <CoffeeAnimation mode="hero" />
        <p className="eyebrow">just one question</p>
        <h1 tabIndex={-1}>{heading}</h1>
        <p className="lede">{coffeeMessage}</p>
        <p className="whisper-line" aria-hidden="true">
          {whispers[whisperIndex]}
        </p>
        {cursorWhisper ? (
          <span
            className="cursor-whisper"
            style={{ left: cursorWhisper.x, top: cursorWhisper.y }}
            aria-hidden="true"
          >
            {cursorWhisper.text}
          </span>
        ) : null}
        <div className="choices">
          <button ref={yesRef} type="button" className="btn btn-yes" onClick={onYes}>
            YES {emoji.heart}
          </button>
          <DodgingButton
            text={invitation.noButtonLines[0]}
            lines={invitation.noButtonLines}
            maxDodges={invitation.maxDodges}
            enabled
            mobileEnabled
            avoidRef={yesRef}
            resetKey={resetKey}
            onSettledChange={setStopped}
            onClick={onNo}
          />
        </div>
        <p className="settle-note" role="status">
          {stopped ? customMessages.stopRunning : ""}
        </p>
        <button type="button" className="btn btn-text" onClick={onNo}>
          {customMessages.honestNo}
        </button>
        <p className="hint">No may wander for a moment. It always comes back.</p>
        <p className="sr-only">
          The No button stops moving after a few tries. You can also activate it with the
          keyboard immediately, or use {customMessages.honestNo}
        </p>
        <p className="signoff">— {senderName}</p>
      </article>
    </InvitationCard>
  );
}
