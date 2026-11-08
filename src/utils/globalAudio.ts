/**
 * Global Audio Manager for "BỤI PHẤN" (Nhạc: Vũ Hoàng · Lời: Lê Văn Lộc)
 *
 * Capabilities:
 * 1. Dual-source architecture:
 *    - Priority 1: Plays real MP3 file from `/assets/aistudio/B_i_Ph_n_9eaa576b.mp3` or `/assets/audio/bui-phan.mp3`
 *    - Priority 2: Built-in procedural orchestral acoustic piano synthesizer playing the EXACT melody of "Bụi Phấn".
 * 2. Fully global singleton:
 *    - Persists across all slides, modals, full-screen transitions, and re-renders.
 *    - Accurate pause/resume without restarting.
 *    - Volume control (0 - 100%), mute/unmute, looping.
 *    - Real-time audio waveform / spectrum analyzer for UI visualizers.
 */

import { BUI_PHAN_MELODY, MusicalNote } from './songScore';

export type AudioSourceType = 'file' | 'synth';

class GlobalAudioManager {
  private static instance: GlobalAudioManager | null = null;

  // HTMLAudioElement for user provided MP3/WAV files
  private audioElement: HTMLAudioElement | null = null;
  private hasCustomFile = true;

  // Web Audio Context for synthesizer & chimes
  private audioCtx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;

  // Synthesizer playback state
  private isPlaying = false;
  private isMuted = false;
  private volume = 0.55; // Default 55%
  private currentNoteIndex = 0;
  private synthTimeoutId: number | null = null;
  private activeOscillators: OscillatorNode[] = [];

  // Listeners for UI state update
  private listeners: Set<() => void> = new Set();

  private constructor() {
    this.initAudioElement();
  }

  public static getInstance(): GlobalAudioManager {
    if (!GlobalAudioManager.instance) {
      GlobalAudioManager.instance = new GlobalAudioManager();
    }
    return GlobalAudioManager.instance;
  }

  private initAudioElement() {
    if (typeof window === 'undefined') return;

    this.audioElement = new Audio();
    this.audioElement.loop = true;
    this.audioElement.volume = this.volume;
    this.audioElement.preload = 'auto';

    // Primary audio file paths for Bụi Phấn
    const audioCandidates = [
      '/assets/aistudio/B_i_Ph_n_9eaa576b.mp3',
      '/assets/audio/bui-phan.mp3',
      '/bui-phan.mp3',
      '/B_i_Ph_n_9eaa576b.mp3',
    ];

    // Set source immediately to enable synchronous mobile & desktop playback
    this.audioElement.src = audioCandidates[0];
    this.hasCustomFile = true;

    this.audioElement.addEventListener('canplay', () => {
      this.hasCustomFile = true;
      this.notify();
    });

    this.audioElement.addEventListener('ended', () => {
      if (this.hasCustomFile && this.isPlaying) {
        this.audioElement!.currentTime = 0;
        this.audioElement!.play().catch(() => {});
      }
    });

    this.audioElement.addEventListener('error', () => {
      // If primary path errors, try fallback
      if (this.audioElement && !this.audioElement.src.includes('bui-phan.mp3')) {
        this.audioElement.src = '/assets/audio/bui-phan.mp3';
        this.audioElement.load();
        return;
      }
      this.hasCustomFile = false;
      if (this.isPlaying) {
        this.startSynthPlayback();
      }
      this.notify();
    });
  }

  public initWebAudio() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioContextClass();

      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 64;

      this.masterGain = this.audioCtx.createGain();
      this.masterGain.gain.value = this.isMuted ? 0 : this.volume;

