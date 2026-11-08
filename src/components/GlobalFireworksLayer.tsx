/**
 * FireworksContext & GlobalFireworksLayer
 *
 * Implements:
 * 1. Global Three.js layer running across all slides and views.
 * 2. Interactive Touch & Click Fireworks Listener:
 *    - Uses Pointer Events (pointerdown) supporting mouse, touch, and stylus.
 *    - Accurately converts screen pixel coordinates to 3D world space.
 *    - Ignores interactions on interactive UI controls (buttons, inputs, links).
 *    - Dismisses the introductory "CHẠM VÀO BẦU TRỜI – THẮP SÁNG TRI ÂN" cue on first tap.
 */

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import {
  FireworksEngine,
  FireworksConfig,
  DEFAULT_FIREWORKS_CONFIG,
  FireworksLevel,
  FireworkType,
} from '../utils/fireworksEngine';

export interface FloatingBadge {
  id: number;
  x: number;
  y: number;
  text: string;
}

interface FireworksContextType {
  config: FireworksConfig;
  engine: FireworksEngine | null;
  toggleFireworks: () => void;
  toggleInteractive: () => void;
  setLevel: (level: FireworksLevel) => void;
  setDensity: (density: number) => void;
  setBloom: (brightness: number) => void;
  setPowerMode: (mode: 'auto' | 'high' | 'battery-save') => void;
  toggleReflection: () => void;
  toggleGoldenDust: () => void;
  launchSpecific: (type: FireworkType) => void;
  launchCornerWelcome: () => void;
  triggerGrandClimax: () => void;
  hasInteractedOnce: boolean;
}

const FireworksContext = createContext<FireworksContextType | null>(null);

export const useFireworks = () => {
  const ctx = useContext(FireworksContext);
  if (!ctx) {
    throw new Error('useFireworks must be used within FireworksProvider');
  }
  return ctx;
};

const CELEBRATORY_PHRASES = [
  '✨ TRI ÂN THẦY CÔ! ✨',
  '💐 HAPPY TEACHERS\' DAY!',
  '✦ 20 − 11 YÊU THƯƠNG! ✦',
  '🌸 NGÀN HOA TRI ÂN! 🌸',
  '★ TÔN VINH NGƯỜI GIEO CHỮ! ★',
  '✦ TỔ TOÁN – THPT GIA HỘI! ✦',
  '🌱 TRI THỨC GIEO MẦM! 🌱',
  '☀️ NGHỀ GIÁO TỎA SÁNG! ☀️',
];

