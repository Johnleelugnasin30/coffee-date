type SoundToggleProps = {
  on: boolean;
  onToggle: () => void;
};

export function SoundToggle({ on, onToggle }: SoundToggleProps) {
  return (
    <button
      type="button"
      className={on ? "sound-toggle is-on" : "sound-toggle"}
      aria-pressed={on}
      aria-label={on ? "Turn sound off" : "Turn sound on"}
      onClick={onToggle}
    >
      <span aria-hidden="true">{on ? "🔊" : "🔈"}</span>
      {on ? "Sound on" : "Sound off"}
    </button>
  );
}
