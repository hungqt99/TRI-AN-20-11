import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, MailOpen, Copy, Check, RotateCcw, Sparkles } from 'lucide-react';
import { soundEngine } from '../utils/audio';

const LETTER_CONTENT = {
  title: 'THƯ TRI ÂN – TỔ TOÁN THPT GIA HỘI',
  salutation: 'Kính gửi quý Thầy giáo, Cô giáo!',
  paragraphs: [
    'Tháng Mười Một lại về, mang theo những tình cảm yêu thương và lòng biết ơn sâu sắc dành cho những người đã và đang tận tụy với sự nghiệp trồng người.',
    'Nhân Ngày Nhà giáo Việt Nam 20/11, Tổ Toán – Trường THPT Gia Hội xin kính gửi đến quý Thầy giáo, Cô giáo những lời chúc mừng tốt đẹp và chân thành nhất.',
    'Xin tri ân những bài giảng tâm huyết, những giờ lên lớp miệt mài, những lời động viên ân cần và cả những hy sinh thầm lặng mà quý Thầy Cô đã dành cho các thế hệ học sinh.',
    'Mỗi bài học không chỉ mở ra một chân trời tri thức, mà còn góp phần vun đắp nhân cách, khơi dậy niềm tin và chắp cánh cho những ước mơ.',
    'Trên hành trình ấy, tình yêu nghề, lòng tận tâm và sự sẻ chia của quý Thầy Cô luôn là những giá trị đáng trân trọng.',
    'Kính chúc quý Thầy giáo, Cô giáo luôn mạnh khỏe, bình an, hạnh phúc; giữ mãi ngọn lửa đam mê với nghề và tiếp tục gặt hái nhiều thành công trong sự nghiệp giáo dục.',
  ],
  closing: 'Trân trọng và biết ơn!',
  signature: 'TẬP THỂ TỔ TOÁN – TRƯỜNG THPT GIA HỘI',
};

