import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Pencil } from "lucide-react";
import Initials from "../../shared/components/Initials";
import StarRating from "../../shared/components/StarRating";
import {
  coursesData,
  submissionsData,
  feedbackHistoryData,
  assignmentsData,
} from "../data/mockData";
import type { Submission, FeedbackEntry } from "../types";

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

  const [selectedCourseId, setSelectedCourseId] = useState<number>(1);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<number>(0);

  const [submissions, setSubmissions] = useState<Submission[]>(submissionsData);
  const [feedbackHistory, setFeedbackHistory] =
    useState<FeedbackEntry[]>(feedbackHistoryData);

  const [gradingId, setGradingId] = useState<number | null>(null);

  const [grades, setGrades] = useState<
    Record<number, { rating: number; feedback: string }>
  >({});

  const [form, setForm] = useState({
    title: "",
    type: preselectedType ?? "assignment",
    course:
      coursesData.find((c) => c.id === preselectedCourseId)?.name ??
      coursesData[0].name,
    dueDate: "",
    description: "",
  });

  const [displayCourse, setDisplayCourse] = useState(
    preselectedCourseId
      ? coursesData.find((c) => c.id === preselectedCourseId)?.name
      : coursesData[0].name,
  );

  const [expandedAssignments, setExpandedAssignments] = useState<number[]>([]);

  const [postedAssignments, setPostedAssignments] = useState<
    {
      id: number;
      title: string;
      type: "assignment" | "project";
      course: string;
      dueDate: string;
      description: string;
      createdAt: string;
    }[]
  >([]);

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
    if (preselectedCourseId) {
      setForm((prev) => ({
        ...prev,
        course:
          coursesData.find((c) => c.id === preselectedCourseId)?.name ??
          prev.course,
      }));
    }
    if (preselectedType) {
      setForm((prev) => ({ ...prev, type: preselectedType }));
    }
  }, [preselectedCourseId, preselectedType]);

  const handlePost = () => {
    if (!form.title || !form.dueDate || !form.description) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      const newAssignment = {
        id: Date.now(),
        title: form.title,
        type: form.type,
        course: form.course,
        dueDate: form.dueDate,
        description: form.description,
        createdAt: new Date().toISOString(),
      };

      setPostedAssignments((prev) => [
        {
          ...newAssignment,
          id: Date.now(),
        },
        ...prev,
      ]);
      setDisplayCourse(form.course);

      setSubmitting(false);

      setForm({
        title: "",
        type: preselectedType ?? "assignment",
        course:
          coursesData.find((c) => c.id === preselectedCourseId)?.name ??
          coursesData[0].name,
        dueDate: "",
        description: "",
      });

      toast({
        title:
          form.type === "assignment" ? "Assignment Posted!" : "Project Posted!",
        description: `"${form.title}" has been assigned to students.`,
        duration: 3000,
      });
    }, 600);
  };

  const handleDelete = (id: number) => {
    const assignmentToDelete = postedAssignments.find((a) => a.id === id);
    if (!assignmentToDelete) return;
    if (
      window.confirm(
        `Are you sure you want to delete this ${assignmentToDelete.type}?`,
      )
    ) {
      setPostedAssignments((prev) => prev.filter((a) => a.id !== id));
      toast({
        title: "Deleted",
        description: `${assignmentToDelete.type.charAt(0).toUpperCase() + assignmentToDelete.type.slice(1)} has been deleted.`,
        duration: 3000,
      });
    }
  };

  const handleUpdate = (id: number) => {
    setPostedAssignments((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              title: editForm.title,
              type: editForm.type,
              dueDate: editForm.dueDate,
              description: editForm.description,
            }
          : a,
      ),
    );

    setEditingAssignment(null);

    toast({
      title: "Updated",
      description: `${editForm.type} "${editForm.title}" has been updated successfully.`,
      duration: 3000,
    });
  };

  const handleGrade = (id: number) => {
    const g = grades[id];

    // Validate rating
    if (!g?.rating) {
      toast({
        title: "Rating required",
        description: "Please select a performance rating before submitting.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    // Validate feedback
    if (!g.feedback || g.feedback.trim() === "") {
      toast({
        title: "Feedback required",
        description: "Please provide written feedback before submitting.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    // Find the submission
    const submission = submissions.find((s) => s.id === id);
    if (!submission) return;

    const courseName =
      coursesData.find((c) => c.id === submission.course_id)?.name ??
      "Unknown Course";

    // Mark submission as graded
    setSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, graded: true } : s)),
    );

    // Add or update feedback history
    setFeedbackHistory((prev) => {
      const existing = prev.find((f) => f.id === id);

      if (existing) {
        // Update existing feedback
        return prev.map((f) =>
          f.id === id
            ? {
                ...f,
                rating: g.rating,
                feedback: g.feedback,
                date: new Date().toISOString(),
              }
            : f,
        );
      } else {
        // Add new feedback
        return [
          ...prev,
          {
            id,
            student: submission.student,
            course: courseName,
            rating: g.rating,
            feedback: g.feedback,
            date: new Date().toISOString(),
          },
        ];
      }
    });

    // Close grading panel
    setGradingId(null);

    // Toast notification
    toast({
      title: submission.graded ? "Grade Updated!" : "Graded!",
      description: "Your feedback has been submitted.",
      duration: 3000,
    });
  };

  const filteredSubmissions = submissions
    .filter((s) => s.course_id === selectedCourseId)
    .filter((s) =>
      selectedAssignmentId === 0
        ? true
        : s.assignment_id === selectedAssignmentId,
    )
    .sort((a, b) => Number(a.graded) - Number(b.graded));

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
              {coursesData.map((c) => (
                <option key={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Posted Assignments */}
          {postedAssignments
            .filter((a) => a.course === displayCourse)
            .map((assignment) => {
              const isExpanded = expandedAssignments.includes(assignment.id);
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
                            setEditForm({ ...editForm, title: e.target.value })
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
                              type: e.target.value as "assignment" | "project",
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
                        >
                          Save
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
                          {new Date(assignment.createdAt).toLocaleDateString()}
                        </div>

                        <p
                          className={`text-sm text-muted-foreground mt-3 ${!isExpanded ? "line-clamp-2" : ""}`}
                        >
                          {assignment.description}
                        </p>
                        {assignment.description.length > 100 && (
                          <button
                            className="text-xs text-primary mt-1 hover:underline"
                            onClick={() =>
                              setExpandedAssignments((prev) =>
                                isExpanded
                                  ? prev.filter((id) => id !== assignment.id)
                                  : [...prev, assignment.id],
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
            })}
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
                  setSelectedCourseId(Number(e.target.value));
                  setSelectedAssignmentId(0); // reset assignment
                }}
                className="mt-1 w-full text-sm rounded-lg border border-border bg-background text-foreground px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {coursesData.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
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
                onChange={(e) =>
                  setSelectedAssignmentId(Number(e.target.value))
                }
                className="mt-1 w-full text-sm rounded-lg border border-border bg-background text-foreground px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value={0}>All Assignments</option>
                {assignmentsData
                  .filter((a) => a.course_id === selectedCourseId)
                  .map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.title}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {filteredSubmissions.map((sub) => (
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
                    {sub.student} ·{" "}
                    {coursesData.find((c) => c.id === sub.course_id)?.name ??
                      "Unknown Course"}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    Submitted {sub.submitted}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium capitalize">
                    {sub.type}
                  </span>
                  {sub.graded && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 font-medium">
                      Graded
                    </span>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="hero"
                  onClick={() => {
                    setGradingId(gradingId === sub.id ? null : sub.id);

                    const existing = feedbackHistory.find(
                      (f) => f.id === sub.id,
                    );
                    if (existing) {
                      setGrades((prev) => ({
                        ...prev,
                        [sub.id]: {
                          rating: existing.rating,
                          feedback: existing.feedback,
                        },
                      }));
                    }
                  }}
                >
                  {gradingId === sub.id
                    ? "Close"
                    : sub.graded
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
                        Evaluate {sub.student}'s submission
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
                          variant="hero"
                          size="sm"
                          onClick={() => handleGrade(sub.id)}
                        >
                          Submit Evaluation & Feedback
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

export default AssignmentsSection;