      this.analyser.connect(this.masterGain);
      this.masterGain.connect(this.audioCtx.destination);
    }

    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  /**
   * Start or resume playing "Bụi Phấn"
   */
  public async play(): Promise<boolean> {
    this.initWebAudio();
    this.isPlaying = true;

    if (this.hasCustomFile && this.audioElement && this.audioElement.src) {
      try {
        this.audioElement.volume = this.isMuted ? 0 : this.volume;
        await this.audioElement.play();
        this.notify();
        return true;
      } catch (err) {
        console.warn('Autoplay prevented or audio file error, starting synthesizer fallback', err);
        this.startSynthPlayback();
        this.notify();
        return true;
      }
    } else {
      this.startSynthPlayback();
      this.notify();
      return true;
    }
  }

  /**
   * Pause playback (retains current position)
   */
  public pause() {
    this.isPlaying = false;
    if (this.audioElement && !this.audioElement.paused) {
      this.audioElement.pause();
    }
    this.stopSynthPlayback(false); // Retain note index
    this.notify();
  }

  public togglePlay(): boolean {
    if (this.isPlaying) {
      this.pause();
      return false;
    } else {
      this.play();
      return true;
    }
  }

  public setVolume(val: number) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.audioElement) {
      this.audioElement.volume = this.isMuted ? 0 : this.volume;
    }
    if (this.masterGain && this.audioCtx) {
      this.masterGain.gain.setValueAtTime(
        this.isMuted ? 0 : this.volume,
        this.audioCtx.currentTime
      );
    }
    this.notify();
  }

  public getVolume(): number {
    return this.volume;
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
    if (this.audioElement) {
      this.audioElement.volume = muted ? 0 : this.volume;
    }
    if (this.masterGain && this.audioCtx) {
      this.masterGain.gain.setValueAtTime(
        muted ? 0 : this.volume,
        this.audioCtx.currentTime
      );
    }
    this.notify();
  }

  public toggleMute(): boolean {
    this.setMute(!this.isMuted);
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getSourceType(): AudioSourceType {
    return this.hasCustomFile ? 'file' : 'synth';
  }

  public getWaveformData(): Uint8Array {
    if (!this.analyser) {
      return new Uint8Array(32);
    }
    const data = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(data);
    return data;
  }

  /**
   * Procedural Orchestral Synthesizer for "Bài ca người giáo viên nhân dân"
   * Plays realistic rich acoustic piano harmonics + violin warmth + chord progression
   */
  private startSynthPlayback() {
    this.initWebAudio();
    if (!this.audioCtx || !this.analyser) return;

    if (this.synthTimeoutId) {
      clearTimeout(this.synthTimeoutId);
      this.synthTimeoutId = null;
    }

    const tempoBpm = 96; // Lively, heartwarming allegro moderato
    const beatDurationMs = (60 / tempoBpm) * 1000;

    const playNextNote = () => {
      if (!this.isPlaying || !this.audioCtx || !this.analyser) return;

      const score = BUI_PHAN_MELODY;
      const noteData = score[this.currentNoteIndex];
      const durationSec = (noteData.duration * beatDurationMs) / 1000;

      const now = this.audioCtx.currentTime;

      // 1. Lead Melody Note (Acoustic Piano & Flute Harmonic Blend)
      this.synthesizeRichNote(noteData.freq, now, durationSec);

      // 2. Harmonious Bass/Arpeggio Accompaniment on chord beats
      if (this.currentNoteIndex % 4 === 0) {
        const bassFreq = noteData.freq / 2;
        this.synthesizeBassChord(bassFreq, now, durationSec * 2);
      }

      // Advance to next note (looping continuously)
      this.currentNoteIndex = (this.currentNoteIndex + 1) % score.length;

      // Schedule next note
      this.synthTimeoutId = window.setTimeout(playNextNote, durationSec * 1000 * 0.94);
    };

    playNextNote();
  }

  private synthesizeRichNote(freq: number, startTime: number, duration: number) {
    if (!this.audioCtx || !this.analyser) return;

    // Harmonic layers for orchestral warmth
    const harmonics = [
      { type: 'triangle' as OscillatorType, mult: 1, gain: 0.22 },
      { type: 'sine' as OscillatorType, mult: 2, gain: 0.10 },
      { type: 'sine' as OscillatorType, mult: 3, gain: 0.04 },
    ];

    harmonics.forEach((h) => {
      const osc = this.audioCtx!.createOscillator();
      const gain = this.audioCtx!.createGain();

      osc.type = h.type;
      osc.frequency.setValueAtTime(freq * h.mult, startTime);

      // Warm piano/flute envelope
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(h.gain, startTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      osc.connect(gain);
      gain.connect(this.analyser!);

      osc.start(startTime);
      osc.stop(startTime + duration + 0.1);
    });
  }

  private synthesizeBassChord(rootFreq: number, startTime: number, duration: number) {
    if (!this.audioCtx || !this.analyser) return;

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(rootFreq, startTime);

    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(0.12, startTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + Math.min(3.5, duration));

    osc.connect(gain);
    gain.connect(this.analyser);

    osc.start(startTime);
    osc.stop(startTime + Math.min(3.5, duration) + 0.1);
  }

  private stopSynthPlayback(resetIndex = false) {
    if (this.synthTimeoutId) {
      clearTimeout(this.synthTimeoutId);
      this.synthTimeoutId = null;
    }
    if (resetIndex) {
      this.currentNoteIndex = 0;
    }
  }

  // Play delicate chime on clicks / envelope reveals
  public playChime(freqs: number[] = [523.25, 659.25, 783.99, 1046.5]) {
    if (this.isMuted) return;
    try {
      this.initWebAudio();
      if (!this.audioCtx || !this.masterGain) return;

      const now = this.audioCtx.currentTime;
      freqs.forEach((freq, index) => {
        const osc = this.audioCtx!.createOscillator();
        const gain = this.audioCtx!.createGain();

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
      // AudioContext blocked until interaction
    }
  }

  public subscribe(cb: () => void) {
    this.listeners.add(cb);
    return () => {
      this.listeners.delete(cb);
    };
  }

  private notify() {
    this.listeners.forEach((cb) => cb());
  }
}

export const globalAudio = GlobalAudioManager.getInstance();
