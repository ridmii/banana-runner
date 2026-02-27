let ctx;
let unlocked = false;

export function initAudio() {
  try {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    unlocked = true;
  } catch (_) {
    // ignore
  }
}

function ensureCtx() {
  if (!ctx) {
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
    } catch (_) {
      return null;
    }
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

export function playCollect() {
  const audio = ensureCtx();
  if (!audio) return;
  const t0 = audio.currentTime;
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(660, t0);
  osc.frequency.exponentialRampToValueAtTime(990, t0 + 0.08);
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(0.2, t0 + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.12);
  osc.connect(gain).connect(audio.destination);
  osc.start(t0);
  osc.stop(t0 + 0.14);
}

export function playError() {
  const audio = ensureCtx();
  if (!audio) return;
  const t0 = audio.currentTime;
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = 'square';
  osc.frequency.setValueAtTime(220, t0);
  gain.gain.setValueAtTime(0.001, t0);
  gain.gain.exponentialRampToValueAtTime(0.12, t0 + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.12);
  osc.connect(gain).connect(audio.destination);
  osc.start(t0);
  osc.stop(t0 + 0.13);
}

export function playSuccess() {
  const audio = ensureCtx();
  if (!audio) return;
  const t0 = audio.currentTime;
  const o1 = audio.createOscillator();
  const g1 = audio.createGain();
  o1.type = 'sine';
  o1.frequency.setValueAtTime(523.25, t0); // C5
  g1.gain.setValueAtTime(0.0001, t0);
  g1.gain.exponentialRampToValueAtTime(0.18, t0 + 0.01);
  g1.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.18);
  o1.connect(g1).connect(audio.destination);
  o1.start(t0);
  o1.stop(t0 + 0.2);
}
