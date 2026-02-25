import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, PlusCircle, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { coursesData } from "../data/mockData";

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

export default CoursesSection;
