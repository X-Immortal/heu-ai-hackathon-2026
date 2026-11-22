import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Copy, X } from "lucide-react";
import { TRACKS } from "../data/hackathonData";

interface RegistrationModalProps {
  open: boolean;
  onClose: () => void;
}

export function RegistrationModal({ open, onClose }: RegistrationModalProps) {
  const [teamName, setTeamName] = useState("");
  const [trackId, setTrackId] = useState(TRACKS[0].id);
  const [members, setMembers] = useState("1");
  const [problem, setProblem] = useState("");
  const [copied, setCopied] = useState(false);

  const selectedTrack = TRACKS.find((t) => t.id === trackId) ?? TRACKS[0];

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const handleCopyBrief = async () => {
    const summary = [
      `【2026 河工程 AI 黑客松 · 组队申报备忘】`,
      `队名：${teamName.trim() || "待定"}`,
      `主赛道：${selectedTrack.name}`,
      `人数：${members} 人（1–5人）`,
      `拟解决真问题：${problem.trim() || "待补充"}`,
      `提交窗口：2026.11.23 — 11.30（同步提交连尚孵化器申请表）`,
    ].join("\n");

    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="reg-modal-title"
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg border border-white/25 bg-[#050409] p-6 sm:p-8 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <div className="text-[11px] uppercase tracking-widest text-[#ff2d78]">
                  // OFFICIAL CHANNEL & TEAM MEMO
                </div>
                <h3 id="reg-modal-title" className="mt-1 text-xl font-bold text-white">报名指引与组队备忘生成</h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="关闭弹窗"
                className="border border-white/15 p-1.5 text-white/60 hover:border-white hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 border-l-2 border-[#ff2d78] bg-[#ff2d78]/[0.06] px-3.5 py-2.5 text-xs text-neutral-200 leading-relaxed">
              报名通道与宣讲场地以<strong>河北工程大学计算机协会</strong>正式通知、海报与官方大群为准。报名免收费用，须填报真实姓名、学院与联系方式。
            </div>

            {/* Interactive local team memo card builder */}
            <div className="mt-5 space-y-3.5 text-xs">
              <div>
                <label className="block text-white/55 mb-1.5">主赛道选择（仅限 1 条）</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {TRACKS.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTrackId(t.id)}
                      className={`border py-2 px-2 text-center font-bold transition-colors cursor-pointer ${
                        trackId === t.id
                          ? "border-[#ff2d78] bg-[#ff2d78]/15 text-white"
                          : "border-white/15 bg-black text-white/60 hover:text-white"
                      }`}
                    >
                      {t.name.replace("AI × ", "")}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/55 mb-1.5">队伍名称（选填）</label>
                  <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="如：HEU远航队"
                    className="w-full border border-white/15 bg-black px-3 py-2 text-white placeholder:text-white/30 focus:border-[#ff2d78] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-white/55 mb-1.5">队员规模</label>
                  <select
                    value={members}
                    onChange={(e) => setMembers(e.target.value)}
                    className="w-full border border-white/15 bg-black px-3 py-2 text-white focus:border-[#ff2d78] focus:outline-none"
                  >
                    {["1", "2", "3", "4", "5"].map((n) => (
                      <option key={n} value={n}>
                        {n} 人 {n === "1" ? "(单人参赛)" : "(混合组队)"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-white/55 mb-1.5">发现的真实问题（一句话备忘）</label>
                <input
                  type="text"
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  placeholder="何人在何种情形下遇到什么障碍..."
                  className="w-full border border-white/15 bg-black px-3 py-2 text-white placeholder:text-white/30 focus:border-[#ff2d78] focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
              <button
                type="button"
                onClick={handleCopyBrief}
                className="inline-flex items-center gap-2 border border-white bg-white px-4 py-2.5 text-xs font-bold text-black hover:bg-neutral-100 cursor-pointer"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "已复制组队备忘" : "复制组队申报备忘"}
              </button>
              <a
                href="#checklist"
                onClick={onClose}
                className="border border-white/20 px-4 py-2.5 text-xs text-white hover:border-white"
              >
                前往 8 项提交自检 →
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
