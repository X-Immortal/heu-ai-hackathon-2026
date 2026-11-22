import React, { useEffect, useMemo, useState } from "react";
import { VOYAGE_HUBS, type MapHub } from "../data/hackathonData";

// Stylized Equirectangular continent clusters in 150x65 coordinate space
const CONTINENT_SILHOUETTES: Array<{ cx: number; cy: number; rx: number; ry: number; rot?: number }> = [
  // North America
  { cx: 26, cy: 17, rx: 13.5, ry: 7.5, rot: -10 },
  { cx: 33, cy: 25, rx: 6.5, ry: 4.5, rot: 25 },
  { cx: 18, cy: 13, rx: 5.5, ry: 3.2, rot: -5 },
  // Greenland
  { cx: 52, cy: 9, rx: 5, ry: 2.8 },
  // South America
  { cx: 43, cy: 43, rx: 7.2, ry: 11, rot: 12 },
  // Europe
  { cx: 77, cy: 16.5, rx: 9, ry: 5, rot: -6 },
  // Africa
  { cx: 80, cy: 36, rx: 9.5, ry: 11.2, rot: 4 },
  // Eurasia / Siberia / China / India
  { cx: 105, cy: 16, rx: 22, ry: 7.2, rot: 2 },
  { cx: 116, cy: 26, rx: 10.5, ry: 6.2, rot: -8 },
  { cx: 103, cy: 30, rx: 4.8, ry: 5.2 },
  // SE Asia & Japan
  { cx: 124, cy: 38.5, rx: 5.5, ry: 3.2, rot: 14 },
  { cx: 132.5, cy: 24, rx: 2, ry: 4, rot: 28 },
  // Australia
  { cx: 128, cy: 48, rx: 7.2, ry: 4.6 },
];

function isPointInLand(x: number, y: number): boolean {
  for (const c of CONTINENT_SILHOUETTES) {
    const rad = ((c.rot ?? 0) * Math.PI) / 180;
    const dx = x - c.cx;
    const dy = y - c.cy;
    const rx = dx * Math.cos(rad) + dy * Math.sin(rad);
    const ry = -dx * Math.sin(rad) + dy * Math.cos(rad);
    if ((rx * rx) / (c.rx * c.rx) + (ry * ry) / (c.ry * c.ry) <= 1) {
      return true;
    }
  }
  return false;
}

