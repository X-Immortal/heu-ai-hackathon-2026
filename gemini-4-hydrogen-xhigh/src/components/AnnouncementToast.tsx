import { useEffect, useState } from "react";
import { ArrowRight, X } from "lucide-react";

interface AnnouncementToastProps {
  onOpenModal: () => void;
}

export function AnnouncementToast({ onOpenModal }: AnnouncementToastProps) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (!dismissed && window.scrollY > 420) {
        setVisible(true);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [dismissed]);

  if (!visible || dismissed) return null;

  return (
    <aside
      aria-label="赛事提交提醒"
      className="announce-in fixed bottom-4 right-4 z-40 w-[18.5rem] max-w-[calc(100vw-2rem)] border border-[#ff2d78]/60 bg-black/95 backdrop-blur-md p-3.5 shadow-2xl"
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-[10px] uppercase tracking-widest text-[#ff2d78] font-bold">
          11.23—11.30 · 线上提交进行中
        </span>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="关闭通知"
          className="text-white/50 hover:text-white cursor-pointer"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="mt-1.5 text-sm font-bold text-white">2026 河工程 AI 黑客松</div>
      <p className="mt-1 text-xs text-white/65 leading-relaxed">
        OpenDev 最高 $500 算力 + ¥1,200 一等奖，12.06 现场点评开奖。
      </p>

      <div className="mt-3.5 flex items-center gap-2">
        <button
          type="button"
          onClick={onOpenModal}
          className="inline-flex flex-1 items-center justify-center gap-1.5 border border-white bg-white px-3 py-2 text-xs font-bold text-black hover:bg-neutral-100 cursor-pointer"
        >
          立即报名
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
        <a
          href="#checklist"
          className="inline-flex items-center justify-center border border-white/20 px-3 py-2 text-xs text-white hover:border-white"
        >
          自检清单
        </a>
      </div>
    </aside>
  );
}
