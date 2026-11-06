import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Heart } from 'lucide-react';
import { globalAudio } from '../utils/globalAudio';

interface IntroScreenProps {
  onEnter: () => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({ onEnter }) => {
  const handleOpenGarden = () => {
    // Play celebratory chime and trigger global orchestral audio
    globalAudio.playChime([349.23, 440.0, 523.25, 659.25, 783.99, 1046.5]);
    globalAudio.play().catch(() => {});
    onEnter();
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.9, ease: 'easeInOut' }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-[#060e20] via-[#091530] to-[#040915] text-center p-6 select-none overflow-hidden"
    >
      {/* Background ethereal light aura */}
      <div className="absolute w-[360px] sm:w-[600px] h-[360px] sm:h-[600px] bg-gradient-to-tr from-amber-500/20 via-rose-500/15 to-indigo-600/15 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />

      {/* Decorative math curves watermark */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
        <svg viewBox="0 0 800 800" className="w-[800px] h-[800px]">
          <circle cx="400" cy="400" r="350" stroke="#d4af37" strokeWidth="1" strokeDasharray="5,5" fill="none" />
          <circle cx="400" cy="400" r="240" stroke="#d4af37" strokeWidth="1" fill="none" />
          <line x1="50" y1="400" x2="750" y2="400" stroke="#d4af37" strokeWidth="1" />
          <line x1="400" y1="50" x2="400" y2="750" stroke="#d4af37" strokeWidth="1" />
        </svg>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
        {/* Department Name */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs sm:text-sm tracking-[0.25em] uppercase font-semibold mb-6 shadow-sm"
        >
          <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
          <span>TỔ TOÁN – THPT GIA HỘI</span>
        </motion.div>

        {/* Salutation Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="space-y-3"
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl font-serif tracking-widest text-amber-100 uppercase font-light">
            KÍNH CHÚC QUÝ THẦY CÔ
          </h2>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-serif font-black gold-shimmer-text tracking-tight drop-shadow-[0_4px_20px_rgba(212,175,55,0.4)]">
            MỪNG NGÀY NHÀ GIÁO VIỆT NAM
          </h1>
          <div className="text-4xl sm:text-5xl md:text-7xl font-sans font-extrabold text-amber-200 tracking-wide pt-1">
            20 − 11
          </div>
        </motion.div>

        {/* Theme Title & Core Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.65 }}
          className="my-8 max-w-lg"
        >
          <div className="text-sm sm:text-base uppercase tracking-widest text-amber-400 font-semibold mb-2">
            CHỦ ĐỀ: “THÁNG MƯỜI MỘT – NGÀN HOA TRI ÂN”
          </div>
          <p className="text-base sm:text-lg font-serif italic text-stone-300 leading-relaxed">
            “Tri thức gieo mầm – Yêu thương nở hoa – Nghề giáo tỏa sáng.”
          </p>
        </motion.div>

        {/* Prominent CTA Button: MỞ VƯỜN HOA TRI ÂN */}
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
          transition={{ duration: 0.5, delay: 0.85 }}
          onClick={handleOpenGarden}
          className="group relative flex items-center gap-3 px-8 sm:px-10 py-4 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-base sm:text-lg rounded-2xl shadow-[0_10px_35px_rgba(245,158,11,0.4)] transition-all cursor-pointer overflow-hidden"
        >
          {/* Shimmer sweep effect */}
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />

          <Sparkles className="w-5 h-5 text-slate-950" />
          <span className="tracking-wide">MỞ VƯỜN HOA TRI ÂN</span>
        </motion.button>

        {/* Interactive Sky Cue: CHẠM VÀO BẦU TRỜI – THẮP SÁNG TRI ÂN */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.05 }}
          className="mt-6 flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/15 border border-amber-400/40 text-amber-200 text-xs sm:text-sm font-bold tracking-wider gold-shimmer-text animate-pulse shadow-md">
            <span>✨ CHẠM VÀO BẦU TRỜI – THẮP SÁNG TRI ÂN ✨</span>
          </div>
          <span className="text-xs text-stone-300 mt-2 italic font-serif text-center max-w-md">
            “Kích chuột hoặc chạm vào màn hình để tự tay tạo nên những chùm pháo hoa rực rỡ.”
          </span>
        </motion.div>

        {/* Subtle note about audio & custom MP3 placement */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.25 }}
          className="mt-5 space-y-1 text-center"
        >
          <p className="text-xs text-amber-200/90 font-serif italic">
            Bản hòa tấu “Bài ca người giáo viên nhân dân” tự động phát khi bạn mở chương trình
          </p>
          <p className="text-[10px] text-stone-400">
            Hỗ trợ file nhạc cá nhân: đặt file MP3 tại <code className="text-amber-300 font-mono">/public/assets/audio/bai-ca-nguoi-giao-vien-nhan-dan.mp3</code>
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};
