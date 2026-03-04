import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import InstructorLayout from "./layout";
import CoursesSection from "./sections/CoursesSection";
import AttendanceSection from "./sections/AttendanceSection";
import AssignmentsSection from "./sections/AssignmentsSection";
import FeedbackSection from "./sections/FeedbackSection";
import StudentsSection from "./sections/StudentsSection";
import ProfileSection from "./sections/ProfileSection";
import { useParams, useNavigate as useRouterNavigate } from "react-router-dom";

const InstructorDashboard = () => {
  const params = useParams<{ section?: string }>();
  const navigateRouter = useRouterNavigate();

  const validSections = [
    "courses",
    "attendance",
    "assignments",
    "feedback",
    "students",
    "profile",
  ] as const;

  type Section = (typeof validSections)[number];

  const initialSection: Section = validSections.includes(
    params.section as Section,
  )
    ? (params.section as Section)
    : "courses";

  const [activeSection, setActiveSection] = useState<Section>(initialSection);

  const [preselectedCourseId, setPreselectedCourseId] = useState<
    number | undefined
  >(undefined);

  const [preselectedAssignmentType, setPreselectedAssignmentType] = useState<
    "assignment" | "project"
  >("assignment");

  const navigate = (
    section: Section,
    options?: { courseId?: number; assignmentType?: "assignment" | "project" },
  ) => {
    setActiveSection(section);
    navigateRouter(`/dashboard/instructor/${section}`);

    if (options?.courseId !== undefined)
      setPreselectedCourseId(options.courseId);
    else setPreselectedCourseId(undefined);

    if (options?.assignmentType)
      setPreselectedAssignmentType(options.assignmentType);
    else setPreselectedAssignmentType("assignment");
  };

  const renderContent = () => {
    switch (activeSection) {
      case "courses":
        return <CoursesSection onQuickAction={navigate} />;
      case "attendance":
        return <AttendanceSection selectedCourseId={preselectedCourseId} />;
      case "assignments":
        return (
          <AssignmentsSection
            preselectedCourseId={preselectedCourseId}
            preselectedType={preselectedAssignmentType}
          />
        );
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
