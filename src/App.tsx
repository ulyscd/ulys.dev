/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "motion/react";
import { Maximize2, X } from "lucide-react";
import { CURATED_PROJECTS, ProjectCurated } from "./data/projects";
import FloralHalo from "./components/FloralHalo";
import PetalRain from "./components/PetalRain";
import PixelGrid from "./components/PixelGrid";
import TopRightAsciiArt, { BlindReveal } from "./components/TopRightAsciiArt";
import FishTimeline from "./components/FishTimeline";
import loaderTitleAscii from "./assets/loader-title-ascii.txt?raw";
import selectCenterBorderAscii from "./assets/select-center-border-ascii.txt?raw";
import selectLeftAscii from "./assets/select-left-ascii.txt?raw";
import selectWindowAscii from "./assets/select-window-ascii.txt?raw";
import githubIcon from "../assets/social/github.webp";
import instagramIcon from "../assets/social/insta.webp";
import linkedinIcon from "../assets/social/linkedin.webp";

const SOCIAL_LINKS = [
  {
    label: "GitHub",
    href: "https://github.com/ulyscd",
    icon: githubIcon,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/ulyscd",
    icon: linkedinIcon,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/ulyscd/",
    icon: instagramIcon,
  },
];

const getPdfViewerUrl = (url: string) =>
  `${url}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`;

const SITE_THEMES = ["pink", "green", "navy", "black"] as const;
type SiteTheme = (typeof SITE_THEMES)[number];

const THEME_CLASS: Record<SiteTheme, string> = {
  pink: "",
  green: "theme-green",
  navy: "theme-navy",
  black: "theme-black",
};

const LOADER_GREEN = "#86a45c";
const LOADER_NAVY = "#1a365d";
const LOADER_NAVY_RGB = "26, 54, 93";

