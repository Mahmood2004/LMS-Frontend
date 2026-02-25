import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { stats, courses, notificationsData } from "../data/mockData";

interface DashboardSectionProps {
  onNavigate: (section: string) => void;
}

const DashboardSection = ({ onNavigate }: DashboardSectionProps) => (
  <>
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold font-display text-foreground">
        Welcome back, <span className="text-gradient">Alex</span> 👋
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
        {courses.map((course, i) => (
          <motion.div
            key={course.id}
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
                {course.name}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {course.instructor}
              </div>
              <div className="mt-2 w-full h-1.5 rounded-full bg-secondary overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${course.progress}%` }}
                  transition={{
                    delay: 0.4 + i * 0.1,
                    duration: 0.6,
                    ease: "easeOut",
                  }}
                  className="h-full rounded-full bg-hero-gradient"
                />
              </div>
            </div>
            <span className="text-sm font-semibold text-primary shrink-0">
              {course.progress}%
            </span>
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
        {notificationsData.slice(0, 3).map((n) => (
          <div
            key={n.id}
            className="p-4 rounded-lg bg-card border border-border flex items-start gap-3"
          >
            <div
              className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!n.read ? "bg-primary" : "bg-muted-foreground/30"}`}
            />
            <div>
              <p className="text-sm font-medium text-foreground">{n.title}</p>
              <p className="text-xs text-muted-foreground">{n.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </>
);

export default DashboardSection;
