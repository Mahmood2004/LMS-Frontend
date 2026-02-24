import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  BookOpen,
  ClipboardCheck,
  Bell,
  User,
  LogOut,
  BarChart3,
  Calendar,
  Send,
  FileText,
  Video,
  File,
  Upload,
  Star,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Clock,
  Award,
  X,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const stats = [
  {
    label: "Enrolled Courses",
    value: "6",
    icon: BookOpen,
    color: "text-primary",
  },
  {
    label: "Avg. Grade",
    value: "A-",
    icon: Award,
    color: "text-accent-foreground",
  },
  {
    label: "Assignments Due",
    value: "3",
    icon: ClipboardCheck,
    color: "text-primary",
  },
  {
    label: "Attendance",
    value: "94%",
    icon: Calendar,
    color: "text-muted-foreground",
  },
];

const courses = [
  {
    id: 1,
    name: "Advanced React Patterns",
    instructor: "Dr. Sarah Chen",
    progress: 72,
    modules: [
      {
        title: "Week 1: Component Architecture",
        type: "pdf",
        desc: "Slides covering compound components and render props.",
      },
      {
        title: "Week 2: State Management Deep Dive",
        type: "video",
        desc: "3-hour video lecture on Zustand, Jotai & Redux Toolkit.",
      },
      {
        title: "Week 3: Performance Optimization",
        type: "pdf",
        desc: "PDF guide on memoization, lazy loading and Profiler API.",
      },
    ],
  },
  {
    id: 2,
    name: "Machine Learning Fundamentals",
    instructor: "Prof. James Okafor",
    progress: 45,
    modules: [
      {
        title: "Week 1: Linear Algebra Refresher",
        type: "pdf",
        desc: "Core matrix operations for ML practitioners.",
      },
      {
        title: "Week 2: Supervised Learning",
        type: "video",
        desc: "Walkthrough of regression and classification algorithms.",
      },
    ],
  },
  {
    id: 3,
    name: "System Design Architecture",
    instructor: "Dr. Maria Gonzalez",
    progress: 88,
    modules: [
      {
        title: "Week 1: CAP Theorem & Trade-offs",
        type: "pdf",
        desc: "Distributed systems fundamentals.",
      },
      {
        title: "Week 2: Load Balancing Strategies",
        type: "video",
        desc: "Deep dive into horizontal scaling patterns.",
      },
      {
        title: "Week 3: Database Sharding",
        type: "file",
        desc: "Reference guide on database partitioning strategies.",
      },
    ],
  },
];

type AssignmentStatus = "pending" | "submitted" | "graded";
const assignmentsData: {
  id: number;
  title: string;
  course: string;
  due: string;
  status: AssignmentStatus;
  type: "assignment" | "project";
  grade?: string;
  rating?: number;
  feedback?: string;
}[] = [
  {
    id: 1,
    title: "React Hooks Deep Dive",
    course: "Advanced React Patterns",
    due: "Feb 22, 2026",
    status: "pending",
    type: "assignment",
  },
  {
    id: 2,
    title: "Neural Network Lab",
    course: "Machine Learning Fundamentals",
    due: "Feb 25, 2026",
    status: "pending",
    type: "assignment",
  },
  {
    id: 3,
    title: "Microservices Design Doc",
    course: "System Design Architecture",
    due: "Feb 20, 2026",
    status: "submitted",
    type: "project",
  },
  {
    id: 4,
    title: "State Management Essay",
    course: "Advanced React Patterns",
    due: "Feb 15, 2026",
    status: "graded",
    type: "assignment",
    grade: "A",
    rating: 5,
    feedback:
      "Excellent analysis of state management patterns. Very well-structured argument.",
  },
  {
    id: 5,
    title: "ML Capstone Project",
    course: "Machine Learning Fundamentals",
    due: "Feb 10, 2026",
    status: "graded",
    type: "project",
    grade: "B+",
    rating: 4,
    feedback:
      "Good implementation. Could improve model accuracy with better feature engineering.",
  },
];

