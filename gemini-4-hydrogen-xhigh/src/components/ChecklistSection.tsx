import { useState } from "react";
import { motion } from "motion/react";
import { Check, RotateCcw, Terminal } from "lucide-react";
import { CHECKLIST_ITEMS } from "../data/hackathonData";
import { CipherText, Reveal } from "./MotionPrimitives";

export function ChecklistSection() {
  const [checkedIds, setCheckedIds] = useState<string[]>(["c1", "c3"]);

  const toggle = (id: string) => {
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const completed = checkedIds.length;
  const total = CHECKLIST_ITEMS.length;
  const isReady = completed === total;
  const pct = (completed / total) * 100;

  return (
    <section id="checklist" className="mx-auto max-w-6xl px-4 sm:px-6 py-20 sm:py-24 border-b border-white/10">
      <Reveal>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-white/55">
              <CipherText text="// 06 PRE-FLIGHT CHECK" />
            </div>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-white">
              提交前，8 项一勾自检。
            </h2>
          </div>
          <div className="flex flex-wrap shrink-0 gap-2 text-xs">
            <span className="border border-white/15 bg-white/5 px-2.5 py-1 text-white/75">
              鼓励附 ≤3 分钟演示视频
            </span>
            <span className="border border-white/15 bg-white/5 px-2.5 py-1 text-white/75">
              Web 作品由计协协助统一部署
            </span>
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.08} className="mt-10 border border-white/10 bg-[#050409]">
        {/* Terminal header bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-3.5 bg-black">
          <div className="flex items-center gap-2.5 text-xs">
            <Terminal className="h-4 w-4 text-[#ff2d78]" />
            <span className="font-bold tracking-wider text-white">SUBMIT_CHECKLIST.SH</span>
            <span
              className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest border ${
                isReady
                  ? "border-emerald-400 bg-emerald-400/15 text-emerald-300"
                  : "border-[#ff2d78]/50 bg-[#ff2d78]/10 text-[#ff2d78]"
              }`}
            >
              {isReady ? "READY [8/8]" : `PENDING [${completed}/${total}]`}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCheckedIds(CHECKLIST_ITEMS.map((c) => c.id))}
              className="border border-white/15 px-2.5 py-1 text-[11px] text-white/75 hover:border-white hover:text-white cursor-pointer"
            >
              全部勾选
            </button>
            <button
              type="button"
              onClick={() => setCheckedIds([])}
              className="inline-flex items-center gap-1 border border-white/15 px-2.5 py-1 text-[11px] text-white/55 hover:border-white hover:text-white cursor-pointer"
            >
              <RotateCcw className="h-3 w-3" />
              重置
            </button>
          </div>
        </div>

        {/* Dynamic progress line */}
        <div className="h-1 w-full bg-white/10">
          <motion.div
            className="h-full"
            initial={false}
            animate={{
              width: `${pct}%`,
              backgroundColor: isReady ? "#34d399" : "#ff2d78",
            }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
          />
        </div>

        {/* 2x4 clickable hairline grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10">
          {CHECKLIST_ITEMS.map((item, idx) => {
            const checked = checkedIds.includes(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => toggle(item.id)}
                className={`text-left p-5 transition-colors cursor-pointer ${
                  checked ? "bg-[#0e0c18]" : "bg-black hover:bg-white/[0.03]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] tabular-nums text-white/40">0{idx + 1}</span>
                  <span
                    className={`flex h-5 w-5 items-center justify-center border transition-colors ${
                      checked
                        ? "border-[#ff2d78] bg-[#ff2d78] text-black"
                        : "border-white/25 bg-black text-transparent"
                    }`}
                  >
                    <Check className="h-3.5 w-3.5 stroke-[3]" />
                  </span>
                </div>
                <div className={`mt-3 text-sm font-bold ${checked ? "text-white" : "text-white/85"}`}>
                  {item.title}
                </div>
                <div className="mt-1.5 text-xs text-white/50 leading-relaxed">{item.detail}</div>
              </button>
            );
          })}
        </div>
      </Reveal>
    </section>
  );
}
