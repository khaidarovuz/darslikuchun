/**
 * Web Audio API Sound Synthesizer for FC Mobile Pack Simulator
 * Generates dynamic audio without relying on external media files.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    // Check saved audio preference
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fc_sound_muted');
      if (saved === 'true') {
        this.isMuted = true;
      }
    }
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('fc_sound_muted', String(this.isMuted));
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // Pack rip / tear sound
  public playPackTear() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    
    // Noise buffer for the rip/tear texture
    const bufferSize = this.ctx.sampleRate * 0.4;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, t);
    filter.frequency.exponentialRampToValueAtTime(3200, t + 0.3);
    filter.Q.setValueAtTime(3, t);

    const gainNode = this.ctx.createGain();
    gainNode.gain.setValueAtTime(0.6, t);
    gainNode.gain.exponentialRampToValueAtTime(0.01, t + 0.35);

    whiteNoise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    whiteNoise.start(t);
    whiteNoise.stop(t + 0.4);

    // Sub whoosh
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(40, t + 0.3);
    oscGain.gain.setValueAtTime(0.4, t);
    oscGain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);
    osc.connect(oscGain);
    oscGain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.3);
  }

  // Suspense heartbeat pulse during walkout buildup
  public playHeartbeat() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(60, t);
    osc.frequency.exponentialRampToValueAtTime(35, t + 0.2);

    gain.gain.setValueAtTime(0.5, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.22);
  }

  // Card element reveal stinger (Flag, Position, Crest)
  public playRevealStinger(pitchFactor: number = 1.0) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'sawtooth';

    const baseFreq = 440 * pitchFactor;
    osc1.frequency.setValueAtTime(baseFreq, t);
    osc1.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, t + 0.25);

    osc2.frequency.setValueAtTime(baseFreq * 0.5, t);
    osc2.frequency.exponentialRampToValueAtTime(baseFreq * 0.75, t + 0.25);

    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + 0.3);
    osc2.stop(t + 0.3);
  }

  // Massive walkout bass drop & boom
  public playWalkoutDrop() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    // Sub rumble
    const sub = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(110, t);
    sub.frequency.exponentialRampToValueAtTime(32, t + 0.8);

    subGain.gain.setValueAtTime(0.8, t);
    subGain.gain.exponentialRampToValueAtTime(0.01, t + 0.9);

    sub.connect(subGain);
    subGain.connect(this.ctx.destination);
    sub.start(t);
    sub.stop(t + 0.9);

    // Sparkle chime chord
    const freqs = [523.25, 659.25, 783.99, 1046.5]; // C Major
    freqs.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const chordGain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t + idx * 0.04);
      chordGain.gain.setValueAtTime(0.15, t + idx * 0.04);
      chordGain.gain.exponentialRampToValueAtTime(0.001, t + 0.7);
      osc.connect(chordGain);
      chordGain.connect(this.ctx.destination);
      osc.start(t + idx * 0.04);
      osc.stop(t + 0.7);
    });

    this.playCrowdCheer();
  }

  // Stadium crowd roar
  public playCrowdCheer() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const bufferSize = this.ctx.sampleRate * 1.5;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(500, t);
    filter.frequency.exponentialRampToValueAtTime(800, t + 0.5);
    filter.frequency.exponentialRampToValueAtTime(300, t + 1.4);
    filter.Q.setValueAtTime(1.5, t);

    const gainNode = this.ctx.createGain();
    gainNode.gain.setValueAtTime(0.05, t);
    gainNode.gain.linearRampToValueAtTime(0.3, t + 0.3);
    gainNode.gain.exponentialRampToValueAtTime(0.01, t + 1.4);

    whiteNoise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    whiteNoise.start(t);
    whiteNoise.stop(t + 1.5);
  }

  // Golden coins clinking sound
  public playCoinSound() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const tones = [987.77, 1318.51, 1567.98]; // B5, E6, G6
    tones.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t + idx * 0.06);
      gain.gain.setValueAtTime(0.2, t + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.06 + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t + idx * 0.06);
      osc.stop(t + idx * 0.06 + 0.25);
    });
  }

  // Crisp UI Click
  public playClick() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.exponentialRampToValueAtTime(200, t + 0.04);
    gain.gain.setValueAtTime(0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.04);
  }
}

export const sounds = new SoundEngine();
