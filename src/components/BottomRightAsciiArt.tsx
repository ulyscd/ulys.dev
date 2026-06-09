import bottomRightAscii from "../assets/bottom-right-ascii.txt?raw";

export default function BottomRightAsciiArt() {
  return (
    <pre
      aria-hidden="true"
      className="absolute top-[calc(100%-0.22rem)] left-1/2 -translate-x-1/2 z-0 pointer-events-none select-none font-mono text-[#FF007F] opacity-55 leading-[0.8] text-[1.7px] sm:text-[2.2px] md:text-[2.85px] lg:text-[3.08px] xl:text-[3.85px] whitespace-pre text-center drop-shadow-[0_0_14px_rgba(255,0,127,0.14)]"
    >
      {bottomRightAscii}
    </pre>
  );
}
