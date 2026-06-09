/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { motion } from 'motion/react';

interface Petal {
  id: number;
  x: number;      // initial horizontal percentage (0-100)
  y: number;      // initial vertical percentage or offset (-20 to 100)
  size: number;   // size in pixels
  opacity: number;
  duration: number; // speed multiplier
  delay: number;
  rotation: number;
  curveAmp: number; // wobble amplitude
}

export default function PetalRain() {
  const petals = useMemo(() => {
    // Generate a set of stable petals that will cycle infinitely
    return Array.from({ length: 24 }).map((_, i) => ({
      id: i,
      x: Math.random() * 110 - 5, // disperse wider than screen
      y: Math.random() * 120 - 20, // disperse vertically
      size: Math.random() * 12 + 6, // 6px to 18px
      opacity: Math.random() * 0.25 + 0.1, // very soft translucent layer
      duration: Math.random() * 25 + 20, // 20s to 45s slow drifting
      delay: Math.random() * -10, // pre-delay so they don't all spawn at once
      rotation: Math.random() * 360,
      curveAmp: Math.random() * 30 + 15 // wiggle sway
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-10 w-full h-full">
      {petals.map((petal) => (
        <motion.div
          key={petal.id}
          className="absolute"
          initial={{
            left: `${petal.x}%`,
            top: `${petal.y}%`,
            x: 0,
            y: 0,
            rotate: petal.rotation,
            scale: 0.8,
          }}
          animate={{
            // Slow romantic diagonal drift down-left, kept on transform for compositing.
            x: ["0vw", `${petal.curveAmp}px`, `-${petal.curveAmp}px`, "-15vw"],
            y: ["0vh", "20vh", "40vh", "60vh"],
            rotate: [petal.rotation, petal.rotation + 360],
          }}
          transition={{
            duration: petal.duration,
            repeat: Infinity,
            ease: "linear",
            delay: petal.delay,
          }}
          style={{
            zIndex: 1,
            pointerEvents: 'none',
          }}
        >
          {/* Beautifully styled vector petal character */}
          <div
            style={{
              fontSize: petal.size * 1.6,
              opacity: petal.opacity,
              color: 'var(--theme-hot)',
              filter: `drop-shadow(0 2px 4px rgba(var(--theme-rgb), 0.15))`,
              lineHeight: 1,
            }}
            className="font-sans select-none pointer-events-none"
          >
            ৡ
          </div>
        </motion.div>
      ))}

      {/* Floating horizontal or vertical hair-thin energy streams (Flash aesthetic) */}
      <div className="absolute top-[25%] left-0 w-full h-[0.5px] bg-gradient-to-r from-transparent via-[var(--theme-hot)]/25 to-transparent pointer-events-none" />
      <div className="absolute top-[68%] left-0 w-full h-[0.5px] bg-gradient-to-r from-transparent via-[var(--theme-hot)]/25 to-transparent pointer-events-none" />
      <div className="absolute left-[30%] top-0 h-full w-[0.5px] bg-gradient-to-b from-transparent via-[var(--theme-hot)]/15 to-transparent pointer-events-none" />
    </div>
  );
}
