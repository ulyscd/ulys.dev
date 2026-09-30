/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  motion,
  animate,
  useMotionValue,
  useSpring,
  type MotionValue,
} from 'motion/react';
import compassLayer from '../../assets/halo/compass.svg?raw';
import coreLayer from '../../assets/halo/core.svg?raw';
import innerFlowerLayer from '../../assets/halo/inner-flower.svg?raw';
import outerSigilLayer from '../../assets/halo/outer-sigil.svg?raw';
import waveRingLayer from '../../assets/halo/wave-ring.svg?raw';

export interface HaloFocusPoint {
  x: number;
  y: number;
}

interface FloralHaloProps {
  className?: string;
  isPaused?: boolean;
  playIntro?: boolean;
  /** Viewport point the halo turns toward and gently spins for (wide viewports only). */
  focusPoint?: HaloFocusPoint | null;
}

interface ThemedSvgLayerProps {
  svg: string;
  className: string;
  rotate: MotionValue<number>;
}

function ThemedSvgLayer({ svg, className, rotate }: ThemedSvgLayerProps) {
  return (
    <motion.div
      style={{ rotate }}
      className={`${className} text-[var(--theme-hot)] transition-colors duration-500 [&_svg]:h-full [&_svg]:w-full [&_svg]:block`}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

const WIDE_VIEWPORT_QUERY = "(min-width: 1024px)";
const SPIN_DOWN_DELAY_MS = 2000;
const FOCUS_SPIN_SPEED = 0.45;
const FOCUS_TILT_DEG = 12;

// Degrees per second at full speed; negative values counter-rotate.
const WAVE_DPS = 360 / 54;
const OUTER_DPS = 360 / 32.4;
const INNER_DPS = -360 / 19.8;
const CORE_DPS = 360 / 10.8;
const COMPASS_DPS = -360 / 8;

function useIsWideViewport() {
  const [isWide, setIsWide] = useState(
    () => window.matchMedia(WIDE_VIEWPORT_QUERY).matches,
  );

  useEffect(() => {
    const query = window.matchMedia(WIDE_VIEWPORT_QUERY);
    const update = () => setIsWide(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return isWide;
}

function FloralHalo({
  className = "",
  isPaused = false,
  playIntro = true,
  focusPoint = null,
}: FloralHaloProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isWide = useIsWideViewport();
  const [isHovered, setIsHovered] = useState(false);
  const [hasSettled, setHasSettled] = useState(false);
  const rawTiltX = useMotionValue(0);
  const rawTiltY = useMotionValue(0);
  const tiltX = useSpring(rawTiltX, { stiffness: 60, damping: 20 });
  const tiltY = useSpring(rawTiltY, { stiffness: 60, damping: 20 });
  const spinSpeed = useMotionValue(1);
  const waveRotate = useMotionValue(0);
  const outerRotate = useMotionValue(0);
  const innerRotate = useMotionValue(0);
  const coreRotate = useMotionValue(0);
  const compassRotate = useMotionValue(0);
  const isFocused = isWide && !isPaused && focusPoint !== null;

  useEffect(() => {
    if (!playIntro || hasSettled) return;
    const timeout = window.setTimeout(() => setHasSettled(true), SPIN_DOWN_DELAY_MS);
    return () => window.clearTimeout(timeout);
  }, [playIntro, hasSettled]);

  useEffect(() => {
    if (isPaused) {
      spinSpeed.stop();
      spinSpeed.set(0);
      return;
    }

    const target = !hasSettled ? 1 : isFocused ? FOCUS_SPIN_SPEED : 0;
    const isSpeedingUp = target > spinSpeed.get();
    const controls = animate(spinSpeed, target, {
      duration: isSpeedingUp ? 0.8 : 1.5,
      ease: isSpeedingUp ? "easeInOut" : "easeOut",
    });
    return () => controls.stop();
  }, [hasSettled, isFocused, isPaused, spinSpeed]);

  // Only runs frames while the halo is actually turning.
  useEffect(() => {
    const layers: [MotionValue<number>, number][] = [
      [waveRotate, WAVE_DPS],
      [outerRotate, OUTER_DPS],
      [innerRotate, INNER_DPS],
      [coreRotate, CORE_DPS],
      [compassRotate, COMPASS_DPS],
    ];
    let frame: number | null = null;
    let lastTime: number | null = null;

    const tick = (time: number) => {
      const speed = spinSpeed.get();
      if (speed <= 0) {
        frame = null;
        lastTime = null;
        return;
      }

      if (lastTime !== null) {
        const elapsed = Math.min((time - lastTime) / 1000, 0.1);
        for (const [rotation, degreesPerSecond] of layers) {
          rotation.set((rotation.get() + degreesPerSecond * speed * elapsed) % 360);
        }
      }
      lastTime = time;
      frame = window.requestAnimationFrame(tick);
    };

    const start = () => {
      if (frame === null && spinSpeed.get() > 0) {
        frame = window.requestAnimationFrame(tick);
      }
    };

    start();
    const unsubscribe = spinSpeed.on("change", start);

    return () => {
      unsubscribe();
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, [compassRotate, coreRotate, innerRotate, outerRotate, spinSpeed, waveRotate]);

  useEffect(() => {
    if (!isFocused || !focusPoint || !containerRef.current) {
      rawTiltX.set(0);
      rawTiltY.set(0);
      return;
    }

    const rect = containerRef.current.getBoundingClientRect();
    const dx = focusPoint.x - (rect.left + rect.width / 2);
    const dy = focusPoint.y - (rect.top + rect.height / 2);
    const distance = Math.hypot(dx, dy) || 1;

    rawTiltX.set(-(dy / distance) * FOCUS_TILT_DEG);
    rawTiltY.set((dx / distance) * FOCUS_TILT_DEG);
  }, [focusPoint, isFocused, rawTiltX, rawTiltY]);

  useEffect(() => {
    if (!isWide || isPaused) setIsHovered(false);
  }, [isPaused, isWide]);

  return (
    <div 
      ref={containerRef}
      className={`relative select-none pointer-events-none flex items-center justify-center ${className}`}
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
      {/* Untransformed circle matching the outer sigil, so hover never grows or follows the tilt */}
      <div
        onPointerEnter={(event) => {
          if (!isPaused && isWide && event.pointerType !== "touch") setIsHovered(true);
        }}
        onPointerLeave={() => setIsHovered(false)}
        className={`absolute z-40 w-[580px] h-[580px] rounded-full ${
          isWide && !isPaused ? "pointer-events-auto" : "pointer-events-none"
        }`}
      />

      <motion.div
        animate={{
          scale: isHovered && !isPaused ? 1.04 : 1.0,
        }}
        style={{
          rotateX: tiltX,
          rotateY: tiltY,
          willChange: "transform",
        }}
        transition={{ type: "spring", stiffness: 80, damping: 24 }}
        className="w-[580px] h-[580px] flex items-center justify-center relative pointer-events-none"
      >
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
          rotate={waveRotate}
          svg={waveRingLayer}
          className="absolute w-[540px] h-[540px] pointer-events-none select-none"
        />

        {/* ========================================================== */}
        {/* OUTER CIRCLE: FLATTENED SIGIL LAYER */}
        {/* ========================================================== */}
        <ThemedSvgLayer
          rotate={outerRotate}
          svg={outerSigilLayer}
          className="absolute w-[580px] h-[580px] pointer-events-none select-none z-10"
        />

        {/* ========================================================== */}
        {/* INNER CIRCLE: FLATTENED GEOMETRIC FLOWER */}
        {/* ========================================================== */}
        <ThemedSvgLayer
          rotate={innerRotate}
          svg={innerFlowerLayer}
          className="absolute w-[320px] h-[320px] pointer-events-none select-none z-10"
        />

        {/* ========================================================== */}
        {/* COUNTER-ROTATING FLATTENED ROSE CORE */}
        {/* ========================================================== */}
        <ThemedSvgLayer
          rotate={coreRotate}
          svg={coreLayer}
          className="absolute w-[180px] h-[180px] pointer-events-none select-none z-[15]"
        />

        {/* ========================================================== */}
        {/* FLATTENED PRECISION AXIS COMPASS */}
        {/* ========================================================== */}
        <ThemedSvgLayer
          rotate={compassRotate}
          svg={compassLayer}
          className="absolute w-[72px] h-[72px] pointer-events-none select-none z-[25]"
        />
      </motion.div>
    </div>
  );
}

export default React.memo(FloralHalo);