export default function App() {
  // Global States
  const [loading, setLoading] = useState(true);
  const loadProgress = useMotionValue(0);
  const [displayPercent, setDisplayPercent] = useState(0);
  const loadBarWidth = useTransform(loadProgress, (value) => `${Math.min(100, value)}%`);
  const lightLeakX = useMotionValue(-180);
  const lightLeakY = useMotionValue(-180);
  const pointerFrame = useRef<number | null>(null);
  const latestPointer = useRef({ x: 0, y: 0 });

  // Custom states for the composition expansion
  const [showCompositions, setShowCompositions] = useState(false);
  const [activeComposition, setActiveComposition] =
    useState<ProjectCurated | null>(null);
  const [showArticle, setShowArticle] = useState(false);
  const [showExtendedArticle, setShowExtendedArticle] = useState(false);
  const [showFishTimelineExtended, setShowFishTimelineExtended] =
    useState(false);
  const projectScrollRef = useRef<HTMLDivElement | null>(null);
  const [projectScrollClip, setProjectScrollClip] = useState({
    top: false,
    bottom: false,
  });

  // Active light bloom rays triggers
  const [burstActive, setBurstActive] = useState(false);
  const [siteTheme, setSiteTheme] = useState<SiteTheme>("navy");
  const [themePulseKey, setThemePulseKey] = useState(0);

  useEffect(() => {
    const unsubscribe = loadProgress.on("change", (value) => {
      setDisplayPercent(Math.min(100, Math.round(value)));
    });
    return unsubscribe;
  }, [loadProgress]);

  useEffect(() => {
    let current = 0;
    let finished = false;

    const interval = window.setInterval(() => {
      if (finished) return;

      if (current >= 100) {
        finished = true;
        window.clearInterval(interval);
        void animate(loadProgress, 100, {
          duration: 0.25,
          ease: "easeOut",
        }).then(() => {
          window.setTimeout(() => setLoading(false), 280);
        });
        return;
      }

      const step = Math.floor(Math.random() * 7) + 3;
      current = Math.min(100, current + step);
      void animate(loadProgress, current, {
        duration: 0.28,
        ease: "easeOut",
      });
    }, 75);

    return () => window.clearInterval(interval);
  }, [loadProgress]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (showCompositions) return;

    latestPointer.current = {
      x: e.clientX,
      y: e.clientY,
    };

    if (pointerFrame.current !== null) return;

    pointerFrame.current = window.requestAnimationFrame(() => {
      lightLeakX.set(latestPointer.current.x * 0.15 - 180);
      lightLeakY.set(latestPointer.current.y * 0.15 - 180);
      pointerFrame.current = null;
    });
  };

  useEffect(() => {
    return () => {
      if (pointerFrame.current !== null) {
        window.cancelAnimationFrame(pointerFrame.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!showCompositions) {
      setProjectScrollClip({ top: false, bottom: false });
      return;
    }

    const scroller = projectScrollRef.current;
    if (!scroller) return;

    const updateClip = () => {
      if (window.matchMedia("(min-width: 768px)").matches) {
        setProjectScrollClip({ top: false, bottom: false });
        return;
      }

      const containerRect = scroller.getBoundingClientRect();
      let clipTop = false;
      let clipBottom = false;

      scroller.querySelectorAll<HTMLElement>("[data-project-item]").forEach((item) => {
        const itemRect = item.getBoundingClientRect();
        const visibleTop = Math.max(itemRect.top, containerRect.top);
        const visibleBottom = Math.min(itemRect.bottom, containerRect.bottom);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);
        const ratio = itemRect.height > 0 ? visibleHeight / itemRect.height : 1;

        // Intensify when a card is partially cut (around halfway through the edge).
        const partiallyCut = ratio > 0.08 && ratio < 0.92;

        if (partiallyCut && itemRect.top < containerRect.top - 1) {
          clipTop = true;
        }
        if (partiallyCut && itemRect.bottom > containerRect.bottom + 1) {
          clipBottom = true;
        }
      });

      setProjectScrollClip((prev) =>
        prev.top === clipTop && prev.bottom === clipBottom
          ? prev
          : { top: clipTop, bottom: clipBottom },
      );
    };

    updateClip();
    scroller.addEventListener("scroll", updateClip, { passive: true });
    window.addEventListener("resize", updateClip);

    const resizeObserver = new ResizeObserver(updateClip);
    resizeObserver.observe(scroller);

    return () => {
      scroller.removeEventListener("scroll", updateClip);
      window.removeEventListener("resize", updateClip);
      resizeObserver.disconnect();
    };
  }, [showCompositions, activeComposition]);

  const handleIntroduceClick = () => {
    setShowCompositions(true);
    setBurstActive(true);

    // Deactivate light ray burst after simulation completes
    setTimeout(() => {
      setBurstActive(false);
    }, 1800);
  };

  const handleThemeCycle = () => {
    setSiteTheme((current) => {
      const currentIndex = SITE_THEMES.indexOf(current);
      return SITE_THEMES[(currentIndex + 1) % SITE_THEMES.length];
    });
    setThemePulseKey((key) => key + 1);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className={`theme-surface min-h-screen bg-white text-[var(--theme-hot)] flex flex-col justify-between relative overflow-hidden select-none font-sans ${THEME_CLASS[siteTheme]}`}
    >
      {!loading && (
        <TopRightAsciiArt
          siteTheme={siteTheme}
          onCycleTheme={handleThemeCycle}
          isObscured={showCompositions}
          playIntro
        />
      )}
      <AnimatePresence>
        {themePulseKey > 0 && (
          <motion.div
            key={themePulseKey}
            initial={{ scaleY: 0, opacity: 0.95 }}
            animate={{ scaleY: 1, opacity: [0.95, 0.42, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
            className="theme-shift-wash fixed inset-0 z-[70] pointer-events-none"
          />
        )}
      </AnimatePresence>

      <div
        className={`absolute inset-0 transition-[filter,transform] duration-500 ${
          showCompositions ? "blur-sm scale-[0.99]" : "blur-0 scale-100"
        }`}
      >
        {/* Background Micro Guidelines (No numbers, purely pink structures) */}
        <PixelGrid />

        {/* Floating Petal Rain simulator */}
        {!showCompositions && <PetalRain />}

        {/* Ambient Pulsing Light Leaks (reactive to the graphics on the left edge) */}
        {!showCompositions && (
          <div className="absolute inset-y-0 left-0 w-1/2 pointer-events-none select-none z-0 overflow-hidden">
            {/* Soft infinite radial hot pink bloom */}
            <motion.div
              animate={{
                scale: [1, 1.15, 0.95, 1.05, 1],
                opacity: [0.35, 0.5, 0.3, 0.45, 0.35],
              }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-[-200px] top-[10%] w-[584px] h-[584px] rounded-full glow-leak pointer-events-none"
            />
            <motion.div
              animate={{
                scale: [1, 0.9, 1.1, 1],
                opacity: [0.25, 0.4, 0.2, 0.25],
              }}
              transition={{
                duration: 16,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2,
              }}
              className="absolute left-[-150px] bottom-[15%] w-[480px] h-[480px] rounded-full glow-leak pointer-events-none"
            />

            {/* Dynamic Light leaks responding gently to cursor */}
            <motion.div
              className="absolute w-[450px] h-[450px] rounded-full glow-leak-bright pointer-events-none transition-all duration-1000 ease-out"
              style={{
                x: lightLeakX,
                y: lightLeakY,
                opacity: 0.4,
              }}
            />
          </div>
        )}
      </div>

      {/* Interactive Cinematic Light Rays triggered on Burst */}
      <AnimatePresence>
        {burstActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.65, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6, ease: "easeInOut" }}
            className="absolute inset-0 pointer-events-none z-10 flex justify-around items-stretch overflow-hidden"
          >
            {/* Array of vertical light flaring lines sweeping left to right */}
            {[...Array(6)].map((_, idx) => (
              <motion.div
                key={idx}
                initial={{ x: -200, opacity: 0 }}
                animate={{ x: window.innerWidth + 200, opacity: [0, 0.8, 0] }}
                transition={{
                  duration: 1.2,
                  delay: idx * 0.12,
                  ease: "easeOut",
                }}
                className="w-[1.5px] bg-gradient-to-b from-transparent via-[var(--theme-hot)] to-transparent h-full"
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================================================== */}
      {/* 1. RETRO-VINTAGE LOADER */}
      {/* ============================================================================== */}
      <AnimatePresence>
        {loading && (
          <motion.div
            key="preloader"
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 bg-white z-50 flex flex-col items-center justify-center p-6"
          >
            <div className="w-[min(94vw,580px)] text-center space-y-5">
              <pre
                className="loader-ascii-glow mx-auto max-w-full whitespace-pre text-center [font-family:var(--font-ascii)] text-[3px] leading-[0.82] sm:text-[3.8px] md:text-[4.5px]"
                style={{ color: LOADER_GREEN }}
              >
                {loaderTitleAscii}
              </pre>
              <div className="loader-bar-track">
                <div className="loader-bar-rail">
                  <motion.div
                    className="loader-bar-fill"
                    style={{ width: loadBarWidth }}
                  />
                </div>
              </div>
              <div
                className="flex justify-between font-mono text-[10px] tracking-widest uppercase tabular-nums"
                style={{ color: `rgba(${LOADER_NAVY_RGB}, 0.8)` }}
              >
                <span>loading...</span>
                <span>{displayPercent}%</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================================================== */}
      {/* HEADER BAR (Simple, beautiful, hot pink on white options) */}
      {/* ============================================================================== */}
      <header className="w-full max-w-7xl mx-auto px-8 py-6 flex justify-between items-center z-40 relative">
        <div className="flex items-center space-x-3 pointer-events-auto">
          <motion.div
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.8 }}
            className="w-4 h-4 flex items-center justify-center rounded-full border border-[var(--theme-hot)]/40"
          >
            <span className="w-1.5 h-1.5 bg-[var(--theme-hot)] rounded-full animate-ping" />
          </motion.div>
        </div>

        <div />
      </header>

      {/* ============================================================================== */}
      {/* MAIN VIEWPORT FRAME */}
      {/* ============================================================================== */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-5 lg:px-8 grid grid-cols-1 lg:grid-cols-12 items-center relative gap-4 lg:gap-8 z-30 py-2 lg:py-4">
        {/* LEFT COLUMN: ENLARGED GRAPHIC AND HALFWAY OFF-SCREEN POSITION */}
        <div className="order-2 lg:order-1 lg:col-span-7 flex items-center justify-center lg:justify-start h-[200px] sm:h-[260px] md:h-[300px] lg:h-[620px] relative pointer-events-none select-none opacity-70 lg:opacity-100 -mt-2 sm:mt-0 lg:mt-0">
          <div className="absolute left-1/2 lg:left-[-420px] -translate-x-1/2 lg:translate-x-0 w-[360px] h-[360px] sm:w-[420px] sm:h-[420px] md:w-[480px] md:h-[480px] lg:w-[840px] lg:h-[840px] flex items-center justify-center">
            {/* The halo itself is magnified for a majestic cinematic appearance */}
            <FloralHalo
              className="w-full h-full scale-[0.88] sm:scale-[0.95] md:scale-[1.05] lg:scale-[1.6]"
              isPaused={showCompositions}
              playIntro={!loading}
            />
          </div>
        </div>

        {/* RIGHT COLUMN: REFINED PURE WHITE INTERFACE */}
        <div className="order-1 lg:order-2 lg:col-span-5 flex flex-col items-center lg:items-start justify-center space-y-6 md:space-y-7 lg:space-y-8 text-center lg:text-left lg:pl-8 pointer-events-auto pt-2 lg:pt-0 mx-auto lg:mx-0 w-full max-w-md lg:max-w-none">
          {/* Elite Title Heading & Underlined structures */}
          <BlindReveal playIntro={!loading} className="space-y-3">
            <h1 className="font-serif italic text-4xl sm:text-5xl md:text-5xl lg:text-6xl text-[var(--theme-hot)] tracking-wide leading-none select-none">
              ulys drumrongthai
            </h1>
            <div className="w-24 h-[1px] bg-[var(--theme-hot)]/40 mx-auto lg:mx-0" />
          </BlindReveal>

          {/* Bio statement description */}
          <div className="space-y-4 max-w-sm mx-auto lg:mx-0">
            <p className="font-sans text-xs text-[var(--theme-hot)]/80 uppercase tracking-widest leading-relaxed">
              (yoo-lis)
            </p>
            <p className="font-serif text-lg text-[var(--theme-hot)] font-light leading-relaxed">
              data science & c.i.t. undergrad
            </p>
          </div>

          {/* Interactive Composition Introductions Launcher */}
          <div className="w-full max-w-sm mx-auto lg:mx-0 pt-1 lg:pt-2 space-y-5 relative">
            <div className="flex items-center justify-center gap-5">
              {SOCIAL_LINKS.map((link) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ y: -3, scale: 1.08 }}
                  whileTap={{ scale: 0.94 }}
                  className="social-link w-10 h-10 lg:w-8 lg:h-8 flex items-center justify-center opacity-90 hover:opacity-100 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-hot)]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded"
                  aria-label={link.label}
                >
                  <img
                    src={link.icon}
                    alt=""
                    className="social-icon w-full h-full object-contain"
                    draggable={false}
                  />
                </motion.a>
              ))}
            </div>
            <div className="relative">
              <motion.button
                onClick={handleIntroduceClick}
                whileHover={{
                  y: -3,
                  boxShadow:
                    "0 16px 36px rgba(var(--theme-rgb), 0.26), inset 0 1px 0 rgba(255, 255, 255, 0.8)",
                }}
                whileTap={{
                  scale: 0.98,
                  y: 1,
                }}
                transition={{
                  type: "spring",
                  stiffness: 220,
                  damping: 24,
                  mass: 0.6,
                }}
                className="liquid-glass-enter pixel-bevel-border relative z-10 w-full py-4 rounded-none text-xs font-pixel tracking-widest text-[var(--theme-hot)] flex items-center justify-center space-x-2 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-hot)]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                <span>[ ENTER ]</span>
              </motion.button>
            </div>
          </div>
        </div>
      </main>

      {/* ============================================================================== */}
      {/* FLOATING COMPOSITION GRID OVERLAY */}
      {/* ============================================================================== */}
      <AnimatePresence>
        {showCompositions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white/20 backdrop-blur-md z-50 flex items-center justify-center p-3 md:p-6 overflow-y-auto"
          >
            <div className="max-w-6xl lg:max-w-7xl w-full max-h-[calc(100dvh-1.5rem)] md:max-h-[min(92dvh,920px)] overflow-hidden flex flex-col space-y-3 md:space-y-6 relative border border-white/45 p-3 sm:p-4 md:p-8 lg:p-10 rounded bg-white/55 shadow-[0_24px_80px_rgba(var(--theme-rgb),0.22)] backdrop-blur-2xl ring-1 ring-[var(--theme-hot)]/20 pointer-events-auto">
              {/* Header inside overlay */}
              <div className="flex justify-between items-start gap-4 border-b border-[var(--theme-hot)]/20 pb-2.5 md:pb-4 shrink-0">
                <div className="min-w-0">
                  <h2 className="font-pixel text-xl sm:text-2xl md:text-3xl lg:text-4xl text-[var(--theme-hot)] leading-none">
                    About Me
                  </h2>
                </div>
                <button
                  onClick={() => {
                    setShowCompositions(false);
                    setActiveComposition(null);
                    setShowArticle(false);
                    setShowExtendedArticle(false);
                    setShowFishTimelineExtended(false);
                  }}
                  className="shrink-0 p-1 border border-[var(--theme-hot)]/30 rounded-full hover:bg-[var(--theme-light)] text-[var(--theme-hot)] transition-all cursor-pointer focus:outline-none"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Composition Selection body split-view */}
              <div className="flex flex-col md:grid md:grid-cols-12 gap-3 md:gap-8 lg:gap-10 min-h-0 flex-1 overflow-hidden items-stretch md:min-h-[480px] lg:min-h-[540px]">
                {/* List items: Left */}
                <div
                  ref={projectScrollRef}
                  className={`about-project-scroll md:col-span-5 flex flex-col space-y-2 md:space-y-3 justify-start overflow-y-auto scrollbar-hidden shrink-0 md:shrink md:max-h-[480px] lg:max-h-[540px] pr-0 md:pr-2 ${
                    activeComposition
                      ? "max-h-[22dvh] sm:max-h-[26dvh]"
                      : "max-h-[34dvh] sm:max-h-[38dvh] md:max-h-[480px]"
                  }${projectScrollClip.top ? " about-project-scroll--clip-top" : ""}${
                    projectScrollClip.bottom
                      ? " about-project-scroll--clip-bottom"
                      : ""
                  }`}
                >
                  {CURATED_PROJECTS.map((project) => (
                    <button
                      key={project.id}
                      data-project-item
                      onClick={() => {
                        setActiveComposition(project);
                        setShowArticle(false);
                        setShowExtendedArticle(false);
                        setShowFishTimelineExtended(false);
                      }}
                      className={`text-left p-2.5 sm:p-3 md:p-4 rounded border transition-all duration-300 focus:outline-none cursor-pointer ${activeComposition?.id === project.id ? "bg-[var(--theme-hot)]/85 text-white border-white/40 shadow backdrop-blur-md" : "bg-white/35 text-[var(--theme-hot)] border-[var(--theme-hot)]/20 hover:border-[var(--theme-hot)]/50 hover:bg-white/55 backdrop-blur-md"}`}
                    >
                      <div className="flex justify-between items-baseline font-mono text-[9px] md:text-[10px] opacity-85 mb-0.5 md:mb-1">
                        <span>{project.navLabel}</span>
                        <span>[{project.num}]</span>
                      </div>
                      <h3 className="font-pixel text-base sm:text-lg md:text-xl font-bold tracking-wide">
                        {project.title}
                      </h3>
                      <p className="font-pixel text-[11px] md:text-xs opacity-90 line-clamp-1 mt-0.5 md:mt-1">
                        {project.subtitle}
                      </p>
                    </button>
                  ))}
                </div>

                {/* Details view: Right */}
                <div
                  className={`relative md:col-span-7 border border-dashed border-[var(--theme-hot)]/30 p-3 sm:p-4 md:p-6 lg:p-8 rounded bg-white/25 backdrop-blur-md flex flex-col overflow-hidden ${
                    activeComposition
                      ? "min-h-0 flex-1"
                      : "h-[150px] max-h-[28dvh] shrink-0 md:h-auto md:max-h-none md:min-h-0 md:flex-1"
                  }`}
                >
                  {activeComposition ? (
                    activeComposition.id === "blush-chronicles" ? (
                      <div className="flex h-full min-h-0 flex-col space-y-3 md:space-y-4 overflow-hidden">
                        <h3 className="shrink-0 font-pixel text-xl sm:text-2xl md:text-3xl font-bold text-[var(--theme-hot)]">
                          {activeComposition.title}
                        </h3>
                        <div className="min-h-0 flex-1 overflow-hidden">
                          <FishTimeline
                            onExtend={() => setShowFishTimelineExtended(true)}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="min-h-0 flex-1 overflow-y-auto scrollbar-hidden space-y-4 pr-1">
                        <div>
                          <h3 className="font-pixel text-xl sm:text-2xl md:text-3xl font-bold text-[var(--theme-hot)]">
                            {activeComposition.title}
                          </h3>
                          {activeComposition.detailSubtitle && (
                            <p className="font-mono text-[11px] md:text-xs text-[var(--theme-hot)]/85 mt-1.5 leading-relaxed">
                              {activeComposition.detailSubtitle}
                              {activeComposition.articleUrl &&
                                activeComposition.detailUrlLabel && (
                                  <>
                                    {" ⇢ "}
                                    <button
                                      type="button"
                                      onClick={() => setShowArticle(true)}
                                      className="underline underline-offset-2 hover:opacity-70 focus:outline-none cursor-pointer"
                                    >
                                      [{activeComposition.detailUrlLabel}]
                                    </button>
                                  </>
                                )}
                              {!activeComposition.articleUrl &&
                                activeComposition.detailUrl &&
                                activeComposition.detailUrlLabel && (
                                  <>
                                    {" ⇢ "}
                                    <a
                                      href={activeComposition.detailUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="underline underline-offset-2 hover:opacity-70"
                                    >
                                      [{activeComposition.detailUrlLabel}]
                                    </a>
                                  </>
                                )}
                            </p>
                          )}
                        </div>

                        <div className="w-full h-[1px] bg-[var(--theme-hot)]/10" />

                        <p className="font-pixel text-sm sm:text-base leading-relaxed text-[var(--theme-hot)] whitespace-pre-line">
                          "{activeComposition.description}"
                        </p>

                        {activeComposition.extraDetails.length > 0 && (
                          <div className="space-y-1.5 pt-2">
                            <div className="text-[9px] md:text-[10px] font-mono uppercase tracking-widest text-[var(--theme-hot)] font-bold">
                              {activeComposition.featuresLabel ??
                                "KINETIC ATTRIBUTES:"}
                            </div>
                            {activeComposition.extraDetails.map(
                              (detail, dIdx) => (
                                <div
                                  key={dIdx}
                                  className="text-sm font-pixel flex items-start"
                                >
                                  <span className="text-[var(--theme-hot)] mr-1.5 opacity-80">
                                    ▪
                                  </span>
                                  <span>{detail}</span>
                                </div>
                              ),
                            )}
                          </div>
                        )}

                        {activeComposition.techStack &&
                          activeComposition.techStack.length > 0 && (
                            <div className="space-y-1.5 pt-2 pb-2">
                              <div className="text-[9px] md:text-[10px] font-mono uppercase tracking-widest text-[var(--theme-hot)] font-bold">
                                {activeComposition.techStackLabel ??
                                  "TECH STACK:"}
                              </div>
                              {activeComposition.techStack.map(
                                (detail, dIdx) => (
                                  <div
                                    key={dIdx}
                                    className="text-sm font-pixel flex items-start"
                                  >
                                    <span className="text-[var(--theme-hot)] mr-1.5 opacity-80">
                                      ▪
                                    </span>
                                    <span>{detail}</span>
                                  </div>
                                ),
                              )}
                            </div>
                          )}
                      </div>
                    )
                  ) : (
                    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden text-center">
                      <pre
                        aria-hidden="true"
                        className="pointer-events-none absolute left-1/2 top-[42%] z-0 max-h-[70%] max-w-[78%] -translate-x-1/2 -translate-y-1/2 overflow-hidden whitespace-pre text-center font-mono text-[2.6px] leading-[0.82] text-[var(--theme-hot)]/28 drop-shadow-[0_0_10px_rgba(var(--theme-rgb),0.1)] sm:text-[3.4px] md:top-1/2 md:max-h-[58%] md:max-w-[72%] md:text-[6px] md:text-[var(--theme-hot)]/32"
                      >
                        {selectCenterBorderAscii}
                      </pre>
                      <div className="relative z-10 flex h-6 w-6 items-center justify-center rounded-full border border-dashed border-[var(--theme-hot)]/40 animate-spin duration-3000 md:absolute md:left-1/2 md:top-1/2 md:h-8 md:w-8 md:-translate-x-1/2 md:-translate-y-1/2">
                        <span className="w-1.5 h-1.5 bg-[var(--theme-hot)] rounded-full" />
                      </div>
                      <p className="relative z-10 mt-2.5 font-mono text-[10px] uppercase tracking-widest text-[var(--theme-hot)]/65 md:absolute md:bottom-[10%] md:left-1/2 md:mt-0 md:-translate-x-1/2 md:text-xs md:text-[var(--theme-hot)]/60">
                        select something
                      </p>
                      <pre
                        aria-hidden="true"
                        className="pointer-events-none absolute -bottom-[1px] right-2 z-0 max-h-[38%] max-w-[34%] overflow-hidden whitespace-pre text-right [font-family:var(--font-ascii)] text-[1px] leading-[0.78] text-[var(--theme-hot)]/22 drop-shadow-[0_0_8px_rgba(var(--theme-rgb),0.08)] sm:right-3 sm:text-[1.2px] md:right-8 md:max-h-[42%] md:max-w-[42%] md:text-[1.95px] md:text-[var(--theme-hot)]/28"
                      >
                        {selectWindowAscii.trimEnd()}
                      </pre>
                      <pre
                        aria-hidden="true"
                        className="pointer-events-none absolute -bottom-[1px] left-2 z-0 max-h-[38%] max-w-[34%] overflow-hidden whitespace-pre text-left [font-family:var(--font-ascii)] text-[1.4px] leading-[0.78] text-[var(--theme-hot)]/22 drop-shadow-[0_0_8px_rgba(var(--theme-rgb),0.08)] sm:left-3 sm:text-[1.7px] md:left-8 md:max-h-[42%] md:max-w-[42%] md:text-[2.925px] md:text-[var(--theme-hot)]/28"
                      >
                        {selectLeftAscii.trimEnd()}
                      </pre>
                    </div>
                  )}

                  {showArticle && activeComposition?.articleUrl && (
                    <div className="absolute inset-2 md:inset-3 z-30 flex flex-col overflow-hidden rounded border border-[var(--theme-hot)]/30 bg-white/95 shadow-[0_18px_60px_rgba(var(--theme-rgb),0.22)] backdrop-blur-xl">
                      <div className="pointer-events-none absolute right-2 top-2 z-40 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setShowExtendedArticle(true)}
                          className="pointer-events-auto shrink-0 p-1 border border-[var(--theme-hot)]/30 rounded bg-white/90 hover:bg-[var(--theme-light)] text-[var(--theme-hot)] transition-all cursor-pointer focus:outline-none shadow-[0_8px_20px_rgba(var(--theme-rgb),0.12)]"
                          aria-label="Extend article view"
                        >
                          <Maximize2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowArticle(false);
                            setShowExtendedArticle(false);
                          }}
                          className="pointer-events-auto shrink-0 p-1 border border-[var(--theme-hot)]/30 rounded-full bg-white/90 hover:bg-[var(--theme-light)] text-[var(--theme-hot)] transition-all cursor-pointer focus:outline-none shadow-[0_8px_20px_rgba(var(--theme-rgb),0.12)]"
                          aria-label="Close article"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <iframe
                        src={getPdfViewerUrl(activeComposition.articleUrl)}
                        title={`${activeComposition.title} article`}
                        className="min-h-0 flex-1 w-full bg-white"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <AnimatePresence>
              {showExtendedArticle && activeComposition?.articleUrl && (
                <motion.div
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "spring", stiffness: 180, damping: 28 }}
                  data-testid="extended-article-view"
                  className="liquid-glass-panel fixed inset-y-0 right-0 z-[80] w-full md:w-1/2 flex flex-col"
                >
                  <div className="pointer-events-none absolute right-3 top-3 z-40">
                    <button
                      type="button"
                      onClick={() => {
                        setShowArticle(false);
                        setShowExtendedArticle(false);
                      }}
                      className="pointer-events-auto shrink-0 p-1.5 border border-[var(--theme-hot)]/30 rounded-full bg-white/90 hover:bg-[var(--theme-light)] text-[var(--theme-hot)] transition-all cursor-pointer focus:outline-none shadow-[0_8px_20px_rgba(var(--theme-rgb),0.12)]"
                      aria-label="Close article"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <iframe
                    src={getPdfViewerUrl(activeComposition.articleUrl)}
                    title={`${activeComposition.title} extended article`}
                    className="relative z-10 min-h-0 flex-1 w-full bg-white/90"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {showFishTimelineExtended &&
                activeComposition?.id === "blush-chronicles" && (
                  <motion.div
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ type: "spring", stiffness: 180, damping: 28 }}
                    data-testid="extended-fish-timeline-view"
                    className="liquid-glass-panel fixed inset-y-0 right-0 z-[80] w-full md:w-1/2 flex flex-col"
                  >
                    <div className="pointer-events-none absolute right-3 top-3 z-40">
                      <button
                        type="button"
                        onClick={() => setShowFishTimelineExtended(false)}
                        className="pointer-events-auto shrink-0 p-1.5 border border-[var(--theme-hot)]/30 rounded-full bg-white/90 hover:bg-[var(--theme-light)] text-[var(--theme-hot)] transition-all cursor-pointer focus:outline-none shadow-[0_8px_20px_rgba(var(--theme-rgb),0.12)]"
                        aria-label="Close fish timeline"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="liquid-glass-body relative z-10 min-h-0 flex-1 p-3 md:p-4 pt-12">
                      <FishTimeline variant="extended" />
                    </div>
                  </motion.div>
                )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
