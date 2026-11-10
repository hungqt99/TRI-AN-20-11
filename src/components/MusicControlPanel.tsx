import React, { useEffect, useState, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  Music,
  Sliders,
  ChevronDown,
  ChevronUp,
  SkipBack,
  SkipForward,
  ListMusic,
  Repeat,
  Repeat1,
  Check,
} from 'lucide-react';
import { globalAudio, SongItem, LoopMode } from '../utils/globalAudio';

export const MusicControlPanel: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.55);
  const [sourceType, setSourceType] = useState<'file' | 'synth'>('synth');
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [currentSong, setCurrentSong] = useState<SongItem>(globalAudio.getCurrentSong());
  const [loopMode, setLoopMode] = useState<LoopMode>('playlist');
  const [playlist, setPlaylist] = useState<SongItem[]>(globalAudio.getPlaylist());
  const [expanded, setExpanded] = useState(false);
  const [waveformData, setWaveformData] = useState<Uint8Array>(new Uint8Array(16));
  const popoverRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Sync state with singleton audio manager
    const update = () => {
      setIsPlaying(globalAudio.getIsPlaying());
      setIsMuted(globalAudio.getIsMuted());
      setVolume(globalAudio.getVolume());
      setSourceType(globalAudio.getSourceType());
      setCurrentSongIndex(globalAudio.getCurrentSongIndex());
      setCurrentSong(globalAudio.getCurrentSong());
      setLoopMode(globalAudio.getLoopMode());
      setPlaylist(globalAudio.getPlaylist());
    };

    update();
    const unsubscribe = globalAudio.subscribe(update);

    // Waveform visualization ticker
    let animId: number;
    const ticker = () => {
      if (globalAudio.getIsPlaying() && !globalAudio.getIsMuted()) {
        const data = globalAudio.getWaveformData();
        setWaveformData(data.slice(0, 8));
      }
      animId = requestAnimationFrame(ticker);
    };
    animId = requestAnimationFrame(ticker);

    return () => {
      unsubscribe();
      cancelAnimationFrame(animId);
    };
  }, []);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setExpanded(false);
      }
    };
    if (expanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [expanded]);

  const handlePlayToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    globalAudio.togglePlay();
  };

  const handleNextSong = (e: React.MouseEvent) => {
    e.stopPropagation();
    globalAudio.nextSong(true);
  };

  const handlePrevSong = (e: React.MouseEvent) => {
    e.stopPropagation();
    globalAudio.prevSong(true);
  };

  const handleSelectSong = (index: number) => {
    globalAudio.selectSong(index, true);
  };

  const handleMuteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    globalAudio.toggleMute();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    globalAudio.setVolume(val);
  };

  const handleToggleLoopMode = () => {
    globalAudio.toggleLoopMode();
  };

  return (
    <div className="relative select-none text-xs" ref={popoverRef}>
      {/* Compact Status Button / Trigger in Header */}
      <div className="flex items-center gap-1 p-1 bg-slate-900/90 border border-amber-400/40 rounded-xl shadow-lg backdrop-blur-md">
        {/* Previous Track Button */}
        <button
          onClick={handlePrevSong}
          className="p-1.5 rounded-lg hover:bg-slate-800 text-stone-300 hover:text-amber-300 transition-colors hidden sm:flex items-center justify-center active:scale-95"
          title="Bài trước"
          aria-label="Bài trước"
        >
          <SkipBack className="w-3.5 h-3.5" />
        </button>

        {/* Play/Pause Button */}
        <button
          onClick={handlePlayToggle}
          className="w-8 h-8 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 flex items-center justify-center transition-all shadow active:scale-95 shrink-0"
          title={isPlaying ? `Tạm dừng: ${currentSong.title}` : `Phát: ${currentSong.title}`}
          aria-label="Phát hoặc tạm dừng"
        >
          {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
        </button>

        {/* Next Track Button */}
        <button
          onClick={handleNextSong}
          className="p-1.5 rounded-lg hover:bg-slate-800 text-stone-300 hover:text-amber-300 transition-colors hidden sm:flex items-center justify-center active:scale-95"
          title="Bài kế tiếp"
          aria-label="Bài kế tiếp"
        >
          <SkipForward className="w-3.5 h-3.5" />
        </button>

        {/* Music Title, Track Index & Mini Visualizer */}
        <div
          onClick={() => setExpanded(!expanded)}
          className="cursor-pointer flex items-center gap-2 px-1.5 sm:px-2 py-1 rounded-md hover:bg-slate-800/80 transition-colors"
          title="Nhấn để mở danh sách 3 bài hát & chỉnh âm lượng"
        >
          <div className="flex items-center gap-1.5">
            <Music className={`w-3.5 h-3.5 text-amber-300 shrink-0 ${isPlaying ? 'animate-bounce' : 'opacity-60'}`} />
            <div className="flex flex-col text-left max-w-[105px] sm:max-w-[140px] md:max-w-[160px]">
              <span className="text-[11px] font-semibold text-amber-200 leading-tight truncate">
                {currentSongIndex + 1}/3 · {currentSong.shortTitle}
              </span>
              <span className="text-[9px] text-stone-400 truncate flex items-center gap-1">
                <span>{currentSong.artist}</span>
                <span className="text-amber-400/60 hidden md:inline">·</span>
                <span className="hidden md:inline">{isPlaying ? `${Math.round(volume * 100)}%` : 'Tạm dừng'}</span>
              </span>
            </div>
          </div>

          {/* Mini dynamic animated sound bars */}
          <div className="flex items-end gap-0.5 h-3.5 w-5 shrink-0">
            {[0, 1, 2, 3, 4].map((i) => {
              const height = isPlaying && !isMuted ? Math.max(3, (waveformData[i] || 30) / 18) : 3;
              return (
                <span
                  key={i}
                  className="w-0.5 bg-gradient-to-t from-amber-500 to-amber-300 rounded-full transition-all duration-75"
                  style={{ height: `${height}px` }}
                />
              );
            })}
          </div>

          {expanded ? (
            <ChevronUp className="w-3.5 h-3.5 text-amber-300/80 shrink-0" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-stone-400 shrink-0" />
          )}
        </div>

        {/* Quick Mute/Unmute */}
        <button
          onClick={handleMuteToggle}
          className={`p-1.5 rounded-lg border transition-colors shrink-0 ${
            !isMuted
              ? 'text-amber-300 border-amber-400/30 bg-amber-500/10'
              : 'text-stone-400 border-slate-700 bg-slate-800'
          }`}
          title={isMuted ? 'Bật tiếng' : 'Tắt tiếng'}
        >
          {!isMuted ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Expanded Playlist & Audio Control Popover */}
      {expanded && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 max-w-[calc(100vw-1.5rem)] p-4 bg-[#09152e]/98 border border-amber-400/50 rounded-2xl shadow-2xl backdrop-blur-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200 text-stone-200">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-amber-400/20 pb-2.5 mb-3">
            <div className="flex items-center gap-2">
              <ListMusic className="w-4 h-4 text-amber-300" />
              <span className="text-xs uppercase tracking-wider text-amber-300 font-bold">
                Danh Sách 3 Ca Khúc Tri Ân
              </span>
            </div>
            <button
              onClick={handleToggleLoopMode}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-lg border text-[10px] transition-all ${
                loopMode === 'playlist'
                  ? 'bg-amber-500/20 text-amber-200 border-amber-400/40'
                  : 'bg-slate-800 text-stone-300 border-slate-700'
              }`}
              title={loopMode === 'playlist' ? 'Đang bật: Phát lần lượt cả 3 bài' : 'Đang bật: Lặp lại 1 bài'}
            >
              {loopMode === 'playlist' ? <Repeat className="w-3 h-3 text-amber-300" /> : <Repeat1 className="w-3 h-3 text-amber-400" />}
              <span>{loopMode === 'playlist' ? 'Phát hết 3 bài' : 'Lặp 1 bài'}</span>
            </button>
          </div>

          {/* Interactive Playlist of 3 Songs */}
          <div className="space-y-1.5 mb-3.5">
            {playlist.map((song, idx) => {
              const isSelected = idx === currentSongIndex;
              return (
                <div
                  key={song.id}
                  onClick={() => handleSelectSong(idx)}
                  className={`group relative flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-amber-500/20 via-amber-400/10 to-amber-500/5 border-amber-400/60 shadow-sm'
                      : 'bg-slate-900/60 hover:bg-slate-800/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    {/* Track Number / Indicator */}
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-amber-400 text-slate-950 shadow-sm'
                          : 'bg-slate-800 text-stone-400 group-hover:text-amber-300'
                      }`}
                    >
                      {idx + 1}
                    </div>

                    {/* Song Details */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`font-semibold text-xs leading-tight truncate ${
                            isSelected ? 'text-amber-200' : 'text-stone-200 group-hover:text-amber-100'
                          }`}
                        >
                          {song.title}
                        </span>
                        {isSelected && isPlaying && (
                          <span className="flex items-center gap-0.5 shrink-0 px-1.5 py-0.2 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-[9px] text-emerald-300 font-mono">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Đang phát
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-stone-400 truncate mt-0.5">
                        {song.composer} · <span className="text-stone-300">{song.artist}</span>
                      </div>
                    </div>
                  </div>

                  {/* Play state icon */}
                  <div className="ml-2 shrink-0">
                    {isSelected ? (
                      <div className="w-7 h-7 rounded-lg bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
                        {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
                      </div>
                    ) : (
                      <div className="w-7 h-7 rounded-lg opacity-0 group-hover:opacity-100 bg-slate-800 flex items-center justify-center text-stone-300 transition-opacity">
                        <Play className="w-3 h-3 ml-0.5 text-amber-300" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Playlist Controls (Prev - Play/Pause - Next) */}
          <div className="flex items-center justify-center gap-2 py-1 mb-3 bg-slate-950/40 p-2 rounded-xl border border-slate-800/80">
            <button
              onClick={handlePrevSong}
              className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-stone-200 text-xs rounded-lg transition-colors border border-slate-700 active:scale-95"
              title="Bài trước"
            >
              <SkipBack className="w-3.5 h-3.5" />
              <span>Trước</span>
            </button>

            <button
              onClick={handlePlayToggle}
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-lg transition-all shadow active:scale-95"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{isPlaying ? 'Tạm dừng' : 'Tiếp tục phát'}</span>
            </button>

            <button
              onClick={handleNextSong}
              className="flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-stone-200 text-xs rounded-lg transition-colors border border-slate-700 active:scale-95"
              title="Bài tiếp theo"
            >
              <span>Kế tiếp</span>
              <SkipForward className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Volume Control */}
          <div className="space-y-1.5 pt-1 border-t border-amber-400/10">
            <div className="flex justify-between items-center text-[11px] text-stone-300">
              <span className="flex items-center gap-1.5">
                <Sliders className="w-3 h-3 text-amber-300" />
                <span>Âm lượng hòa tấu:</span>
              </span>
              <span className="text-amber-300 font-bold font-mono">{Math.round(volume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
          </div>

          {/* Footer source badge */}
          <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-[9px] text-stone-400">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span>{sourceType === 'file' ? 'Bản MP3 chất lượng cao' : 'Bản hòa tấu Web Audio'}</span>
            </span>
            <button
              onClick={handleMuteToggle}
              className="text-amber-300 hover:underline flex items-center gap-1"
            >
              {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
              <span>{isMuted ? 'Mở âm thanh' : 'Tắt tiếng nhanh'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
