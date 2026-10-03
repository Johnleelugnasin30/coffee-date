export type SoundKind = "envelope" | "click" | "success";

let audio: AudioContext | null = null;
let ambience: { stop: () => void } | null = null;

function context() {
  if (!audio) {
    const Ctx =
      window.AudioContext ||
      (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) {
      throw new Error("Audio is not available in this browser.");
    }
    audio = new Ctx();
  }
  return audio;
}

export function unlockAudio() {
  const ctx = context();
  if (ctx.state === "suspended") {
    void ctx.resume();
  }
  return ctx;
}

function tone(
  ctx: AudioContext,
  frequency: number,
  when: number,
  duration: number,
  gainValue: number,
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.value = frequency;
  gain.gain.setValueAtTime(0.0001, when);
  gain.gain.exponentialRampToValueAtTime(gainValue, when + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, when + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(when);
  osc.stop(when + duration + 0.03);
}

export function playSound(kind: SoundKind) {
  const ctx = unlockAudio();
  const now = ctx.currentTime;

  if (kind === "click") {
    tone(ctx, 640, now, 0.07, 0.035);
    return;
  }

  if (kind === "envelope") {
    const duration = 0.32;
    const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * duration), ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 1400;
    const gain = ctx.createGain();
    gain.gain.value = 0.028;
    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    source.start();
    tone(ctx, 392, now, 0.16, 0.03);
    return;
  }

  [523.25, 659.25, 783.99, 1046.5].forEach((frequency, index) => {
    tone(ctx, frequency, now + index * 0.08, 0.32, 0.04);
  });
}

export function startAmbience() {
  if (ambience) return;
  const ctx = unlockAudio();
  const duration = 1.8;
  const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * duration), ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) {
    data[i] = Math.random() * 2 - 1;
  }
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 420;
  const gain = ctx.createGain();
  gain.gain.value = 0.01;
  source.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  source.start();
  ambience = {
    stop() {
      try {
        source.stop();
      } catch {
        /* already stopped */
      }
      source.disconnect();
    },
  };
}

export function stopAmbience() {
  ambience?.stop();
  ambience = null;
}
