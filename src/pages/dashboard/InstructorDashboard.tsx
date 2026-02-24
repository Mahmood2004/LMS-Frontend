import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  BookOpen,
  Users,
  Bell,
  LogOut,
  ClipboardCheck,
  Star,
  PlusCircle,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  Search,
  FileText,
  Calendar,
  User,
  Upload,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const coursesData = [
  {
    id: 1,
    name: "Advanced React Patterns",
    students: 32,
    pendingGrades: 8,
    description:
      "Deep-dive into advanced React patterns, hooks, and performance.",
  },
  {
    id: 2,
    name: "System Design Architecture",
    students: 28,
    pendingGrades: 3,
    description: "Scalable system design principles for modern applications.",
  },
  {
    id: 3,
    name: "Cloud Computing Essentials",
    students: 45,
    pendingGrades: 12,
    description: "Core cloud concepts, AWS, and serverless architectures.",
  },
];

const rosterData = [
  { id: 1, name: "Alex Rivera", email: "alex@edu.com" },
  { id: 2, name: "Priya Sharma", email: "priya@edu.com" },
  { id: 3, name: "Marcus Johnson", email: "marcus@edu.com" },
  { id: 4, name: "Lisa Chen", email: "lisa@edu.com" },
  { id: 5, name: "David Kim", email: "david@edu.com" },
];

type AttendanceStatus = "present" | "absent" | "late";

const submissionsData = [
  {
    id: 1,
    student: "Alex Rivera",
    title: "React Hooks Deep Dive",
    course: "Advanced React Patterns",
    submitted: "Feb 16, 2026",
    type: "assignment",
  },
  {
    id: 2,
    student: "Priya Sharma",
    title: "State Management Essay",
    course: "Advanced React Patterns",
    submitted: "Feb 15, 2026",
    type: "assignment",
  },
  {
    id: 3,
    student: "Marcus Johnson",
    title: "Microservices Design Doc",
    course: "System Design Architecture",
    submitted: "Feb 17, 2026",
    type: "project",
  },
  {
    id: 4,
    student: "Lisa Chen",
    title: "Cloud Architecture Lab",
    course: "Cloud Computing Essentials",
    submitted: "Feb 16, 2026",
    type: "project",
  },
];

const feedbackHistoryData = [
  {
    id: 1,
    student: "Alex Rivera",
    course: "Advanced React Patterns",
    rating: 5,
    date: "Feb 14, 2026",
    feedback:
      "Excellent understanding of hooks lifecycle. Could improve error handling patterns.",
  },
  {
    id: 2,
    student: "Priya Sharma",
    course: "Advanced React Patterns",
    rating: 4,
    date: "Feb 13, 2026",
    feedback:
      "Good grasp of concepts, creative solutions. Needs better code documentation.",
  },
  {
    id: 3,
    student: "Marcus Johnson",
    course: "System Design Architecture",
    rating: 3,
    date: "Feb 12, 2026",
    feedback:
      "Solid system design skills. Should focus more on scalability considerations.",
  },
];

const studentsData = [
  {
    id: 1,
    name: "Alex Rivera",
    email: "alex@edu.com",
    courses: ["Advanced React Patterns", "Cloud Computing"],
    avgGrade: "A-",
    grades: [
      { course: "Advanced React Patterns", grade: "A" },
      { course: "Cloud Computing", grade: "A-" },
    ],
    feedback: "Excellent work overall. Strong technical fundamentals.",
  },
  {
    id: 2,
    name: "Priya Sharma",
    email: "priya@edu.com",
    courses: ["Advanced React Patterns"],
    avgGrade: "B+",
    grades: [{ course: "Advanced React Patterns", grade: "B+" }],
    feedback: "Good progress. Needs improvement in code review practices.",
  },
  {
    id: 3,
    name: "Marcus Johnson",
    email: "marcus@edu.com",
    courses: ["System Design Architecture", "Cloud Computing"],
    avgGrade: "B",
    grades: [
      { course: "System Design", grade: "B" },
      { course: "Cloud Computing", grade: "B+" },
    ],
    feedback:
      "Solid understanding. Could push further on system design problems.",
  },
  {
    id: 4,
    name: "Lisa Chen",
    email: "lisa@edu.com",
    courses: [
      "Cloud Computing Essentials",
      "Advanced React Patterns",
      "System Design",
    ],
    avgGrade: "A",
    grades: [
      { course: "Cloud Computing", grade: "A" },
      { course: "React Patterns", grade: "A-" },
    ],
    feedback: "Outstanding student. Consistently high-quality work.",
  },
  {
    id: 5,
    name: "David Kim",
    email: "david@edu.com",
    courses: ["System Design Architecture"],
    avgGrade: "A-",
    grades: [{ course: "System Design", grade: "A-" }],
    feedback: "Very promising. Analytical thinking is a strong suit.",
  },
];