export const FireworksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const engineRef = useRef<FireworksEngine | null>(null);
  const [config, setConfig] = useState<FireworksConfig>(DEFAULT_FIREWORKS_CONFIG);
  const [hasInteractedOnce, setHasInteractedOnce] = useState(false);
  const [floatingBadges, setFloatingBadges] = useState<FloatingBadge[]>([]);
  const badgeCounterRef = useRef(0);
  const burstCountRef = useRef(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const engine = new FireworksEngine(containerRef.current, config);
    engineRef.current = engine;

    // Attach explosion listener for floating celebratory badges
    engine.onExplode = ({ screenX, screenY }) => {
      burstCountRef.current += 1;
      // Show badge on every 3rd automatic explosion or any interactive explosion
      if (burstCountRef.current % 3 === 0) {
        const id = ++badgeCounterRef.current;
        const phrase = CELEBRATORY_PHRASES[Math.floor(Math.random() * CELEBRATORY_PHRASES.length)];
        
        // Keep within viewport boundaries
        const clampedX = Math.max(80, Math.min(window.innerWidth - 80, screenX));
        const clampedY = Math.max(60, Math.min(window.innerHeight - 80, screenY));

        setFloatingBadges((prev) => [
          ...prev.slice(-6), // Keep max 7 active badges at once
          { id, x: clampedX, y: clampedY, text: phrase },
        ]);

        setTimeout(() => {
          setFloatingBadges((prev) => prev.filter((b) => b.id !== id));
        }, 2600);
      }
    };

    // Welcoming corner bursts after 700ms
    const welcomeTimer = setTimeout(() => {
      engine.launchCornerWelcome();
    }, 700);

    return () => {
      clearTimeout(welcomeTimer);
      engine.destroy();
      engineRef.current = null;
    };
  }, []);

  const toggleFireworks = () => {
    const next = !config.enabled;
    setConfig((prev) => ({ ...prev, enabled: next }));
    if (engineRef.current) {
      engineRef.current.config.enabled = next;
    }
  };

  const toggleInteractive = () => {
    const next = !config.interactiveEnabled;
    setConfig((prev) => ({ ...prev, interactiveEnabled: next }));
  };

  const setLevel = (level: FireworksLevel) => {
    setConfig((prev) => ({ ...prev, level }));
    if (engineRef.current) {
      engineRef.current.setLevel(level);
    }
  };

  const setDensity = (density: number) => {
    setConfig((prev) => ({ ...prev, particleDensity: density }));
    if (engineRef.current) {
      engineRef.current.setDensity(density);
    }
  };

  const setBloom = (brightness: number) => {
    setConfig((prev) => ({ ...prev, bloomBrightness: brightness }));
    if (engineRef.current) {
      engineRef.current.setBloom(brightness);
    }
  };

  const setPowerMode = (mode: 'auto' | 'high' | 'battery-save') => {
    setConfig((prev) => ({ ...prev, powerMode: mode }));
    if (engineRef.current) {
      engineRef.current.config.powerMode = mode;
      if (mode === 'battery-save') {
        engineRef.current.setDensity(0.6);
        engineRef.current.config.showReflection = false;
      } else if (mode === 'high') {
        engineRef.current.setDensity(1.5);
        engineRef.current.config.showReflection = true;
      } else {
        engineRef.current.setDensity(1.0);
        engineRef.current.config.showReflection = true;
      }
    }
  };

  const toggleReflection = () => {
    const next = !config.showReflection;
    setConfig((prev) => ({ ...prev, showReflection: next }));
    if (engineRef.current) {
      engineRef.current.config.showReflection = next;
    }
  };

  const toggleGoldenDust = () => {
    const next = !config.showGoldenDust;
    setConfig((prev) => ({ ...prev, showGoldenDust: next }));
    if (engineRef.current) {
      engineRef.current.config.showGoldenDust = next;
    }
  };

  const launchSpecific = (type: FireworkType) => {
    if (engineRef.current) {
      engineRef.current.launchFirework(type);
    }
  };

  const triggerGrandClimax = () => {
    if (engineRef.current) {
      engineRef.current.triggerGrandClimax();
    }
  };

  const launchCornerWelcome = () => {
    if (engineRef.current) {
      engineRef.current.launchCornerWelcome();
    }
  };

  // Ref to track last touch timestamp and prevent synthetic mouse double-firing
  const lastTouchTimeRef = useRef(0);

  /**
   * Global pointer listener for Click & Touch on the sky
   * Mobile: Immediate sparkling burst right under fingertip
   * Desktop: Immediate sparkling burst right at cursor coordinate
   */
  const handleGlobalPointerDown = useCallback(
    (e: PointerEvent) => {
      // Only respond to left click on desktop (button 0) or touch/pen
      if (e.pointerType === 'mouse' && e.button !== 0) return;

      if (!config.enabled || !config.interactiveEnabled || !engineRef.current) return;

      const isTouch = e.pointerType === 'touch' || e.pointerType === 'pen';

      // Prevent double-firing on devices that emulate mouse events after touch
      if (isTouch) {
        lastTouchTimeRef.current = Date.now();
      } else if (Date.now() - lastTouchTimeRef.current < 450) {
        // Ignored synthetic mouse event within 450ms of touch
        return;
      }

      // Ignore clicks on buttons, inputs, links, or control panels
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactiveTag = target.closest('button, a, input, select, textarea, [role="button"], #header-nav, .floating-bar');
        if (interactiveTag) {
          return;
        }
      }

      // Convert client screen coordinates to 3D world target
      const worldPos = engineRef.current.screenToWorld(e.clientX, e.clientY);
      const chosenType = engineRef.current.selectSmartRandomType();

      // Trigger instant sparkling burst right at exact interaction coordinates!
      engineRef.current.triggerInstantBurst(worldPos.x, worldPos.y, worldPos.z, chosenType);

      if (!hasInteractedOnce) {
        setHasInteractedOnce(true);
      }
    },
    [config.enabled, config.interactiveEnabled, hasInteractedOnce]
  );

  useEffect(() => {
    window.addEventListener('pointerdown', handleGlobalPointerDown, { passive: true });
    return () => {
      window.removeEventListener('pointerdown', handleGlobalPointerDown);
    };
  }, [handleGlobalPointerDown]);

  return (
    <FireworksContext.Provider
      value={{
        config,
        engine: engineRef.current,
        toggleFireworks,
        toggleInteractive,
        setLevel,
        setDensity,
        setBloom,
        setPowerMode,
        toggleReflection,
        toggleGoldenDust,
        launchSpecific,
        launchCornerWelcome,
        triggerGrandClimax,
        hasInteractedOnce,
      }}
    >
      {/* 
        Global Fireworks 3D Layer:
        z-35 places it above background & content cards (z-20),
        pointer-events-none allows page buttons and scrolling to work 100% unimpeded.
      */}
      <div
        ref={containerRef}
        id="global-fireworks-layer"
        className="fixed inset-0 pointer-events-none z-35 overflow-hidden"
        aria-hidden="true"
      />

      {/* Floating Celebratory Tribute Badges */}
      <div className="fixed inset-0 pointer-events-none z-36 overflow-hidden" aria-hidden="true">
        {floatingBadges.map((badge) => (
          <div
            key={badge.id}
            style={{
              left: `${badge.x}px`,
              top: `${badge.y}px`,
              transform: 'translate(-50%, -50%)',
            }}
            className="absolute pointer-events-none select-none px-3.5 py-1.5 rounded-full bg-slate-950/85 border border-amber-400/70 shadow-[0_0_25px_rgba(245,158,11,0.6)] backdrop-blur-md text-amber-200 font-serif font-bold text-xs sm:text-sm tracking-wider whitespace-nowrap animate-bounce duration-1000"
          >
            <span className="drop-shadow-[0_2px_8px_rgba(251,191,36,0.8)]">
              {badge.text}
            </span>
          </div>
        ))}
      </div>

      {children}
    </FireworksContext.Provider>
  );
};
