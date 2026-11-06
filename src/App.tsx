/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { PetalCanvas } from './components/PetalCanvas';
import { IntroScreen } from './components/IntroScreen';
import { HeaderNav } from './components/HeaderNav';
import { HeroTitle } from './components/HeroTitle';
import { FloralBouquet } from './components/FloralBouquet';
import { TributeLetter } from './components/TributeLetter';
import { MathGarden } from './components/MathGarden';
import { GreetingCard } from './components/GreetingCard';
import { GrandFinale } from './components/GrandFinale';
import { OfflineHelpModal } from './components/OfflineHelpModal';
import { FireworksProvider, useFireworks } from './components/GlobalFireworksLayer';
import { downloadStandaloneSingleHtml } from './utils/htmlExporter';
import { globalAudio } from './utils/globalAudio';

function AppContent() {
  const [hasEntered, setHasEntered] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [petalIntensity, setPetalIntensity] = useState<'normal' | 'burst'>('normal');

  const { setLevel, launchSpecific, triggerGrandClimax } = useFireworks();

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // When user clicks "MỞ VƯỜN HOA TRI ÂN"
  const handleEnter = () => {
    setHasEntered(true);
    setPetalIntensity('burst');
    // Start with lively Rực Rỡ fireworks show and launch special Golden Lotus & Heart
    setLevel('ruc-ro');
    setTimeout(() => launchSpecific('lotus'), 600);
    setTimeout(() => launchSpecific('heart'), 1400);

    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      setPetalIntensity('normal');
    }, 4000);
  };

  const handleReplay = () => {
    setHasEntered(false);
    setLevel('lung-linh');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  return (
    <div id="top" className="min-h-screen bg-[#081226] text-stone-100 flex flex-col relative overflow-x-hidden">
      {/* Floating Petal Engine across background */}
      <PetalCanvas intensity={petalIntensity} />

      {/* Intro Curtain Screen */}
      <AnimatePresence>
        {!hasEntered && <IntroScreen onEnter={handleEnter} />}
      </AnimatePresence>

      {/* Main Interactive Gift Content */}
      {hasEntered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="flex-1 flex flex-col relative z-20"
        >
          {/* Top Navigation Bar with persistent Global Music & 3D Fireworks Controls */}
          <HeaderNav
            isFullscreen={isFullscreen}
            onToggleFullscreen={handleToggleFullscreen}
            onOpenHelp={() => setIsHelpOpen(true)}
          />

          <main className="flex-1 flex flex-col space-y-8 md:space-y-12">
            {/* 1. Tiêu đề chúc mừng 20-11 nổi bật với nghệ thuật hình học Toán */}
            <HeroTitle />

            {/* 2. Bó hoa nghệ thuật tương tác (Điểm nhấn trung tâm) */}
            <section id="bo-hoa" className="w-full">
              <FloralBouquet />
            </section>

            {/* 3. Bức thư tri ân từ Tổ Toán THPT Gia Hội */}
            <TributeLetter />

            {/* 4. Khu vườn hoa tri thức (Kết hợp hoa & đồ thị hàm số) */}
            <MathGarden />

            {/* 5. Thiệp chúc mừng tương tác (Cá nhân hóa & Sao chép) */}
            <GreetingCard />

            {/* 6. Khoảnh khắc kết thúc (Chữ ký tập thể Tổ Toán & Đại tiệc Pháo hoa) */}
            <GrandFinale
              onReplay={handleReplay}
              onOpenOfflineHelp={() => setIsHelpOpen(true)}
              onDownloadSingleHtml={downloadStandaloneSingleHtml}
            />
          </main>
        </motion.div>
      )}

      {/* Offline Guide & Deployment Modal */}
      <OfflineHelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <FireworksProvider>
      <AppContent />
    </FireworksProvider>
  );
}
