import { ArrowRight, ArrowUp } from "lucide-react";
import { EVENT_META } from "../data/hackathonData";
import { CipherText, Reveal } from "./MotionPrimitives";

interface FooterSectionProps {
  onOpenModal: () => void;
}

export function FooterSection({ onOpenModal }: FooterSectionProps) {
  return (
    <>
      {/* Final CTA reusing .hero-backdrop glow + grid */}
      <section className="hero-backdrop border-b border-white/10 py-24 sm:py-32">
        <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <Reveal>
            <div className="text-xs uppercase tracking-widest text-white/55">
              <CipherText text="// SET SAIL · HEU 2026" />
            </div>
            <h2 className="mt-4 text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.08]">
              这一次远航，不预设终点。
            </h2>
            <p className="mt-5 text-sm sm:text-base text-white/65 max-w-xl mx-auto">
              11 月 23 日 — 11 月 30 日提交可运行作品 · 团队保留完整知识产权
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={onOpenModal}
                className="cta-sweep relative overflow-hidden inline-flex items-center gap-2 border border-white bg-white px-6 py-3.5 text-sm font-bold text-black transition-all hover:bg-neutral-100 cursor-pointer"
              >
                立即报名参赛
                <ArrowRight className="h-4 w-4" />
              </button>
              <a
                href="#top"
                className="inline-flex items-center gap-2 border border-white/25 bg-black/60 px-6 py-3.5 text-sm text-white transition-colors hover:border-white"
              >
                返回航线地图
                <ArrowUp className="h-4 w-4" />
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Hairline Footer matching SinceAI */}
      <footer className="bg-black text-xs text-white/55">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-white/10">
            <div className="md:col-span-1 space-y-2">
              <div className="text-sm font-bold text-white">HEU AI HACKATHON 2026</div>
              <p className="leading-relaxed">
                {EVENT_META.organizer} × {EVENT_META.coOrganizer}
              </p>
              <p className="text-white/40">发文时间：{EVENT_META.issueDate}</p>
            </div>

            <div>
              <div className="uppercase tracking-widest text-white/40 mb-3">// 赛制导航</div>
              <ul className="space-y-2">
                <li><a href="#tracks" className="hover:text-white transition-colors">三条赛道说明</a></li>
                <li><a href="#rewards" className="hover:text-white transition-colors">奖金与 OpenDev 算力</a></li>
                <li><a href="#schedule" className="hover:text-white transition-colors">赛程与开奖时间</a></li>
                <li><a href="#judging" className="hover:text-white transition-colors">百分制评审维度</a></li>
              </ul>
            </div>

            <div>
              <div className="uppercase tracking-widest text-white/40 mb-3">// 支持单位</div>
              <ul className="space-y-2">
                <li>OpenDev（独家算力与礼品卡）</li>
                <li>上海连尚网络科技有限公司</li>
                <li>连尚集团（校招实习直通）</li>
                <li>连尚孵化器（项目孵化对接）</li>
              </ul>
            </div>

            <div>
              <div className="uppercase tracking-widest text-white/40 mb-3">// 参赛须知</div>
              <ul className="space-y-2">
                <li>面向河北工程大学在校学生</li>
                <li>每队 1–5 人 · 0 元免费报名</li>
                <li>团队保留全部作品知识产权</li>
                <li>严禁抄袭、套壳及恶意代码</li>
              </ul>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[11px] text-white/40">
            <span>报名通道与宣讲安排以河北工程大学计算机协会官方通知为准</span>
            <span>看见问题，就是开始。</span>
          </div>
        </div>
      </footer>
    </>
  );
}
