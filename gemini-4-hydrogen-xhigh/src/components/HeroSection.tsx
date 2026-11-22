import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Compass, Terminal } from "lucide-react";
import { EVENT_META, HERO_STATS } from "../data/hackathonData";
import { CipherText, CountUp } from "./MotionPrimitives";
import { VoyageMap } from "./VoyageMap";
import { HeuCsLogo, IncubatorLogo, LinkSureLogo, OpenDevLogo, SummerFieldLogo } from "./PartnerLogos";

interface HeroSectionProps {
  onOpenModal: () => void;
}

interface CountdownState {
  label: string;
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
}

function getCountdown(): CountdownState {
  const now = Date.now();
  const submitEnd = new Date(EVENT_META.submissionEnd).getTime();
  const demoDay = new Date(EVENT_META.demoDay).getTime();

  let target = submitEnd;
  let label = "距提交截止 11.30";

  if (now > submitEnd && now <= demoDay) {
    target = demoDay;
    label = "距路演开奖 12.06";
  } else if (now > demoDay) {
    return {
      label: "2026 赛事进程",
      days: "12",
      hours: "06",
      minutes: "19",
      seconds: "00",
    };
  }

  const diff = Math.max(0, target - now);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return {
    label,
    days: String(days).padStart(2, "0"),
    hours: String(hours).padStart(2, "0"),
    minutes: String(minutes).padStart(2, "0"),
    seconds: String(seconds).padStart(2, "0"),
  };
}

export function HeroSection({ onOpenModal }: HeroSectionProps) {
  const [countdown, setCountdown] = useState<CountdownState>(getCountdown);

  useEffect(() => {
    const id = window.setInterval(() => setCountdown(getCountdown()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const marqueeItems = [
    <OpenDevLogo key="od" className="h-6 w-auto" />,
    <LinkSureLogo key="ls" />,
    <IncubatorLogo key="inc" />,
    <HeuCsLogo key="heu" />,
    <SummerFieldLogo key="sf" />,
    <span key="t1" className="border border-white/15 px-2.5 py-1 text-[11px] uppercase tracking-widest text-white/70">
      ZERO ENTRY FEE · 0元报名
    </span>,
    <span key="t2" className="border border-white/15 px-2.5 py-1 text-[11px] uppercase tracking-widest text-white/70">
      1–5 BUILDERS · 跨学院组队
    </span>,
    <span key="t3" className="border border-[#ff2d78]/40 px-2.5 py-1 text-[11px] uppercase tracking-widest text-[#ff2d78]">
      $500 MAX TOKEN · 算力赞助
    </span>,
  ];

  return (
    <section id="top" className="hero-backdrop pt-24 pb-0 border-b border-white/10">
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        {/* Eyebrow row */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="flex flex-wrap items-center justify-between gap-3 text-xs uppercase tracking-widest text-white/55"
        >
          <CipherText text="// 河北工程大学计算机协会 × 夏野黑客松 · 2026" />
          <div className="inline-flex items-center gap-2 border border-white/15 bg-black/60 px-3 py-1 tabular-nums text-[11px] text-white/80">
            <span className="text-[#ff2d78]">{countdown.label}</span>
            <span className="text-white/30">|</span>
            <span>
              {countdown.days}d : {countdown.hours}h : {countdown.minutes}m : {countdown.seconds}s
            </span>
          </div>
        </motion.div>

        {/* Display H1 */}
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="mt-5 max-w-4xl font-bold tracking-tight text-white leading-[1.03]"
          style={{ fontSize: "clamp(2.4rem, 5.2vw, 4.5rem)" }}
        >
          看见问题，
          <span className="bg-gradient-to-r from-white via-white to-[#ff2d78] bg-clip-text text-transparent">
            就是开始。
          </span>
        </motion.h1>

        {/* Concise split subtitle + CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 flex flex-col lg:flex-row lg:items-end justify-between gap-6"
        >
          <div className="max-w-xl space-y-2">
            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
              {EVENT_META.subTitle}
            </p>
            <p className="text-xs text-white/50 tracking-wide">
              {EVENT_META.teamRule}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onOpenModal}
              className="cta-sweep relative overflow-hidden inline-flex items-center gap-2 border border-white bg-white px-5 py-3 text-sm font-bold text-black transition-all hover:bg-neutral-100 cursor-pointer"
            >
              立即报名参赛
              <ArrowRight className="h-4 w-4" />
            </button>
            <a
              href="#tracks"
              className="inline-flex items-center gap-2 border border-white/25 bg-black/50 px-5 py-3 text-sm text-white transition-colors hover:border-white hover:bg-white/5"
            >
              <Compass className="h-4 w-4 text-[#8b7bff]" />
              三条赛道
            </a>
            <a
              href="#checklist"
              aria-label="打开提交自检清单"
              className="inline-flex h-[46px] w-[46px] items-center justify-center border border-white/20 bg-black/50 text-white/80 transition-colors hover:border-[#ff2d78] hover:text-[#ff2d78]"
            >
              <Terminal className="h-4 w-4" />
            </a>
          </div>
        </motion.div>

        {/* Centerpiece interactive dot-matrix map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10"
        >
          <VoyageMap />
        </motion.div>

        {/* Hairline 4-stat bar */}
        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 border border-white/10">
          {HERO_STATS.map((stat) => (
            <div key={stat.label} className="bg-black px-5 py-4">
              <div
                className={`text-2xl sm:text-3xl font-bold tracking-tight leading-none ${
                  stat.highlight ? "text-[#ff2d78]" : "text-white"
                }`}
              >
                <CountUp
                  target={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  raw={stat.raw}
                />
              </div>
              <div className="mt-2 text-xs text-white/55">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Infinite partner marquee */}
      <div className="relative z-10 mt-10 border-t border-white/10 bg-black/80 py-3.5">
        <div className="mx-auto flex max-w-6xl items-center gap-6 px-4 sm:px-6">
          <span className="shrink-0 text-[11px] uppercase tracking-widest text-white/45">
            // SUPPORTED BY
          </span>
          <div className="marquee-mask flex-1 overflow-hidden">
            <div className="marquee-track items-center gap-10">
              {[0, 1].map((dup) => (
                <div key={dup} className="flex shrink-0 items-center gap-10 pr-10">
                  {marqueeItems.map((item, idx) => (
                    <div
                      key={`${dup}-${idx}`}
                      className="opacity-70 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