export function VoyageMap() {
  const [activeId, setActiveId] = useState<string>("heu");
  const [isLocked, setIsLocked] = useState(false);
  const [cursorCoord, setCursorCoord] = useState<{ lat: string; lon: string }>({
    lat: "36.60°N",
    lon: "114.48°E",
  });

  // Deterministic dot-matrix world map points
  const landDots = useMemo(() => {
    const dots: Array<{ x: number; y: number; bright: boolean }> = [];
    for (let x = 6; x <= 144; x += 2.2) {
      for (let y = 6; y <= 58; y += 2.2) {
        if (isPointInLand(x, y)) {
          const bright = Math.abs(x - 118) < 15 && Math.abs(y - 25) < 11;
          dots.push({ x: Number(x.toFixed(1)), y: Number(y.toFixed(1)), bright });
        }
      }
    }
    return dots;
  }, []);

  // Auto-cycle featured hubs unless hovered/clicked
  useEffect(() => {
    if (isLocked) return;
    const timer = window.setInterval(() => {
      setActiveId((prev) => {
        const idx = VOYAGE_HUBS.findIndex((h) => h.id === prev);
        const next = (idx + 1) % VOYAGE_HUBS.length;
        return VOYAGE_HUBS[next].id;
      });
    }, 3200);
    return () => window.clearInterval(timer);
  }, [isLocked]);

  const hq = VOYAGE_HUBS[0];
  const activeHub: MapHub = VOYAGE_HUBS.find((h) => h.id === activeId) ?? hq;

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const ny = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    const lon = (nx * 360 - 180).toFixed(2);
    const lat = (90 - ny * 180).toFixed(2);
    setCursorCoord({
      lat: `${Math.abs(Number(lat)).toFixed(2)}°${Number(lat) >= 0 ? "N" : "S"}`,
      lon: `${Math.abs(Number(lon)).toFixed(2)}°${Number(lon) >= 0 ? "E" : "W"}`,
    });
  };

  return (
    <div className="relative w-full border border-white/10 bg-[#050409]/90 overflow-hidden select-none">
      {/* Subtle corner HUD metadata */}
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2 text-[11px] uppercase tracking-widest text-white/55">
        <span className="flex items-center gap-2">
          <span className="inline-block h-1.5 w-1.5 bg-[#ff2d78] animate-pulse" />
          VOYAGE MATRIX // 航线与算力节点
        </span>
        <span className="tabular-nums hidden sm:inline">
          {cursorCoord.lat} · {cursorCoord.lon}
        </span>
      </div>

      <div className="relative aspect-[150/62] w-full">
        <svg
          viewBox="0 0 150 65"
          className="h-full w-full block cursor-crosshair"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setIsLocked(false)}
          role="img"
          aria-label="河北工程大学 AI 黑客松航线矩阵地图"
        >
          <defs>
            <radialGradient id="glow-magenta" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ff2d78" stopOpacity="0.34" />
              <stop offset="100%" stopColor="#ff2d78" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="glow-violet" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#8b7bff" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#8b7bff" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Subtle latitude/longitude grid hairlines */}
          {[16.25, 32.5, 48.75].map((y) => (
            <line key={`lat-${y}`} x1="0" y1={y} x2="150" y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="0.18" />
          ))}
          {[30, 60, 90, 120].map((x) => (
            <line key={`lon-${x}`} x1={x} y1="0" x2={x} y2="65" stroke="rgba(255,255,255,0.04)" strokeWidth="0.18" />
          ))}

          {/* Regional density glow halos */}
          <circle cx="120" cy="25" r="17" fill="url(#glow-magenta)" />
          <circle cx="76" cy="18" r="13" fill="url(#glow-violet)" />
          <circle cx="26" cy="23" r="14" fill="url(#glow-violet)" />

          {/* Dot-matrix continents */}
          {landDots.map((dot, idx) => (
            <circle
              key={idx}
              cx={dot.x}
              cy={dot.y}
              r={dot.bright ? 0.36 : 0.3}
              fill={dot.bright ? "rgba(255,255,255,0.34)" : "rgba(255,255,255,0.16)"}
            />
          ))}

          {/* Animated connection arcs shooting from HEU HQ to destination nodes */}
          {VOYAGE_HUBS.slice(1).map((hub, idx) => {
            const mx = (hq.x + hub.x) / 2;
            const arcLift = Math.abs(hub.x - hq.x) * 0.22 + 5;
            const my = Math.min(hq.y, hub.y) - arcLift;
            const d = `M ${hq.x} ${hq.y} Q ${mx} ${Math.max(3, my)} ${hub.x} ${hub.y}`;
            const isActive = activeHub.id === hub.id;
            return (
              <g key={hub.id}>
                <path
                  d={d}
                  fill="none"
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth="0.25"
                />
                <path
                  d={d}
                  pathLength={1}
                  fill="none"
                  stroke={isActive ? "#ff2d78" : "#8b7bff"}
                  strokeWidth={isActive ? "0.52" : "0.34"}
                  className="eco-arc"
                  style={{ animationDelay: `${idx * 0.55}s` }}
                />
              </g>
            );
          })}

          {/* Hub nodes */}
          {VOYAGE_HUBS.map((hub) => {
            const isSelected = hub.id === activeHub.id;
            return (
              <g
                key={hub.id}
                className="cursor-pointer"
                onMouseEnter={() => {
                  setIsLocked(true);
                  setActiveId(hub.id);
                }}
                onClick={() => {
                  setIsLocked(true);
                  setActiveId(hub.id);
                }}
              >
                {/* Invisible hit box for easy hovering */}
                <circle cx={hub.x} cy={hub.y} r="4.5" fill="transparent" />

                {hub.isHq ? (
                  <>
                    <rect
                      x={hub.x - 1.8}
                      y={hub.y - 1.8}
                      width="3.6"
                      height="3.6"
                      fill="none"
                      stroke="#ff2d78"
                      strokeWidth="0.35"
                      className="eco-hq-pulse"
                    />
                    <rect
                      x={hub.x - 1.1}
                      y={hub.y - 1.1}
                      width="2.2"
                      height="2.2"
                      fill="#ff2d78"
                    />
                  </>
                ) : (
                  <>
                    {isSelected && (
                      <circle
                        cx={hub.x}
                        cy={hub.y}
                        r="2.4"
                        fill="none"
                        stroke="#ff2d78"
                        strokeWidth="0.32"
                        className="eco-ring"
                      />
                    )}
                    <circle
                      cx={hub.x}
                      cy={hub.y}
                      r={isSelected ? "1.1" : "0.75"}
                      fill={isSelected ? "#ff2d78" : "#ffffff"}
                    />
                  </>
                )}
              </g>
            );
          })}
        </svg>

        {/* Frosted glass telemetry tooltip anchored safely inside viewport on desktop and mobile */}
        <div
          className="pointer-events-none absolute z-20 transition-all duration-500 ease-out border border-white/20 bg-black/90 backdrop-blur-md px-3 py-2 w-[196px] sm:w-[220px] max-w-[calc(100%-1rem)]"
          style={
            activeHub.x > 96
              ? {
                  right: `${Math.max(3, 100 - (activeHub.x / 150) * 100 + 2)}%`,
                  top: `${Math.min(54, Math.max(6, (activeHub.y / 65) * 100 - 20))}%`,
                }
              : {
                  left: `${Math.min(52, Math.max(3, (activeHub.x / 150) * 100 - 4))}%`,
                  top: `${Math.min(54, Math.max(6, (activeHub.y / 65) * 100 - 20))}%`,
                }
          }
        >
          <div className="flex items-center justify-between gap-2 text-[10px] tracking-widest uppercase text-[#ff2d78]">
            <span>{activeHub.tag}</span>
            <span className="h-1.5 w-1.5 bg-[#ff2d78]" />
          </div>
          <div className="mt-0.5 text-xs font-bold text-white truncate">{activeHub.label}</div>
          <div className="mt-0.5 text-[11px] text-white/65 leading-snug">{activeHub.metric}</div>
        </div>
      </div>

      {/* Interactive quick hub selector strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 px-4 py-2.5 text-[11px] text-white/55">
        <div className="flex flex-wrap items-center gap-1.5">
          {VOYAGE_HUBS.map((hub) => {
            const active = hub.id === activeHub.id;
            return (
              <button
                key={hub.id}
                type="button"
                onClick={() => {
                  setIsLocked(true);
                  setActiveId(hub.id);
                }}
                className={`px-2 py-0.5 border text-[11px] transition-colors cursor-pointer ${
                  active
                    ? "border-[#ff2d78] bg-[#ff2d78]/15 text-white"
                    : "border-white/10 bg-transparent text-white/55 hover:border-white/30 hover:text-white"
                }`}
              >
                {hub.id === "heu" ? "HEU [HQ]" : hub.label.split(" · ")[0]}
              </button>
            );
          })}
        </div>
        <span className="text-white/45 hidden md:inline">悬停或点击节点锁定航线</span>
      </div>
    </div>
  );
}
