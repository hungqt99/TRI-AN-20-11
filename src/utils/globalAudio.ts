/**
 * Global Audio Manager & Playlist Controller
 * Tri Ân Thầy Cô 20/11 – Tổ Toán THPT Gia Hội
 *
 * Danh sách 3 ca khúc tri ân:
 * 1. Bụi Phấn (Nhạc: Vũ Hoàng · Thơ: Lê Văn Lộc)
 * 2. Nghề Giáo Tôi Yêu (Nhạc & Lời: Bùi Anh Tú · Thể hiện: Phạm Thùy Dung)
 * 3. Bài Ca Người Giáo Viên Nhân Dân (Sáng tác: Nhạc sĩ Hoàng Vân)
 *
 * Tính năng:
 * - Hỗ trợ phát cả 3 bài hát mượt mà trên Desktop và Điện thoại (iOS / Android)
 * - Chuyển đổi linh hoạt giữa các bài hát bất kỳ lúc nào (Next / Prev / Chọn trực tiếp)
 * - Tự động phát bài kế tiếp khi hết bài (Playlist Loop) hoặc Lặp lại 1 bài (Single Loop)
 * - Tích hợp hệ thống nhạc giao hưởng Synthesizer Web Audio dự phòng cho cả 3 ca khúc
 * - Bộ phân tích sóng âm (AnalyserNode) cho hiệu ứng Audio Visualizer động
 */

import {
  BUI_PHAN_MELODY,
  BAI_CA_NGUOI_GIAO_VIEN_NHAN_DAN_MELODY,
  NGHE_GIAO_TOI_YEU_MELODY,
  MusicalNote,
} from './songScore';

export type AudioSourceType = 'file' | 'synth';
export type LoopMode = 'playlist' | 'single';

export interface SongItem {
  id: string;
  title: string;
  shortTitle: string;
  composer: string;
  artist: string;
  sources: string[];
  synthScore: MusicalNote[];
  tempoBpm: number;
}

export const PLAYLIST: SongItem[] = [
  {
    id: 'bui-phan',
    title: 'Bụi Phấn',
    shortTitle: 'Bụi Phấn',
    composer: 'Vũ Hoàng · Thơ: Lê Văn Lộc',
    artist: 'Ca khúc tri ân truyền thống',
    sources: [
      '/assets/aistudio/B_i_Ph_n_9eaa576b.mp3',
      '/assets/audio/bui-phan.mp3',
      '/bui-phan.mp3',
    ],
    synthScore: BUI_PHAN_MELODY,
    tempoBpm: 96,
  },
  {
    id: 'nghe-giao-toi-yeu',
    title: 'Nghề Giáo Tôi Yêu',
    shortTitle: 'Nghề Giáo Tôi Yêu',
    composer: 'Bùi Anh Tú',
    artist: 'NSƯT Phạm Thùy Dung',
    sources: [
      '/assets/aistudio/NGH__GI_O_T_I_Y_U_-_PH_M_TH_Y_DUNG____B_I_H_T_NG_Y_NH__GI_O_VI_T_NAM_-__320_Kbps__5cec219d.mp3',
      '/assets/audio/nghe-giao-toi-yeu.mp3',
    ],
    synthScore: NGHE_GIAO_TOI_YEU_MELODY,
    tempoBpm: 88,
  },
  {
    id: 'bai-ca-nguoi-giao-vien-nhan-dan',
    title: 'Bài Ca Người Giáo Viên Nhân Dân',
    shortTitle: 'Bài Ca Người GVND',
    composer: 'Hoàng Vân',
    artist: 'Khúc ca tự hào & Hòa tấu',
    sources: [
      '/assets/aistudio/B_i_Ca_Ng__i_Gi_o_Vi_n_Nh_n_D_n_b1107779.mp3',
      '/assets/audio/bai-ca-nguoi-giao-vien-nhan-dan.mp3',
    ],
    synthScore: BAI_CA_NGUOI_GIAO_VIEN_NHAN_DAN_MELODY,
    tempoBpm: 94,
  },
];

class GlobalAudioManager {
  private static instance: GlobalAudioManager | null = null;

  // HTMLAudioElement for user provided MP3 files
  private audioElement: HTMLAudioElement | null = null;
  private hasCustomFile = true;
  private currentSourceCandidateIndex = 0;

  // Web Audio Context for synthesizer & chimes
  private audioCtx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;

  // Playlist State
  private currentSongIndex = 0;
  private loopMode: LoopMode = 'playlist';

  // Playback state
  private isPlaying = false;
  private isMuted = false;
  private volume = 0.55; // Default 55%
  private currentNoteIndex = 0;
  private synthTimeoutId: number | null = null;

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
    this.audioElement.volume = this.volume;
    this.audioElement.preload = 'auto';

    // Set first song source
    this.applyCurrentSongSource();

    this.audioElement.addEventListener('canplay', () => {
      this.hasCustomFile = true;
      this.notify();
    });