export const TributeLetter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [copied, setCopied] = useState(false);

  const toggleEnvelope = () => {
    if (!isOpen) {
      soundEngine.playPaperSound();
      soundEngine.playChime([440, 554.37, 659.25, 880]);
    } else {
      soundEngine.playPaperSound();
    }
    setIsOpen(!isOpen);
  };

  const handleCopy = async () => {
    const fullText = `${LETTER_CONTENT.title}

${LETTER_CONTENT.salutation}

${LETTER_CONTENT.paragraphs.join('\n\n')}

${LETTER_CONTENT.closing}
${LETTER_CONTENT.signature}`;

    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      soundEngine.playChime([659.25, 880, 1046.5]);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <section id="thu-tri-an" className="relative w-full max-w-4xl mx-auto px-4 py-12 md:py-16">
      {/* Section Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-950/60 border border-indigo-400/30 text-indigo-200 text-xs tracking-wider uppercase mb-3">
          <Mail className="w-3.5 h-3.5 text-amber-300" />
          <span>Tâm tình người giáo viên Toán</span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-amber-100 font-normal">
          Bức Thư Tri Ân Từ Tổ Toán
        </h2>
        <p className="text-stone-300 text-sm mt-1.5 font-serif italic">
          Gửi trọn tấm lòng đến quý Thầy Cô giáo trường THPT Gia Hội
        </p>
      </div>

      {/* Envelope Container */}
      <div className="relative w-full max-w-2xl mx-auto flex flex-col items-center">
        {/* State Toggle Bar */}
        <div className="flex items-center gap-3 mb-6 z-10">
          <button
            onClick={toggleEnvelope}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold text-xs sm:text-sm rounded-xl shadow-lg shadow-amber-500/20 transition-all active:scale-95"
          >
            {isOpen ? (
              <>
                <Mail className="w-4 h-4" />
                <span>Gấp phong thư lại</span>
              </>
            ) : (
              <>
                <MailOpen className="w-4 h-4" />
                <span>Mở phong thư tri ân</span>
              </>
            )}
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-stone-200 text-xs sm:text-sm rounded-xl transition-all active:scale-95"
            title="Sao chép toàn bộ bức thư"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-300">Đã sao chép!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-amber-300" />
                <span>Sao chép thư</span>
              </>
            )}
          </button>
        </div>

        {/* Envelope Graphic when folded */}
        <AnimatePresence mode="wait">
          {!isOpen && (
            <motion.div
              key="closed-envelope"
              initial={{ scale: 0.9, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: -15 }}
              onClick={toggleEnvelope}
              className="cursor-pointer group relative w-full max-w-lg aspect-[16/10] bg-gradient-to-br from-[#10224a] to-[#0a1530] border-2 border-amber-400/40 rounded-2xl shadow-2xl p-6 flex flex-col items-center justify-center text-center overflow-hidden transition-transform hover:scale-[1.01]"
            >
              {/* Envelope flap visual lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
                <line x1="0" y1="0" x2="50%" y2="50%" stroke="rgba(212, 175, 55, 0.3)" strokeWidth="1" />
                <line x1="100%" y1="0" x2="50%" y2="50%" stroke="rgba(212, 175, 55, 0.3)" strokeWidth="1" />
                <line x1="0" y1="100%" x2="50%" y2="50%" stroke="rgba(212, 175, 55, 0.15)" strokeWidth="1" />
                <line x1="100%" y1="100%" x2="50%" y2="50%" stroke="rgba(212, 175, 55, 0.15)" strokeWidth="1" />
              </svg>

              {/* Red Wax Seal */}
              <div className="relative z-10 w-20 h-20 rounded-full bg-gradient-to-br from-red-600 via-rose-700 to-red-900 border-2 border-amber-300 shadow-[0_4px_16px_rgba(225,29,72,0.5)] flex flex-col items-center justify-center group-hover:scale-105 transition-transform">
                <span className="text-[10px] uppercase tracking-wider text-amber-200 font-serif font-bold">THPT</span>
                <span className="text-base font-serif font-bold text-amber-100">GIA HỘI</span>
                <span className="text-[9px] text-amber-200 font-serif">TỔ TOÁN</span>
              </div>

              <div className="relative z-10 mt-4">
                <h3 className="text-lg font-serif text-amber-200 tracking-wide">
                  THƯ TRI ÂN 20/11
                </h3>
                <p className="text-xs text-stone-300 mt-1 font-serif italic flex items-center justify-center gap-1">
                  <span>Chạm vào đây để mở phong thư</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                </p>
              </div>
            </motion.div>
          )}

          {/* Letter Sheet when Open */}
          {isOpen && (
            <motion.div
              key="open-letter"
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.96 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="relative w-full bg-[#fdfbf7] text-stone-800 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.4)] border-2 border-amber-500/30 p-6 sm:p-10 md:p-12 overflow-hidden"
            >
              {/* Luxury gold corner filigree frames */}
              <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-amber-600/60 pointer-events-none" />
              <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-amber-600/60 pointer-events-none" />
              <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-amber-600/60 pointer-events-none" />
              <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-amber-600/60 pointer-events-none" />

              {/* Watermark of school crest and math geometry */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.035] pointer-events-none">
                <span className="text-9xl font-sans font-black">20-11</span>
              </div>

              {/* Letter Header */}
              <div className="text-center pb-6 border-b border-amber-900/15 mb-6">
                <span className="text-xs uppercase tracking-widest text-amber-800 font-semibold block mb-1">
                  TRƯỜNG THPT GIA HỘI – THÀNH PHỐ HUẾ
                </span>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-amber-950 tracking-wide">
                  {LETTER_CONTENT.title}
                </h3>
              </div>

              {/* Salutation */}
              <p className="text-base sm:text-lg font-serif italic font-semibold text-amber-900 mb-5">
                {LETTER_CONTENT.salutation}
              </p>

              {/* Letter Paragraphs */}
              <div className="space-y-4 text-sm sm:text-base font-sans text-stone-700 leading-relaxed text-justify">
                {LETTER_CONTENT.paragraphs.map((p, idx) => (
                  <p key={idx} className={idx === 0 ? 'first-letter:text-4xl first-letter:font-serif first-letter:font-bold first-letter:float-left first-letter:mr-2.5 first-letter:text-amber-800 first-letter:leading-none' : ''}>
                    {p}
                  </p>
                ))}
              </div>

              {/* Letter Closing & Signature */}
              <div className="mt-8 pt-6 border-t border-amber-900/15 flex flex-col items-end text-right">
                <p className="font-serif italic text-base sm:text-lg text-amber-900 font-semibold">
                  {LETTER_CONTENT.closing}
                </p>
                <p className="mt-2 text-sm sm:text-base font-serif font-bold uppercase tracking-wider text-amber-950">
                  {LETTER_CONTENT.signature}
                </p>
                <span className="text-xs font-handwriting text-amber-700 text-lg mt-1">
                  Tổ Toán kính chúc
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
