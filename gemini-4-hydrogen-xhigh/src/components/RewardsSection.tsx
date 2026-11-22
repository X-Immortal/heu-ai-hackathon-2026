import { useState } from "react";
import { motion } from "motion/react";
import { Cpu, Gift, Sparkles } from "lucide-react";
import { CASH_AWARDS, SPECIAL_AWARDS } from "../data/hackathonData";
import { CipherText, Reveal, SpotlightCell } from "./MotionPrimitives";
import { HeuCsLogo, IncubatorLogo, LinkSureLogo, OpenDevLogo, SummerFieldLogo } from "./PartnerLogos";

export function RewardsSection() {
  const [invitedCount, setInvitedCount] = useState(2);
  const baseUsd = 200;
  const bonusUsd = invitedCount * 100;
  const totalUsd = baseUsd + bonusUsd;
  const progressPct = (totalUsd / 500) * 100;

  return (
    <section id="rewards" className="mx-auto max-w-6xl px-4 sm:px-6 py-20 sm:py-24 border-b border-white/10">
      <Reveal>
        <div className="text-xs uppercase tracking-widest text-white/55">
          <CipherText text="// 03 REWARDS & COMPUTE" />
        </div>
        <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
          算力、奖金与直通孵化支持。
        </h2>
      </Reveal>

      {/* 2-column asymmetric split matching SinceAI flagship event */}
      <Reveal delay={0.08} className="mt-10 grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-px bg-white/10 border border-white/10">
        {/* Left: Cash + Track + Special awards */}
        <div className="bg-black p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[11px] uppercase tracking-widest text-white/50">
              <span>// 奖项设置</span>
              <span className="text-[#ff2d78]">12.06 现场公布</span>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-px bg-white/10 border border-white/10">
              {CASH_AWARDS.map((award, idx) => (
                <div key={award.tier} className="bg-[#050409] p-4">
                  <div className="text-[11px] text-white/50">{award.tier}</div>
                  <div
                    className={`mt-1.5 text-xl sm:text-2xl font-bold tabular-nums ${
                      idx === 0 ? "text-[#ff2d78]" : "text-white"
                    }`}
                  >
                    {award.amount}
                  </div>
                  <div className="mt-1 text-[11px] text-white/55">{award.quota}</div>
                </div>
              ))}
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SPECIAL_AWARDS.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between border border-white/10 bg-[#0a0a0f] px-3 py-2.5 text-xs"
                >
                  <span className="font-bold text-white">{item.name}</span>
                  <span className="text-white/50">{item.scope}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-white/10 pt-5 text-xs text-white/65">
            <span className="inline-flex items-center gap-1.5 border border-[#8b7bff]/40 bg-[#8b7bff]/10 px-2.5 py-1 text-[#8b7bff]">
              <Sparkles className="h-3.5 w-3.5" /> 连尚集团实习机会
            </span>
            <span className="inline-flex items-center gap-1.5 border border-white/15 px-2.5 py-1">
              连尚孵化器入驻与投资对接
            </span>
            <span className="inline-flex items-center gap-1.5 border border-white/15 px-2.5 py-1">
              <Gift className="h-3.5 w-3.5 text-[#ff2d78]" /> OpenDev 线下礼品卡
            </span>
          </div>
        </div>

        {/* Right: Interactive OpenDev Token Simulator */}
        <SpotlightCell accent="magenta" className="bg-[#07060d] p-6 sm:p-8">
          <div className="flex h-full flex-col gap-6">
            <div>
              <div className="flex items-center justify-between text-[11px] uppercase tracking-widest text-white/50">
                <span className="flex items-center gap-1.5">
                  <Cpu className="h-3.5 w-3.5 text-[#ff2d78]" />
                  OPENDEV TOKEN 模拟器
                </span>
                <span className="text-[#ff2d78]">按人发放 · 非按队</span>
              </div>

              <div className="mt-6 flex items-baseline justify-between">
                <div>
                  <div className="text-xs text-white/55">单人赛期可用算力额度</div>
                  <motion.div
                    key={totalUsd}
                    initial={{ opacity: 0.4, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.22 }}
                    className="mt-1 text-4xl sm:text-5xl font-bold tabular-nums text-[#ff2d78]"
                  >
                    ${totalUsd}
                  </motion.div>
                </div>
                <div className="text-right text-xs text-white/55 tabular-nums">
                  <div>基础 ${baseUsd}</div>
                  <div className="text-[#8b7bff]">邀请 +${bonusUsd}</div>
                </div>
              </div>

              {/* Animated progress bar */}
              <div className="mt-5 h-3 w-full border border-white/15 bg-black p-0.5">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#ff2d78] to-[#8b7bff]"
                  initial={false}
                  animate={{ width: `${progressPct}%` }}
                  transition={{ type: "spring", stiffness: 260, damping: 24 }}
                />
              </div>
              <div className="mt-2 flex justify-between text-[10px] text-white/40 tabular-nums">
                <span>$0</span>
                <span>BASE $200</span>
                <span>MAX $500</span>
              </div>
            </div>

            <div className="border-t border-white/10 pt-5">
              <div className="text-xs text-white/75 mb-3">
                点击模拟：成功邀请 <span className="font-bold text-white">{invitedCount}</span> 名同样入选选手（+$100/人，上限 3 人）
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[0, 1, 2, 3].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setInvitedCount(n)}
                    className={`py-2 text-xs font-bold border transition-colors cursor-pointer ${
                      invitedCount === n
                        ? "border-[#ff2d78] bg-[#ff2d78] text-black"
                        : "border-white/15 bg-black text-white/70 hover:border-white/40 hover:text-white"
                    }`}
                  >
                    +{n} 人
                  </button>
                ))}
              </div>
              <p className="mt-3 text-[11px] text-white/45">
                开赛前发放，限赛期内用于模型调用或云资源；未入选邀请不计入加成。
              </p>
            </div>
          </div>
        </SpotlightCell>
      </Reveal>

      {/* Organizer & Sponsor hairline wall */}
      <Reveal delay={0.14} className="mt-10">
        <div className="text-[11px] uppercase tracking-widest text-white/45 mb-3">
          // 主办与支持单位
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 border-t border-l border-white/10">
          {[
            { role: "主办单位", logo: <HeuCsLogo /> },
            { role: "联合主办", logo: <SummerFieldLogo /> },
            { role: "独家算力资助", logo: <OpenDevLogo className="h-5 w-auto" /> },
            { role: "赞助支持", logo: <LinkSureLogo /> },
            { role: "项目孵化", logo: <IncubatorLogo /> },
          ].map((partner) => (
            <div
              key={partner.role}
              className="border-r border-b border-white/10 bg-black p-5 flex flex-col justify-between gap-4 transition-colors hover:bg-white/[0.03]"
            >
              <span className="text-[10px] uppercase tracking-widest text-white/45">{partner.role}</span>
              <div>{partner.logo}</div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