const sidebarItems = [
  { icon: BookOpen, label: "My Courses", id: "courses" },
  { icon: Calendar, label: "Attendance", id: "attendance" },
  { icon: ClipboardCheck, label: "Assignments", id: "assignments" },
  { icon: Star, label: "Feedback", id: "feedback" },
  { icon: Users, label: "Students", id: "students" },
  { icon: User, label: "Profile", id: "profile" },
];

// ─── Shared UI Helpers ────────────────────────────────────────────────────────

const StarRating = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((s) => (
      <button
        key={s}
        onClick={() => onChange(s)}
        className="transition-transform hover:scale-110"
      >
        <Star
          className={`w-6 h-6 transition-colors ${s <= value ? "fill-amber-400 text-amber-400" : "text-muted"}`}
        />
      </button>
    ))}
  </div>
);

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

const Initials = ({ name }: { name: string }) => {
  const i = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  return (
    <div className="w-9 h-9 rounded-full bg-hero-gradient flex items-center justify-center text-primary-foreground text-sm font-bold shrink-0">
      {i}
    </div>
  );
};

const RatingBadge = ({ rating }: { rating: number }) => {
  const color =
    rating >= 4
      ? "bg-emerald-100 text-emerald-700"
      : rating >= 3
        ? "bg-amber-100 text-amber-700"
        : "bg-destructive/10 text-destructive";
  return (
    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${color}`}>
      {rating}.0 / 5
    </span>
  );
};

// ─── Section: My Courses ──────────────────────────────────────────────────────

const CoursesSection = () => {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
  });
  const [courses, setCourses] = useState(coursesData);

  const handleCreate = () => {
    if (!form.name) return;
    setCourses((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: form.name,
        students: 0,
        pendingGrades: 0,
        description: form.description,
      },
    ]);
    setForm({ name: "", description: "", startDate: "", endDate: "" });
    setShowForm(false);
    toast({
      title: "Course created!",
      description: `"${form.name}" is now live.`,
    });
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display text-foreground">
            My <span className="text-gradient">Courses</span>
          </h1>
          <p className="mt-1 text-muted-foreground">
            Manage your courses and content.
          </p>
        </div>
        <Button
          variant="hero"
          className="gap-2"
          onClick={() => setShowForm(!showForm)}
        >
          <PlusCircle className="w-4 h-4" />
          New Course
        </Button>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        {[
          {
            label: "Total Students",
            value: courses.reduce((a, c) => a + c.students, 0).toString(),
          },
          {
            label: "Pending Grades",
            value: courses.reduce((a, c) => a + c.pendingGrades, 0).toString(),
          },
          { label: "Active Courses", value: courses.length.toString() },
        ].map((s) => (
          <div
            key={s.label}
            className="p-5 rounded-xl bg-card border border-border shadow-card text-center"
          >
            <div className="text-2xl font-bold font-display text-foreground">
              {s.value}
            </div>
            <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* New Course Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-6 p-6 rounded-2xl bg-card border border-primary/30 shadow-elevated space-y-4">
              <h2 className="text-lg font-semibold font-display text-foreground">
                Create New Course
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-foreground">
                    Course Name *
                  </label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Advanced TypeScript"
                    className="mt-1"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-foreground">
                    Description
                  </label>
                  <Textarea
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    placeholder="Brief course description..."
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Start Date
                  </label>
                  <Input
                    type="date"
                    value={form.startDate}
                    onChange={(e) =>
                      setForm({ ...form, startDate: e.target.value })
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">
                    End Date
                  </label>
                  <Input
                    type="date"
                    value={form.endDate}
                    onChange={(e) =>
                      setForm({ ...form, endDate: e.target.value })
                    }
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="ghost" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
                <Button variant="hero" onClick={handleCreate}>
                  Create Course
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Course Cards */}
      <div className="mt-6 space-y-4">
        {courses.map((course) => (
          <motion.div
            key={course.id}
            whileHover={{ y: -2 }}
            className="rounded-xl bg-card border border-border shadow-card overflow-hidden"
          >
            <div className="p-5 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-hero-gradient flex items-center justify-center shrink-0">
                <BookOpen className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-foreground">
                  {course.name}
                </div>
                <div className="text-sm text-muted-foreground mt-0.5">
                  {course.students} students · {course.pendingGrades} to grade
                </div>
              </div>
              <span className="text-xs font-medium text-primary bg-accent px-3 py-1 rounded-full shrink-0">
                {course.pendingGrades} pending
              </span>
              <button
                onClick={() =>
                  setExpandedId(expandedId === course.id ? null : course.id)
                }
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {expandedId === course.id ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>
            </div>
            <AnimatePresence>
              {expandedId === course.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden border-t border-border"
                >
                  <div className="p-5 bg-accent/20 flex flex-wrap gap-2">
                    {[
                      "Add Content",
                      "Take Attendance",
                      "Create Assignment",
                      "Create Project",
                    ].map((action) => (
                      <Button
                        key={action}
                        variant="outline"
                        size="sm"
                        className="text-foreground"
                      >
                        {action}
                      </Button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </>
  );
};

// ─── Section: Attendance ──────────────────────────────────────────────────────

const AttendanceSection = () => {
  const { toast } = useToast();
  const [selectedCourse, setSelectedCourse] = useState(coursesData[0].name);
  const [attendance, setAttendance] = useState<
    Record<number, AttendanceStatus>
  >(Object.fromEntries(rosterData.map((s) => [s.id, "present"])));

  const setStatus = (id: number, status: AttendanceStatus) =>
    setAttendance((prev) => ({ ...prev, [id]: status }));

  const statusColors: Record<AttendanceStatus, string> = {
    present: "bg-emerald-100 text-emerald-700 border-emerald-300",
    absent: "bg-destructive/10 text-destructive border-destructive/30",
    late: "bg-amber-100 text-amber-700 border-amber-300",
  };

  return (
    <>
      <h1 className="text-3xl font-bold font-display text-foreground">
        Take <span className="text-gradient">Attendance</span>
      </h1>
      <p className="mt-1 text-muted-foreground">
        Record student attendance for your sessions.
      </p>

      <div className="mt-6 flex items-center gap-3">
        <label className="text-sm font-medium text-foreground">Course:</label>
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="text-sm rounded-lg border border-border bg-card text-foreground px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {coursesData.map((c) => (
            <option key={c.id}>{c.name}</option>
          ))}
        </select>
        <span className="text-xs text-muted-foreground ml-auto">
          Today:{" "}
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </span>
      </div>

      <div className="mt-6 rounded-2xl bg-card border border-border shadow-card overflow-hidden">
        <div className="grid grid-cols-[1fr_auto] gap-4 p-4 border-b border-border bg-secondary/30">
          <span className="text-sm font-semibold text-foreground">Student</span>
          <span className="text-sm font-semibold text-foreground">Status</span>
        </div>
        {rosterData.map((student, i) => (
          <motion.div
            key={student.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="grid grid-cols-[1fr_auto] gap-4 items-center p-4 border-b border-border last:border-0 hover:bg-accent/20 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Initials name={student.name} />
              <div>
                <p className="text-sm font-medium text-foreground">
                  {student.name}
                </p>
                <p className="text-xs text-muted-foreground">{student.email}</p>
              </div>
            </div>
            <div className="flex gap-1">
              {(["present", "absent", "late"] as AttendanceStatus[]).map(
                (status) => (
                  <button
                    key={status}
                    onClick={() => setStatus(student.id, status)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      attendance[student.id] === status
                        ? statusColors[status]
                        : "border-border text-muted-foreground hover:border-muted-foreground"
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ),
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 flex justify-end">
        <Button
          variant="hero"
          onClick={() =>
            toast({
              title: "Attendance saved!",
              description: `Recorded for ${selectedCourse}.`,
            })
          }
        >
          <Check className="w-4 h-4 mr-2" />
          Save Attendance
        </Button>
      </div>
    </>
  );
};

// ─── Section: Assignments & Projects ─────────────────────────────────────────

const AssignmentsSection = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"create" | "submissions">(
    "create",
  );
  const [gradingId, setGradingId] = useState<number | null>(null);
  const [grades, setGrades] = useState<
    Record<number, { rating: number; feedback: string; score: string }>
  >({});
  const [form, setForm] = useState({
    title: "",
    type: "assignment",
    course: coursesData[0].name,
    dueDate: "",
    description: "",
    maxScore: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handlePost = () => {
    if (!form.title) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setForm({
        title: "",
        type: "assignment",
        course: coursesData[0].name,
        dueDate: "",
        description: "",
        maxScore: "",
      });
      toast({
        title: "Posted!",
        description: `"${form.title}" has been assigned to students.`,
      });
    }, 600);
  };

  const handleGrade = (id: number) => {
    const g = grades[id];
    if (!g?.rating) return;
    setGradingId(null);
    toast({
      title: "Graded!",
      description: "Your feedback has been submitted.",
    });
  };

  return (
    <>
      <h1 className="text-3xl font-bold font-display text-foreground">
        Assignments <span className="text-gradient">& Projects</span>
      </h1>
      <p className="mt-1 text-muted-foreground">
        Create assignments and grade student submissions.
      </p>

      {/* Tabs */}
      <div className="mt-6 flex gap-2 p-1 bg-secondary rounded-xl w-fit">
        {(
          [
            ["create", "Create New"],
            ["submissions", "Submissions"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === id
                ? "bg-card text-foreground shadow-card"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {activeTab === "create" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 p-7 rounded-2xl bg-card border border-border shadow-card space-y-5"
        >
          <h2 className="text-lg font-semibold font-display text-foreground">
            New Assignment / Project
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-foreground">
                Title *
              </label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Assignment title..."
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">
                Type
              </label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="mt-1 w-full text-sm rounded-lg border border-border bg-background text-foreground px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="assignment">Assignment</option>
                <option value="project">Project</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">
                Course
              </label>
              <select
                value={form.course}
                onChange={(e) => setForm({ ...form, course: e.target.value })}
                className="mt-1 w-full text-sm rounded-lg border border-border bg-background text-foreground px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {coursesData.map((c) => (
                  <option key={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">
                Due Date
              </label>
              <Input
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground">
                Max Score
              </label>
              <Input
                value={form.maxScore}
                onChange={(e) => setForm({ ...form, maxScore: e.target.value })}
                placeholder="e.g. 100"
                className="mt-1"
              />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-foreground">
                Description
              </label>
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Describe the task..."
                className="mt-1"
              />
            </div>
          </div>
          <Button
            variant="hero"
            onClick={handlePost}
            disabled={submitting}
            className="gap-2"
          >
            <Send className="w-4 h-4" />
            {submitting ? "Posting..." : "Post Assignment"}
          </Button>
        </motion.div>
      )}

      {activeTab === "submissions" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 space-y-4"
        >
          {submissionsData.map((sub) => (
            <div
              key={sub.id}
              className="rounded-xl bg-card border border-border shadow-card overflow-hidden"
            >
              <div className="p-5 flex items-center gap-4">
                <Initials name={sub.student} />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-foreground">
                    {sub.title}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {sub.student} · {sub.course}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    Submitted {sub.submitted}
                  </div>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium capitalize">
                  {sub.type}
                </span>
                <Button
                  size="sm"
                  variant="hero"
                  onClick={() =>
                    setGradingId(gradingId === sub.id ? null : sub.id)
                  }
                >
                  {gradingId === sub.id ? "Close" : "Grade"}
                </Button>
              </div>

              <AnimatePresence>
                {gradingId === sub.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden border-t border-border"
                  >
                    <div className="p-6 bg-accent/20 space-y-4">
                      <h3 className="text-sm font-semibold text-foreground">
                        Grade {sub.student}'s submission
                      </h3>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Performance Rating
                        </label>
                        <StarRating
                          value={grades[sub.id]?.rating ?? 0}
                          onChange={(v) =>
                            setGrades((prev) => ({
                              ...prev,
                              [sub.id]: {
                                ...prev[sub.id],
                                rating: v,
                                feedback: prev[sub.id]?.feedback ?? "",
                                score: prev[sub.id]?.score ?? "",
                              },
                            }))
                          }
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground">
                          Numeric Grade
                        </label>
                        <Input
                          value={grades[sub.id]?.score ?? ""}
                          onChange={(e) =>
                            setGrades((prev) => ({
                              ...prev,
                              [sub.id]: {
                                ...prev[sub.id],
                                score: e.target.value,
                                rating: prev[sub.id]?.rating ?? 0,
                                feedback: prev[sub.id]?.feedback ?? "",
                              },
                            }))
                          }
                          placeholder="e.g. 88"
                          className="mt-1 w-32"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground">
                          Written Feedback
                        </label>
                        <Textarea
                          value={grades[sub.id]?.feedback ?? ""}
                          onChange={(e) =>
                            setGrades((prev) => ({
                              ...prev,
                              [sub.id]: {
                                ...prev[sub.id],
                                feedback: e.target.value,
                                rating: prev[sub.id]?.rating ?? 0,
                                score: prev[sub.id]?.score ?? "",
                              },
                            }))
                          }
                          placeholder="Provide constructive feedback..."
                          className="mt-1 min-h-[90px]"
                        />
                      </div>
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setGradingId(null)}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="hero"
                          size="sm"
                          onClick={() => handleGrade(sub.id)}
                        >
                          Submit Grade & Feedback
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </motion.div>
      )}
    </>
  );
};

// ─── Section: Feedback & Ratings ──────────────────────────────────────────────

const FeedbackSection = () => {
  const [filterCourse, setFilterCourse] = useState("All");
  const filtered =
    filterCourse === "All"
      ? feedbackHistoryData
      : feedbackHistoryData.filter((f) => f.course === filterCourse);

  return (
    <>
      <h1 className="text-3xl font-bold font-display text-foreground">
        Feedback <span className="text-gradient">& Ratings</span>
      </h1>
      <p className="mt-1 text-muted-foreground">
        History of all feedback you've provided.
      </p>

      <div className="mt-6 flex items-center gap-3">
        <label className="text-sm font-medium text-foreground">Filter:</label>
        <select
          value={filterCourse}
          onChange={(e) => setFilterCourse(e.target.value)}
          className="text-sm rounded-lg border border-border bg-card text-foreground px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option>All</option>
          {coursesData.map((c) => (
            <option key={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="mt-6 grid md:grid-cols-2 gap-4">
        {filtered.map((f) => (
          <motion.div
            key={f.id}
            whileHover={{ y: -3 }}
            className="p-6 rounded-2xl bg-card border border-border shadow-card"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <Initials name={f.student} />
                <div>
                  <p className="font-semibold text-foreground">{f.student}</p>
                  <p className="text-xs text-muted-foreground">{f.course}</p>
                </div>
              </div>
              <RatingBadge rating={f.rating} />
            </div>
            <StarDisplay rating={f.rating} />
            <blockquote className="mt-3 text-sm text-muted-foreground italic border-l-2 border-primary/30 pl-3 leading-relaxed">
              "{f.feedback}"
            </blockquote>
            <p className="text-xs text-muted-foreground mt-3">{f.date}</p>
          </motion.div>
        ))}
      </div>
    </>
  );
};

// ─── Section: Students ────────────────────────────────────────────────────────

const StudentsSection = () => {
  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<
    (typeof studentsData)[0] | null
  >(null);

  const filtered = studentsData.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <h1 className="text-3xl font-bold font-display text-foreground">
        <span className="text-gradient">Students</span>
      </h1>
      <p className="mt-1 text-muted-foreground">
        Directory of all your enrolled students.
      </p>

      <div className="mt-6 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search students..."
          className="pl-9"
        />
      </div>

      <div className="mt-6 rounded-2xl bg-card border border-border shadow-card overflow-hidden">
        <div className="grid grid-cols-[2fr_2fr_1fr_1fr_auto] gap-4 px-5 py-3 border-b border-border bg-secondary/30">
          {["Name", "Email", "Courses", "Avg. Grade", ""].map((h) => (
            <span
              key={h}
              className="text-xs font-semibold text-muted-foreground uppercase tracking-wide"
            >
              {h}
            </span>
          ))}
        </div>
        {filtered.map((s, i) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.04 }}
            className="grid grid-cols-[2fr_2fr_1fr_1fr_auto] gap-4 items-center px-5 py-4 border-b border-border last:border-0 hover:bg-accent/20 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Initials name={s.name} />
              <span className="text-sm font-medium text-foreground">
                {s.name}
              </span>
            </div>
            <span className="text-sm text-muted-foreground">{s.email}</span>
            <span className="text-sm text-muted-foreground">
              {s.courses.length}
            </span>
            <span className="text-sm font-semibold text-primary">
              {s.avgGrade}
            </span>
            <Button
              size="sm"
              variant="outline"
              className="text-foreground"
              onClick={() => setSelectedStudent(s)}
            >
              View Profile
            </Button>
          </motion.div>
        ))}
      </div>

      {/* Side panel */}
      <AnimatePresence>
        {selectedStudent && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedStudent(null)}
              className="fixed inset-0 z-40 bg-foreground"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-card border-l border-border shadow-elevated overflow-y-auto"
            >
              <div className="p-7 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold font-display text-foreground">
                    Student Profile
                  </h2>
                  <button
                    onClick={() => setSelectedStudent(null)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-hero-gradient flex items-center justify-center text-primary-foreground font-bold text-xl">
                    {selectedStudent.name
                      .split(" ")
                      .map((w) => w[0])
                      .join("")
                      .toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold font-display text-foreground">
                      {selectedStudent.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedStudent.email}
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">
                    Enrolled Courses
                  </h4>
                  <div className="space-y-1">
                    {selectedStudent.courses.map((c) => (
                      <div
                        key={c}
                        className="text-sm text-muted-foreground flex items-center gap-2"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-primary" /> {c}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">
                    Recent Grades
                  </h4>
                  <div className="space-y-2">
                    {selectedStudent.grades.map((g) => (
                      <div
                        key={g.course}
                        className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
                      >
                        <span className="text-sm text-foreground">
                          {g.course}
                        </span>
                        <span className="text-sm font-bold text-primary">
                          {g.grade}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">
                    Latest Instructor Feedback
                  </h4>
                  <blockquote className="text-sm text-muted-foreground italic border-l-2 border-primary/30 pl-3 leading-relaxed">
                    "{selectedStudent.feedback}"
                  </blockquote>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

// ─── Section: Profile ─────────────────────────────────────────────────────────

const ProfileSection = () => {
  const { toast } = useToast();
  const [name, setName] = useState("Dr. Sarah Chen");
  const [title, setTitle] = useState("Associate Professor · Computer Science");
  const [bio, setBio] = useState(
    "Researcher and educator specializing in distributed systems and React architecture.",
  );

  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <>
      <h1 className="text-3xl font-bold font-display text-foreground">
        My <span className="text-gradient">Profile</span>
      </h1>
      <p className="mt-1 text-muted-foreground">
        Manage your instructor profile.
      </p>
      <div className="mt-8 max-w-lg p-7 rounded-2xl bg-card border border-border shadow-card space-y-5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-hero-gradient flex items-center justify-center text-primary-foreground font-bold text-xl">
            {initials}
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-lg">{name}</h3>
            <p className="text-sm text-muted-foreground">instructor@edu.com</p>
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
          <label className="text-sm font-medium text-foreground">
            Title / Department
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground">Email</label>
          <Input defaultValue="instructor@edu.com" disabled className="mt-1" />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground">Bio</label>
          <Textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="mt-1 min-h-[90px]"
          />
        </div>
        <Button
          variant="hero"
          onClick={() =>
            toast({
              title: "Profile saved!",
              description: "Your changes have been updated.",
            })
          }
        >
          Save Changes
        </Button>
      </div>
    </>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const InstructorDashboard = () => {
  const [activeSection, setActiveSection] = useState("courses");

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
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 border-r border-border bg-card p-6 hidden lg:flex flex-col z-40">
        <Link to="/" className="flex items-center gap-2 mb-10">
          <div className="w-9 h-9 rounded-lg bg-hero-gradient flex items-center justify-center">
            <Brain className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-foreground">
            EduRecruit<span className="text-primary">AI</span>
          </span>
        </Link>
        <div className="mb-4 px-3 py-2 rounded-lg bg-accent/50 border border-border">
          <p className="text-xs font-medium text-accent-foreground">
            Instructor Portal
          </p>
          <p className="text-xs text-muted-foreground">Dr. Sarah Chen</p>
        </div>
        <nav className="flex-1 space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                activeSection === item.id
                  ? "bg-accent text-accent-foreground font-medium shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              }`}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {item.label}
            </button>
          ))}
        </nav>
        <Link to="/login">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-muted-foreground"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </Link>
      </aside>

      {/* Main content */}
      <main className="lg:ml-64 p-6 lg:p-10 max-w-5xl">
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
      </main>
    </div>
  );
};

export default InstructorDashboard;
