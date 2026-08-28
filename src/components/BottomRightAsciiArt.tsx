import bottomRightAscii from "../assets/bottom-right-ascii.txt?raw";

type SiteTheme = "pink" | "green" | "navy" | "black";

interface BottomRightAsciiArtProps {
  siteTheme: SiteTheme;
  onCycleTheme: () => void;
}

const NEXT_THEME_LABEL: Record<SiteTheme, string> = {
  pink: "Switch site theme to green",
  green: "Switch site theme to navy blue",
  navy: "Switch site theme to black",
  black: "Switch site theme back to pink",
};

export default function BottomRightAsciiArt({
  siteTheme,
  onCycleTheme,
}: BottomRightAsciiArtProps) {
  return (
    <button
      type="button"
      onClick={(event) => {
        if (event.detail === 0) {
          onCycleTheme();
        }
      }}
      onPointerDown={(event) => {
        event.preventDefault();
        onCycleTheme();
      }}
      aria-label={NEXT_THEME_LABEL[siteTheme]}
      className="fixed left-0 top-0 z-[60] flex h-28 w-full touch-manipulation select-none justify-center border-0 bg-transparent p-0 text-[var(--theme-hot)] opacity-55 transition-opacity duration-300 hover:opacity-85 focus:outline-none focus-visible:opacity-90 md:absolute md:left-1/2 md:top-[calc(100%-0.22rem)] md:z-[5] md:h-auto md:w-auto md:-translate-x-1/2"
    >
      <pre className="theme-ascii-glow pointer-events-none font-mono leading-[0.8] text-[1.7px] sm:text-[2.2px] md:text-[2.85px] lg:text-[3.08px] xl:text-[3.85px] whitespace-pre text-center">
        {bottomRightAscii}
      </pre>
    </button>
  );
}
