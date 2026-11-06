import React from 'react';
import { Maximize, Minimize, HelpCircle } from 'lucide-react';
import { MusicControlPanel } from './MusicControlPanel';
import { VisualEffectsControlPanel } from './VisualEffectsControlPanel';

interface HeaderNavProps {
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onOpenHelp: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  isFullscreen,
  onToggleFullscreen,
  onOpenHelp,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#081226]/85 backdrop-blur-md border-b border-amber-500/20 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 md:gap-8">
        {/* Zone 1: Brand wordmark (single text element) */}
        <a
          href="#top"
          className="text-base sm:text-lg font-serif font-bold tracking-wider text-amber-200 hover:text-amber-100 transition-colors whitespace-nowrap shrink-0"
        >
          TỔ TOÁN · THPT GIA HỘI
        </a>

        {/* Zone 2: 4–5 single-line navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs sm:text-sm font-medium text-stone-300">
          <a
            href="#bo-hoa"
            className="hover:text-amber-300 transition-colors whitespace-nowrap shrink-0"
          >
            Bó Hoa Nghệ Thuật
          </a>
          <a
            href="#thu-tri-an"
            className="hover:text-amber-300 transition-colors whitespace-nowrap shrink-0"
          >
            Thư Tri Ân
          </a>
          <a
            href="#vuon-tri-thuc"
            className="hover:text-amber-300 transition-colors whitespace-nowrap shrink-0"
          >
            Vườn Tri Thức
          </a>
          <a
            href="#thiep-mung"
            className="hover:text-amber-300 transition-colors whitespace-nowrap shrink-0"
          >
            Thiệp Chúc Mừng
          </a>
          <a
            href="#loi-ket"
            className="hover:text-amber-300 transition-colors whitespace-nowrap shrink-0"
          >
            Lời Kết
          </a>
        </nav>

        {/* Zone 3: Primary utility actions (Music + 3D Fireworks + Projector Mode + Help) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Global Music Control Panel */}
          <MusicControlPanel />

          {/* 3D Fireworks Show Control Panel */}
          <VisualEffectsControlPanel />

          {/* Fullscreen / Projector Mode */}
          <button
            onClick={onToggleFullscreen}
            className="p-2 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-amber-400/40 text-stone-300 hover:text-white transition-colors"
            title={isFullscreen ? 'Thu nhỏ màn hình' : 'Toàn màn hình / Máy chiếu'}
            aria-label="Chế độ máy chiếu"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>

          {/* Help & Offline Guide */}
          <button
            onClick={onOpenHelp}
            className="p-2 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-amber-400/40 text-stone-300 hover:text-white transition-colors"
            title="Hướng dẫn & Triển khai"
            aria-label="Hướng dẫn"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
