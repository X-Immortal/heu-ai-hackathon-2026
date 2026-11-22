import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AlertTriangle, Globe, HeartHandshake, Sparkles } from "lucide-react";
import { DISQUALIFY_RULES, TRACKS, type TrackSpec } from "../data/hackathonData";
import { CipherText, Reveal } from "./MotionPrimitives";

function TrackTelemetryVisual({ track }: { track: TrackSpec }) {
  if (track.id === "knowledge") {
    const nodes = [
      { cx: 52, cy: 48, r: 4 },
      { cx: 118, cy: 36, r: 3.5 },
      { cx: 192, cy: 52, r: 4 },
      { cx: 74, cy: 132, r: 3.5 },
      { cx: 176, cy: 138, r: 4 },
    ];
    return (
      <svg viewBox="0 0 240 170" className="w-full h-44" aria-hidden="true">
        {nodes.map((n, i) => (
          <g key={i}>
            <line
              x1="120"
              y1="88"
              x2={n.cx}
              y2={n.cy}
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="1"
            />
            <motion.line
              x1="120"
              y1="88"
              x2={n.cx}
              y2={n.cy}
              stroke="#ff2d78"
              strokeWidth="1.5"
              initial={{ pathLength: 0, opacity: 0.2 }}
              animate={{ pathLength: [0, 1, 0.3], opacity: [0.2, 1, 0.4] }}
              transition={{ duration: 2.6, repeat: Infinity, delay: i * 0.35 }}
            />
            <circle cx={n.cx} cy={n.cy} r={n.r} fill="#000" stroke="#fff" strokeWidth="1.2" />
          </g>
        ))}
        <motion.circle
          cx="120"
          cy="88"
          r="18"
          fill="none"
          stroke="#ff2d78"
          strokeWidth="1"
          animate={{ scale: [0.9, 1.45], opacity: [0.85, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
          style={{ transformOrigin: "120px 88px" }}
        />
        <rect x="111" y="79" width="18" height="18" fill="#ff2d78" />
        <text x="120" y="91" textAnchor="middle" fill="#000" fontSize="8" fontWeight="700">
          AI
        </text>
      </svg>
    );
  }

  if (track.id === "companion") {
    return (
      <svg viewBox="0 0 240 170" className="w-full h-44" aria-hidden="true">
        {[0, 1, 2].map((ring) => (
          <motion.circle
            key={ring}
            cx="120"
            cy="85"
            r={22 + ring * 18}
            fill="none"
            stroke="#8b7bff"
            strokeOpacity={0.6 - ring * 0.16}
            strokeWidth="1"
            strokeDasharray="4 4"
            animate={{ rotate: ring % 2 === 0 ? 360 : -360 }}
            transition={{ duration: 16 + ring * 6, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "120px 85px" }}
          />
        ))}
        <motion.path
          d="M 24 85 Q 60 45, 96 85 T 168 85 T 216 85"
          fill="none"
          stroke="#8b7bff"
          strokeWidth="2"
          animate={{
            d: [
              "M 24 85 Q 60 45, 96 85 T 168 85 T 216 85",
              "M 24 85 Q 60 120, 96 85 T 168 85 T 216 85",
              "M 24 85 Q 60 45, 96 85 T 168 85 T 216 85",
            ],
          }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        />
        <circle cx="120" cy="85" r="7" fill="#8b7bff" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 240 170" className="w-full h-44" aria-hidden="true">
      <circle cx="120" cy="85" r="52" fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="1" />
      <ellipse cx="120" cy="85" rx="52" ry="18" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
      <motion.ellipse
        cx="120"
        cy="85"
        rx="22"
        ry="52"
        fill="none"
        stroke="#22d3ee"
        strokeOpacity="0.45"
        strokeWidth="1"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "120px 85px" }}
      />
      <motion.path
        d="M 68 96 Q 120 26 178 72"
        fill="none"
        stroke="#22d3ee"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: [0, 1, 1], opacity: [0.3, 1, 0.2] }}
        transition={{ duration: 2.8, repeat: Infinity }}
      />
      <circle cx="68" cy="96" r="4" fill="#ff2d78" />
      <circle cx="178" cy="72" r="4" fill="#22d3ee" />
    </svg>
  );
}

const TRACK_ICONS = {
  knowledge: Sparkles,
  companion: HeartHandshake,
  global: Globe,
};

export function TracksSection() {
  const [selectedId, setSelectedId] = useState<TrackSpec["id"]>("knowledge");
  const active = TRACKS.find((t) => t.id === selectedId) ?? TRACKS[0];

  return (
    <section id="tracks" className="mx-auto max-w-6xl px-4 sm:px-6 py-20 sm:py-24 border-b border-white/10">
      <Reveal>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-white/55">
              <CipherText text="// 02 THREE TRACKS" />
            </div>
            <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
              三条赛道，同一主题。
            </h2>
          </div>
          <span className="text-xs text-white/55 border border-white/15 px-3 py-1.5 self-start md:self-auto">
            每队限选 1 条主赛道 · 跨界可注明交叉亮点
          </span>
        </div>
      </Reveal>

      {/* Interactive track tabs */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-px bg-white/10 border border-white/10">
        {TRACKS.map((track) => {
          const isSelected = track.id === active.id;
          const Icon = TRACK_ICONS[track.id];
          return (
            <button
              key={track.id}
              type="button"
              onClick={() => setSelectedId(track.id)}
              className={`relative text-left px-5 py-4 transition-colors cursor-pointer ${
                isSelected ? "bg-[#0a0a0f]" : "bg-black hover:bg-white/[0.03]"
              }`}
            >
              {isSelected && (
                <motion.div
                  layoutId="trackActiveBar"
                  className="absolute top-0 left-0 right-0 h-[2px]"
                  style={{ backgroundColor: track.accent }}
                  transition={{ type: "spring", stiffness: 360, damping: 30 }}
                />
              )}
              <div className="flex items-center justify-between text-[11px] uppercase tracking-widest text-white/50">
                <span>
                  {track.code} // {track.englishTag}
                </span>
                <Icon className="h-3.5 w-3.5" style={{ color: isSelected ? track.accent : undefined }} />
              </div>
              <div className="mt-1.5 text-lg font-bold text-white">{track.name}</div>
            </button>
          );
        })}
      </div>

      {/* Animated track inspector stage */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="grid grid-cols-1 lg:grid-cols-[1.05fr_1.2fr] gap-px bg-white/10 border-x border-b border-white/10"
        >
          {/* Left visual schematic */}
          <div className="bg-[#050409] p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[11px] uppercase tracking-widest text-white/50">
              <span>TRACK_TELEMETRY // {active.code}</span>
              <span style={{ color: active.accent }}>ACTIVE</span>
            </div>
            <div className="my-4 flex items-center justify-center border border-white/10 bg-black/60 p-4">
              <TrackTelemetryVisual track={active} />
            </div>
            <div className="text-xs text-white/60 border-l-2 pl-3" style={{ borderColor: active.accent }}>
              {active.requirementHint}
            </div>
          </div>

          {/* Right crisp 3-row breakdown */}
          <div className="grid grid-rows-3 gap-px bg-white/10">
            <div className="bg-black p-6">
              <div className="text-[11px] uppercase tracking-widest text-white/45">// 问题取向</div>
              <div className="mt-2 text-lg font-bold text-white">{active.problemFocus}</div>
            </div>

            <div className="bg-black p-6">
              <div className="text-[11px] uppercase tracking-widest text-white/45">// 作品方向举例</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {active.examples.map((ex) => (
                  <span
                    key={ex}
                    className="border border-white/15 bg-white/5 px-2.5 py-1 text-xs text-neutral-200"
                  >
                    {ex}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-black p-6">
              <div className="text-[11px] uppercase tracking-widest text-white/45">// 评审侧重</div>
              <div className="mt-2 text-base font-medium text-neutral-200">{active.judgingFocus}</div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Disqualification strip */}
      <div className="mt-4 flex flex-wrap items-center gap-2 border border-white/10 bg-[#0a0a0f] px-4 py-3 text-xs">
        <span className="inline-flex items-center gap-1.5 font-bold text-[#ff2d78] mr-2">
          <AlertTriangle className="h-3.5 w-3.5" />
          不予入围红线：
        </span>
        {DISQUALIFY_RULES.map((rule) => (
          <span key={rule} className="border border-white/10 bg-black px-2.5 py-1 text-white/65">
            × {rule}
          </span>
        ))}
      </div>
    </section>
  );
}