    this.audioElement.addEventListener('ended', () => {
      if (!this.isPlaying) return;

      if (this.loopMode === 'single') {
        if (this.audioElement) {
          this.audioElement.currentTime = 0;
          this.audioElement.play().catch(() => {});
        }
      } else {
        // Next song in playlist
        this.nextSong();
      }
    });

    this.audioElement.addEventListener('error', () => {
      const curSong = this.getCurrentSong();
      this.currentSourceCandidateIndex += 1;

      if (this.currentSourceCandidateIndex < curSong.sources.length) {
        // Try fallback source
        if (this.audioElement) {
          this.audioElement.src = curSong.sources[this.currentSourceCandidateIndex];
          this.audioElement.load();
          if (this.isPlaying) {
            this.audioElement.play().catch(() => {});
          }
        }
      } else {
        // Switch to synthesizer fallback if all file URLs fail
        this.hasCustomFile = false;
        if (this.isPlaying) {
          this.startSynthPlayback();
        }
        this.notify();
      }
    });
  }

  private applyCurrentSongSource() {
    if (!this.audioElement) return;
    const curSong = this.getCurrentSong();
    this.currentSourceCandidateIndex = 0;
    this.hasCustomFile = true;
    this.audioElement.src = curSong.sources[0];
    this.audioElement.currentTime = 0;
    this.audioElement.load();
  }

  public initWebAudio() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
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
   * Start or resume playing current song
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

  /**
   * Select a song from playlist by index (0, 1, 2)
   */
  public selectSong(index: number, autoPlay = true) {
    if (index < 0 || index >= PLAYLIST.length) return;
    const isDifferent = this.currentSongIndex !== index;
    this.currentSongIndex = index;
    this.currentNoteIndex = 0;

    this.stopSynthPlayback(true);

    if (this.audioElement) {
      this.audioElement.pause();
      this.applyCurrentSongSource();
    }

    if (autoPlay || this.isPlaying) {
      this.play();
    } else {
      this.notify();
    }
  }

  /**
   * Switch to next song in playlist
   */
  public nextSong(autoPlay = true) {
    const nextIdx = (this.currentSongIndex + 1) % PLAYLIST.length;
    this.selectSong(nextIdx, autoPlay);
  }

  /**
   * Switch to previous song in playlist
   */
  public prevSong(autoPlay = true) {
    const prevIdx = (this.currentSongIndex - 1 + PLAYLIST.length) % PLAYLIST.length;
    this.selectSong(prevIdx, autoPlay);
  }

  public getPlaylist(): SongItem[] {
    return PLAYLIST;
  }

  public getCurrentSong(): SongItem {
    return PLAYLIST[this.currentSongIndex];
  }

  public getCurrentSongIndex(): number {
    return this.currentSongIndex;
  }

  public getLoopMode(): LoopMode {
    return this.loopMode;
  }

  public setLoopMode(mode: LoopMode) {
    this.loopMode = mode;
    this.notify();
  }

  public toggleLoopMode() {
    this.loopMode = this.loopMode === 'playlist' ? 'single' : 'playlist';
    this.notify();
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
   * Procedural Orchestral Synthesizer for offline fallback
   */
  private startSynthPlayback() {
    this.initWebAudio();
    if (!this.audioCtx || !this.analyser) return;

    if (this.synthTimeoutId) {
      clearTimeout(this.synthTimeoutId);
      this.synthTimeoutId = null;
    }

    const curSong = this.getCurrentSong();
    const tempoBpm = curSong.tempoBpm || 92;
    const beatDurationMs = (60 / tempoBpm) * 1000;

    const playNextNote = () => {
      if (!this.isPlaying || !this.audioCtx || !this.analyser) return;

      const score = curSong.synthScore;
      if (!score || score.length === 0) return;

      const noteData = score[this.currentNoteIndex];
      const durationSec = (noteData.duration * beatDurationMs) / 1000;

      const now = this.audioCtx.currentTime;

      // 1. Lead Melody Note
      this.synthesizeRichNote(noteData.freq, now, durationSec);

      // 2. Harmonious Bass/Arpeggio Accompaniment on chord beats
      if (this.currentNoteIndex % 4 === 0) {
        const bassFreq = noteData.freq / 2;
        this.synthesizeBassChord(bassFreq, now, durationSec * 2);
      }

      // Advance to next note
      this.currentNoteIndex = (this.currentNoteIndex + 1) % score.length;

      // Schedule next note
      this.synthTimeoutId = window.setTimeout(playNextNote, durationSec * 1000 * 0.94);
    };

    playNextNote();
  }

  private synthesizeRichNote(freq: number, startTime: number, duration: number) {
    if (!this.audioCtx || !this.analyser) return;

    const harmonics = [
      { type: 'triangle' as OscillatorType, mult: 1, gain: 0.22 },
      { type: 'sine' as OscillatorType, mult: 2, gain: 0.1 },
      { type: 'sine' as OscillatorType, mult: 3, gain: 0.04 },
    ];

    harmonics.forEach((h) => {
      const osc = this.audioCtx!.createOscillator();
      const gain = this.audioCtx!.createGain();

      osc.type = h.type;
      osc.frequency.setValueAtTime(freq * h.mult, startTime);

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