type Notification = {
  id: number;
  title: string;
  body: string;
  time: string;
  type: "assignment" | "grade" | "announcement";
  read: boolean;
};
const notificationsData: Notification[] = [
  {
    id: 1,
    title: "New Assignment Posted",
    body: "React Hooks Deep Dive is due Feb 22.",
    time: "2 hours ago",
    type: "assignment",
    read: false,
  },
  {
    id: 2,
    title: "Assignment Graded",
    body: "Your State Management Essay received an A.",
    time: "1 day ago",
    type: "grade",
    read: false,
  },
  {
    id: 3,
    title: "Instructor Announcement",
    body: "Office hours moved to Thursday 2–4pm.",
    time: "2 days ago",
    type: "announcement",
    read: true,
  },
  {
    id: 4,
    title: "Project Deadline Extended",
    body: "System Design final project now due March 5.",
    time: "3 days ago",
    type: "announcement",
    read: true,
  },
];

const navItems = [
  { icon: BarChart3, label: "Dashboard", id: "dashboard" },
  { icon: BookOpen, label: "My Courses", id: "courses" },
  { icon: ClipboardCheck, label: "Assignments", id: "assignments" },
  { icon: Brain, label: "AI Assistant", id: "assistant" },
  { icon: Bell, label: "Notifications", id: "notifications" },
  { icon: User, label: "Profile & CV", id: "profile" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

const ModuleIcon = ({ type }: { type: string }) => {
  if (type === "video") return <Video className="w-4 h-4 text-primary" />;
  if (type === "pdf") return <FileText className="w-4 h-4 text-amber-500" />;
  return <File className="w-4 h-4 text-muted-foreground" />;
};

const StarDisplay = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        className={`w-4 h-4 ${s <= rating ? "fill-amber-400 text-amber-400" : "text-muted"}`}
      />
    ))}
  </div>
);

