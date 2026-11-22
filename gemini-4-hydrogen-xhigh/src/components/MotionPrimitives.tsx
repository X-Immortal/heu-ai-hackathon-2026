import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";

const CIPHER_CHARS = "01//_#*+=<>ABCDEFGHIJKLMNOPQRSTUVWXYZ";

interface CipherTextProps {
  text: string;
  className?: string;
  delayMs?: number;
}

/** Monospace character-scramble reveal triggered once when entering the viewport. */
export function CipherText({ text, className = "", delayMs = 0 }: CipherTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [output, setOutput] = useState(text);

  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setOutput(text);
      return;
    }

    let frame = 0;
    const totalFrames = 18;
    let rafId = 0;
    const timeoutId = window.setTimeout(() => {
      const tick = () => {
        frame += 1;
        const progress = frame / totalFrames;
        const lockedCount = Math.floor(progress * text.length);
        const scrambled = text
          .split("")
          .map((ch, idx) => {
            if (ch === " " || ch === "·" || ch === "/") return ch;
            if (idx < lockedCount) return ch;
            return CIPHER_CHARS[Math.floor(Math.random() * CIPHER_CHARS.length)];
          })
          .join("");
        setOutput(scrambled);
        if (frame < totalFrames) {
          rafId = window.requestAnimationFrame(tick);
        } else {
          setOutput(text);
        }
      };
      rafId = window.requestAnimationFrame(tick);
    }, delayMs);

    return () => {
      window.clearTimeout(timeoutId);
      window.cancelAnimationFrame(rafId);
    };
  }, [inView, text, delayMs]);

  return (
    <span ref={ref} className={className}>
      {output}
    </span>
  );
}

interface CountUpProps {
  target: number;
  prefix?: string;
  suffix?: string;
  raw?: string;
  className?: string;
}

/** Smooth cubic-out tabular counter triggered on scroll into view. */
export function CountUp({ target, prefix = "", suffix = "", raw, className = "" }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView || raw) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVal(target);
      return;
    }

    const duration = 950;
    const start = performance.now();
    let rafId = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(target * eased));
      if (t < 1) {
        rafId = window.requestAnimationFrame(tick);
      } else {
        setVal(target);
      }
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [inView, target, raw]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {raw ? raw : `${prefix}${val.toLocaleString("en-US")}${suffix}`}
    </span>
  );
}

interface SpotlightCellProps {
  children: React.ReactNode;
  className?: string;
  accent?: "magenta" | "violet";
}

/** Cyber-brutalist hairline cell with zero border-radius and cursor-tracking border/surface glow. */
export function SpotlightCell({ children, className = "", accent = "magenta" }: SpotlightCellProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false,
  });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    });
  };

  const glowColor = accent === "magenta" ? "rgba(255, 45, 120, 0.14)" : "rgba(139, 123, 255, 0.14)";

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={() => setCoords((prev) => ({ ...prev, active: false }))}
      className={`relative overflow-hidden bg-black transition-colors duration-300 ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: coords.active ? 1 : 0,
          background: `radial-gradient(280px circle at ${coords.x}px ${coords.y}px, ${glowColor}, transparent 70%)`,
        }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export function Reveal({ children, delay = 0, className = "" }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.14 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
