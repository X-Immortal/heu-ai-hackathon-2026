import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { ArrowRight } from "lucide-react";

interface NavbarProps {
  onOpenModal: () => void;
}

const NAV_LINKS = [
  { href: "#tracks", label: "赛道" },
  { href: "#rewards", label: "奖励与算力" },
  { href: "#schedule", label: "赛程" },
  { href: "#judging", label: "评审" },
  { href: "#checklist", label: "提交自检" },
];

export function Navbar({ onOpenModal }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 280, damping: 32, restDelta: 0.001 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-black/80 backdrop-blur-md border-b border-white/10"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      {/* Top scroll telemetry beam */}
      <motion.div
        className="h-[2px] w-full origin-left bg-gradient-to-r from-[#ff2d78] via-[#8b7bff] to-[#22d3ee]"
        style={{ scaleX }}
      />

      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#top" className="flex items-center gap-2.5 group">
          <div className="flex h-7 w-7 items-center justify-center border border-white/25 bg-black text-xs font-bold tracking-tighter text-white transition-colors group-hover:border-[#ff2d78]">
            H×
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-xs font-bold tracking-wider text-white">HEU AI HACKATHON</span>
            <span className="text-[10px] tracking-widest text-white/50">2026 // 河工程计协</span>
          </div>
        </a>

        <nav className="hidden md:flex items-center gap-7 text-[13px] text-neutral-400">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative py-1 transition-colors hover:text-white after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-[#ff2d78] after:transition-all after:duration-200 hover:after:w-full"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <span className="hidden lg:inline-flex items-center gap-1.5 border border-[#ff2d78]/40 bg-[#ff2d78]/10 px-2.5 py-1 text-[11px] uppercase tracking-wider text-[#ff2d78]">
            <span className="h-1.5 w-1.5 bg-[#ff2d78] animate-ping" />
            11.23—11.30 开放提交
          </span>
          <button
            type="button"
            onClick={onOpenModal}
            className="cta-sweep relative overflow-hidden inline-flex items-center gap-1.5 border border-white bg-white px-4 py-1.5 text-[13px] font-bold text-black transition-transform active:scale-[0.98] cursor-pointer"
          >
            立即报名
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
}
