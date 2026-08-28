/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  motion,
  AnimatePresence,
  useAnimationControls,
  useMotionValue,
  useSpring,
} from 'motion/react';
import compassLayer from '../../assets/halo/compass.svg?raw';
import coreLayer from '../../assets/halo/core.svg?raw';
import innerFlowerLayer from '../../assets/halo/inner-flower.svg?raw';
import outerSigilLayer from '../../assets/halo/outer-sigil.svg?raw';
import waveRingLayer from '../../assets/halo/wave-ring.svg?raw';

interface FloralHaloProps {
  className?: string;
  isPaused?: boolean;
  playIntro?: boolean;
}

interface ThemedSvgLayerProps {
  svg: string;
  className: string;
  animate: ReturnType<typeof useAnimationControls>;
}

function ThemedSvgLayer({ svg, className, animate }: ThemedSvgLayerProps) {
  return (
    <motion.div
      animate={animate}
      className={`${className} text-[var(--theme-hot)] transition-colors duration-500 [&_svg]:h-full [&_svg]:w-full [&_svg]:block`}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

function FloralHalo({
  className = "",
  isPaused = false,
  playIntro = true,
}: FloralHaloProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [clickPulseKey, setClickPulseKey] = useState(0);
  const rawTiltX = useMotionValue(0);
  const rawTiltY = useMotionValue(0);
  const tiltX = useSpring(rawTiltX, { stiffness: 80, damping: 24 });
  const tiltY = useSpring(rawTiltY, { stiffness: 80, damping: 24 });
  const rotationSpeed = isHovered ? 9.6 : 18; // seconds per full rotation
  const waveControls = useAnimationControls();
  const outerControls = useAnimationControls();
  const innerControls = useAnimationControls();
  const coreControls = useAnimationControls();
  const compassControls = useAnimationControls();

  useEffect(() => {
    let frame: number | null = null;
    let latestPointer = { x: 0, y: 0 };

    const updateTilt = () => {
      if (!containerRef.current || isPaused) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = latestPointer.x - centerX;
      const dy = latestPointer.y - centerY;
      const maxTilt = 20;

      rawTiltX.set(-(dy / 600) * maxTilt);
      rawTiltY.set((dx / 600) * maxTilt);
    };

    const handlePointerMove = (event: PointerEvent) => {
      latestPointer = {
        x: event.clientX,
        y: event.clientY,
      };

      if (frame !== null) return;

      frame = window.requestAnimationFrame(() => {
        updateTilt();
        frame = null;
      });
    };

    if (isPaused) {
      rawTiltX.set(0);
      rawTiltY.set(0);
      return;
    }

    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      if (frame !== null) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, [isPaused, rawTiltX, rawTiltY]);

  useEffect(() => {
    if (isPaused) {
      waveControls.stop();
      outerControls.stop();
      innerControls.stop();
      coreControls.stop();
      compassControls.stop();
      return;
    }

    waveControls.start({
      rotate: 360,
      transition: {
        repeat: Infinity,
        ease: "linear",
        duration: rotationSpeed * 3,
      },
    });
    outerControls.start({
      rotate: 360,
      transition: {
        repeat: Infinity,
        ease: "linear",
        duration: rotationSpeed * 1.8,
      },
    });
    innerControls.start({
      rotate: -360,
      transition: {
        repeat: Infinity,
        ease: "linear",
        duration: rotationSpeed * 1.1,
      },
    });
    coreControls.start({
      rotate: 360,
      transition: {
        repeat: Infinity,
        ease: "linear",
        duration: rotationSpeed * 0.6,
      },
    });
    compassControls.start({
      rotate: -360,
      transition: {
        repeat: Infinity,
        ease: "linear",
        duration: 8,
      },
    });
  }, [
    compassControls,
    coreControls,
    innerControls,
    isPaused,
    outerControls,
    rotationSpeed,
    waveControls,
  ]);

  return (
    <div 
      ref={containerRef}
      onMouseEnter={() => {
        if (!isPaused) setIsHovered(true);
      }}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative select-none pointer-events-auto flex items-center justify-center ${className}`}
      style={{
        perspective: 1200,
      }}
    >
      {/* ========================================================== */}
      {/* AMBIENT LIGHTING, BLOOMS & HIGH-INTENSITY LIGHT BEAMS (ONLY PINK & WHITE) */}
      {/* ========================================================== */}
      
      {/* Intense vertical light bars / columns of pink and white - screen mix mode */}
      <div className="absolute inset-y-[-600px] left-1/2 -translate-x-1/2 w-[240px] bg-gradient-to-b from-transparent via-[var(--theme-hot)]/45 to-transparent filter blur-[100px] pointer-events-none mix-blend-screen" />
      <div className="absolute inset-y-[-600px] left-[40%] w-[90px] bg-gradient-to-b from-transparent via-[var(--theme-hot)]/35 to-transparent filter blur-[80px] pointer-events-none mix-blend-screen animate-pulse" />
      <div className="absolute inset-y-[-600px] left-[60%] w-[70px] bg-gradient-to-b from-transparent via-white/20 to-transparent filter blur-[60px] pointer-events-none mix-blend-screen" />
      
      {/* Pure white intense key light beam down the center */}
      <div className="absolute inset-y-[-500px] left-1/2 -translate-x-1/2 w-[12px] bg-gradient-to-b from-transparent via-white/50 to-transparent filter blur-[6px] pointer-events-none mix-blend-screen" />
      <div className="absolute inset-y-[-500px] left-1/2 -translate-x-1/2 w-[3px] bg-gradient-to-b from-transparent via-white to-transparent filter blur-[1px] pointer-events-none mix-blend-screen" />

      {/* Horizontal glowing pink/white flare */}
      <div className="absolute inset-x-[-350px] top-1/2 -translate-y-1/2 h-[60px] bg-gradient-to-r from-transparent via-[var(--theme-hot)]/40 to-transparent filter blur-[70px] pointer-events-none mix-blend-screen" />
      <div className="absolute inset-x-[-200px] top-1/2 -translate-y-1/2 h-[8px] bg-gradient-to-r from-transparent via-white/35 to-transparent filter blur-[10px] pointer-events-none mix-blend-screen" />

      {/* Extreme pink blooming vignette cloud centered on the graphic */}
      <div className="absolute w-[640px] h-[640px] bg-[var(--theme-hot)]/25 rounded-full filter blur-[120px] pointer-events-none mix-blend-screen" />
      <div className="absolute w-[360px] h-[360px] bg-white/10 rounded-full filter blur-[60px] pointer-events-none mix-blend-screen" />

      {playIntro && (
        <div className="absolute inset-0 pointer-events-none z-30 flex flex-col justify-stretch overflow-hidden">
          {[...Array(30)].map((_, idx) => (
            <motion.div
              key={idx}
              initial={{ scaleY: 1, opacity: 1 }}
              animate={{ scaleY: 0, opacity: 0 }}
              transition={{
                duration: 0.45,
                delay: idx * 0.02 + 0.05,
                ease: "easeInOut"
              }}
              style={{ originY: 0 }}
              className="w-full bg-white border-b border-[var(--theme-hot)]/10 flex-1"
            />
          ))}
        </div>
      )}

      {/* Interaction Stage */}
      <motion.div
        onClick={() => {
          if (!isPaused) setClickPulseKey((key) => key + 1);
        }}
        animate={{
          scale: isHovered && !isPaused ? 1.04 : 1.0,
        }}
        style={{
          rotateX: tiltX,
          rotateY: tiltY,
          willChange: "transform",
        }}
        transition={{ type: "spring", stiffness: 80, damping: 24 }}
        className="w-[580px] h-[580px] flex items-center justify-center relative pixel-cursor-clickable"
      >
        <AnimatePresence>
          {clickPulseKey > 0 && (
            <motion.div
              key={clickPulseKey}
              initial={{ opacity: 0.75, scale: 0.88 }}
              animate={{ opacity: 0, scale: 1.22 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.95, ease: "easeOut" }}
              className="pointer-events-none absolute inset-[-12%] z-[5] rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(var(--theme-rgb), 0.42) 0%, rgba(var(--theme-rgb), 0.18) 42%, rgba(var(--theme-rgb), 0) 72%)",
                boxShadow:
                  "0 0 48px rgba(var(--theme-rgb), 0.55), 0 0 96px rgba(var(--theme-rgb), 0.32)",
              }}
            />
          )}
        </AnimatePresence>
        {/* Soft glowing background center aura */}
        <div className={`absolute w-[400px] h-[400px] bg-[var(--theme-hot)]/20 rounded-full blur-3xl pointer-events-none transition-all duration-700 ${isHovered ? 'opacity-100 scale-110' : 'opacity-70 scale-100'}`} />

        {/* ========================================================== */}
        {/* SPECULAR LIGHT OVERLAYS (NO BLACK AT ALL - SHIFTS DYNAMICALLY OVER ROTATING ARTWORK) */}
        {/* ========================================================== */}
        <div 
          className="absolute w-[520px] h-[520px] rounded-full pointer-events-none mix-blend-color-dodge opacity-90 select-none z-20 pointer-events-none"
          style={{
            background: "radial-gradient(circle at 35% 35%, rgba(255, 255, 255, 0.95) 0%, rgba(var(--theme-rgb), 0.3) 35%, rgba(var(--theme-light-rgb), 0) 70%)"
          }}
        />
        <div 
          className="absolute w-[520px] h-[520px] rounded-full pointer-events-none mix-blend-overlay opacity-60 select-none z-25 pointer-events-none"
          style={{
            background: "radial-gradient(circle at 40% 40%, rgba(255, 255, 255, 0.9) 0%, rgba(var(--theme-rgb), 0.15) 50%, rgba(255, 255, 255, 0) 80%)"
          }}
        />

        <ThemedSvgLayer
          animate={waveControls}
          svg={waveRingLayer}
          className="absolute w-[540px] h-[540px] pointer-events-none select-none"
        />

        {/* ========================================================== */}
        {/* OUTER CIRCLE: FLATTENED SIGIL LAYER */}
        {/* ========================================================== */}
        <ThemedSvgLayer
          animate={outerControls}
          svg={outerSigilLayer}
          className="absolute w-[580px] h-[580px] pointer-events-none select-none z-10"
        />

        {/* ========================================================== */}
        {/* INNER CIRCLE: FLATTENED GEOMETRIC FLOWER */}
        {/* ========================================================== */}
        <ThemedSvgLayer
          animate={innerControls}
          svg={innerFlowerLayer}
          className="absolute w-[320px] h-[320px] pointer-events-none select-none z-10"
        />

        {/* ========================================================== */}
        {/* COUNTER-ROTATING FLATTENED ROSE CORE */}
        {/* ========================================================== */}
        <ThemedSvgLayer
          animate={coreControls}
          svg={coreLayer}
          className="absolute w-[180px] h-[180px] pointer-events-none select-none z-[15]"
        />

        {/* ========================================================== */}
        {/* FLATTENED PRECISION AXIS COMPASS */}
        {/* ========================================================== */}
        <ThemedSvgLayer
          animate={compassControls}
          svg={compassLayer}
          className="absolute w-[72px] h-[72px] pointer-events-none select-none z-[25]"
        />
      </motion.div>
    </div>
  );
}

export default React.memo(FloralHalo);
