import bottomRightAscii from "../assets/bottom-right-ascii.txt?raw";

interface BottomRightAsciiArtProps {
  isGreenTheme: boolean;
  onToggleTheme: () => void;
}

export default function BottomRightAsciiArt({
  isGreenTheme,
  onToggleTheme,
}: BottomRightAsciiArtProps) {
  return (
    <button
      type="button"
      onClick={(event) => {
        if (event.detail === 0) {
          onToggleTheme();
        }
      }}
      onPointerDown={(event) => {
        event.preventDefault();
        onToggleTheme();
      }}
      aria-label={
        isGreenTheme
          ? "Switch site theme back to pink"
          : "Switch site theme to green"
      }
      className="fixed left-0 top-0 z-[60] flex h-28 w-full cursor-pointer touch-manipulation select-none justify-center border-0 bg-transparent p-0 text-[var(--theme-hot)] opacity-55 transition-[filter,opacity] duration-300 hover:opacity-80 hover:drop-shadow-[0_0_18px_rgba(var(--theme-rgb),0.48)] focus:outline-none focus-visible:opacity-90 focus-visible:drop-shadow-[0_0_18px_rgba(var(--theme-rgb),0.52)] md:absolute md:left-1/2 md:top-[calc(100%-0.22rem)] md:z-[5] md:h-auto md:w-auto md:-translate-x-1/2"
    >
      <pre className="pointer-events-none [font-family:var(--font-ascii)] leading-[0.8] text-[1.7px] sm:text-[2.2px] md:text-[2.85px] lg:text-[3.08px] xl:text-[3.85px] whitespace-pre text-center drop-shadow-[0_0_14px_rgba(var(--theme-rgb),0.14)]">
        {bottomRightAscii}
      </pre>
    </button>
  );
}
