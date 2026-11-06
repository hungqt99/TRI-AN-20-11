import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Compass, Lightbulb, X, RefreshCw } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface MathFlowerNode {
  id: string;
  name: string;
  mathSymbol: string;
  mathFormula: string;
  flowerType: string;
  accentColor: string;
  x: number; // percentage
  y: number; // percentage
}

const MATH_FLOWER_NODES: MathFlowerNode[] = [
  {
    id: 'node-fibonacci',
    name: 'Hoa Hướng Dương Fibonacci',
    mathSymbol: 'φ = 1.618...',
    mathFormula: 'F(n) = F(n-1) + F(n-2)',
    flowerType: 'Xoắn ốc Tỷ lệ vàng',
    accentColor: '#fbbf24',
    x: 22,
    y: 35,
  },
  {
    id: 'node-sine',
    name: 'Dải Hoa Sóng Sin',
    mathSymbol: 'y = sin(x)',
    mathFormula: 'T = 2π / ω',
    flowerType: 'Hoa Loa Kèn Tuần Hoàn',
    accentColor: '#38bdf8',
    x: 48,
    y: 22,
  },
  {
    id: 'node-calculus',
    name: 'Đóa Tích Phân Tận Tụy',
    mathSymbol: '∫ f(x)dx',
    mathFormula: 'S = ∫[a,b] f(x)dx',
    flowerType: 'Cẩm Tú Cầu Tích Lũy Tri Thức',
    accentColor: '#a855f7',
    x: 75,
    y: 32,
  },
  {
    id: 'node-coordinate',
    name: 'Tọa Độ Trái Tim & Lòng Biết Ơn',
    mathSymbol: '(x - a)² + (y - b)² = R²',
    mathFormula: 'Ox: Thời gian cống hiến · Oy: Tri thức nâng bước',
    flowerType: 'Đóa Hồng Tọa Độ',
    accentColor: '#f43f5e',
    x: 32,
    y: 68,
  },
  {
    id: 'node-parabola',
    name: 'Cổng Vòm Parabol Tương Lai',
    mathSymbol: 'y = ax² + bx + c',
    mathFormula: 'Đỉnh I(-b/2a, -Δ/4a)',
    flowerType: 'Hoa Dây Leo Khát Vọng',
    accentColor: '#34d399',
    x: 65,
    y: 72,
  },
  {
    id: 'node-infinity',
    name: 'Biển Học Vô Cực',
    mathSymbol: '∞',
    mathFormula: 'lim_{x → ∞} Tri thức(x) = Mênh mông',
    flowerType: 'Hoa Ngàn Sao Vĩnh Cửu',
    accentColor: '#e879f9',
    x: 85,
    y: 55,
  },
];

const MATH_TRIBUTE_WISHES = [
  '“Thầy Cô là điểm tựa vững vàng để đồ thị tương lai của chúng em luôn vươn tới cực đại.”',
  '“Tình yêu thương của Thầy Cô như một hằng số bất biến, luôn bao dung trước mọi sai số của học trò.”',
  '“Tích phân bao giờ cũng gom từng vi phân nhỏ – cũng như Thầy Cô gom từng ngày thầm lặng để dệt nên ước mơ lớn.”',
  '“Chúc Thầy Cô niềm vui tăng theo hàm số mũ, sức khỏe dồi dào tựa trục tung vươn thẳng!”',
  '“Không gian ba chiều mở lối muôn phương, nhưng trái tim người thầy luôn hướng về viên phấn trắng.”',
  '“Mỗi công thức Thầy Cô trao là một chìa khóa diệu kỳ mở ra thế giới tư duy logic và sáng tạo.”',
  '“Đường cong hàm số có khi uốn lượn thăng trầm, nhưng tấm lòng người thầy luôn là đường tiệm cận chở che.”',
  '“Tri ân Thầy Cô – những kỹ sư tâm hồn biến những phép tính khô khan thành bài ca tràn đầy cảm hứng.”',
];

