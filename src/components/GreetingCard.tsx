import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gift, Copy, Share2, Check, Sparkles, UserCheck, BookOpen, RotateCcw } from 'lucide-react';
import { soundEngine } from '../utils/audio';

export const GreetingCard: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [recipient, setRecipient] = useState('Quý Thầy Cô');
  const [copied, setCopied] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  const handleOpenCard = () => {
    soundEngine.playPaperSound();
    soundEngine.playChime([523.25, 659.25, 783.99, 1046.5]);
    setIsOpen(true);
  };

  const handleCloseCard = () => {
    soundEngine.playPaperSound();
    setIsOpen(false);
  };

  const fullWishText = `HAPPY VIETNAMESE TEACHERS' DAY 20 - 11
“With gratitude and respect.”

KÍNH CHÚC ${recipient.toUpperCase()}
Một mùa Hiến chương thật nhiều niềm vui, sức khỏe, bình an và hạnh phúc.
Chúc mỗi ngày đến trường là một ngày ý nghĩa, mỗi bài giảng là một niềm vui và mỗi thế hệ học trò là một niềm tự hào.

Trân quý và biết ơn!
Tổ Toán – Trường THPT Gia Hội`;

  const handleCopyWish = async () => {
    try {
      await navigator.clipboard.writeText(fullWishText);
      setCopied(true);
      soundEngine.playChime([659.25, 880, 1046.5]);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Thiệp Tri Ân 20/11 – Tổ Toán THPT Gia Hội',
          text: fullWishText,
          url: window.location.href,
        });
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 3000);
      } catch {
        // User cancelled or share failed, fallback to copy
        handleCopyWish();
      }
    } else {
      // Fallback: copy wish
      handleCopyWish();
    }
  };

  return (
    <section id="thiep-mung" className="relative w-full max-w-4xl mx-auto px-4 py-14 md:py-20 select-none">
      {/* Section Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-950/60 border border-rose-400/30 text-rose-200 text-xs tracking-wider uppercase mb-3">
          <Gift className="w-3.5 h-3.5 text-amber-300" />
          <span>Món quà điện tử trao tay</span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-amber-100 font-normal">
          Thiệp Chúc Mừng Nghệ Thuật
        </h2>
        <p className="text-stone-300 text-sm mt-1.5 font-serif italic max-w-xl mx-auto">
          Mở tấm thiệp mạ vàng, cá nhân hóa lời chúc dành tặng riêng cho từng Thầy Cô
        </p>
      </div>

      {/* Recipient Personalization Box */}
      <div className="max-w-md mx-auto mb-8 bg-slate-900/80 border border-amber-400/30 rounded-2xl p-4 shadow-xl backdrop-blur-md">
        <label className="block text-xs uppercase tracking-wider text-amber-300 font-semibold mb-2 flex items-center gap-1.5">
          <UserCheck className="w-3.5 h-3.5" />
          <span>Người nhận thiệp (Nhập tên để cá nhân hóa):</span>
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value || 'Quý Thầy Cô')}
            placeholder="Ví dụ: Thầy Hiệu Trưởng, Cô Mai, Thầy Hùng..."
            className="flex-1 bg-slate-950 border border-slate-700 focus:border-amber-400 rounded-xl px-3.5 py-2 text-stone-100 text-sm focus:outline-none transition-colors"
          />
          <button
            onClick={() => setRecipient('Quý Thầy Cô')}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-stone-300 text-xs rounded-xl transition-colors"
            title="Đặt lại mặc định"
          >
            Mặc định
          </button>
        </div>
      </div>

      {/* Interactive 3D Card Stage */}
      <div className="relative w-full max-w-xl mx-auto min-h-[380px] sm:min-h-[430px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {!isOpen ? (
            /* FRONT COVER */
            <motion.div
              key="front-card"
              initial={{ scale: 0.94, opacity: 0, rotateY: -30 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              exit={{ scale: 0.94, opacity: 0, rotateY: 30 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              onClick={handleOpenCard}
              className="cursor-pointer group relative w-full aspect-[4/3] max-w-md bg-gradient-to-br from-[#0c1b3a] via-[#102450] to-[#081226] border-2 border-amber-400/50 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] p-8 flex flex-col items-center justify-between text-center overflow-hidden transition-all hover:scale-[1.02]"
            >
              {/* Foil geometric corners */}
              <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-amber-300" />
              <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-amber-300" />
              <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-amber-300" />
              <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-amber-300" />

              {/* Top seal ribbon */}
              <div className="text-xs uppercase tracking-widest text-amber-300/80 font-serif">
                TỔ TOÁN · THPT GIA HỘI
              </div>

              {/* Cover Main Titles */}
              <div className="my-auto py-4">
                <h3 className="text-sm sm:text-base tracking-[0.2em] font-serif uppercase text-amber-200 font-semibold mb-2">
                  HAPPY VIETNAMESE TEACHERS' DAY
                </h3>
                <div className="text-5xl sm:text-6xl font-sans font-extrabold gold-shimmer-text tracking-tight my-2">
                  20 − 11
                </div>
                <p className="text-sm sm:text-base font-serif italic text-stone-300 mt-2">
                  “With gratitude and respect.”
                </p>
              </div>

              {/* Open Call to Action */}
              <div className="flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 group-hover:from-amber-400 group-hover:to-amber-500 text-slate-950 text-xs sm:text-sm font-bold shadow-lg shadow-amber-500/25 transition-all">
                <BookOpen className="w-4 h-4" />
                <span>Mở thiệp chúc mừng</span>
              </div>
            </motion.div>
          ) : (
            /* INSIDE CARD */
            <motion.div
              key="inside-card"
              initial={{ scale: 0.94, opacity: 0, rotateY: 30 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              exit={{ scale: 0.94, opacity: 0, rotateY: -30 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="relative w-full max-w-lg bg-[#faf6ee] text-stone-850 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.5)] border-2 border-amber-500/40 p-6 sm:p-8 md:p-9 text-stone-800 flex flex-col justify-between"
            >
              {/* Gold floral corner accents */}
              <div className="absolute top-3 left-3 text-amber-700/60 text-xs">✤</div>
              <div className="absolute top-3 right-3 text-amber-700/60 text-xs">✤</div>
              <div className="absolute bottom-3 left-3 text-amber-700/60 text-xs">✤</div>
              <div className="absolute bottom-3 right-3 text-amber-700/60 text-xs">✤</div>

              {/* Inside Header */}
              <div className="text-center pb-4 border-b border-amber-800/15 mb-4">
                <span className="text-xs uppercase tracking-widest text-amber-800 font-semibold block mb-1">
                  MỪNG NGÀY NHÀ GIÁO VIỆT NAM 20/11
                </span>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-amber-950">
                  KÍNH CHÚC {recipient.toUpperCase()}
                </h3>
              </div>

              {/* Inside Wishes Body (Verbatim prompt) */}
              <div className="space-y-3.5 text-sm sm:text-base font-sans text-stone-700 leading-relaxed text-center py-2">
                <p className="font-medium text-stone-800">
                  Một mùa Hiến chương thật nhiều niềm vui, sức khỏe, bình an và hạnh phúc.
                </p>
                <p>
                  Chúc mỗi ngày đến trường là một ngày ý nghĩa, mỗi bài giảng là một niềm vui và mỗi thế hệ học trò là một niềm tự hào.
                </p>
              </div>

              {/* Signature block */}
              <div className="mt-5 pt-4 border-t border-amber-800/15 text-center">
                <p className="font-serif italic text-base sm:text-lg font-bold text-amber-900">
                  Trân quý và biết ơn!
                </p>
                <p className="text-xs sm:text-sm font-serif font-bold uppercase tracking-wider text-amber-950 mt-1">
                  Tổ Toán – Trường THPT Gia Hội
                </p>
              </div>

              {/* Functional Card Actions */}
              <div className="mt-6 pt-3 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                <button
                  onClick={handleCopyWish}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs rounded-xl shadow-md transition-all active:scale-95"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-200" />
                      <span>Đã sao chép!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Sao chép lời chúc</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-stone-200 font-medium text-xs rounded-xl transition-all active:scale-95"
                >
                  <Share2 className="w-3.5 h-3.5 text-amber-300" />
                  <span>{shareSuccess ? 'Đã chia sẻ!' : 'Chia sẻ Zalo/Email'}</span>
                </button>

                <button
                  onClick={handleCloseCard}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-700 font-medium text-xs rounded-xl transition-all active:scale-95"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Đóng thiệp</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
