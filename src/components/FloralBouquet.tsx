import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart, X, Volume2 } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface FlowerTribute {
  id: string;
  name: string;
  vietnameseType: string;
  colorName: string;
  message: string;
  meaning: string;
}

const FLOWER_MESSAGES: FlowerTribute[] = [
  {
    id: 'red-rose-1',
    name: 'Đóa Hồng Nhung Trung Tâm',
    vietnameseType: 'Hoa Hồng Đỏ',
    colorName: 'Đỏ thắm rạng rỡ',
    message: 'Kính trọng người gieo hạt tri thức.',
    meaning: 'Tượng trưng cho lòng tôn kính và biết ơn sâu sắc đối với tâm huyết của Thầy Cô.',
  },
  {
    id: 'pink-rose-1',
    name: 'Hồng Phấn Dịu Ngọt',
    vietnameseType: 'Hoa Hồng Phấn',
    colorName: 'Hồng pastel thanh nhã',
    message: 'Biết ơn những tháng ngày tận tụy.',
    meaning: 'Tượng trưng cho sự ân cần, bao dung và tình thương ấm áp Thầy Cô dành cho học trò.',
  },
  {
    id: 'hydrangea-blue',
    name: 'Cẩm Tú Cầu Xanh Lam',
    vietnameseType: 'Hoa Cẩm Tú Cầu',
    colorName: 'Xanh lam & Tím lavender',
    message: 'Trân quý những bài học làm người.',
    meaning: 'Kết tinh từ ngàn cánh hoa nhỏ – như tình cảm đoàn kết và sự trọn vẹn của tri thức.',
  },
  {
    id: 'gerbera-gold',
    name: 'Đồng Tiền Ánh Dương',
    vietnameseType: 'Hoa Đồng Tiền',
    colorName: 'Vàng cam ấm áp',
    message: 'Chúc Thầy Cô luôn mạnh khỏe và hạnh phúc.',
    meaning: 'Lời chúc sức khỏe dồi dào, niềm vui viên mãn và năng lượng tích cực mỗi ngày lên lớp.',
  },
  {
    id: 'chrysanthemum-white',
    name: 'Cúc Họa Mi Trắng Trong',
    vietnameseType: 'Cúc Nhỏ Tinh Khôi',
    colorName: 'Trắng kem nhụy vàng',
    message: 'Mỗi nét phấn trắng là một hạt mầm tương lai.',
    meaning: 'Biểu tượng của sự giản dị, thanh cao và phẩm cách trong sáng của người làm giáo dục.',
  },
  {
    id: 'rose-blush-2',
    name: 'Đóa Hồng Tỉ Muội',
    vietnameseType: 'Hồng Đào E Ấp',
    colorName: 'Cam đào phớt hồng',
    message: 'Bụi phấn rơi nghiêng, dệt nên những ước mơ bay xa.',
    meaning: 'Nhớ ơn những lời chỉ dạy tận tình đã chắp cánh cho bao thế hệ học trò trưởng thành.',
  },
  {
    id: 'hydrangea-purple',
    name: 'Tú Cầu Tím Mộng Mơ',
    vietnameseType: 'Cẩm Tú Cầu Tím',
    colorName: 'Tím mộng Huế thương',
    message: 'Nguyện chúc Thầy Cô mãi sáng ngọn lửa nhiệt huyết.',
    meaning: 'Gợi nét mộng mơ của cố đô Huế và sự bền bỉ của tấm lòng người gieo chữ tại THPT Gia Hội.',
  },
  {
    id: 'golden-sun',
    name: 'Đóa Hướng Dương Tri Thức',
    vietnameseType: 'Hoa Hướng Dương',
    colorName: 'Vàng kim hoàng gia',
    message: 'Tri ân tấm lòng người chèo đò thầm lặng.',
    meaning: 'Luôn hướng về ánh sáng chân lý, dẫn dắt học sinh vượt qua bao bến bờ thử thách.',
  },
];

