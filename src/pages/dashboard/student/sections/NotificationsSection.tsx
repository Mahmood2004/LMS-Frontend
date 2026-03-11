import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ClipboardCheck, Award, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import StudentNotificationServices, {
  Notification,
} from "@/services/student/notificationService";

const NotificationsSection = () => {
  const [filter, setFilter] = useState<
    "all" | "assignment" | "feedback" | "announcement"
  >("all");

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  const typeColor: Record<string, string> = {
    assignment: "border-l-amber-400",
    feedback: "border-l-emerald-400",
    announcement: "border-l-primary",
  };
  const typeIcon: Record<string, React.ReactNode> = {
    assignment: <ClipboardCheck className="w-4 h-4 text-amber-500" />,
    feedback: <Award className="w-4 h-4 text-emerald-500" />,
    announcement: <Bell className="w-4 h-4 text-primary" />,
  };

  const markAllRead = async () => {
    try {
      const unreadNotifications = notifications.filter((n) => !n.is_read);
      for (const n of unreadNotifications) {
        await StudentNotificationServices.markAsRead(n.id);
      }
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const markAsRead = async (notification: Notification) => {
    if (notification.is_read) return;
    try {
      await StudentNotificationServices.markAsRead(notification.id);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notification.id ? { ...n, is_read: true } : n,
        ),
      );
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const res = await StudentNotificationServices.getMyNotifications();
        setNotifications(res.notifications);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const filtered =
    filter === "all"
      ? notifications
      : notifications.filter((n) => n.reference_type === filter);

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
        {(["all", "announcement", "assignment", "feedback"] as const).map(
          (t) => (
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
          ),
        )}
      </div>

      <div className="mt-6 space-y-3">
        {loading ? (
          <div className="py-16 text-center text-muted-foreground">
            <ClipboardCheck className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>Loading notifications...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground">
            <ClipboardCheck className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No notifications found.</p>
          </div>
        ) : (
          filtered
            .sort(
              (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime(),
            )
            .map((n) => (
              <motion.div
                key={n.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`p-4 rounded-xl bg-card border border-border shadow-card border-l-4 ${typeColor[n.reference_type]} flex items-start gap-3 sm:gap-4 cursor-pointer hover:shadow-elevated transition-shadow`}
                onClick={() => markAsRead(n)}
              >
                <div className="mt-0.5 shrink-0">
                  {typeIcon[n.reference_type]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-foreground">
                      {n.title}
                    </p>
                    {!n.is_read && (
                      <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {n.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(n.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </motion.div>
            ))
        )}
      </div>
    </>
  );
};

export default NotificationsSection;