const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, string> = {
    pending:
      "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400",
    submitted: "bg-primary/10 text-primary border-primary/20",
    graded:
      "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400",
  };
  const icons: Record<string, React.ReactNode> = {
    pending: <Clock className="w-3 h-3" />,
    submitted: <CheckCircle2 className="w-3 h-3" />,
    graded: <Award className="w-3 h-3" />,
  };
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border ${map[status] ?? ""}`}
    >
      {icons[status]}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// ─── Section: Dashboard ───────────────────────────────────────────────────────

const DashboardSection = ({
  onNavigate,
}: {
  onNavigate: (s: string) => void;
}) => (
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

// ─── Section: My Courses ──────────────────────────────────────────────────────

const CoursesSection = () => {
  const { toast } = useToast();
  const [expandedCourse, setExpandedCourse] = useState<number | null>(null);
  const [viewingModule, setViewingModule] = useState<{
    title: string;
    desc: string;
  } | null>(null);

  return (
    <>
      <h1 className="text-2xl sm:text-3xl font-bold font-display text-foreground">
        My <span className="text-gradient">Courses</span>
      </h1>
      <p className="mt-1 text-muted-foreground">
        Browse your enrolled courses and study materials.
      </p>
      <div className="mt-6 sm:mt-8 space-y-4">
        {courses.map((course) => (
          <motion.div
            key={course.id}
            whileHover={{ y: -2 }}
            className="rounded-xl bg-card border border-border shadow-card overflow-hidden"
          >
            <button
              onClick={() =>
                setExpandedCourse(
                  expandedCourse === course.id ? null : course.id,
                )
              }
              className="w-full p-4 sm:p-6 flex items-center gap-3 sm:gap-4 text-left hover:bg-accent/30 transition-colors"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-hero-gradient flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base sm:text-lg font-semibold font-display text-foreground">
                  {course.name}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Instructor: {course.instructor}
                </p>
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full rounded-full bg-hero-gradient"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-primary">
                    {course.progress}%
                  </span>
                </div>
              </div>
              {expandedCourse === course.id ? (
                <ChevronUp className="w-5 h-5 text-muted-foreground shrink-0" />
              ) : (
                <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />
              )}
            </button>
            <AnimatePresence>
              {expandedCourse === course.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden border-t border-border"
                >
                  <div className="p-4 sm:p-6 space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                      Course Modules
                    </p>
                    {course.modules.map((mod, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-accent/50 transition-colors group"
                      >
                        <ModuleIcon type={mod.type} />
                        <span className="flex-1 text-sm text-foreground">
                          {mod.title}
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity text-primary hover:text-primary text-xs sm:text-sm"
                          onClick={() => setViewingModule(mod)}
                        >
                          View
                        </Button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Module Detail Modal */}
      <AnimatePresence>
        {viewingModule && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm p-4"
            onClick={() => setViewingModule(null)}
          >
            <motion.div
              initial={{ scale: 0.93, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.93, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card border border-border rounded-2xl shadow-elevated p-6 sm:p-8 max-w-md w-full"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold font-display text-foreground pr-4">
                  {viewingModule.title}
                </h3>
                <button
                  onClick={() => setViewingModule(null)}
                  className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {viewingModule.desc}
              </p>
              <div className="mt-6 p-4 rounded-xl bg-accent/50 border border-border text-center text-sm text-muted-foreground">
                📄 Content preview would appear here in the live version.
              </div>
              <Button
                variant="hero"
                className="w-full mt-4"
                onClick={() => {
                  toast({
                    title: "Opening content",
                    description: `Loading: ${viewingModule.title}`,
                  });
                  setViewingModule(null);
                }}
              >
                Open Full Content
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// ─── Section: Assignments ─────────────────────────────────────────────────────

const AssignmentsSection = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"assignment" | "project">(
    "assignment",
  );
  const [submitting, setSubmitting] = useState<number | null>(null);
  const [submitText, setSubmitText] = useState("");
  const [dragging, setDragging] = useState(false);
  const [submittedIds, setSubmittedIds] = useState<number[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const items = assignmentsData.filter((a) => a.type === activeTab);

  const handleSubmit = (id: number) => {
    setSubmittedIds((prev) => [...prev, id]);
    setSubmitting(null);
    setSubmitText("");
    toast({
      title: "Submitted!",
      description: "Your work has been submitted successfully.",
    });
  };

  return (
    <>
      <h1 className="text-2xl sm:text-3xl font-bold font-display text-foreground">
        Assignments <span className="text-gradient">& Projects</span>
      </h1>
      <p className="mt-1 text-muted-foreground">
        Submit your work and track your grades.
      </p>

      {/* Tabs */}
      <div className="mt-6 flex gap-2 p-1 bg-secondary rounded-xl w-fit">
        {(["assignment", "project"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 sm:px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab
                ? "bg-card text-foreground shadow-card"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab === "assignment" ? "Assignments" : "Projects"}
          </button>
        ))}
      </div>

      {/* Hidden file input for dropzone */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,.zip"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) toast({ title: "File selected", description: file.name });
        }}
      />

      <div className="mt-6 space-y-4">
        {items.length === 0 && (
          <div className="py-16 text-center text-muted-foreground">
            <ClipboardCheck className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>Nothing here yet.</p>
          </div>
        )}
        {items.map((a) => {
          const isLocallySubmitted = submittedIds.includes(a.id);
          const effectiveStatus: AssignmentStatus = isLocallySubmitted
            ? "submitted"
            : a.status;
          return (
            <motion.div
              key={a.id}
              layout
              className="rounded-xl bg-card border border-border shadow-card overflow-hidden"
            >
              <div className="p-4 sm:p-5 flex flex-wrap items-start gap-3 sm:gap-4">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-foreground">{a.title}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {a.course}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Due {a.due}
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                  <StatusBadge status={effectiveStatus} />
                  {effectiveStatus === "pending" && (
                    <Button
                      size="sm"
                      variant="hero"
                      onClick={() =>
                        setSubmitting(submitting === a.id ? null : a.id)
                      }
                    >
                      Submit
                    </Button>
                  )}
                </div>
              </div>

              {/* Inline submission form */}
              <AnimatePresence>
                {submitting === a.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden border-t border-border"
                  >
                    <div className="p-4 sm:p-6 space-y-4 bg-accent/20">
                      {/* Dropzone */}
                      <div
                        onDragOver={(e) => {
                          e.preventDefault();
                          setDragging(true);
                        }}
                        onDragLeave={() => setDragging(false)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setDragging(false);
                          const file = e.dataTransfer.files[0];
                          if (file)
                            toast({
                              title: "File attached",
                              description: file.name,
                            });
                        }}
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-xl p-6 sm:p-8 text-center transition-colors cursor-pointer ${
                          dragging
                            ? "border-primary bg-accent/50"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm font-medium text-foreground">
                          Drop your file here or{" "}
                          <span className="text-primary">browse</span>
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          PDF, DOCX, ZIP up to 20MB
                        </p>
                      </div>
                      {/* Text area */}
                      <Textarea
                        placeholder="Add a note or description for your submission..."
                        value={submitText}
                        onChange={(e) => setSubmitText(e.target.value)}
                        className="min-h-[80px]"
                      />
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSubmitting(null)}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="hero"
                          size="sm"
                          onClick={() => handleSubmit(a.id)}
                        >
                          <Send className="w-3.5 h-3.5 mr-1.5" /> Submit
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Graded feedback */}
              {effectiveStatus === "graded" && (
                <div className="p-4 sm:p-5 border-t border-border bg-emerald-50/50">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-2xl font-bold font-display text-emerald-600">
                      {a.grade}
                    </span>
                    <StarDisplay rating={a.rating ?? 0} />
                  </div>
                  <p className="text-sm text-muted-foreground italic">
                    "{a.feedback}"
                  </p>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </>
  );
};

// ─── Section: AI Assistant ────────────────────────────────────────────────────

type ChatMsg = { role: "user" | "bot"; text: string };

const botReplies = [
  "Great question! Based on your course material, I'd suggest reviewing the week 2 lecture notes first.",
  "This is covered in the System Design module on CAP theorem. Want me to summarise the key points?",
  "The React Hooks deep dive covers this pattern extensively — specifically the useCallback and useMemo sections.",
  "I'd recommend cross-referencing the ML Fundamentals slides with Andrew Ng's notes on gradient descent.",
];

const AssistantSection = () => {
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      role: "bot",
      text: "Hi! I'm your course AI assistant. Ask me anything about your enrolled courses.",
    },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(courses[0].name);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  const send = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setThinking(true);
    setTimeout(() => {
      setThinking(false);
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: botReplies[Math.floor(Math.random() * botReplies.length)],
        },
      ]);
    }, 1200);
  };

  return (
    <>
      <h1 className="text-2xl sm:text-3xl font-bold font-display text-foreground">
        AI <span className="text-gradient">Research Assistant</span>
      </h1>
      <p className="mt-1 text-muted-foreground">
        Ask questions about your course material.
      </p>

      {/* Course selector */}
      <div className="mt-4 flex items-center gap-2 flex-wrap">
        <span className="text-sm text-muted-foreground">Context:</span>
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="text-sm rounded-lg border border-border bg-card text-foreground px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {courses.map((c) => (
            <option key={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Chat window — responsive height */}
      <div className="mt-4 rounded-2xl bg-card border border-border shadow-card flex flex-col h-[60vh] min-h-[360px]">
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: msg.role === "user" ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex items-end gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                {msg.role === "bot" && (
                  <div className="w-8 h-8 rounded-full bg-hero-gradient flex items-center justify-center shrink-0">
                    <Brain className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] sm:max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-hero-gradient text-primary-foreground rounded-br-sm"
                      : "bg-secondary text-foreground rounded-bl-sm"
                  }`}
                >
                  {msg.text}
                </div>
              </motion.div>
            ))}
            {thinking && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-end gap-2"
              >
                <div className="w-8 h-8 rounded-full bg-hero-gradient flex items-center justify-center shrink-0">
                  <Brain className="w-4 h-4 text-primary-foreground" />
                </div>
                <div className="bg-secondary rounded-2xl rounded-bl-sm px-4 py-3">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ y: [0, -4, 0] }}
                        transition={{
                          repeat: Infinity,
                          delay: i * 0.15,
                          duration: 0.6,
                        }}
                        className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50"
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={bottomRef} />
        </div>
        <div className="border-t border-border p-3 sm:p-4 flex gap-2">
          <Input
            placeholder="Ask about your course material..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            className="flex-1"
          />
          <Button
            variant="hero"
            size="icon"
            onClick={send}
            disabled={!input.trim() || thinking}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </>
  );
};

