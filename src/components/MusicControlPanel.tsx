import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX, Play, Pause, Music, Sliders, ChevronDown, ChevronUp } from 'lucide-react';
import { globalAudio } from '../utils/globalAudio';

export const MusicControlPanel: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.45);
  const [sourceType, setSourceType] = useState<'file' | 'synth'>('synth');
  const [expanded, setExpanded] = useState(false);
  const [waveformData, setWaveformData] = useState<Uint8Array>(new Uint8Array(16));

  useEffect(() => {
    // Sync state with singleton audio manager
    const update = () => {
      setIsPlaying(globalAudio.getIsPlaying());
      setIsMuted(globalAudio.getIsMuted());
      setVolume(globalAudio.getVolume());
      setSourceType(globalAudio.getSourceType());
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

  const handlePlayToggle = () => {
    globalAudio.togglePlay();
  };

  const handleMuteToggle = () => {
    globalAudio.toggleMute();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    globalAudio.setVolume(val);
  };

  return (
    <div className="relative select-none text-xs">
      {/* Compact Status Button / Trigger */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 border border-amber-400/40 rounded-xl shadow-lg backdrop-blur-md">
        {/* Play/Pause Button */}
        <button
          onClick={handlePlayToggle}
          className="w-8 h-8 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 flex items-center justify-center transition-all shadow active:scale-95"
          title={isPlaying ? 'Tạm dừng nhạc' : 'Phát bản hòa tấu: Bài ca người giáo viên nhân dân'}
          aria-label="Phát hoặc tạm dừng"
        >
          {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
        </button>

        {/* Music Title & Audio Wave Visualizer */}
        <div
          onClick={() => setExpanded(!expanded)}
          className="cursor-pointer flex items-center gap-2 px-2 py-1 rounded-md hover:bg-slate-800/80 transition-colors"
          title="Nhấn để mở bảng chỉnh âm lượng"
        >
          <div className="flex items-center gap-1">
            <Music className={`w-3.5 h-3.5 text-amber-300 ${isPlaying ? 'animate-bounce' : 'opacity-60'}`} />
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-[11px] font-semibold text-amber-200 leading-tight">
                Bài ca Người giáo viên nhân dân
              </span>
              <span className="text-[9px] text-stone-400 flex items-center gap-1">
                {sourceType === 'file' ? 'Bản hòa tấu MP3' : 'Hòa tấu giao hưởng'}
                <span className="text-amber-400/70">·</span>
                {isPlaying ? `${Math.round(volume * 100)}%` : 'Tạm dừng'}
              </span>
            </div>
          </div>

          {/* Mini dynamic animated sound bars */}
          <div className="flex items-end gap-0.5 h-3.5 w-6">
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

          {expanded ? <ChevronUp className="w-3.5 h-3.5 text-amber-300/80" /> : <ChevronDown className="w-3.5 h-3.5 text-stone-400" />}
        </div>

        {/* Quick Mute/Unmute */}
        <button
          onClick={handleMuteToggle}
          className={`p-1.5 rounded-lg border transition-colors ${
            !isMuted ? 'text-amber-300 border-amber-400/30 bg-amber-500/10' : 'text-stone-400 border-slate-700 bg-slate-800'
          }`}
          title={isMuted ? 'Bật tiếng' : 'Tắt tiếng'}
        >
          {!isMuted ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Expanded Control Popover */}
      {expanded && (
        <div className="absolute right-0 top-full mt-2 w-72 p-4 bg-[#09152e] border border-amber-400/40 rounded-2xl shadow-2xl backdrop-blur-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between border-b border-amber-400/20 pb-2 mb-3">
            <span className="text-xs uppercase tracking-wider text-amber-300 font-bold flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5" />
              <span>Bảng điều khiển âm nhạc</span>
            </span>
            <span className="text-[10px] text-stone-400 font-mono">
              {Math.round(volume * 100)}%
            </span>
          </div>

          <div className="space-y-3">
            {/* Song info badge */}
            <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800">
              <div className="text-[11px] font-semibold text-amber-100">
                BÀI CA NGƯỜI GIÁO VIÊN NHÂN DÂN
              </div>
              <div className="text-[10px] text-stone-300 mt-0.5">
                Nhạc sĩ: Hoàng Vân · Hòa tấu không lời
              </div>
              <div className="text-[9px] text-amber-400/80 mt-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>{sourceType === 'file' ? 'Đang phát từ file âm thanh quản trị viên' : 'Đang phát bản hòa tấu giao hưởng phòng thu'}</span>
              </div>
            </div>

            {/* Volume slider */}
            <div>
              <div className="flex justify-between text-[11px] text-stone-300 mb-1">
                <span>Âm lượng hòa tấu:</span>
                <span className="text-amber-300 font-bold">{Math.round(volume * 100)}%</span>
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

            {/* Audio actions */}
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handlePlayToggle}
                className="flex-1 py-1.5 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow"
              >
                {isPlaying ? 'Tạm dừng' : 'Tiếp tục phát'}
              </button>
              <button
                onClick={handleMuteToggle}
                className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-stone-200 text-xs rounded-xl transition-colors border border-slate-700"
              >
                {isMuted ? 'Mở tiếng' : 'Tắt tiếng'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
