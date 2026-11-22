import { useState } from "react";
import { motion } from "motion/react";
import { TIMELINE_NODES } from "../data/hackathonData";
import { CipherText, Reveal } from "./MotionPrimitives";

export function ScheduleSection() {
  const [hoveredIdx, setHoveredIdx] = useState<number>(1);

  return (
    <section id="schedule" className="mx-auto max-w-6xl px-4 sm:px-6 py-20 sm:py-24 border-b border-white/10">
      <Reveal>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-white/55">
              <CipherText text="// 04 SCHEDULE · 2026" />
            </div>
            <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
              两周冲刺，12.06 现场开奖。
            </h2>
          </div>
          <span className="text-xs text-white/55">提交期：11 月 23 日 00:00 — 11 月 30 日 23:59</span>
        </div>
      </Reveal>

      <Reveal delay={0.08} className="mt-10">
        <div className="relative border border-white/10 bg-white/10 grid grid-cols-1 md:grid-cols-4 gap-px">
          {TIMELINE_NODES.map((node, idx) => {
            const active = hoveredIdx === idx;
            const isLive = node.status === "live";
            return (
              <div
                key={node.step}
                onMouseEnter={() => setHoveredIdx(idx)}
                onClick={() => setHoveredIdx(idx)}
                className={`relative p-6 transition-colors duration-300 cursor-pointer ${
                  active ? "bg-[#0a0a0f]" : "bg-black hover:bg-white/[0.02]"
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="scheduleBeam"
                    className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#ff2d78] to-[#8b7bff]"
                    transition={{ type: "spring", stiffness: 320, damping: 28 }}
                  />
                )}

                <div className="flex items-center justify-between text-[11px] uppercase tracking-widest">
                  <span className="text-white/45">{node.step}</span>
                  {isLive ? (
                    <span className="inline-flex items-center gap-1.5 text-[#ff2d78] font-bold">
                      <span className="h-1.5 w-1.5 bg-[#ff2d78] animate-pulse" />
                      进行中
                    </span>
                  ) : (
                    <span className="text-white/40">待开启</span>
                  )}
                </div>

                <div className="mt-4 text-sm font-bold text-[#8b7bff] tabular-nums">{node.date}</div>
                <h3 className="mt-1 text-xl font-bold text-white">{node.title}</h3>
                <p className="mt-3 text-xs text-white/60 leading-relaxed">{node.summary}</p>
              </div>
            );
          })}
        </div>
      </Reveal>
    </section>
  );
}
