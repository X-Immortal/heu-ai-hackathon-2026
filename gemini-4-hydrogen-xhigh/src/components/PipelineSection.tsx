import { ArrowUpRight } from "lucide-react";
import { PIPELINE_STEPS } from "../data/hackathonData";
import { CipherText, Reveal, SpotlightCell } from "./MotionPrimitives";

export function PipelineSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 py-20 sm:py-24 border-b border-white/10">
      <Reveal>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-white/55">
              <CipherText text="// 01 THE ECOSYSTEM" />
            </div>
            <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
              从发现问题，到跑出真实产品。
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-white/55 max-w-sm">
            不预设命题，不限技术栈。把身边痛点做成可演示、可持续迭代的真实作品。
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.08} className="mt-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10 border border-white/10">
          {PIPELINE_STEPS.map((col) => (
            <SpotlightCell
              key={col.code}
              accent={col.featured ? "magenta" : "violet"}
              className={
                col.featured
                  ? "bg-[#ff2d78]/[0.05] shadow-[inset_2px_0_0_#ff2d78]"
                  : "bg-black"
              }
            >
              <div className="flex h-full flex-col justify-between p-6">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs tracking-widest text-white/50">
                      {col.code} // {col.subtitle}
                    </span>
                    {col.badge && (
                      <span className="border border-[#ff2d78] bg-[#ff2d78]/15 px-2 py-0.5 text-[10px] font-bold tracking-widest text-[#ff2d78]">
                        {col.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-2 text-2xl font-bold text-white">{col.title}</h3>
                </div>

                <div className="mt-8 divide-y divide-white/10 border-t border-white/10">
                  {col.items.map((item) => (
                    <div key={item.name} className="py-4 first:pt-4 last:pb-0 group">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-bold text-white flex items-center gap-1.5">
                          {item.name}
                          <ArrowUpRight className="h-3.5 w-3.5 text-white/40 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#ff2d78]" />
                        </span>
                        <span
                          className={`px-2 py-0.5 text-[10px] uppercase tracking-wider border ${
                            col.featured
                              ? "border-[#ff2d78]/40 text-[#ff2d78]"
                              : "border-white/15 text-white/60"
                          }`}
                        >
                          {item.tag}
                        </span>
                      </div>
                      <p className="mt-1.5 text-xs text-white/55">{item.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            </SpotlightCell>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