export const FloralBouquet: React.FC = () => {
  const [selectedFlower, setSelectedFlower] = useState<FlowerTribute | null>(null);
  const [hoveredFlower, setHoveredFlower] = useState<string | null>(null);

  const handleFlowerClick = (flower: FlowerTribute) => {
    soundEngine.playChime([523.25, 659.25, 783.99, 1046.5]);
    setSelectedFlower(flower);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center select-none py-6">
      {/* Decorative subtle aura behind bouquet */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] md:w-[500px] h-[340px] md:h-[500px] bg-gradient-to-tr from-amber-500/15 via-rose-500/10 to-indigo-500/10 blur-3xl pointer-events-none rounded-full" />

      {/* Guide hint */}
      <div className="mb-4 flex items-center gap-2 text-xs md:text-sm text-amber-200/90 font-medium bg-amber-950/40 border border-amber-500/30 px-3.5 py-1.5 rounded-full shadow-inner backdrop-blur-md">
        <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
        <span>Chạm vào từng đóa hoa để đón nhận thông điệp tri ân</span>
      </div>

      {/* Main Masterpiece SVG Floral Bouquet */}
      <div className="relative w-[320px] sm:w-[420px] md:w-[520px] lg:w-[560px] aspect-[4/5] animate-sway-soft">
        <svg
          viewBox="0 0 500 620"
          className="w-full h-full drop-shadow-[0_20px_35px_rgba(0,0,0,0.55)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Gradients for realistic velvet petals */}
            <radialGradient id="gradRedRose" cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#ff4d6d" />
              <stop offset="45%" stopColor="#c9184a" />
              <stop offset="85%" stopColor="#800f2f" />
              <stop offset="100%" stopColor="#590d22" />
            </radialGradient>

            <radialGradient id="gradPinkRose" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#fff0f3" />
              <stop offset="40%" stopColor="#ffb3c1" />
              <stop offset="80%" stopColor="#f72585" />
              <stop offset="100%" stopColor="#a01a58" />
            </radialGradient>

            <radialGradient id="gradBlueHydrangea" cx="40%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#e0e7ff" />
              <stop offset="50%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#4338ca" />
            </radialGradient>

            <radialGradient id="gradPurpleHydrangea" cx="45%" cy="45%" r="60%">
              <stop offset="0%" stopColor="#f3e8ff" />
              <stop offset="50%" stopColor="#c084fc" />
              <stop offset="100%" stopColor="#7e22ce" />
            </radialGradient>

            <radialGradient id="gradSunflower" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fffbeb" />
              <stop offset="35%" stopColor="#fde047" />
              <stop offset="75%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#ca8a04" />
            </radialGradient>

            <radialGradient id="gradFlowerCenter" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#78350f" />
              <stop offset="70%" stopColor="#451a03" />
              <stop offset="100%" stopColor="#1c1917" />
            </radialGradient>

            <linearGradient id="gradRibbon" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="35%" stopColor="#d4af37" />
              <stop offset="70%" stopColor="#fef08a" />
              <stop offset="100%" stopColor="#a16207" />
            </linearGradient>

            <linearGradient id="gradLeaf" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#86efac" />
              <stop offset="50%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#14532d" />
            </linearGradient>

            <linearGradient id="gradDarkLeaf" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4ade80" />
              <stop offset="60%" stopColor="#15803d" />
              <stop offset="100%" stopColor="#052e16" />
            </linearGradient>

            <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Stems bundle at the bottom wrapped in champagne silk */}
          <g id="stems" opacity="0.95">
            <path d="M210 440 L195 560" stroke="#166534" strokeWidth="9" strokeLinecap="round" />
            <path d="M230 440 L235 575" stroke="#14532d" strokeWidth="8" strokeLinecap="round" />
            <path d="M250 440 L255 580" stroke="#15803d" strokeWidth="9" strokeLinecap="round" />
            <path d="M270 440 L285 570" stroke="#166534" strokeWidth="8" strokeLinecap="round" />
            <path d="M290 440 L310 555" stroke="#14532d" strokeWidth="7" strokeLinecap="round" />
          </g>

          {/* Lush Green Background Leaves */}
          <g id="background-foliage">
            {/* Top-left eucalyptus */}
            <path d="M230 250 C180 180 110 160 80 170 C90 200 130 240 230 250 Z" fill="url(#gradDarkLeaf)" />
            <path d="M80 170 Q150 205 230 250" stroke="#86efac" strokeWidth="1.5" opacity="0.6" />

            {/* Top-right branch */}
            <path d="M270 250 C320 170 390 150 425 165 C410 200 370 240 270 250 Z" fill="url(#gradDarkLeaf)" />
            <path d="M425 165 Q350 200 270 250" stroke="#86efac" strokeWidth="1.5" opacity="0.6" />

            {/* Side lush leaves */}
            <path d="M200 320 C130 300 70 340 50 370 C80 390 140 370 200 320 Z" fill="url(#gradLeaf)" />
            <path d="M290 320 C360 300 420 330 445 365 C415 390 350 370 290 320 Z" fill="url(#gradLeaf)" />

            {/* Delicate baby's breath sprigs */}
            <g stroke="#ffffff" opacity="0.8" strokeWidth="1">
              <circle cx="110" cy="210" r="3" fill="#ffffff" />
              <circle cx="125" cy="195" r="2.5" fill="#ffffff" />
              <circle cx="100" cy="225" r="3" fill="#ffffff" />
              <circle cx="380" cy="205" r="3" fill="#ffffff" />
              <circle cx="395" cy="190" r="2.5" fill="#ffffff" />
              <circle cx="410" cy="220" r="3" fill="#ffffff" />
              <circle cx="250" cy="115" r="3" fill="#ffffff" />
              <circle cx="235" cy="105" r="2.5" fill="#ffffff" />
              <circle cx="265" cy="108" r="2.5" fill="#ffffff" />
            </g>
          </g>

          {/* FLOWER 8: Golden Sunflower / Hướng Dương Tri Thức (Top Center) */}
          <g
            id="flower-sunflower"
            className="cursor-pointer transition-transform duration-300 hover:scale-105 origin-[250px_160px]"
            onClick={() => handleFlowerClick(FLOWER_MESSAGES[7])}
            onMouseEnter={() => setHoveredFlower(FLOWER_MESSAGES[7].id)}
            onMouseLeave={() => setHoveredFlower(null)}
          >
            <circle cx="250" cy="160" r="46" fill="url(#gradSunflower)" />
            {/* Radiating Petals */}
            {[0, 24, 48, 72, 96, 120, 144, 168, 192, 216, 240, 264, 288, 312, 336].map((deg) => (
              <path
                key={deg}
                d="M250 160 m0 -45 l8 -18 l-8 -6 l-8 6 z"
                fill="#facc15"
                transform={`rotate(${deg} 250 160)`}
                stroke="#eab308"
                strokeWidth="0.8"
              />
            ))}
            {/* Center disk with mathematical spiral texture */}
            <circle cx="250" cy="160" r="22" fill="url(#gradFlowerCenter)" stroke="#ca8a04" strokeWidth="2" />
            <circle cx="250" cy="160" r="16" fill="none" stroke="#eab308" strokeWidth="1" strokeDasharray="2,2" />
            <circle cx="250" cy="160" r="9" fill="none" stroke="#fef08a" strokeWidth="1" strokeDasharray="1,2" />
          </g>

          {/* FLOWER 3: Blue Hydrangea / Cẩm Tú Cầu Xanh (Left Wing) */}
          <g
            id="flower-hydrangea-blue"
            className="cursor-pointer transition-transform duration-300 hover:scale-105 origin-[140px_270px]"
            onClick={() => handleFlowerClick(FLOWER_MESSAGES[2])}
            onMouseEnter={() => setHoveredFlower(FLOWER_MESSAGES[2].id)}
            onMouseLeave={() => setHoveredFlower(null)}
          >
            <circle cx="140" cy="270" r="50" fill="url(#gradBlueHydrangea)" opacity="0.9" />
            {/* Clusters of individual 4-petal florets */}
            {[
              [120, 250], [145, 240], [160, 265], [130, 280], [150, 290],
              [115, 270], [140, 265], [135, 245], [155, 250]
            ].map(([x, y], i) => (
              <g key={i} transform={`translate(${x}, ${y})`}>
                <rect x="-6" y="-6" width="6" height="6" rx="2" fill="#e0e7ff" stroke="#6366f1" strokeWidth="0.6" />
                <rect x="0" y="-6" width="6" height="6" rx="2" fill="#c7d2fe" stroke="#6366f1" strokeWidth="0.6" />
                <rect x="-6" y="0" width="6" height="6" rx="2" fill="#c7d2fe" stroke="#6366f1" strokeWidth="0.6" />
                <rect x="0" y="0" width="6" height="6" rx="2" fill="#e0e7ff" stroke="#6366f1" strokeWidth="0.6" />
                <circle cx="0" cy="0" r="1.5" fill="#fef08a" />
              </g>
            ))}
          </g>

          {/* FLOWER 7: Purple Hydrangea / Tú Cầu Tím (Right Wing) */}
          <g
            id="flower-hydrangea-purple"
            className="cursor-pointer transition-transform duration-300 hover:scale-105 origin-[360px_270px]"
            onClick={() => handleFlowerClick(FLOWER_MESSAGES[6])}
            onMouseEnter={() => setHoveredFlower(FLOWER_MESSAGES[6].id)}
            onMouseLeave={() => setHoveredFlower(null)}
          >
            <circle cx="360" cy="270" r="50" fill="url(#gradPurpleHydrangea)" opacity="0.9" />
            {[
              [340, 250], [365, 240], [380, 265], [350, 280], [370, 290],
              [335, 270], [360, 265], [355, 245], [375, 250]
            ].map(([x, y], i) => (
              <g key={i} transform={`translate(${x}, ${y})`}>
                <rect x="-6" y="-6" width="6" height="6" rx="2" fill="#fae8ff" stroke="#a855f7" strokeWidth="0.6" />
                <rect x="0" y="-6" width="6" height="6" rx="2" fill="#f0abfc" stroke="#a855f7" strokeWidth="0.6" />
                <rect x="-6" y="0" width="6" height="6" rx="2" fill="#f0abfc" stroke="#a855f7" strokeWidth="0.6" />
                <rect x="0" y="0" width="6" height="6" rx="2" fill="#fae8ff" stroke="#a855f7" strokeWidth="0.6" />
                <circle cx="0" cy="0" r="1.5" fill="#fef08a" />
              </g>
            ))}
          </g>

          {/* FLOWER 2: Pink Rose / Hồng Phấn (Upper Left) */}
          <g
            id="flower-pink-rose"
            className="cursor-pointer transition-transform duration-300 hover:scale-105 origin-[195px_225px]"
            onClick={() => handleFlowerClick(FLOWER_MESSAGES[1])}
            onMouseEnter={() => setHoveredFlower(FLOWER_MESSAGES[1].id)}
            onMouseLeave={() => setHoveredFlower(null)}
          >
            <circle cx="195" cy="225" r="42" fill="url(#gradPinkRose)" />
            {/* Rose spiral petals */}
            <path d="M165 225 C165 200 225 200 225 225 C225 250 165 250 165 225 Z" fill="#ffb3c1" stroke="#f72585" strokeWidth="1.2" />
            <path d="M175 215 C190 200 215 205 215 225 C215 240 185 240 178 225" fill="#ffe5ec" stroke="#e01a4f" strokeWidth="1" />
            <path d="M185 220 C192 212 205 215 205 225 C202 232 190 232 188 222" fill="#ffffff" stroke="#c9184a" strokeWidth="1" />
          </g>

          {/* FLOWER 6: Peach Rose / Hồng Đào (Upper Right) */}
          <g
            id="flower-peach-rose"
            className="cursor-pointer transition-transform duration-300 hover:scale-105 origin-[305px_225px]"
            onClick={() => handleFlowerClick(FLOWER_MESSAGES[5])}
            onMouseEnter={() => setHoveredFlower(FLOWER_MESSAGES[5].id)}
            onMouseLeave={() => setHoveredFlower(null)}
          >
            <circle cx="305" cy="225" r="40" fill="url(#gradPinkRose)" />
            <path d="M275 225 C275 200 335 200 335 225 C335 250 275 250 275 225 Z" fill="#fecdd3" stroke="#f43f5e" strokeWidth="1.2" />
            <path d="M285 215 C300 200 325 205 325 225 C325 240 295 240 288 225" fill="#fff1f2" stroke="#e11d48" strokeWidth="1" />
            <path d="M295 220 C302 212 315 215 315 225 C312 232 300 232 298 222" fill="#ffffff" stroke="#be123c" strokeWidth="1" />
          </g>

          {/* FLOWER 5: White Daisy / Cúc Nhỏ Tinh Khôi (Lower Left) */}
          <g
            id="flower-white-daisy"
            className="cursor-pointer transition-transform duration-300 hover:scale-105 origin-[170px_350px]"
            onClick={() => handleFlowerClick(FLOWER_MESSAGES[4])}
            onMouseEnter={() => setHoveredFlower(FLOWER_MESSAGES[4].id)}
            onMouseLeave={() => setHoveredFlower(null)}
          >
            {/* White petals circle */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
              <ellipse
                key={deg}
                cx="170"
                cy="325"
                rx="6"
                ry="22"
                fill="#ffffff"
                stroke="#e2e8f0"
                strokeWidth="0.8"
                transform={`rotate(${deg} 170 350)`}
              />
            ))}
            <circle cx="170" cy="350" r="14" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" />
            <circle cx="170" cy="350" r="8" fill="#eab308" />
          </g>

          {/* FLOWER 4: Gerbera Daisy / Hoa Đồng Tiền Vàng (Lower Right) */}
          <g
            id="flower-gerbera"
            className="cursor-pointer transition-transform duration-300 hover:scale-105 origin-[330px_350px]"
            onClick={() => handleFlowerClick(FLOWER_MESSAGES[3])}
            onMouseEnter={() => setHoveredFlower(FLOWER_MESSAGES[3].id)}
            onMouseLeave={() => setHoveredFlower(null)}
          >
            {[0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 300, 320, 340].map((deg) => (
              <ellipse
                key={deg}
                cx="330"
                cy="324"
                rx="5"
                ry="24"
                fill="#fb923c"
                stroke="#ea580c"
                strokeWidth="0.7"
                transform={`rotate(${deg} 330 350)`}
              />
            ))}
            <circle cx="330" cy="350" r="15" fill="#78350f" stroke="#451a03" strokeWidth="2" />
            <circle cx="330" cy="350" r="9" fill="#451a03" />
          </g>

          {/* FLOWER 1: The Crown Jewel - Velvet Red Rose (Heart Center) */}
          <g
            id="flower-red-rose-center"
            className="cursor-pointer transition-transform duration-300 hover:scale-105 origin-[250px_300px]"
            onClick={() => handleFlowerClick(FLOWER_MESSAGES[0])}
            onMouseEnter={() => setHoveredFlower(FLOWER_MESSAGES[0].id)}
            onMouseLeave={() => setHoveredFlower(null)}
          >
            {/* Outer Petals */}
            <circle cx="250" cy="300" r="54" fill="url(#gradRedRose)" />
            {/* Velvet swirling petals */}
            <path
              d="M210 290 C205 250 280 245 290 285 C295 320 230 340 210 290 Z"
              fill="#c9184a"
              stroke="#590d22"
              strokeWidth="1.5"
            />
            <path
              d="M225 280 C230 255 270 255 278 280 C282 305 240 315 228 295"
              fill="#e01a4f"
              stroke="#800f2f"
              strokeWidth="1.5"
            />
            <path
              d="M236 288 C240 270 262 270 266 286 C268 298 246 304 240 294"
              fill="#ff4d6d"
              stroke="#a01a58"
              strokeWidth="1.2"
            />
            {/* Rose center bud */}
            <ellipse cx="251" cy="291" rx="8" ry="6" fill="#590d22" stroke="#ff758f" strokeWidth="1" />
          </g>

          {/* Golden Champagne Silk Ribbon Wrapping & Bow */}
          <g id="ribbon" className="pointer-events-none">
            {/* Ribbon tie around stems */}
            <path
              d="M190 440 Q250 455 310 440 L315 470 Q250 490 185 470 Z"
              fill="url(#gradRibbon)"
              stroke="#ca8a04"
              strokeWidth="1.5"
              filter="url(#goldGlow)"
            />
            {/* Large festive ribbon bow */}
            <path
              d="M250 460 C200 420 160 480 230 475 Z"
              fill="url(#gradRibbon)"
              stroke="#a16207"
              strokeWidth="1.5"
            />
            <path
              d="M250 460 C300 420 340 480 270 475 Z"
              fill="url(#gradRibbon)"
              stroke="#a16207"
              strokeWidth="1.5"
            />
            {/* Bow center knot with Gia Hội initial */}
            <ellipse cx="250" cy="468" rx="14" ry="12" fill="#fef08a" stroke="#ca8a04" strokeWidth="2" />
            <text x="250" y="472" textAnchor="middle" fill="#854d0e" fontSize="10" fontWeight="bold" fontFamily="serif">GH</text>

            {/* Trailing golden ribbon tails */}
            <path
              d="M242 478 Q220 530 200 580 Q215 570 235 550 Q245 520 248 480"
              fill="url(#gradRibbon)"
              opacity="0.95"
            />
            <path
              d="M258 478 Q280 530 300 580 Q285 570 265 550 Q255 520 252 480"
              fill="url(#gradRibbon)"
              opacity="0.95"
            />
          </g>
        </svg>

        {/* Floating pulse indicator on center rose */}
        <div className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center">
          <span className="w-10 h-10 rounded-full border border-amber-300/60 animate-ping" />
        </div>
      </div>

      {/* Hover preview tooltip when hovering a flower */}
      {hoveredFlower && !selectedFlower && (
        <div className="mt-3 text-xs md:text-sm text-stone-300 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full border border-amber-400/30 transition-all">
          {FLOWER_MESSAGES.find((f) => f.id === hoveredFlower)?.name} · Nhấn để đọc lời tri ân
        </div>
      )}

      {/* Modal Dialog for Flower Tribute Message */}
      <AnimatePresence>
        {selectedFlower && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md"
            onClick={() => setSelectedFlower(null)}
          >
            <motion.div
              initial={{ scale: 0.88, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-md bg-[#0d1e3d] border border-amber-400/40 rounded-2xl p-6 sm:p-7 shadow-2xl text-center overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Golden corner ornaments */}
              <div className="absolute top-2 left-2 text-amber-400/40 text-xs">✤</div>
              <div className="absolute top-2 right-2 text-amber-400/40 text-xs">✤</div>
              <div className="absolute bottom-2 left-2 text-amber-400/40 text-xs">✤</div>
              <div className="absolute bottom-2 right-2 text-amber-400/40 text-xs">✤</div>

              {/* Close button */}
              <button
                onClick={() => setSelectedFlower(null)}
                className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-slate-800/80 text-stone-300 hover:text-white hover:bg-slate-700 flex items-center justify-center transition-colors"
                aria-label="Đóng"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Flower Icon / Indicator */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs uppercase tracking-wider mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{selectedFlower.vietnameseType}</span>
                <span className="text-stone-500">·</span>
                <span className="text-stone-300">{selectedFlower.colorName}</span>
              </div>

              {/* Tribute Quote */}
              <blockquote className="my-4 text-xl sm:text-2xl font-serif text-amber-100 font-semibold leading-relaxed italic">
                “{selectedFlower.message}”
              </blockquote>

              {/* Meaning prose */}
              <p className="text-sm text-stone-300 leading-relaxed font-sans mt-2 mb-5">
                {selectedFlower.meaning}
              </p>

              {/* Signature footer */}
              <div className="pt-4 border-t border-amber-400/20 flex flex-col items-center">
                <span className="text-xs tracking-widest uppercase text-amber-400/80 font-medium">
                  TỔ TOÁN – THPT GIA HỘI
                </span>
                <span className="text-[11px] text-stone-400 mt-0.5">
                  Mừng Ngày Nhà giáo Việt Nam 20/11
                </span>
              </div>

              {/* Button close */}
              <button
                onClick={() => setSelectedFlower(null)}
                className="mt-5 w-full py-2.5 px-4 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-500 text-slate-950 font-semibold text-sm rounded-xl transition-all shadow-lg shadow-amber-500/20 active:scale-[0.99]"
              >
                Cảm ơn đóa hoa tri ân
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
