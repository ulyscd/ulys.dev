/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue } from "motion/react";
import { Maximize2, X } from "lucide-react";
import { CURATED_PROJECTS, ProjectCurated } from "./data/projects";
import FloralHalo from "./components/FloralHalo";
import PetalRain from "./components/PetalRain";
import PixelGrid from "./components/PixelGrid";
import BottomRightAsciiArt from "./components/BottomRightAsciiArt";
import FishTimeline from "./components/FishTimeline";
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

export default function App() {
  // Global States
  const [loading, setLoading] = useState(true);
  const [loadPercentage, setLoadPercentage] = useState(0);
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

  // Active light bloom rays triggers
  const [burstActive, setBurstActive] = useState(false);
  const [isGreenTheme, setIsGreenTheme] = useState(false);
  const [themePulseKey, setThemePulseKey] = useState(0);

  // Simulated vintage loading cycle, styled purely in vibrant pink on white
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadPercentage((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setLoading(false);
          }, 350);
          return 100;
        }
        return prev + (Math.floor(Math.random() * 15) + 5);
      });
    }, 80);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
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

  const handleIntroduceClick = () => {
    setShowCompositions(true);
    setBurstActive(true);

    // Deactivate light ray burst after simulation completes
    setTimeout(() => {
      setBurstActive(false);
    }, 1800);
  };

  const handleThemeToggle = () => {
    setIsGreenTheme((current) => !current);
    setThemePulseKey((key) => key + 1);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className={`theme-surface min-h-screen bg-white text-[var(--theme-hot)] flex flex-col justify-between relative overflow-hidden select-none font-sans ${
        isGreenTheme ? "theme-green" : ""
      }`}
    >
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
        <PetalRain />

        {/* Ambient Pulsing Light Leaks (reactive to the graphics on the left edge) */}
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
      {/* 1. RETRO-VINTAGE PINK-ON-WHITE LOADER */}
      {/* ============================================================================== */}
      <AnimatePresence>
        {loading && (
          <motion.div
            key="preloader"
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 bg-white z-50 flex flex-col items-center justify-center p-6"
          >
            <div className="w-[280px] text-center space-y-5">
              <p className="font-serif italic text-3xl text-[var(--theme-hot)] tracking-wide">
                ulys.dev
              </p>
              <div className="w-full h-[1px] bg-[var(--theme-hot)]/20 relative">
                <motion.div
                  className="absolute left-0 top-0 h-full bg-[var(--theme-hot)]"
                  style={{ width: `${loadPercentage}%` }}
                />
              </div>
              <div className="flex justify-between font-mono text-[8px] text-[var(--theme-hot)]/80 tracking-widest uppercase">
                <span>BUFFERING SPEC_</span>
                <span>{loadPercentage}%</span>
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
      <main className="flex-1 w-full max-w-7xl mx-auto px-5 md:px-8 grid grid-cols-1 md:grid-cols-12 items-center relative gap-4 md:gap-8 z-30 py-2 md:py-4">
        {/* LEFT COLUMN: ENLARGED GRAPHIC AND HALFWAY OFF-SCREEN POSITION */}
        <div className="order-2 md:order-1 md:col-span-7 flex items-center justify-center md:justify-start h-[170px] md:h-[620px] relative pointer-events-none select-none opacity-70 md:opacity-100 -mt-4 md:mt-0">
          <div className="absolute left-1/2 md:left-[-420px] -translate-x-1/2 md:translate-x-0 w-[360px] h-[360px] md:w-[840px] md:h-[840px] flex items-center justify-center">
            {/* The halo itself is magnified for a majestic cinematic appearance */}
            <FloralHalo
              className="w-full h-full scale-[0.88] md:scale-[1.6]"
              isPaused={showCompositions}
              playIntro={!loading}
            />
          </div>
        </div>

        {/* RIGHT COLUMN: REFINED PURE WHITE INTERFACE */}
        <div className="order-1 md:order-2 md:col-span-5 flex flex-col items-center md:items-start justify-center space-y-6 md:space-y-8 text-center md:text-left md:pl-8 pointer-events-auto pt-2 md:pt-0">
          {/* Elite Title Heading & Underlined structures */}
          <div className="space-y-3">
            <h1 className="font-serif italic text-4xl sm:text-5xl md:text-6xl text-[var(--theme-hot)] tracking-wide leading-none select-none">
              ulys drumrongthai
            </h1>
            <div className="w-24 h-[1px] bg-[var(--theme-hot)]/40 mx-auto md:mx-0" />
          </div>

          {/* Bio statement description */}
          <div className="space-y-4 max-w-sm">
            <p className="font-sans text-xs text-[var(--theme-hot)]/80 uppercase tracking-widest leading-relaxed">
              (yoo-lis)
            </p>
            <p className="font-serif text-lg text-[var(--theme-hot)] font-light leading-relaxed">
              data science & c.i.t. undergrad
            </p>
          </div>

          {/* Interactive Composition Introductions Launcher */}
          <div className="w-full max-w-sm pt-1 md:pt-2 space-y-5 relative">
            <div className="flex items-center justify-center gap-5">
              {SOCIAL_LINKS.map((link) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  whileHover={{ y: -3, scale: 1.08 }}
                  whileTap={{ scale: 0.94 }}
                  className="w-10 h-10 md:w-8 md:h-8 flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-hot)]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-white rounded"
                  aria-label={link.label}
                >
                  <img
                    src={link.icon}
                    alt=""
                    className="w-full h-full object-contain transition-[filter] duration-500 [filter:var(--theme-icon-filter)_drop-shadow(0_0_8px_rgba(var(--theme-rgb),0.55))]"
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
                  boxShadow: "0px 12px 24px rgba(var(--theme-rgb), 0.18)",
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
                className="relative z-10 w-full py-4 bg-white hover:bg-[var(--theme-light)]/40 border-2 border-[var(--theme-hot)] rounded text-xs font-mono tracking-widest text-[var(--theme-hot)] flex items-center justify-center space-x-2 transition-all cursor-pointer focus:outline-none"
              >
                <span>[ ENTER ]</span>
              </motion.button>
              <BottomRightAsciiArt
                isGreenTheme={isGreenTheme}
                onToggleTheme={handleThemeToggle}
              />
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
            <div className="max-w-4xl w-full max-h-[calc(100dvh-1.5rem)] md:max-h-none overflow-hidden flex flex-col space-y-4 md:space-y-6 relative border border-white/45 p-4 md:p-8 rounded bg-white/55 shadow-[0_24px_80px_rgba(var(--theme-rgb),0.22)] backdrop-blur-2xl ring-1 ring-[var(--theme-hot)]/20 pointer-events-auto">
              {/* Header inside overlay */}
              <div className="flex justify-between items-start gap-4 border-b border-[var(--theme-hot)]/20 pb-3 md:pb-4 shrink-0">
                <div className="min-w-0">
                  <h2 className="font-serif italic text-2xl md:text-3xl text-[var(--theme-hot)] leading-none">
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
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-stretch min-h-0 md:min-h-[340px] overflow-y-auto md:overflow-visible scrollbar-hidden pr-1 md:pr-0">
                {/* List items: Left */}
                <div className="md:col-span-5 flex flex-col space-y-3 justify-start overflow-y-auto scrollbar-hidden max-h-[34dvh] md:max-h-[360px] pr-0 md:pr-2">
                  {CURATED_PROJECTS.map((project) => (
                    <button
                      key={project.id}
                      onClick={() => {
                        setActiveComposition(project);
                        setShowArticle(false);
                        setShowExtendedArticle(false);
                        setShowFishTimelineExtended(false);
                      }}
                      className={`text-left p-3 md:p-4 rounded border transition-all duration-300 focus:outline-none cursor-pointer ${activeComposition?.id === project.id ? "bg-[var(--theme-hot)]/85 text-white border-white/40 shadow backdrop-blur-md" : "bg-white/35 text-[var(--theme-hot)] border-[var(--theme-hot)]/20 hover:border-[var(--theme-hot)]/50 hover:bg-white/55 backdrop-blur-md"}`}
                    >
                      <div className="flex justify-between items-baseline font-mono text-[8px] opacity-85 mb-1">
                        <span>{project.navLabel}</span>
                        <span>[{project.num}]</span>
                      </div>
                      <h3 className="font-serif text-base md:text-lg tracking-wide">
                        {project.title}
                      </h3>
                      <p className="text-[10px] font-sans opacity-90 line-clamp-1 mt-1 font-light">
                        {project.subtitle}
                      </p>
                    </button>
                  ))}
                </div>

                {/* Details view: Right */}
                <div className="relative md:col-span-7 border border-dashed border-[var(--theme-hot)]/30 p-4 md:p-6 rounded bg-white/25 backdrop-blur-md flex flex-col justify-between min-h-[230px] md:min-h-0 overflow-hidden">
                  {activeComposition ? (
                    activeComposition.id === "blush-chronicles" ? (
                      <div className="flex h-full min-h-0 flex-col space-y-4">
                        <h3 className="font-serif italic text-xl md:text-2xl text-[var(--theme-hot)]">
                          {activeComposition.title}
                        </h3>
                        <FishTimeline
                          onExtend={() => setShowFishTimelineExtended(true)}
                        />
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-serif italic text-xl md:text-2xl text-[var(--theme-hot)]">
                            {activeComposition.title}
                          </h3>
                          {activeComposition.detailSubtitle && (
                            <p className="font-mono text-[10px] text-[var(--theme-hot)]/85 mt-1.5 leading-relaxed">
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

                        <p className="font-serif text-sm leading-relaxed text-[var(--theme-hot)] font-light whitespace-pre-line">
                          "{activeComposition.description}"
                        </p>

                        {activeComposition.extraDetails.length > 0 && (
                          <div className="space-y-1.5 pt-2">
                            <div className="text-[8px] font-mono uppercase tracking-widest text-[var(--theme-hot)] font-bold">
                              {activeComposition.featuresLabel ??
                                "KINETIC ATTRIBUTES:"}
                            </div>
                            {activeComposition.extraDetails.map(
                              (detail, dIdx) => (
                                <div
                                  key={dIdx}
                                  className="text-xs font-sans font-light flex items-start"
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
                            <div className="space-y-1.5 pt-2">
                              <div className="text-[8px] font-mono uppercase tracking-widest text-[var(--theme-hot)] font-bold">
                                {activeComposition.techStackLabel ??
                                  "TECH STACK:"}
                              </div>
                              {activeComposition.techStack.map(
                                (detail, dIdx) => (
                                  <div
                                    key={dIdx}
                                    className="text-xs font-sans font-light flex items-start"
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
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                      <div className="w-8 h-8 rounded-full border border-dashed border-[var(--theme-hot)]/40 flex items-center justify-center animate-spin duration-3000 mb-3">
                        <span className="w-1.5 h-1.5 bg-[var(--theme-hot)] rounded-full" />
                      </div>
                      <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--theme-hot)]/60">
                        select something
                      </p>
                    </div>
                  )}

                  {showArticle && activeComposition?.articleUrl && (
                    <div className="absolute inset-2 md:inset-3 z-30 flex flex-col overflow-hidden rounded border border-[var(--theme-hot)]/30 bg-white/95 shadow-[0_18px_60px_rgba(var(--theme-rgb),0.22)] backdrop-blur-xl">
                      <div className="flex items-center justify-between border-b border-[var(--theme-hot)]/15 px-3 py-2">
                        <span className="font-mono text-[8px] uppercase tracking-widest text-[var(--theme-hot)]/75">
                          article_view
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setShowExtendedArticle(true)}
                            className="shrink-0 p-1 border border-[var(--theme-hot)]/30 rounded hover:bg-[var(--theme-light)] text-[var(--theme-hot)] transition-all cursor-pointer focus:outline-none"
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
                            className="shrink-0 p-1 border border-[var(--theme-hot)]/30 rounded-full hover:bg-[var(--theme-light)] text-[var(--theme-hot)] transition-all cursor-pointer focus:outline-none"
                            aria-label="Close article"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
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
                  className="fixed inset-y-0 right-0 z-[80] w-full md:w-1/2 border-l border-[var(--theme-hot)]/25 bg-white/95 shadow-[-24px_0_80px_rgba(var(--theme-rgb),0.24)] backdrop-blur-2xl flex flex-col"
                >
                  <div className="flex items-center justify-between border-b border-[var(--theme-hot)]/15 px-4 py-3">
                    <div>
                      <p className="font-mono text-[8px] uppercase tracking-widest text-[var(--theme-hot)]/70">
                        extended_article_view
                      </p>
                      <h3 className="font-serif italic text-lg text-[var(--theme-hot)] leading-tight">
                        {activeComposition.title}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setShowArticle(false);
                        setShowExtendedArticle(false);
                      }}
                      className="shrink-0 p-1.5 border border-[var(--theme-hot)]/30 rounded-full hover:bg-[var(--theme-light)] text-[var(--theme-hot)] transition-all cursor-pointer focus:outline-none"
                      aria-label="Close article"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <iframe
                    src={getPdfViewerUrl(activeComposition.articleUrl)}
                    title={`${activeComposition.title} extended article`}
                    className="min-h-0 flex-1 w-full bg-white"
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
                    className="fixed inset-y-0 right-0 z-[80] w-full md:w-1/2 border-l border-[var(--theme-hot)]/25 bg-white/95 shadow-[-24px_0_80px_rgba(var(--theme-rgb),0.24)] backdrop-blur-2xl flex flex-col"
                  >
                    <div className="flex items-center justify-between border-b border-[var(--theme-hot)]/15 px-4 py-3">
                      <div>
                        <p className="font-mono text-[8px] uppercase tracking-widest text-[var(--theme-hot)]/70">
                          extended_fish_timeline
                        </p>
                        <h3 className="font-serif italic text-lg text-[var(--theme-hot)] leading-tight">
                          fish pics
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowFishTimelineExtended(false)}
                        className="shrink-0 p-1.5 border border-[var(--theme-hot)]/30 rounded-full hover:bg-[var(--theme-light)] text-[var(--theme-hot)] transition-all cursor-pointer focus:outline-none"
                        aria-label="Close fish timeline"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="min-h-0 flex-1 p-3 md:p-4">
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
