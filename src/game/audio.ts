class SoundEngine {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;

  constructor() {
    // AudioContext will be initialized on first user interaction
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Subtle pickup blip
   */
  public playPickup() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(540, now + 0.06);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.06);
    } catch {
      // Ignore audio errors
    }
  }

  /**
   * Tactile placement snap / thud
   */
  public playPlace() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      // Low thud
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(50, now + 0.09);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);

      // High click
      const clickOsc = this.ctx.createOscillator();
      const clickGain = this.ctx.createGain();
      clickOsc.type = 'sine';
      clickOsc.frequency.setValueAtTime(800, now);
      clickOsc.frequency.exponentialRampToValueAtTime(200, now + 0.03);

      clickGain.gain.setValueAtTime(0.1, now);
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

      clickOsc.connect(clickGain);
      clickGain.connect(this.ctx.destination);

      clickOsc.start(now);
      clickOsc.stop(now + 0.03);
    } catch {
      // Ignore audio errors
    }
  }

  /**
   * Melodic chime on line clear with pitch escalating with combo
   */
  public playClear(linesCount: number, comboCount: number) {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Pentatonic / C-major scale frequencies
      const scale = [261.63, 329.63, 392.0, 523.25, 659.25, 783.99, 1046.5];
      const baseIndex = Math.min(comboCount - 1, scale.length - 1);
      const notesToPlay = Math.min(linesCount + 1, 4);

      for (let i = 0; i < notesToPlay; i++) {
        const noteIndex = Math.min(baseIndex + i, scale.length - 1);
        const freq = scale[noteIndex];
        const noteStart = now + i * 0.055;

        // Warm bell-like chime
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteStart);

        gain.gain.setValueAtTime(0.18, noteStart);
        gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(noteStart);
        osc.stop(noteStart + 0.35);

        // Overtone harmonic
        const harm = this.ctx.createOscillator();
        const harmGain = this.ctx.createGain();
        harm.type = 'triangle';
        harm.frequency.setValueAtTime(freq * 2, noteStart);

        harmGain.gain.setValueAtTime(0.05, noteStart);
        harmGain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.25);

        harm.connect(harmGain);
        harmGain.connect(this.ctx.destination);

        harm.start(noteStart);
        harm.stop(noteStart + 0.25);
      }
    } catch {
      // Ignore audio errors
    }
  }

  /**
   * Resonant game over sound
   */
  public playGameOver() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [392.0, 349.23, 311.13, 261.63]; // G4, F4, Eb4, C4

      notes.forEach((freq, idx) => {
        const start = now + idx * 0.12;
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.15, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(start);
        osc.stop(start + 0.4);
      });
    } catch {
      // Ignore audio errors
    }
  }

  /**
   * UI Click
   */
  public playClick() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.025);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.025);
    } catch {
      // Ignore audio errors
    }
  }

  /**
   * Triumphant Theme Unlock arpeggio fanfare
   */
  public playThemeUnlock() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 987.77, 1046.5, 1318.51]; // C5, E5, G5, B5, C6, E6

      notes.forEach((freq, idx) => {
        const start = now + idx * 0.075;
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.16, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.45);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(start);
        osc.stop(start + 0.45);

        // Shimmer overtone
        const harm = this.ctx!.createOscillator();
        const harmGain = this.ctx!.createGain();
        harm.type = 'triangle';
        harm.frequency.setValueAtTime(freq * 2, start);

        harmGain.gain.setValueAtTime(0.05, start);
        harmGain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);

        harm.connect(harmGain);
        harmGain.connect(this.ctx!.destination);

        harm.start(start);
        harm.stop(start + 0.35);
      });
    } catch {
      // Ignore audio errors
    }
  }

  /**
   * Resonant All Clear chord
   */
  public playAllClear() {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C major chord

      notes.forEach(freq => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now);
        osc.stop(now + 0.6);
      });
    } catch {
      // Ignore audio errors
    }
  }
}

export const sound = new SoundEngine();
