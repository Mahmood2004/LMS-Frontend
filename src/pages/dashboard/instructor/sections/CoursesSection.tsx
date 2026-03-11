import { useEffect, useState } from "react";
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
  Search,
  Loader2,
  AlignLeft,
  Link,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import InstructorCourseServices, {
  CreateCoursePayload,
} from "@/services/instructor/courseService";
import InstructorContentServices, {
  CourseContent,
  CourseWithContent,
  AddContentPayload,
} from "@/services/instructor/contentService";

interface CoursesSectionProps {
  onQuickAction?: (
    section: string,
    options?: { courseId?: string; assignmentType?: "assignment" | "project" },
  ) => void;
}

const CoursesSection = ({ onQuickAction }: CoursesSectionProps) => {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
  });

  const [courses, setCourses] = useState<CourseWithContent[]>([]);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [loadingCoursesContent, setLoadingCourseContent] = useState(false);
  const [loadingAddContent, setLoadingAddContent] = useState(false);
  const [loadingContentIds, setLoadingContentIds] = useState<string[]>([]);
  const [addingContentCourseId, setAddingContentCourseId] = useState<
    string | null
  >(null);
  const [newContent, setNewContent] = useState<AddContentPayload>({
    title: "",
    content_type: "pdf",
  });
  const [studentCounts, setStudentCounts] = useState<Record<string, number>>(
    {},
  );
  const [pendingSubmissionsCounts, setPendingSubmissionsCounts] = useState<
    Record<string, number>
  >({});

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoadingCourses(true);

        // Get instructor courses
        const fetchedCourses =
          await InstructorCourseServices.getInstructorCourses();
        setCourses(
          fetchedCourses.map((course) => ({
            ...course,
            content: [], // ensure content always exists
          })),
        );

        // Fetch student counts & pending submissions for each course
        const countsPromises = fetchedCourses.map(async (course) => {
          const [numStudents, pendingSubs] = await Promise.all([
            InstructorCourseServices.getCourseStudentCount(course.id),
            InstructorCourseServices.getPendingSubmissionsCount(course.id),
          ]);
          return { courseId: course.id, numStudents, pendingSubs };
        });

        const counts = await Promise.all(countsPromises);

        const studentCountsMap: Record<string, number> = {};
        const pendingSubsMap: Record<string, number> = {};

        counts.forEach(({ courseId, numStudents, pendingSubs }) => {
          studentCountsMap[courseId] = numStudents;
          pendingSubsMap[courseId] = pendingSubs;
        });

        setStudentCounts(studentCountsMap);
        setPendingSubmissionsCounts(pendingSubsMap);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
        toast({
          title: "Error",
          description: "Failed to load courses",
          variant: "destructive",
          duration: 2000,
        });
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    if (!expandedId) return;

    const course = courses.find((c) => c.id === expandedId);
    if (!course || course.content?.length) return;

    const fetchContent = async () => {
      try {
        setLoadingContentIds((prev) => [...prev, expandedId]);
        const res = await InstructorContentServices.getContents(expandedId);
        setCourses((prev) =>
          prev.map((c) =>
            c.id === expandedId ? { ...c, content: res.contents } : c,
          ),
        );
      } catch (err) {
        if (err?.response?.status === 404) {
          setCourses((prev) =>
            prev.map((c) => (c.id === expandedId ? { ...c, content: [] } : c)),
          );
          return;
        }
        console.error(err);
        toast({
          title: "Failed to load content",
          description: "Could not fetch course content.",
          variant: "destructive",
        });
      } finally {
        setLoadingContentIds((prev) => prev.filter((id) => id !== expandedId));
      }
    };

    fetchContent();
  }, [expandedId]);

  const handleAddContent = async (courseId: string) => {
    if (!newContent.title || !newContent.content_url) {
      toast({
        title: "Title and URL required",
        description: "Please provide both a title and a content URL.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    try {
      setLoadingAddContent(true);
      const payload: AddContentPayload = {
        title: newContent.title,
        content_type: newContent.content_type,
        content_url: newContent.content_url,
      };

      // Call backend service
      const res = await InstructorContentServices.addContent(courseId, payload);

      // Update state for this course
      setCourses((prev) =>
        prev.map((c) =>
          c.id === courseId
            ? {
                ...c,
                content: [
                  {
                    id: res.content.id,
                    course_id: res.content.course_id ?? courseId,
                    title: res.content.title,
                    content_type: res.content.content_type as
                      | "pdf"
                      | "video"
                      | "text"
                      | "link",
                    content_url: res.content.content_url ?? "",
                    position: res.content.position ?? c.content?.length + 1,
                    created_at:
                      res.content.created_at ?? new Date().toISOString(),
                  },
                  ...(c.content || []), // prepend new content
                ],
              }
            : c,
        ),
      );

      // Reset form
      setNewContent({ title: "", content_type: "pdf", content_url: "" });
      setAddingContentCourseId(null);

      toast({ title: "Content added successfully" });
    } catch (err) {
      console.error(err);
      toast({
        title: "Failed to add content",
        description: "Something went wrong while adding the content.",
        variant: "destructive",
      });
    } finally {
      setLoadingAddContent(false);
    }
  };

  const handleDeleteContent = async (courseId: string, contentId: string) => {
    if (!confirm("Are you sure you want to delete this content?")) return;

    try {
      await InstructorContentServices.deleteContent(courseId, contentId);

      setCourses((prev) =>
        prev.map((c) =>
          c.id === courseId
            ? {
                ...c,
                content:
                  c.content?.filter((item) => item.id !== contentId) || [],
              }
            : c,
        ),
      );

      toast({ title: "Content deleted successfully", duration: 3000 });
    } catch (err) {
      console.error(err);
      toast({
        title: "Failed to delete content",
        description: "Could not remove the content. Try again later.",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  const handleCreate = async () => {
    if (!form.name || !form.description || !form.startDate || !form.endDate) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }

    try {
      setLoadingCreate(true);

      // Call the backend to create course
      const payload: CreateCoursePayload = {
        title: form.name,
        description: form.description,
      };

      const newCourse = await InstructorCourseServices.createCourse(payload);

      // Add the newly created course to the state
      setCourses((prev) => [
        ...prev,
        {
          ...newCourse,
          content: [], // initially empty
        } as CourseWithContent,
      ]);

      toast({
        title: "Course created!",
        description: `"${form.name}" is now live.`,
        duration: 3000,
      });

      // Reset form and hide
      setForm({ name: "", description: "", startDate: "", endDate: "" });
      setShowForm(false);
    } catch (err) {
      console.error(err);
      toast({
        title: "Failed to create course",
        description: "Something went wrong. Try again later.",
        variant: "destructive",
        duration: 2000,
      });
    } finally {
      setLoadingCreate(false);
    }
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
            value: Object.values(studentCounts).reduce((a, b) => a + b, 0),
          },
          {
            label: "Pending Grades",
            value: Object.values(pendingSubmissionsCounts).reduce(
              (a, b) => a + b,
              0,
            ),
          },
          { label: "Active Courses", value: courses.length },
        ].map((s) => (
          <div
            key={s.label}
            className="p-5 rounded-xl bg-card border border-border shadow-card text-center"
          >
            <div className="text-2xl font-bold font-display text-foreground">
              {loadingCourses ? "..." : s.value}
            </div>
            <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search courses..."
          className="pl-9"
        />
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
                <Button
                  variant="hero"
                  onClick={handleCreate}
                  disabled={loadingCreate}
                >
                  {loadingCreate ? "Creating..." : "Create Course"}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Course Cards */}
      <div className="mt-6 space-y-4">
        {loadingCourses ? (
          <div className="py-16 text-center text-muted-foreground flex justify-center">
            <p className="ml-2">Loading courses...</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground">
            <p>No courses found.</p>
          </div>
        ) : (
          [...courses]
            .filter((course) =>
              course.title.toLowerCase().includes(search.toLowerCase()),
            )
            .sort(
              (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime(),
            )
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
                      {course.title}
                    </div>
                    <div className="text-sm text-muted-foreground mt-0.5">
                      {studentCounts[course.id] ?? 0} students ·{" "}
                      {pendingSubmissionsCounts[course.id] ?? 0} to grade
                    </div>
                  </div>
                  <span className="text-xs font-medium text-primary bg-accent px-3 py-1 rounded-full shrink-0">
                    {pendingSubmissionsCounts[course.id] ?? 0} pending
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
                      <div className="mt-3 px-5">
                        {loadingCoursesContent ? (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Loading content...
                          </div>
                        ) : !course.content || course.content.length === 0 ? (
                          <div className="text-sm text-muted-foreground italic">
                            No content uploaded
                          </div>
                        ) : (
                          <div className="max-h-30 overflow-y-auto space-y-1">
                            {[...course.content]
                              .sort(
                                (a, b) =>
                                  new Date(b.created_at ?? "").getTime() -
                                  new Date(a.created_at ?? "").getTime(),
                              )
                              .map((item) => (
                                <div
                                  key={item.id}
                                  className="flex items-center justify-between text-sm text-foreground bg-secondary/10 rounded px-2 py-1"
                                >
                                  <span className="flex items-center gap-1">
                                    {item.content_type === "pdf" && (
                                      <FileText className="w-4 h-4 text-foreground" />
                                    )}

                                    {item.content_type === "video" && (
                                      <Film className="w-4 h-4 text-foreground" />
                                    )}

                                    {item.content_type === "text" && (
                                      <AlignLeft className="w-4 h-4 text-foreground" />
                                    )}

                                    {item.content_type === "link" && (
                                      <Link className="w-4 h-4 text-foreground" />
                                    )}

                                    {item.title}
                                  </span>

                                  <div className="flex gap-4">
                                    <a
                                      href={item.content_url ?? ""}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:text-blue-800"
                                      title="View"
                                    >
                                      <Eye className="w-4 h-4" />
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
                        )}
                      </div>
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
                            value={newContent.content_type}
                            onChange={(e) =>
                              setNewContent({
                                ...newContent,
                                content_type: e.target.value as
                                  | "pdf"
                                  | "video"
                                  | "text"
                                  | "link",
                              })
                            }
                            className="mt-1 w-full text-sm rounded-lg border border-border bg-card text-foreground px-2 py-1"
                          >
                            <option value="pdf">PDF</option>
                            <option value="video">Video</option>
                            <option value="text">text</option>
                            <option value="link">link</option>
                          </select>
                          <Input
                            placeholder="Content URL"
                            value={newContent.content_url}
                            onChange={(e) =>
                              setNewContent({
                                ...newContent,
                                content_url: e.target.value,
                              })
                            }
                            className="mt-1 text-sm"
                          />
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setAddingContentCourseId(null)}
                              disabled={loadingAddContent}
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="hero"
                              size="sm"
                              onClick={() => handleAddContent(course.id)}
                              disabled={loadingAddContent}
                            >
                              {loadingAddContent ? "Adding..." : "Add"}
                            </Button>
                          </div>
                        </div>
                      )}
                      {/* action buttons */}
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
                                      (action.type as
                                        | "assignment"
                                        | "project") ?? undefined,
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
            ))
        )}
      </div>
    </>
  );
};

export default CoursesSection;
