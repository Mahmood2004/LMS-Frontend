import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StudentLayout from "./layout";
import DashboardSection from "./sections/DashboardSection";
import CoursesSection from "./sections/CoursesSection";
import AssignmentsSection from "./sections/AssignmentsSection";
import AssistantSection from "./sections/AssistantSection";
import NotificationsSection from "./sections/NotificationsSection";
import ProfileSection from "./sections/ProfileSection";

const StudentDashboard = () => {
  const [activeSection, setActiveSection] = useState("dashboard");

  const navigate = (section: string) => {
    setActiveSection(section);
  };

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardSection onNavigate={navigate} />;
      case "courses":
        return <CoursesSection />;
      case "assignments":
        return <AssignmentsSection />;
      case "assistant":
        return <AssistantSection />;
      case "notifications":
        return <NotificationsSection />;
      case "profile":
        return <ProfileSection />;
      default:
        return null;
    }
  };

  return (
    <StudentLayout activeSection={activeSection} onNavigate={navigate}>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25 }}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </StudentLayout>
  );
};

export default StudentDashboard;
