import { motion } from "motion/react";
import type { ReactNode } from "react";
import topRightAscii from "../assets/top-right-ascii.txt?raw";

type SiteTheme = "pink" | "green" | "navy" | "black";

interface TopRightAsciiArtProps {
  siteTheme: SiteTheme;
  onCycleTheme: () => void;
  /** When true, sit under the about/compositions overlay and block theme cycling. */
  isObscured?: boolean;
  playIntro?: boolean;
}

const NEXT_THEME_LABEL: Record<SiteTheme, string> = {
  pink: "Switch site theme to green",
  green: "Switch site theme to navy blue",
  navy: "Switch site theme to black",
  black: "Switch site theme back to pink",
};

const ASCII_PRE_CLASS =
  "pointer-events-none m-0 p-0 font-mono leading-[0.8] text-[6.8px] sm:text-[7.5px] md:text-[8.5px] lg:text-[9px] xl:text-[11px] whitespace-pre text-right";

function BlindReveal({
  playIntro,
  className,
  children,
}: {
  playIntro: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`relative ${className ?? ""}`}>
      {children}
      {playIntro && (
        <div className="pointer-events-none absolute inset-0 z-30 flex flex-col justify-stretch overflow-hidden">
          {[...Array(18)].map((_, idx) => (
            <motion.div
              key={idx}
              initial={{ scaleY: 1, opacity: 1 }}
              animate={{ scaleY: 0, opacity: 0 }}
              transition={{
                duration: 0.45,
                delay: idx * 0.02 + 0.05,
                ease: "easeInOut",
              }}
              style={{ originY: 0 }}
              className="w-full flex-1 border-b border-[var(--theme-hot)]/10 bg-white"
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function TopRightAsciiArt({
  siteTheme,
  onCycleTheme,
  isObscured = false,
  playIntro = true,
}: TopRightAsciiArtProps) {
  return (
    <div
      className={`fixed -right-12 -top-12 overflow-visible p-12 ${
        isObscured ? "z-40" : "z-[60]"
      }`}
    >
      <BlindReveal playIntro={playIntro}>
        <button
          type="button"
          disabled={isObscured}
          tabIndex={isObscured ? -1 : 0}
          onClick={(event) => {
            if (isObscured) return;
            if (event.detail === 0) {
              onCycleTheme();
            }
          }}
          onPointerDown={(event) => {
            if (isObscured) return;
            event.preventDefault();
            onCycleTheme();
          }}
          aria-hidden={isObscured}
          aria-label={isObscured ? undefined : NEXT_THEME_LABEL[siteTheme]}
          className={`flex touch-manipulation select-none items-start justify-end border-0 bg-transparent p-0 m-0 text-[var(--theme-hot)] opacity-55 transition-opacity duration-300 focus:outline-none ${
            isObscured
              ? "pointer-events-none"
              : "hover:opacity-85 focus-visible:opacity-90"
          }`}
        >
          <span className="relative grid">
            {/* Glow only — soft-masked so the drop-shadow crossfades out */}
            <pre
              aria-hidden="true"
              className={`top-right-ascii-glow top-right-ascii-glow-fade col-start-1 row-start-1 ${ASCII_PRE_CLASS}`}
            >
              {topRightAscii}
            </pre>
            {/* Crisp glyphs on top — unmasked, no filter */}
            <pre
              className={`relative z-10 col-start-1 row-start-1 ${ASCII_PRE_CLASS}`}
            >
              {topRightAscii}
            </pre>
          </span>
        </button>
      </BlindReveal>
    </div>
  );
}

export { BlindReveal };
