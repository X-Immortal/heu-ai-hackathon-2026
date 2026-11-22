import { motion } from "motion/react";
import { Award, ShieldCheck, Users } from "lucide-react";
import { SCORE_METRICS } from "../data/hackathonData";
import { CipherText, Reveal, SpotlightCell } from "./MotionPrimitives";

export function JudgingSection() {
  return (
    <section id="judging" className="mx-auto max-w-6xl px-4 sm:px-6 py-20 sm:py-24 border-b border-white/10">
      <Reveal>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-white/55">
              <CipherText text="// 05 EVALUATION · 100 PTS" />
            </div>
            <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
              先线上初评，后专家点评。
            </h2>
          </div>
          <span className="text-xs text-white/55 border border-white/15 px-3 py-1.5 self-start md:self-auto">
            百分制独立打分 · 利益回避 · 24h 可申诉复核
          </span>
        </div>
      </Reveal>

      <div className="mt-10 grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-px bg-white/10 border border-white/10">
        {/* Left: Animated 5-bar score telemetry */}
        <div className="bg-black p-6 sm:p-8">
          <div className="flex items-center justify-between text-[11px] uppercase tracking-widest text-white/50">
            <span>// 评分权重分布</span>
            <span className="tabular-nums text-white font-bold">TOTAL 100 PTS</span>
          </div>

          <div className="mt-6 space-y-5">
            {SCORE_METRICS.map((metric, idx) => (
              <div key={metric.label} className="group">
                <div className="flex items-baseline justify-between gap-2 text-sm">
                  <span className="font-bold text-white">{metric.label}</span>
                  <span className="tabular-nums font-bold" style={{ color: metric.accent }}>
                    {metric.points} 分
                  </span>
                </div>
                <div className="mt-2 h-2 w-full bg-white/10 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${metric.points * 3.4}%` }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.75, delay: idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full transition-opacity group-hover:opacity-100 opacity-90"
                    style={{ backgroundColor: metric.accent }}
                  />
                </div>
                <div className="mt-1.5 text-xs text-white/50">{metric.summary}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Guests & Judges concise panel */}
        <div className="grid grid-rows-2 gap-px bg-white/10">
          <SpotlightCell accent="magenta" className="bg-[#050409] p-6 sm:p-8">
            <div className="flex items-center justify-between text-[11px] uppercase tracking-widest text-[#ff2d78]">
              <span>// 特邀嘉宾</span>
              <Award className="h-4 w-4" />
            </div>
            <h3 className="mt-3 text-xl font-bold text-white">产业导师与生态高管</h3>
            <p className="mt-2 text-xs text-white/60 leading-relaxed">
              学术导师 · OpenDev 社区专家 · 连尚集团技术高管 · 连尚孵化器导师
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-[11px]">
              <span className="border border-white/15 px-2 py-0.5 text-white/75">方向指导</span>
              <span className="border border-white/15 px-2 py-0.5 text-white/75">12.6 现场点评</span>
              <span className="border border-[#ff2d78]/40 px-2 py-0.5 text-[#ff2d78]">孵化与投资对接</span>
            </div>
          </SpotlightCell>

          <SpotlightCell accent="violet" className="bg-black p-6 sm:p-8">
            <div className="flex items-center justify-between text-[11px] uppercase tracking-widest text-[#8b7bff]">
              <span>// 评审专家</span>
              <Users className="h-4 w-4" />
            </div>
            <h3 className="mt-3 text-xl font-bold text-white">专业教师与资深工程师</h3>
            <p className="mt-2 text-xs text-white/60 leading-relaxed">
              专业教师 · 计协技术骨干 · 行业资深工程师 · 优秀校友
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-[11px]">
              <span className="border border-white/15 px-2 py-0.5 text-white/75">源码与套壳审查</span>
              <span className="border border-white/15 px-2 py-0.5 text-white/75">现场质询裁定</span>
              <span className="border border-[#8b7bff]/40 px-2 py-0.5 text-[#8b7bff] inline-flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" /> 实习举荐权
              </span>
            </div>
          </SpotlightCell>
        </div>
      </div>
    </section>
  );
}
