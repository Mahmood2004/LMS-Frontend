import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StudentLayout from "./layout";
import DashboardSection from "./sections/DashboardSection";
import CoursesSection from "./sections/CoursesSection";
import AssignmentsSection from "./sections/AssignmentsSection";
import AssistantSection from "./sections/AssistantSection";
import NotificationsSection from "./sections/NotificationsSection";
import ProfileSection from "./sections/ProfileSection";
import StudentNotificationServices, {
  GetNotificationsResponse,
  Notification,
} from "@/services/student/notificationService";
import { useParams, useNavigate as useRouterNavigate } from "react-router-dom";

const StudentDashboard = () => {
  const params = useParams<{ section?: string }>();
  const navigate = useRouterNavigate();

  const validSections = [
    "dashboard",
    "courses",
    "assignments",
    "assistant",
    "notifications",
    "profile",
  ] as const;

  type Section = (typeof validSections)[number];

  const initialSection: Section = validSections.includes(
    params.section as Section,
  )
    ? (params.section as Section)
    : "dashboard";

  const [activeSection, setActiveSection] = useState<Section>(initialSection);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const response: GetNotificationsResponse =
          await StudentNotificationServices.getMyNotifications();
        setNotifications(response.notifications);
        setUnreadCount(response.unreadCount);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }
    }

    fetchNotifications();
  }, []);

  const handleNavigate = (section: Section) => {
    setActiveSection(section);
    navigate(`/dashboard/student/${section}`);
  };

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardSection onNavigate={handleNavigate} />;
      case "courses":
        return <CoursesSection />;
      case "assignments":
        return <AssignmentsSection />;
      case "assistant":
        return <AssistantSection />;
      case "notifications":
        return (
          <NotificationsSection
           
          />
        );
      case "profile":
        return <ProfileSection />;
      default:
        return null;
    }
  };

  return (
    <StudentLayout
      activeSection={activeSection}
      onNavigate={handleNavigate}
      unreadCount={unreadCount}
    >
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
