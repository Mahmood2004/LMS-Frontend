import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ClipboardCheck, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Pencil } from "lucide-react";
import Initials from "../../shared/components/Initials";
import StarRating from "../../shared/components/StarRating";
import InstructorFeedbackServices from "@/services/instructor/feedbackService";
import InstructorCourseServices, {
  Course,
} from "@/services/instructor/courseService";
import InstructorAssignmentServices from "@/services/instructor/assignmentServices";
import InstructorSubmissionServices, {
  Submission,
} from "@/services/instructor/submissionService";

interface AssignmentsSectionProps {
  preselectedCourseId?: number;
  preselectedType?: "assignment" | "project";
}

const AssignmentsSection = ({
  preselectedCourseId,
  preselectedType,
}: AssignmentsSectionProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"create" | "submissions">(
    "create",
  );

  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("0");
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>("0");
  const [loading, setLoadingCourses] = useState(true);
  const [loadingGrade, setLoadingGrade] = useState<string | null>(null);

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);

  const [gradingId, setGradingId] = useState<string | null>(null);

  const [grades, setGrades] = useState<
    Record<string, { rating: number; feedback: string }>
  >({});

  const [form, setForm] = useState({
    title: "",
    type: preselectedType ?? "assignment",
    course:
      courses.find((c) => c.id === String(preselectedCourseId))?.title ??
      courses[0]?.title,
    dueDate: "",
    description: "",
  });

  const [displayCourse, setDisplayCourse] = useState(
    preselectedCourseId
      ? courses.find((c) => c.id === String(preselectedCourseId))?.title
      : courses[0]?.title,
  );

  const [expandedAssignments, setExpandedAssignments] = useState<string[]>([]);

  const [postedAssignments, setPostedAssignments] = useState<any[]>([]);
  const [loadingAssignments, setLoadingAssignments] = useState(false);
  const [updatingAssignment, setUpdatingAssignment] = useState(false);
  const [loadingDraft, setLoadingDraft] = useState<string | null>(null);
  const [editingAssignment, setEditingAssignment] = useState<number | null>(
    null,
  );

  const [editForm, setEditForm] = useState({
    title: "",
    type: "assignment" as "assignment" | "project",
    dueDate: "",
    description: "",
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoadingCourses(true);
        const data = await InstructorCourseServices.getInstructorCourses();
        setCourses(data);

        if (preselectedCourseId) {
          const preselected = data.find(
            (c) => c.id === String(preselectedCourseId),
          );
          if (preselected) {
            setForm((prev) => ({ ...prev, course: preselected.title }));
            setDisplayCourse(preselected.title);
          }
        } else if (data.length) {
          setForm((prev) => ({ ...prev, course: data[0].title }));
          setDisplayCourse(data[0].title);
        }
      } catch (err) {
        console.error("Failed to fetch courses", err);
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchCourses();
  }, [preselectedCourseId]);

  const fetchAssignments = async (courseId: string) => {
    try {
      setLoadingAssignments(true);

      const data =
        await InstructorAssignmentServices.getAssignmentsByCourse(courseId);
      const formatted = data.map((a: any) => ({
        id: a.id,
        title: a.title,
        type: a.type,
        course:
          courses.find((c) => c.id === courseId)?.title ?? "Unknown Course",
        dueDate: a.due_date?.split("T")[0] ?? "",
        description: a.description ?? "",
        createdAt: a.created_at,
      }));

      setPostedAssignments(formatted);
    } catch (err) {
      setPostedAssignments([]);
    } finally {
      setLoadingAssignments(false);
    }
  };

  const fetchSubmissions = async (assignmentId: string) => {
    if (assignmentId === "0") {
      setSubmissions([]);
      return;
    }
    try {
      setLoadingSubmissions(true);

      const data =
        await InstructorSubmissionServices.getSubmissionsByAssignment(
          assignmentId,
        );
      setSubmissions(data.submissions);
    } catch (err) {
      if (err.response?.status === 404) {
        setSubmissions([]);
      } else {
        console.error("Failed to fetch submissions", err);
        toast({
          title: "Error",
          description: "Failed to fetch submissions",
          variant: "destructive",
          duration: 2000,
        });
      }
    } finally {
      setLoadingSubmissions(false);
    }
  };

  useEffect(() => {
    const course = courses.find((c) => c.title === displayCourse);
    if (course) {
      fetchAssignments(course.id);
    }
  }, [displayCourse]);

  useEffect(() => {
    if (preselectedCourseId) {
      setForm((prev) => ({
        ...prev,
        course:
          courses.find((c) => c.id === String(preselectedCourseId))?.title ??
          prev.course,
      }));
    }
    if (preselectedType) {
      setForm((prev) => ({ ...prev, type: preselectedType }));
    }
  }, [preselectedCourseId, preselectedType]);

  useEffect(() => {
    if (selectedAssignmentId) {
      fetchSubmissions(String(selectedAssignmentId));
    }
  }, [selectedAssignmentId]);

  const handlePost = async () => {
    if (!form.title || !form.dueDate || !form.description) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }

    try {
      setSubmitting(true);

      const course = courses.find((c) => c.title === form.course);

      if (!course) {
        toast({
          title: "Course not found",
          description: "Unable to identify the selected course.",
          variant: "destructive",
          duration: 2000,
        });
        return;
      }

      const res = await InstructorAssignmentServices.createAssignment(
        course.id,
        {
          title: form.title,
          description: form.description,
          type: form.type,
          due_date: form.dueDate,
        },
      );

      const assignment = res.assignment;

      setPostedAssignments((prev) => [
        {
          id: assignment.id,
          title: assignment.title,
          type: assignment.type,
          course: form.course,
          dueDate: assignment.due_date?.split("T")[0] ?? "",
          description: assignment.description ?? "",
          createdAt: assignment.created_at,
        },
        ...prev,
      ]);

      setForm({
        title: "",
        type: preselectedType ?? "assignment",
        course:
          courses.find((c) => c.id === String(preselectedCourseId))?.title ??
          courses[0].title,
        dueDate: "",
        description: "",
      });

      toast({
        title:
          form.type === "assignment" ? "Assignment Posted!" : "Project Posted!",
        description: `"${form.title}" has been successfully assigned to students.`,
        duration: 3000,
      });
    } catch (err: any) {
      toast({
        title: "Failed to create assignment",
        description: "Something went wrong while posting the assignment.",
        variant: "destructive",
        duration: 2000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    const assignmentToDelete = postedAssignments.find((a) => a.id === id);

    if (!assignmentToDelete) return;

    if (
      !window.confirm(
        `Are you sure you want to delete this ${assignmentToDelete.type}?`,
      )
    )
      return;

    try {
      await InstructorAssignmentServices.deleteAssignment(String(id));

      setPostedAssignments((prev) => prev.filter((a) => a.id !== id));

      toast({
        title: "Assignment Deleted",
        description: `"${assignmentToDelete.title}" has been removed successfully.`,
        duration: 3000,
      });
    } catch (err: any) {
      toast({
        title: "Deletion Failed",
        description: "Unable to delete this assignment.",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  const handleUpdate = async (id: number) => {
    try {
      setUpdatingAssignment(true);
      const res = await InstructorAssignmentServices.updateAssignment(
        String(id),
        {
          title: editForm.title,
          description: editForm.description,
          type: editForm.type,
          due_date: editForm.dueDate,
        },
      );

      const updated = res.assignment;

      setPostedAssignments((prev) =>
        prev.map((a) =>
          a.id === id
            ? {
                ...a,
                title: updated.title,
                type: updated.type,
                dueDate: updated.due_date?.split("T")[0] ?? "",
                description: updated.description ?? "",
              }
            : a,
        ),
      );

      setEditingAssignment(null);

      toast({
        title: "Assignment Updated",
        description: `"${updated.title}" has been updated successfully.`,
        duration: 3000,
      });
    } catch (err: any) {
      toast({
        title: "Update Failed",
        description: "Unable to update this assignment.",
        variant: "destructive",
        duration: 2000,
      });
    } finally {
      setUpdatingAssignment(false);
    }
  };

  const handleGrade = async (id: string) => {
    const g = grades[id];

    if (!g?.rating) {
      toast({
        title: "Rating required",
        description: "Please select a performance rating before submitting.",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }

    if (!g.feedback || g.feedback.trim() === "") {
      toast({
        title: "Feedback required",
        description: "Please provide written feedback before submitting.",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }

    const submission = submissions.find((s) => s.id === id);
    if (!submission) return;

    setLoadingGrade(id);

    try {
      const res = await InstructorFeedbackServices.submitFeedback(id, {
        rating: g.rating,
        comment: g.feedback,
      });

      const feedback = res.feedback;

      setSubmissions((prev) =>
        prev.map((s) =>
          s.id === id
            ? {
                ...s,
                status: "graded",
                score: feedback.rating ?? g.rating,
              }
            : s,
        ),
      );

      setGradingId(null);

      toast({
        title: "Graded!",
        description: "Your feedback has been submitted.",
        duration: 3000,
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to submit feedback.",
        variant: "destructive",
      });
    } finally {
      setLoadingGrade(null);
    }
  };

  const handleSaveDraft = async (submissionId: string) => {
    const grade = grades[submissionId];

    if (!grade) return;

    try {
      setLoadingDraft(submissionId);

      await InstructorFeedbackServices.saveDraft(submissionId, {
        rating: grade.rating,
        comment: grade.feedback,
      });

      toast({
        title: "Draft saved",
        description: "Your feedback draft has been saved.",
        duration: 3000,
      });
    } catch (err) {
      console.error(err);

      toast({
        title: "Failed to save draft",
        variant: "destructive",
        duration: 2000,
      });
    } finally {
      setLoadingDraft(null);
    }
  };

  const filteredSubmissions = submissions.filter((s) =>
    selectedAssignmentId === "0"
      ? true
      : s.assignment_id === selectedAssignmentId,
  );

  const assignmentsForSelectedCourse = postedAssignments.filter(
    (a) => a.course === courses.find((c) => c.id === selectedCourseId)?.title,
  );

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
                Title
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
                onChange={(e) =>
                  setForm({
                    ...form,
                    type: e.target.value as "assignment" | "project",
                  })
                }
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
                {courses.map((c) => (
                  <option key={c.id}>{c.title}</option>
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
                min={new Date().toISOString().split("T")[0]}
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

          {/* Display Course Selector */}
          <div className="mt-6 flex items-center gap-2">
            <label className="text-sm font-medium text-foreground">
              Show Assignments for:
            </label>
            <select
              value={displayCourse}
              onChange={(e) => setDisplayCourse(e.target.value)}
              className="text-sm rounded-lg border border-border bg-background text-foreground px-2 py-1 focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {courses.map((c) => (
                <option key={c.id}>{c.title}</option>
              ))}
            </select>
          </div>

          {/* Posted Assignments */}
          {loadingAssignments ? (
            <div className="py-16 text-center text-muted-foreground">
              <p>Loading assignments...</p>
            </div>
          ) : postedAssignments.filter((a) => a.course === displayCourse)
              .length === 0 ? (
            <div className="py-16 text-center text-muted-foreground">
              <ClipboardCheck className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>No assignments found.</p>
            </div>
          ) : (
            postedAssignments
              .filter((a) => a.course === displayCourse)
              .sort(
                (a, b) =>
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime(),
              )
              .map((assignment) => {
                const isExpanded = expandedAssignments.includes(
                  String(assignment.id),
                );
                return (
                  <div
                    key={assignment.id}
                    className="p-5 rounded-xl bg-accent/20 border border-border"
                  >
                    {editingAssignment === assignment.id ? (
                      <div className="w-full space-y-4">
                        <div className="space-y-1">
                          <label className="text-sm font-medium text-foreground">
                            Title
                          </label>
                          <input
                            value={editForm.title}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                title: e.target.value,
                              })
                            }
                            className="w-full rounded-lg border border-border px-3 py-2 text-sm bg-background"
                            placeholder="Enter assignment title"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-sm font-medium text-foreground">
                            Type
                          </label>
                          <select
                            value={editForm.type}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                type: e.target.value as
                                  | "assignment"
                                  | "project",
                              })
                            }
                            className="w-full rounded-lg border border-border px-3 py-2 text-sm bg-background"
                          >
                            <option value="assignment">Assignment</option>
                            <option value="project">Project</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-sm font-medium text-foreground">
                            Due Date
                          </label>
                          <input
                            type="date"
                            value={editForm.dueDate}
                            min={
                              new Date(assignment.createdAt)
                                .toISOString()
                                .split("T")[0]
                            }
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                dueDate: e.target.value,
                              })
                            }
                            className="w-full rounded-lg border border-border px-3 py-2 text-sm bg-background"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-sm font-medium text-foreground">
                            Description
                          </label>
                          <textarea
                            value={editForm.description}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                description: e.target.value,
                              })
                            }
                            className="w-full rounded-lg border border-border px-3 py-2 text-sm bg-background"
                            rows={4}
                          />
                        </div>

                        <div className="flex gap-2 justify-end pt-2">
                          <Button
                            size="sm"
                            onClick={() => handleUpdate(assignment.id)}
                            disabled={updatingAssignment}
                          >
                            {updatingAssignment ? "Saving..." : "Save"}
                          </Button>

                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditingAssignment(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="font-semibold text-foreground">
                            {assignment.title}
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            Due: {assignment.dueDate}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Posted{" "}
                            {new Date(
                              assignment.createdAt,
                            ).toLocaleDateString()}
                          </div>

                          <p
                            className={`text-sm text-muted-foreground mt-3 break-words whitespace-pre-line ${
                              !isExpanded ? "line-clamp-2" : ""
                            } max-w-full`}
                          >
                            {assignment.description}
                          </p>

                          {assignment.description.length > 100 && (
                            <button
                              className="text-xs text-primary mt-1 hover:underline"
                              onClick={() =>
                                setExpandedAssignments((prev) =>
                                  isExpanded
                                    ? prev.filter(
                                        (id) => id !== String(assignment.id),
                                      )
                                    : [...prev, String(assignment.id)],
                                )
                              }
                            >
                              {isExpanded ? "Show Less" : "View More"}
                            </button>
                          )}
                        </div>
                        <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium capitalize">
                          {assignment.type}
                        </span>
                        <div className="flex gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => {
                              setEditingAssignment(assignment.id);
                              setEditForm({
                                title: assignment.title,
                                type: assignment.type,
                                dueDate: assignment.dueDate,
                                description: assignment.description,
                              });
                            }}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>

                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(assignment.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
          )}
        </motion.div>
      )}

      {activeTab === "submissions" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 space-y-4"
        >
          {/* Filters */}
          <div className="flex flex-wrap gap-4 items-end mb-4">
            {/* Course Dropdown */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">
                Course
              </label>
              <select
                value={selectedCourseId}
                onChange={(e) => {
                  const newCourseId = e.target.value;
                  setSelectedCourseId(newCourseId);
                  setSelectedAssignmentId("0");
                  setSubmissions([]);
                }}
                className="mt-1 w-full text-sm rounded-lg border border-border bg-background text-foreground px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="0">All Courses</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Assignment Dropdown */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-foreground">
                Assignment
              </label>
              <select
                value={selectedAssignmentId}
                onChange={(e) => {
                  const id = e.target.value;
                  setSelectedAssignmentId(id);

                  if (id !== "0") {
                    fetchSubmissions(id);
                  } else {
                    setSubmissions([]);
                  }
                }}
                className="mt-1 w-full text-sm rounded-lg border border-border bg-background text-foreground px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="0">All Assignments</option>
                {assignmentsForSelectedCourse.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loadingSubmissions ? (
            <div className="py-16 text-center text-muted-foreground">
              <p>Loading submissions...</p>
            </div>
          ) : filteredSubmissions.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground">
              <p>No submissions found for this assignment.</p>
            </div>
          ) : (
            filteredSubmissions.map((sub) => (
              <div
                key={sub.id}
                className="rounded-xl bg-card border border-border shadow-card overflow-hidden"
              >
                <div className="p-5 flex items-center gap-4">
                  <Initials name={sub.student_name ?? "Student"} />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-foreground">
                      {sub.assignment_title}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {sub.student_name} ·{" "}
                      {sub.course_title ?? "Unknown Course"}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      Submitted{" "}
                      {sub.submission_date &&
                        new Date(sub.submission_date).toLocaleDateString()}
                    </div>

                    {sub.submission_url && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Submission URL:{" "}
                        <a
                          href={sub.submission_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary underline hover:text-primary/80"
                        >
                          {sub.submission_url}
                        </a>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium capitalize">
                      {sub.assignment_type}
                    </span>
                    {sub.status === "graded" ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 font-medium">
                        Graded
                      </span>
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-600 font-medium">
                        Pending
                      </span>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant="hero"
                    disabled={sub.status === "graded"}
                    onClick={async () => {
                      const open = gradingId !== sub.id;
                      setGradingId(open ? sub.id : null);

                      if (!open) return;

                      try {
                        const res =
                          await InstructorFeedbackServices.viewFeedback(sub.id);
                        const fb = res.feedback;

                        setGrades((prev) => ({
                          ...prev,
                          [sub.id]: {
                            rating: fb?.rating ?? 0,
                            feedback: fb?.comment ?? "",
                          },
                        }));
                      } catch {
                        setGrades((prev) => ({
                          ...prev,
                          [sub.id]: { rating: 0, feedback: "" },
                        }));
                      }
                    }}
                  >
                    {gradingId === sub.id
                      ? "Close"
                      : sub.status === "graded"
                        ? "Edit Grade"
                        : "Grade"}
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
                          Evaluate {sub.student_name}'s submission
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
                                },
                              }))
                            }
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
                            onClick={() => {
                              setGrades((prev) => {
                                const updated = { ...prev };
                                delete updated[sub.id];
                                return updated;
                              });
                              setGradingId(null);
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={loadingDraft === sub.id}
                            onClick={() => handleSaveDraft(sub.id)}
                          >
                            {loadingDraft === sub.id
                              ? "Saving..."
                              : "Save Draft"}
                          </Button>
                          <Button
                            variant="hero"
                            size="sm"
                            disabled={loadingGrade === sub.id}
                            onClick={() => handleGrade(sub.id)}
                          >
                            {loadingGrade === sub.id
                              ? "Publishing..."
                              : "Publish Feedback"}
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))
          )}
        </motion.div>
      )}
    </>
  );
};

export default AssignmentsSection;
