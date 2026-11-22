export function OpenDevLogo({ className = "h-7 w-auto" }: { className?: string }) {
  return (
    <div className="inline-flex items-center gap-2.5 select-none">
      <svg viewBox="0 0 64 42" className={className} fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="od-left" x1="6" y1="6" x2="34" y2="38" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1e40af" />
            <stop offset="48%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#22c55e" />
          </linearGradient>
          <linearGradient id="od-right" x1="30" y1="4" x2="56" y2="38" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#facc15" />
            <stop offset="55%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#dc2626" />
          </linearGradient>
        </defs>
        <path
          d="M22 6C12.6 6 6 12.8 6 21C6 29.2 12.6 36 22 36C31.4 36 37 26.8 39 14"
          stroke="url(#od-left)"
          strokeWidth="4.2"
          strokeLinecap="round"
        />
        <path
          d="M28 8C34 5 46 6 52 13C57.5 19.2 55 31 44 35C35.5 38 29 33 27.5 23"
          stroke="url(#od-right)"
          strokeWidth="4.2"
          strokeLinecap="round"
        />
      </svg>
      <span className="font-bold tracking-tight text-white text-base">
        Open<span className="text-[#ff6b4a]">Dev</span>
      </span>
    </div>
  );
}

export function LinkSureLogo() {
  return (
    <div className="inline-flex items-center gap-2 select-none">
      <span className="inline-flex h-5 w-5 items-center justify-center border border-[#1677FF]/60 bg-[#1677FF]/15 text-[10px] font-bold text-[#3b93ff]">
        LS
      </span>
      <span className="font-bold tracking-wider text-[#3b93ff] text-base">连尚集团</span>
    </div>
  );
}

export function HeuCsLogo() {
  return (
    <div className="inline-flex items-center gap-2.5 select-none">
      <span className="inline-flex h-6 w-6 items-center justify-center border border-white/25 bg-white/5 text-[10px] font-bold text-white">
        HEU
      </span>
      <span className="font-bold tracking-tight text-white text-sm">河北工程大学计算机协会</span>
    </div>
  );
}

export function SummerFieldLogo() {
  return (
    <div className="inline-flex items-center gap-2 select-none">
      <span className="inline-block h-2.5 w-2.5 bg-[#ff2d78]" />
      <span className="font-bold tracking-tight text-white text-sm">夏野黑客松</span>
    </div>
  );
}

export function IncubatorLogo() {
  return (
    <div className="inline-flex items-center gap-2 select-none">
      <span className="inline-block h-2.5 w-2.5 border border-[#8b7bff] bg-[#8b7bff]/30" />
      <span className="font-bold tracking-tight text-white text-sm">连尚孵化器</span>
    </div>
  );
}
