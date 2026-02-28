import { useState } from "react";
import { motion } from "framer-motion";
import { ClipboardCheck, Award, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { notificationsData as initialNotifications } from "../data/mockData";

interface NotificationsSectionProps {
  notifications: typeof initialNotifications;
  setNotifications: React.Dispatch<
    React.SetStateAction<typeof initialNotifications>
  >;
}

const NotificationsSection = ({
  notifications,
  setNotifications,
}: NotificationsSectionProps) => {
  const [filter, setFilter] = useState<
    "all" | "assignment" | "grade" | "announcement"
  >("all");

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const filtered =
    filter === "all"
      ? notifications
      : notifications.filter((n) => n.type === filter);

  const typeColor: Record<string, string> = {
    assignment: "border-l-amber-400",
    grade: "border-l-emerald-400",
    announcement: "border-l-primary",
  };
  const typeIcon: Record<string, React.ReactNode> = {
    assignment: <ClipboardCheck className="w-4 h-4 text-amber-500" />,
    grade: <Award className="w-4 h-4 text-emerald-500" />,
    announcement: <Bell className="w-4 h-4 text-primary" />,
  };

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-foreground">
            <span className="text-gradient">Notifications</span>
          </h1>
          <p className="mt-1 text-muted-foreground">
            Stay updated with your courses.
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={markAllRead}
          className="text-primary"
        >
          Mark all as read
        </Button>
      </div>

      {/* Filter tabs */}
      <div className="mt-6 flex gap-2 flex-wrap">
        {(["all", "assignment", "grade", "announcement"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-3 sm:px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
              filter === t
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-3">
        {filtered.map((n) => (
          <motion.div
            key={n.id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`p-4 rounded-xl bg-card border border-border shadow-card border-l-4 ${typeColor[n.type]} flex items-start gap-3 sm:gap-4 cursor-pointer hover:shadow-elevated transition-shadow`}
            onClick={() =>
              setNotifications((prev) =>
                prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)),
              )
            }
          >
            <div className="mt-0.5 shrink-0">{typeIcon[n.type]}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-semibold text-foreground">
                  {n.title}
                </p>
                {!n.read && (
                  <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">{n.body}</p>
              <p className="text-xs text-muted-foreground mt-1">{n.time}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
};

export default NotificationsSection;
