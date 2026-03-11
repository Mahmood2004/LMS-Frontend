import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Calendar, ClipboardCheck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import studentProfileService from "@/services/student/profileService";
import courseService from "@/services/student/courseService";
import assignmentService from "@/services/student/assignmentService";
import StudentNotificationServices, {
  GetNotificationsResponse,
  Notification,
} from "@/services/student/notificationService";

interface DashboardSectionProps {
  onNavigate: (section: string) => void;
}

const DashboardSection = ({ onNavigate }: DashboardSectionProps) => {
  const [profile, setProfile] = useState<{ full_name?: string } | null>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [pendingAssignments, setPendingAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const profileData = await studentProfileService.getProfile();
        const coursesData = await courseService.getMyCourses();
        const attendanceData = await courseService.getMyAttendance();
        const assignmentsData = await assignmentService.getPendingAssignments();

        setProfile(profileData);
        setCourses(coursesData);
        setAttendance(attendanceData);
        setPendingAssignments(assignmentsData);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const res: GetNotificationsResponse =
          await StudentNotificationServices.getMyNotifications();
        setNotifications(res.notifications);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }
    }

    fetchNotifications();
  }, []);

  const totalCourses = courses.length;
  const latestCourses = [...courses]
    .sort(
      (a, b) =>
        new Date(b.enrolled_at).getTime() - new Date(a.enrolled_at).getTime(),
    )
    .slice(0, 3);
  const avgAttendance =
    attendance.length === 0
      ? 0
      : Math.round(
          attendance.reduce(
            (sum, course) => sum + course.attendance_percentage,
            0,
          ) / attendance.length,
        );

  const pendingAssignmentsCount = pendingAssignments.reduce((total, course) => {
    const notOverdue = course.pending_assignments.filter(
      (a: any) => !a.due_date || new Date(a.due_date) >= new Date(),
    );
    return total + notOverdue.length;
  }, 0);

  const stats = [
    {
      label: "Enrolled Courses",
      value: totalCourses,
      icon: BookOpen,
      color: "text-primary",
    },
    {
      label: "Attendance",
      value: `${avgAttendance}%`,
      icon: Calendar,
      color: "text-muted-foreground",
    },
    {
      label: "Assignments Pending",
      value: pendingAssignmentsCount,
      icon: ClipboardCheck,
      color: "text-primary",
    },
  ];

  if (loading) {
    return (
      <div className="py-16 text-center text-muted-foreground">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <>
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-display text-foreground">
          Welcome back,{" "}
          <span className="text-gradient">
            {loading ? "..." : profile?.full_name || "Student"}
          </span>{" "}
          👋
        </h1>
        <p className="mt-1 text-muted-foreground">
          Here's your learning overview for today.
        </p>
      </div>
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            whileHover={{ y: -3, transition: { duration: 0.15 } }}
            className="p-4 sm:p-5 rounded-xl bg-card border border-border shadow-card cursor-default"
          >
            <stat.icon className={`w-5 h-5 ${stat.color} mb-3`} />
            <div className="text-xl sm:text-2xl font-bold font-display text-foreground">
              {stat.value}
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground mt-1">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold font-display text-foreground">
            Active Courses
          </h2>
          <button
            onClick={() => onNavigate("courses")}
            className="text-sm text-primary hover:underline"
          >
            View all →
          </button>
        </div>
        <div className="space-y-3">
          {latestCourses.map((course, i) => (
            <motion.div
              key={course.courses.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.06 }}
              whileHover={{ y: -2 }}
              className="p-4 sm:p-5 rounded-xl bg-card border border-border shadow-card flex items-center gap-3 sm:gap-4 hover:shadow-elevated transition-shadow"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-hero-gradient flex items-center justify-center shrink-0">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-foreground text-sm sm:text-base truncate">
                  {course.courses.title}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {course.courses.users?.profiles?.full_name || "Instructor"}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold font-display text-foreground">
            Recent Notifications
          </h2>
          <button
            onClick={() => onNavigate("notifications")}
            className="text-sm text-primary hover:underline"
          >
            View all →
          </button>
        </div>
        <div className="space-y-2">
          {notifications
            .sort(
              (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime(),
            )
            .slice(0, 3)
            .map((n) => (
              <div
                key={n.id}
                className="p-4 rounded-lg bg-card border border-border flex items-start gap-3"
              >
                <div
                  className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!n.is_read ? "bg-primary" : "bg-muted-foreground/30"}`}
                />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {n.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(n.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};
export default DashboardSection;
