import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, RotateCcw, Download, HelpCircle, Flame } from 'lucide-react';
import { globalAudio } from '../utils/globalAudio';
import { useFireworks } from './GlobalFireworksLayer';

interface GrandFinaleProps {
  onReplay: () => void;
  onOpenOfflineHelp: () => void;
  onDownloadSingleHtml: () => void;
}

export const GrandFinale: React.FC<GrandFinaleProps> = ({
  onReplay,
  onOpenOfflineHelp,
  onDownloadSingleHtml,
}) => {
  const { triggerGrandClimax, setLevel } = useFireworks();

  const handleReplayClick = () => {
    globalAudio.playChime([523.25, 659.25, 783.99, 1046.5]);
    onReplay();
  };

  const handleClimaxFireworks = () => {
    setLevel('dai-tiec');
    triggerGrandClimax();
    globalAudio.playChime([659.25, 880, 1046.5, 1318.5]);
  };

  return (
    <footer id="loi-ket" className="relative w-full py-16 md:py-24 bg-gradient-to-t from-[#050b18] via-[#09152e] to-transparent text-center select-none overflow-hidden">
      {/* Background radial gold glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-3xl mx-auto px-4 z-10">
        {/* Golden flower motif icon */}
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 mb-6 shadow-lg shadow-amber-500/15"
        >
          <Sparkles className="w-7 h-7 animate-pulse text-amber-300" />
        </motion.div>

        {/* Finale Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl sm:text-3xl md:text-5xl font-serif font-bold text-amber-100 tracking-wide gold-shimmer-text leading-tight"
        >
          NGÀN HOA TRI ÂN – VẠN LỜI YÊU THƯƠNG
        </motion.h2>

        {/* Emotion Quote */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-4 text-base sm:text-xl font-serif italic text-amber-200/90 max-w-xl mx-auto leading-relaxed"
        >
          “Cảm ơn Thầy Cô vì đã chọn gieo những hạt mầm tri thức và yêu thương.”
        </motion.p>

        {/* Elegant Signature */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-8 pt-6 border-t border-amber-400/20 inline-block text-center"
        >
          <div className="text-xs uppercase tracking-[0.25em] text-amber-400/70 font-semibold mb-1">
            KÍNH TẶNG VỚI TẤT CẢ LÒNG BIẾT ƠN
          </div>
          <div className="text-lg sm:text-xl font-serif font-bold text-amber-100 uppercase tracking-widest">
            TẬP THỂ TỔ TOÁN
          </div>
          <div className="text-sm sm:text-base font-serif text-amber-300/90 tracking-wide mt-0.5">
            TRƯỜNG THPT GIA HỘI – THÀNH PHỐ HUẾ
          </div>
          <div className="text-xs text-stone-400 mt-2">
            Mừng Ngày Nhà giáo Việt Nam 20 - 11
          </div>
        </motion.div>

        {/* Action Controls */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={handleClimaxFireworks}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 via-rose-500 to-amber-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-rose-500/30 transition-all active:scale-95 animate-pulse"
          >
            <Flame className="w-4 h-4 text-slate-950 fill-current" />
            <span>KÍCH HOẠT ĐẠI TIỆC PHÁO HOA 3D</span>
          </button>

          <button
            onClick={handleReplayClick}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-stone-200 font-semibold text-xs sm:text-sm rounded-xl transition-all active:scale-95 border border-slate-700"
          >
            <RotateCcw className="w-4 h-4 text-amber-300" />
            <span>Trải nghiệm lại từ đầu</span>
          </button>

          <button
            onClick={onDownloadSingleHtml}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900/90 hover:bg-slate-800 border border-amber-400/40 text-amber-200 font-medium text-xs sm:text-sm rounded-xl transition-all active:scale-95 shadow-md"
            title="Lưu trang web thành 1 file HTML duy nhất để mở offline"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>Tải 1 file HTML mở ngoại tuyến</span>
          </button>

          <button
            onClick={onOpenOfflineHelp}
            className="flex items-center gap-1.5 px-3 py-2.5 bg-slate-900/60 hover:bg-slate-800 text-stone-300 text-xs sm:text-sm rounded-xl border border-slate-700 transition-all"
            title="Xem hướng dẫn chạy trên Windows & Trình chiếu hội trường"
          >
            <HelpCircle className="w-4 h-4 text-stone-400" />
            <span>Hướng dẫn & Triển khai</span>
          </button>
        </div>

        {/* Subtle copyright */}
        <div className="mt-12 text-[11px] text-stone-400 tracking-wider">
          Tổ Toán – THPT Gia Hội · Chúc mừng 20/11 · Thiết kế với trọn vẹn yêu thương
        </div>
      </div>
    </footer>
  );
};
