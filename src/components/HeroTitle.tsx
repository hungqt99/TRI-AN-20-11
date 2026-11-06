import React from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { useFireworks } from './GlobalFireworksLayer';
import { globalAudio } from '../utils/globalAudio';

export const HeroTitle: React.FC = () => {
  const { launchSpecific, triggerGrandClimax } = useFireworks();

  const handleCenterpieceClick = () => {
    // Play celebratory chime sound
    globalAudio.playChime([523.25, 659.25, 783.99, 1046.5]);
    // Launch celebratory fireworks right around the title
    launchSpecific('grand-finale');
    setTimeout(() => launchSpecific('lotus'), 350);
    setTimeout(() => launchSpecific('heart'), 700);
  };

  return (
    <section className="relative w-full max-w-4xl mx-auto px-4 text-center py-10 md:py-14 select-none">
      {/* Decorative math curves watermark in background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
        <svg
          viewBox="0 0 600 300"
          className="w-full max-w-2xl h-auto"
          fill="none"
          stroke="#d4af37"
          strokeWidth="0.75"
        >
          {/* Golden Ratio Logarithmic Spiral */}
          <path
            d="M300 150 C320 150 330 160 330 170 C330 185 315 200 295 200 C265 200 245 175 245 145 C245 105 280 75 325 75 C380 75 425 120 425 180 C425 250 365 310 290 310"
            strokeDasharray="3 3"
          />
          {/* Sine wave */}
          <path
            d="M 50 150 Q 112 90, 175 150 T 300 150 T 425 150 T 550 150"
            strokeOpacity="0.4"
          />
          {/* Coordinate Axis */}
          <line x1="50" y1="150" x2="550" y2="150" strokeOpacity="0.25" />
          <line x1="300" y1="40" x2="300" y2="260" strokeOpacity="0.25" />
          {/* Subtle math symbols */}
          <text x="210" y="80" fill="#d4af37" fontSize="13" opacity="0.4" fontFamily="serif">lim f(x)</text>
          <text x="390" y="80" fill="#d4af37" fontSize="14" opacity="0.4" fontFamily="serif">∫ f(t)dt</text>
          <text x="140" y="240" fill="#d4af37" fontSize="13" opacity="0.4" fontFamily="serif">e^(iπ) + 1 = 0</text>
          <text x="430" y="240" fill="#d4af37" fontSize="14" opacity="0.4" fontFamily="serif">y = ax² + bx + c</text>
        </svg>
      </div>

      {/* Editorial Kicker */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs tracking-widest uppercase font-semibold mb-5 shadow-sm"
      >
        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
        <span>Tổ Toán – Trường THPT Gia Hội</span>
        <span className="text-amber-400/60">·</span>
        <span>Mùa Hiến Chương</span>
      </motion.div>

      {/* Main Salutation */}
      <motion.h2
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif text-amber-100 tracking-wide font-normal max-w-3xl mx-auto leading-tight"
        style={{ textWrap: 'balance' }}
      >
        CHÚC MỪNG NGÀY NHÀ GIÁO VIỆT NAM
      </motion.h2>

      {/* The 20 · 11 Focal Centerpiece (Interactive Firework Trigger) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.25, duration: 0.8 }}
        className="relative my-4 sm:my-6 flex flex-col items-center justify-center cursor-pointer group"
        onClick={handleCenterpieceClick}
        title="Kích để bắn pháo hoa tri ân 20 - 11!"
      >
        {/* Soft golden halo */}
        <div className="absolute w-48 sm:w-64 h-24 sm:h-32 bg-amber-400/20 group-hover:bg-amber-400/35 rounded-full blur-2xl pointer-events-none transition-all duration-500" />

        <div className="relative flex items-center justify-center gap-3 sm:gap-6 px-6 py-2 group-hover:scale-105 transition-transform duration-300">
          {/* Left geometric accent line */}
          <div className="hidden sm:flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
            <span className="w-8 md:w-16 h-px bg-gradient-to-r from-transparent to-amber-300" />
            <span className="w-1.5 h-1.5 rotate-45 border border-amber-300" />
          </div>

          {/* Number 20 */}
          <span className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-sans font-extrabold tracking-tight gold-shimmer-text drop-shadow-[0_4px_16px_rgba(212,175,55,0.4)]">
            20
          </span>

          {/* Golden Hyphen Dash '-' */}
          <div className="flex items-center justify-center px-1 sm:px-2">
            <span className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-sans font-bold text-amber-300 drop-shadow-[0_0_15px_rgba(251,191,36,0.6)]">
              −
            </span>
          </div>

          {/* Number 11 - with clear Arabic digits '1 1' */}
          <span className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-sans font-extrabold tracking-tight gold-shimmer-text drop-shadow-[0_4px_16px_rgba(212,175,55,0.4)]">
            11
          </span>

          {/* Right geometric accent line */}
          <div className="hidden sm:flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
            <span className="w-1.5 h-1.5 rotate-45 border border-amber-300" />
            <span className="w-8 md:w-16 h-px bg-gradient-to-l from-transparent to-amber-300" />
          </div>
        </div>

        {/* Subtle interactive hint */}
        <div className="mt-1 flex items-center justify-center gap-1.5 text-[11px] text-amber-300/80 font-mono tracking-wider opacity-80 group-hover:opacity-100 transition-opacity">
          <Sparkles className="w-3 h-3 text-amber-300 animate-pulse" />
          <span>Chạm vào 20 − 11 để bắn pháo hoa đặc biệt</span>
          <Sparkles className="w-3 h-3 text-amber-300 animate-pulse" />
        </div>
      </motion.div>

      {/* Subtitle Message */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.35 }}
        className="text-base sm:text-lg md:text-xl text-stone-300 font-serif italic max-w-xl mx-auto leading-relaxed"
      >
        “Tri ân những người thắp sáng hành trình tri thức.”
      </motion.p>

      {/* Core theme motto */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.45 }}
        className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm text-amber-200/90 font-medium"
      >
        <span>Tri thức gieo mầm</span>
        <span className="text-amber-400/50">✦</span>
        <span>Yêu thương nở hoa</span>
        <span className="text-amber-400/50">✦</span>
        <span>Nghề giáo tỏa sáng</span>
      </motion.div>
    </section>
  );
};
