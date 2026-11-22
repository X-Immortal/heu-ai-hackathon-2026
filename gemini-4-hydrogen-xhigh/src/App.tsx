import { useState } from "react";
import { MotionConfig } from "motion/react";
import { Navbar } from "./components/Navbar";
import { HeroSection } from "./components/HeroSection";
import { PipelineSection } from "./components/PipelineSection";
import { TracksSection } from "./components/TracksSection";
import { RewardsSection } from "./components/RewardsSection";
import { ScheduleSection } from "./components/ScheduleSection";
import { JudgingSection } from "./components/JudgingSection";
import { ChecklistSection } from "./components/ChecklistSection";
import { FooterSection } from "./components/FooterSection";
import { RegistrationModal } from "./components/RegistrationModal";
import { AnnouncementToast } from "./components/AnnouncementToast";

export default function App() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-black text-white selection:bg-[#ff2d78]/30 selection:text-white">
        <Navbar onOpenModal={() => setModalOpen(true)} />
        <main>
          <HeroSection onOpenModal={() => setModalOpen(true)} />
          <PipelineSection />
          <TracksSection />
          <RewardsSection />
          <ScheduleSection />
          <JudgingSection />
          <ChecklistSection />
          <FooterSection onOpenModal={() => setModalOpen(true)} />
        </main>
        <AnnouncementToast onOpenModal={() => setModalOpen(true)} />
        <RegistrationModal open={modalOpen} onClose={() => setModalOpen(false)} />
      </div>
    </MotionConfig>
  );
}