export const MathGarden: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<MathFlowerNode | null>(null);
  const [currentWish, setCurrentWish] = useState<string>('');
  const [lastWishIndex, setLastWishIndex] = useState<number>(-1);

  const getRandomWish = () => {
    let newIndex: number;
    do {
      newIndex = Math.floor(Math.random() * MATH_TRIBUTE_WISHES.length);
    } while (newIndex === lastWishIndex && MATH_TRIBUTE_WISHES.length > 1);

    setLastWishIndex(newIndex);
    return MATH_TRIBUTE_WISHES[newIndex];
  };

  const handleNodeClick = (node: MathFlowerNode) => {
    soundEngine.playChime([440, 523.25, 659.25, 783.99, 1046.5]);
    setSelectedNode(node);
    setCurrentWish(getRandomWish());
  };

  const handleNextWish = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundEngine.playChime([523.25, 659.25, 783.99]);
    setCurrentWish(getRandomWish());
  };

  return (
    <section id="vuon-tri-thuc" className="relative w-full max-w-5xl mx-auto px-4 py-14 md:py-20 select-none">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-400/30 text-cyan-200 text-xs tracking-wider uppercase mb-3">
          <Compass className="w-3.5 h-3.5 text-amber-300" />
          <span>Sự giao thoa giữa Nghệ thuật & Toán học</span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-amber-100 font-normal">
          Khu Vườn Hoa Tri Thức
        </h2>
        <p className="text-stone-300 text-sm mt-1.5 font-serif italic max-w-xl mx-auto">
          Nơi vẻ đẹp thiên nhiên hòa quyện cùng những đường cong hàm số, gửi gắm lời chúc tươi vui và sâu sắc
        </p>
      </div>

      {/* Interactive Garden Canvas Area */}
      <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] bg-gradient-to-b from-[#0a1428] via-[#0d1d3a] to-[#071120] rounded-3xl border border-amber-500/25 shadow-2xl overflow-hidden p-4">
        {/* SVG Decorative Math Grid & Curves */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
          <defs>
            <linearGradient id="gridGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#d4af37" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* Coordinate Axes */}
          <line x1="5%" y1="50%" x2="95%" y2="50%" stroke="rgba(212, 175, 55, 0.2)" strokeWidth="1" />
          <line x1="50%" y1="5%" x2="50%" y2="95%" stroke="rgba(212, 175, 55, 0.2)" strokeWidth="1" />

          {/* Glowing Sine Wave connecting nodes */}
          <path
            d="M 50 250 Q 150 100, 250 250 T 450 250 T 650 250 T 850 250"
            fill="none"
            stroke="rgba(56, 189, 248, 0.25)"
            strokeWidth="2"
            strokeDasharray="4 4"
          />

          {/* Golden Spiral arc */}
          <path
            d="M 220 180 C 260 140, 320 160, 310 210 C 300 250, 240 260, 210 230 C 180 200, 190 140, 240 120 C 300 100, 380 130, 390 200"
            fill="none"
            stroke="rgba(251, 191, 36, 0.3)"
            strokeWidth="1.5"
          />

          {/* Parabolic Arch */}
          <path
            d="M 400 350 Q 550 120, 700 350"
            fill="none"
            stroke="rgba(52, 211, 153, 0.2)"
            strokeWidth="1.5"
          />
        </svg>

        {/* Ambient constellation stars */}
        <div className="absolute inset-0 pointer-events-none">
          {[
            { top: '15%', left: '12%' },
            { top: '28%', left: '38%' },
            { top: '18%', left: '82%' },
            { top: '75%', left: '18%' },
            { top: '80%', left: '50%' },
            { top: '65%', left: '90%' },
          ].map((star, i) => (
            <span
              key={i}
              className="absolute w-1.5 h-1.5 bg-amber-200 rounded-full animate-ping opacity-40"
              style={{ top: star.top, left: star.left, animationDuration: `${3 + i}s` }}
            />
          ))}
        </div>

        {/* Floating Math Garden Nodes */}
        {MATH_FLOWER_NODES.map((node) => (
          <div
            key={node.id}
            style={{ top: `${node.y}%`, left: `${node.x}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10"
            onClick={() => handleNodeClick(node)}
          >
            {/* Glowing aura */}
            <div
              className="absolute -inset-3 rounded-full blur-md opacity-40 group-hover:opacity-80 transition-opacity"
              style={{ backgroundColor: node.accentColor }}
            />

            {/* Core Node Button */}
            <div
              className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-slate-900/90 border-2 flex flex-col items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-115 active:scale-95"
              style={{ borderColor: node.accentColor }}
            >
              <Sparkles className="w-3.5 h-3.5 mb-0.5" style={{ color: node.accentColor }} />
              <span className="text-[10px] sm:text-xs font-serif font-bold text-stone-100">
                {node.mathSymbol.slice(0, 5)}
              </span>
            </div>

            {/* Micro label below */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 whitespace-nowrap px-2 py-0.5 rounded-md bg-slate-950/80 border border-slate-700/60 text-[10px] text-stone-300 pointer-events-none group-hover:border-amber-400/50 transition-colors">
              {node.name}
            </div>
          </div>
        ))}

        {/* Center prompt if nothing is selected */}
        {!selectedNode && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-slate-950/70 border border-amber-400/30 px-3.5 py-1.5 rounded-full text-xs text-amber-200 pointer-events-none backdrop-blur-md">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span>Nhấn vào bất kỳ biểu tượng Toán học nào để hái lời chúc</span>
          </div>
        )}
      </div>

      {/* Selected Node Wish Dialog */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="mt-6 w-full max-w-2xl mx-auto bg-[#0d1e3d] border border-cyan-400/40 rounded-2xl p-6 sm:p-7 shadow-2xl relative overflow-hidden"
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedNode(null)}
              className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-slate-800 text-stone-300 hover:text-white flex items-center justify-center transition-colors"
              aria-label="Đóng"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Node Info Header */}
            <div className="flex flex-wrap items-center gap-2 text-xs mb-3">
              <span
                className="px-2.5 py-0.5 rounded-full font-semibold"
                style={{ backgroundColor: `${selectedNode.accentColor}25`, color: selectedNode.accentColor }}
              >
                {selectedNode.name}
              </span>
              <span className="text-stone-400">·</span>
              <span className="text-stone-300 font-mono">{selectedNode.mathFormula}</span>
            </div>

            {/* Selected Wish Quote */}
            <blockquote className="text-lg sm:text-xl font-serif text-amber-100 italic leading-relaxed my-3">
              {currentWish}
            </blockquote>

            {/* Actions: Next quote or close */}
            <div className="mt-4 pt-4 border-t border-slate-700 flex items-center justify-between">
              <button
                onClick={handleNextWish}
                className="flex items-center gap-2 text-xs text-amber-300 hover:text-amber-200 hover:underline transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Đổi lời chúc ngẫu nhiên khác</span>
              </button>

              <span className="text-xs text-stone-400">
                Tổ Toán – THPT Gia Hội
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
