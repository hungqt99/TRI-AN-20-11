import React, { useState } from 'react';
import {
  Sparkles,
  Flame,
  Layers,
  Sliders,
  ChevronDown,
  ChevronUp,
  Droplets,
  Sun,
  MousePointerClick,
  Battery,
  Zap,
} from 'lucide-react';
import { useFireworks } from './GlobalFireworksLayer';
import { ALL_12_FIREWORKS_TYPES, FireworksLevel, FireworkType } from '../utils/fireworksEngine';

export const VisualEffectsControlPanel: React.FC = () => {
  const {
    config,
    toggleFireworks,
    toggleInteractive,
    setLevel,
    setDensity,
    setBloom,
    setPowerMode,
    toggleReflection,
    toggleGoldenDust,
    launchSpecific,
    triggerGrandClimax,
  } = useFireworks();

  const [expanded, setExpanded] = useState(false);

  return (
    <div className="relative select-none text-xs">
      {/* Compact Trigger Button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all shadow-md backdrop-blur-md ${
          config.enabled
            ? 'bg-amber-500/15 border-amber-400/40 text-amber-300 hover:bg-amber-500/25'
            : 'bg-slate-800/80 border-slate-700 text-stone-400'
        }`}
        title="Bảng điều khiển hiệu ứng Pháo hoa 3D & Ánh sáng"
      >
        <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
        <span className="hidden sm:inline font-semibold">Pháo hoa 3D</span>
        <span className="text-[10px] uppercase font-mono px-1 py-0.2 bg-slate-900/60 rounded text-amber-200">
          {config.level === 'dai-tiec' ? 'Đại tiệc' : config.level === 'ruc-ro' ? 'Rực rỡ' : 'Lung linh'}
        </span>
        {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>

      {/* Expanded Control Popover */}
      {expanded && (
        <div className="absolute right-0 top-full mt-2 w-84 p-4 bg-[#09152e] border border-amber-400/40 rounded-2xl shadow-2xl backdrop-blur-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200 max-h-[85vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-amber-400/20 pb-2 mb-3">
            <span className="text-xs uppercase tracking-wider text-amber-300 font-bold flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5" />
              <span>ĐẠI TIỆC PHÁO HOA 3D</span>
            </span>
            <button
              onClick={toggleFireworks}
              className={`text-[10px] px-2 py-0.5 rounded-full font-semibold transition-colors ${
                config.enabled
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
              }`}
            >
              {config.enabled ? 'Đang bật' : 'Đang tắt'}
            </button>
          </div>

          <div className="space-y-3.5">
            {/* Interactive Touch / Click Toggle */}
            <div className="bg-amber-500/10 border border-amber-400/30 rounded-xl p-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MousePointerClick className="w-4 h-4 text-amber-300" />
                <div>
                  <div className="text-[11px] font-semibold text-amber-100">
                    Pháo hoa tương tác
                  </div>
                  <div className="text-[9px] text-stone-300">
                    Kích chuột hoặc chạm màn hình để bắn
                  </div>
                </div>
              </div>
              <button
                onClick={toggleInteractive}
                className={`text-[10px] font-bold px-2 py-1 rounded-lg transition-colors ${
                  config.interactiveEnabled
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'bg-slate-800 text-stone-400 border border-slate-700'
                }`}
              >
                {config.interactiveEnabled ? 'Đang bật' : 'Tắt'}
              </button>
            </div>

            {/* 1. Level Selection (3 cấp độ) */}
            <div>
              <div className="text-[11px] text-stone-300 mb-1.5 font-medium flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span>Cấp độ trình diễn:</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {(
                  [
                    { id: 'lung-linh', label: '1. Lung linh' },
                    { id: 'ruc-ro', label: '2. Rực rỡ' },
                    { id: 'dai-tiec', label: '3. Đại tiệc' },
                  ] as { id: FireworksLevel; label: string }[]
                ).map((lvl) => (
                  <button
                    key={lvl.id}
                    onClick={() => setLevel(lvl.id)}
                    className={`py-1.5 px-1 rounded-xl text-[10px] font-semibold transition-all ${
                      config.level === lvl.id
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md'
                        : 'bg-slate-900 text-stone-300 hover:bg-slate-800 border border-slate-800'
                    }`}
                  >
                    {lvl.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Sliders: Density & Bloom */}
            <div className="space-y-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
              <div>
                <div className="flex justify-between text-[10px] text-stone-300 mb-1">
                  <span>Mật độ hạt sáng:</span>
                  <span className="text-amber-300 font-bold">{Math.round(config.particleDensity * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={config.particleDensity}
                  onChange={(e) => setDensity(parseFloat(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
              </div>

              <div>
                <div className="flex justify-between text-[10px] text-stone-300 mb-1">
                  <span>Độ sáng phát quang (Bloom):</span>
                  <span className="text-amber-300 font-bold">{Math.round(config.bloomBrightness * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.6"
                  max="2.0"
                  step="0.1"
                  value={config.bloomBrightness}
                  onChange={(e) => setBloom(parseFloat(e.target.value))}
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
              </div>
            </div>

            {/* 3. Toggles: Water Reflection & Golden Dust */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={toggleReflection}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl border text-[10px] transition-colors ${
                  config.showReflection
                    ? 'bg-sky-950/60 border-sky-500/40 text-sky-200'
                    : 'bg-slate-900 border-slate-800 text-stone-400'
                }`}
              >
                <Droplets className="w-3 h-3 text-sky-400" />
                <span>Phản chiếu mặt nước</span>
              </button>

              <button
                onClick={toggleGoldenDust}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl border text-[10px] transition-colors ${
                  config.showGoldenDust
                    ? 'bg-amber-950/60 border-amber-500/40 text-amber-200'
                    : 'bg-slate-900 border-slate-800 text-stone-400'
                }`}
              >
                <Sun className="w-3 h-3 text-amber-400" />
                <span>Kim tuyến vàng rơi</span>
              </button>
            </div>

            {/* 4. Power & Performance Mode */}
            <div>
              <div className="text-[10px] text-stone-400 mb-1 font-medium flex items-center gap-1">
                <Battery className="w-3 h-3 text-amber-400" />
                <span>Chế độ thiết bị:</span>
              </div>
              <div className="grid grid-cols-3 gap-1">
                {(
                  [
                    { id: 'auto', label: 'Tự động' },
                    { id: 'high', label: 'Cao cấp' },
                    { id: 'battery-save', label: 'Tiết kiệm' },
                  ] as { id: 'auto' | 'high' | 'battery-save'; label: string }[]
                ).map((pm) => (
                  <button
                    key={pm.id}
                    onClick={() => setPowerMode(pm.id)}
                    className={`py-1 px-1 rounded-lg text-[10px] transition-colors ${
                      config.powerMode === pm.id
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'bg-slate-900 text-stone-300 border border-slate-800'
                    }`}
                  >
                    {pm.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 5. Trigger 12 Fireworks Shapes */}
            <div>
              <div className="text-[10px] text-stone-400 mb-1 font-medium flex items-center justify-between">
                <span>Bắn thử 12 kiểu pháo hoa:</span>
                <span className="text-[9px] text-amber-400/80">Nhấn để bắn</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto pr-1">
                {ALL_12_FIREWORKS_TYPES.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => launchSpecific(item.id)}
                    className="py-1 px-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-amber-400/40 text-[10px] text-stone-200 text-left truncate transition-colors"
                    title={item.desc}
                  >
                    ✦ {item.name.split(' (')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* 6. Grand Climax Trigger Button */}
            <button
              onClick={triggerGrandClimax}
              className="w-full py-2 px-3 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-1.5 active:scale-95"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>BÙNG NỔ CAO TRÀO ĐẠI TIỆC</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
