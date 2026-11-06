/**
 * Web Audio API procedural synthesizer for ambient music and delicate chimes.
 * 100% offline, zero external MP3 dependencies, guaranteed zero network errors.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isPlayingMusic = false;
  private musicInterval: number | null = null;
  private masterGain: GainNode | null = null;
  private isMuted = false;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.22;
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play a soft crystal bell/harp chime (used for clicks, flower reveals, envelope opening)
  playChime(freqs: number[] = [523.25, 659.25, 783.99, 1046.5]) {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

      const now = this.ctx.currentTime;
      freqs.forEach((freq, index) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + index * 0.08);

        gain.gain.setValueAtTime(0, now + index * 0.08);
        gain.gain.linearRampToValueAtTime(0.15, now + index * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.08 + 1.2);

        osc.connect(gain);
        gain.connect(this.masterGain!);

        osc.start(now + index * 0.08);
        osc.stop(now + index * 0.08 + 1.25);
      });
    } catch {
      // AudioContext might be blocked until user gesture
    }
  }

  // Play a gentle paper unfold sound effect
  playPaperSound() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

      const now = this.ctx.currentTime;
      const bufferSize = this.ctx.sampleRate * 0.25;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 1200;
      filter.Q.value = 3;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      noise.start(now);
    } catch {
      // Ignore
    }
  }

  // Procedural lyrical ambient piano/chime melody generator (Canon / Pentatonic in F Major)
  startAmbientMusic() {
    if (this.isPlayingMusic) return;
    this.isPlayingMusic = true;

    try {
      this.initContext();
    } catch {
      return;
    }

    const chords = [
      [349.23, 440.0, 523.25], // F major (F4, A4, C5)
      [261.63, 329.63, 392.0], // C major (C4, E4, G4)
      [220.0, 261.63, 329.63], // D minor (D4, F4, A4)
      [174.61, 220.0, 261.63], // Bb major (Bb3, D4, F4)
    ];

    const melodyNotes = [
      523.25, 587.33, 659.25, 698.46, 783.99, 880.0, 1046.5,
    ];

    let chordIndex = 0;
    let step = 0;

    const playStep = () => {
      if (!this.isPlayingMusic || !this.ctx || !this.masterGain) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      const now = this.ctx.currentTime;

      // Play soft warm pad / bass note on chord boundaries
      if (step % 4 === 0) {
        const chord = chords[chordIndex % chords.length];
        chordIndex++;

        chord.forEach((freq, idx) => {
          const osc = this.ctx!.createOscillator();
          const gain = this.ctx!.createGain();

          osc.type = idx === 0 ? 'triangle' : 'sine';
          osc.frequency.setValueAtTime(freq / 2, now);

          gain.gain.setValueAtTime(0, now);
          gain.gain.linearRampToValueAtTime(0.035, now + 0.4);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 3.8);

          osc.connect(gain);
          gain.connect(this.masterGain!);

          osc.start(now);
          osc.stop(now + 4.0);
        });
      }

      // Play delicate bell melody note
      if (Math.random() > 0.25) {
        const note = melodyNotes[Math.floor(Math.random() * melodyNotes.length)];
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(note, now);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.045, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 1.9);
      }

      step++;
    };

    // Play immediately then loop at 1.1s cadence
    playStep();
    this.musicInterval = window.setInterval(playStep, 1100);
  }

  stopAmbientMusic() {
    this.isPlayingMusic = false;
    if (this.musicInterval !== null) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }

  toggleMusic(): boolean {
    if (this.isPlayingMusic) {
      this.stopAmbientMusic();
      return false;
    } else {
      this.startAmbientMusic();
      return true;
    }
  }

  isMusicActive(): boolean {
    return this.isPlayingMusic;
  }

  setMute(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(muted ? 0 : 0.22, this.ctx.currentTime);
    }
  }

  getMute(): boolean {
    return this.isMuted;
  }
}

export const soundEngine = new SoundEngine();