// ─── Section: Notifications ───────────────────────────────────────────────────

const NotificationsSection = () => {
  const [filter, setFilter] = useState<
    "all" | "assignment" | "grade" | "announcement"
  >("all");
  const [notifications, setNotifications] = useState(notificationsData);

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

// ─── Section: Profile & CV ────────────────────────────────────────────────────

const ProfileSection = () => {
  const { toast } = useToast();
  const [name, setName] = useState("Alex Rivera");
  const [bio, setBio] = useState(
    "Computer Science student passionate about AI and distributed systems.",
  );
  const [phone, setPhone] = useState("+1 (555) 000-1234");
  const [cvFile, setCvFile] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  const handleSave = () => {
    toast({
      title: "Profile saved!",
      description: "Your changes have been updated.",
    });
  };

  const handleCvDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) setCvFile(file.name);
  };

  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <>
      <h1 className="text-2xl sm:text-3xl font-bold font-display text-foreground">
        Profile <span className="text-gradient">& CV</span>
      </h1>
      <p className="mt-1 text-muted-foreground">
        Manage your personal information and upload your CV.
      </p>

      <div className="mt-6 sm:mt-8 grid lg:grid-cols-5 gap-6">
        {/* Profile form */}
        <div className="lg:col-span-3 p-5 sm:p-7 rounded-2xl bg-card border border-border shadow-card space-y-5">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-16 h-16 rounded-full bg-hero-gradient flex items-center justify-center text-primary-foreground font-bold text-xl shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-foreground text-lg truncate">
                {name}
              </h3>
              <p className="text-sm text-muted-foreground">student@edu.com</p>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">
              Full Name
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Email</label>
            <Input defaultValue="student@edu.com" className="mt-1" disabled />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Phone</label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Bio</label>
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="mt-1 min-h-[90px]"
            />
          </div>
          <Button variant="hero" onClick={handleSave}>
            Save Changes
          </Button>
        </div>

        {/* CV section */}
        <div className="lg:col-span-2 p-5 sm:p-7 rounded-2xl bg-card border border-border shadow-card space-y-4">
          <h2 className="text-lg font-semibold font-display text-foreground">
            Your CV
          </h2>
          <p className="text-sm text-muted-foreground">
            Upload your CV to share with recruiters.
          </p>
          {cvFile ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 rounded-xl border border-border bg-secondary/50 flex items-center gap-3"
            >
              <FileText className="w-8 h-8 text-primary shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {cvFile}
                </p>
                <p className="text-xs text-muted-foreground">
                  Uploaded just now
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCvFile(null)}
                className="shrink-0 text-muted-foreground"
              >
                Replace
              </Button>
            </motion.div>
          ) : (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleCvDrop}
              onClick={() => {
                const el = document.createElement("input");
                el.type = "file";
                el.accept = ".pdf";
                el.onchange = (ev) => {
                  const f = (ev.target as HTMLInputElement).files?.[0];
                  if (f) setCvFile(f.name);
                };
                el.click();
              }}
              className={`border-2 border-dashed rounded-xl p-8 sm:p-10 text-center cursor-pointer transition-colors ${
                dragging
                  ? "border-primary bg-accent/50"
                  : "border-border hover:border-primary/50 hover:bg-accent/20"
              }`}
            >
              <Upload className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">
                Upload your CV (PDF)
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Drag & drop or click to browse
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const StudentDashboard = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigate = (section: string) => {
    setActiveSection(section);
    setMobileMenuOpen(false);
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
    <div className="min-h-screen bg-background">
      {/* ── Top Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 h-16 z-40 bg-card border-b border-border">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-hero-gradient flex items-center justify-center">
              <Brain className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-foreground text-sm sm:text-base">
              EduRecruit<span className="text-primary">AI</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all relative ${
                  activeSection === item.id
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                }`}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
                {item.id === "notifications" &&
                  notificationsData.some((n) => !n.read) && (
                    <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-primary" />
                  )}
              </button>
            ))}
          </div>

          {/* Desktop sign out */}
          <Link to="/login" className="hidden lg:flex">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-muted-foreground"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </Link>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* ── Mobile Drawer ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm lg:hidden"
            />
            {/* Slide-down drawer */}
            <motion.div
              initial={{ y: "-100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border shadow-elevated lg:hidden"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-5 h-16 border-b border-border">
                <Link
                  to="/"
                  className="flex items-center gap-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="w-8 h-8 rounded-lg bg-hero-gradient flex items-center justify-center">
                    <Brain className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <span className="font-display font-bold text-foreground">
                    EduRecruit<span className="text-primary">AI</span>
                  </span>
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {/* Nav items */}
              <div className="p-4 space-y-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => navigate(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all ${
                      activeSection === item.id
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                    }`}
                  >
                    <item.icon className="w-5 h-5 shrink-0" />
                    {item.label}
                    {item.id === "notifications" &&
                      notificationsData.some((n) => !n.read) && (
                        <div className="ml-auto w-2 h-2 rounded-full bg-primary" />
                      )}
                  </button>
                ))}
                <div className="pt-2 border-t border-border mt-2">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <button className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all">
                      <LogOut className="w-5 h-5 shrink-0" />
                      Sign Out
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Main content ── */}
      <main className="pt-16 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
