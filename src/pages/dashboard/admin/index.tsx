import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AdminLayout from "./layout";

import InstructorsSection from "./sections/InstructorsSection";
import StudentsSection from "./sections/StudentsSection";
import SkillsSection from "./sections/SkillsSection";

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState<
    "instructors" | "students" | "skills"
  >("instructors");

  const navigate = (section: "instructors" | "students" | "skills") => {
    setActiveSection(section);
  };

  const renderContent = () => {
    switch (activeSection) {
      case "instructors":
        return <InstructorsSection />;
      case "students":
        return <StudentsSection />;
      case "skills":
        return <SkillsSection />;
      default:
        return null;
    }
  };

  return (
    <AdminLayout activeSection={activeSection} onNavigate={navigate}>
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
    </AdminLayout>
  );
};

export default AdminDashboard;
