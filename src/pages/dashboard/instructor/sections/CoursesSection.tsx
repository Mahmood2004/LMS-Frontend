import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  PlusCircle,
  ChevronDown,
  ChevronUp,
  Download,
  Trash2,
  Film,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { coursesData } from "../data/mockData";

interface CourseContent {
  id: number;
  title: string;
  type: "pdf" | "video";
  url: string;
  createdAt: number;
}

interface ExtendedCourse {
  id: number;
  name: string;
  students: number;
  pendingGrades: number;
  description: string;
  content: CourseContent[];
  createdAt: number;
}

interface CoursesSectionProps {
  onQuickAction?: (
    section: string,
    options?: { courseId?: number; assignmentType?: "assignment" | "project" },
  ) => void;
}

const CoursesSection = ({ onQuickAction }: CoursesSectionProps) => {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
  });
  const [addingContentCourseId, setAddingContentCourseId] = useState<
    number | null
  >(null);
  const [newContent, setNewContent] = useState<{
    title: string;
    type: "pdf" | "video";
    file?: File;
  }>({ title: "", type: "pdf" });

  const [courses, setCourses] = useState<ExtendedCourse[]>(coursesData);

  const handleAddContent = (courseId: number) => {
    if (!newContent.title) {
      toast({
        title: "Title Required!",
        description: "Please fill in the title.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    if (!newContent.file) {
      toast({
        title: "File Required!",
        description: "Please upload a file.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    const file = newContent.file;

    setCourses((prev) =>
      prev.map((course) =>
        course.id === courseId
          ? {
              ...course,
              content: [
                {
                  id: Date.now(),
                  title: newContent.title,
                  type: newContent.type,
                  url: URL.createObjectURL(file),
                  createdAt: Date.now(),
                },
                ...course.content,
              ],
            }
          : course,
      ),
    );

    setNewContent({ title: "", type: "pdf", file: undefined });
    setAddingContentCourseId(null);

    toast({
      title: "Content Added!",
      description: "Course content has been added successfully.",
      duration: 3000,
    });
  };

  const handleDeleteContent = (courseId: number, contentId: number) => {
    if (!confirm("Are you sure you want to delete this content?")) return;
    setCourses((prev) =>
      prev.map((c) =>
        c.id === courseId
          ? { ...c, content: c.content.filter((item) => item.id !== contentId) }
          : c,
      ),
    );
  };

  const handleCreate = () => {
    if (!form.name || !form.description || !form.startDate || !form.endDate) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    setCourses((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: form.name,
        students: 0,
        pendingGrades: 0,
        description: form.description,
        content: [],
        createdAt: Date.now(),
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
                    min={new Date().toISOString().split("T")[0]}
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
                    min={
                      form.startDate || new Date().toISOString().split("T")[0]
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
        {[...courses]
          .sort((a, b) => b.createdAt - a.createdAt)
          .map((course) => (
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
                    {/* Course content list */}
                    {course.content.length > 0 && (
                      <div className="mt-3 space-y-1 px-5">
                        <div className="max-h-30 overflow-y-auto space-y-1">
                          {[...course.content]
                            .sort((a, b) => b.createdAt - a.createdAt)
                            .map((item) => (
                              <div
                                key={item.id}
                                className="flex items-center justify-between text-sm text-foreground bg-secondary/10 rounded px-2 py-1"
                              >
                                <span className="flex items-center gap-1">
                                  {item.type === "pdf" ? (
                                    <FileText className="w-4 h-4 text-foreground" />
                                  ) : (
                                    <Film className="w-4 h-4 text-foreground" />
                                  )}
                                  {item.title}
                                </span>
                                <div className="flex gap-4">
                                  <a
                                    href={item.url}
                                    download
                                    className="text-blue-600 hover:text-blue-800"
                                    title="Download"
                                  >
                                    <Download className="w-4 h-4" />
                                  </a>
                                  <button
                                    onClick={() =>
                                      handleDeleteContent(course.id, item.id)
                                    }
                                    className="text-destructive hover:text-destructive/80"
                                    title="Delete"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                    {/* Add Content Form */}
                    {addingContentCourseId === course.id && (
                      <div className="mt-2 p-3 border border-border rounded-lg bg-secondary/20 space-y-2">
                        <Input
                          placeholder="Content title"
                          value={newContent.title}
                          onChange={(e) =>
                            setNewContent({
                              ...newContent,
                              title: e.target.value,
                            })
                          }
                          className="text-sm"
                        />
                        <select
                          value={newContent.type}
                          onChange={(e) =>
                            setNewContent({
                              ...newContent,
                              type: e.target.value as "pdf" | "video",
                            })
                          }
                          className="mt-1 w-full text-sm rounded-lg border border-border bg-card text-foreground px-2 py-1"
                        >
                          <option value="pdf">PDF</option>
                          <option value="video">Video</option>
                        </select>
                        <Input
                          type="file"
                          accept=".pdf,video/mp4"
                          onChange={(e) =>
                            setNewContent({
                              ...newContent,
                              file: e.target.files?.[0],
                            })
                          }
                          className="mt-1 text-sm"
                        />
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setAddingContentCourseId(null)}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="hero"
                            size="sm"
                            onClick={() => handleAddContent(course.id)}
                          >
                            Add
                          </Button>
                        </div>
                      </div>
                    )}
                    <div className="p-5 bg-accent/20 flex flex-wrap gap-2">
                      {[
                        { label: "Add Content", section: "content" },
                        { label: "Take Attendance", section: "attendance" },
                        {
                          label: "Create Assignment",
                          section: "assignments",
                          type: "assignment",
                        },
                        {
                          label: "Create Project",
                          section: "assignments",
                          type: "project",
                        },
                      ].map((action) =>
                        action.label === "Add Content" ? (
                          <Button
                            key={action.label}
                            variant="outline"
                            size="sm"
                            className="text-foreground"
                            onClick={() =>
                              setAddingContentCourseId(
                                addingContentCourseId === course.id
                                  ? null
                                  : course.id,
                              )
                            }
                          >
                            {action.label}
                          </Button>
                        ) : (
                          <Button
                            key={action.label}
                            variant="outline"
                            size="sm"
                            className="text-foreground"
                            onClick={() => {
                              if (onQuickAction) {
                                onQuickAction(action.section, {
                                  courseId: course.id,
                                  assignmentType:
                                    (action.type as "assignment" | "project") ??
                                    undefined,
                                });
                              }
                            }}
                          >
                            {action.label}
                          </Button>
                        ),
                      )}
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
