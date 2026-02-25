import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import InstructorLayout from "./layout";
import CoursesSection from "./sections/CoursesSection";
import AttendanceSection from "./sections/AttendanceSection";
import AssignmentsSection from "./sections/AssignmentsSection";
import FeedbackSection from "./sections/FeedbackSection";
import StudentsSection from "./sections/StudentsSection";
import ProfileSection from "./sections/ProfileSection";

const InstructorDashboard = () => {
  const [activeSection, setActiveSection] = useState("courses");

  const navigate = (section: string) => {
    setActiveSection(section);
  };

  const renderContent = () => {
    switch (activeSection) {
      case "courses":
        return <CoursesSection />;
      case "attendance":
        return <AttendanceSection />;
      case "assignments":
        return <AssignmentsSection />;
      case "feedback":
        return <FeedbackSection />;
      case "students":
        return <StudentsSection />;
      case "profile":
        return <ProfileSection />;
      default:
        return null;
    }
  };

  return (
    <InstructorLayout activeSection={activeSection} onNavigate={navigate}>
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
    </InstructorLayout>
  );
};

export default InstructorDashboard;
