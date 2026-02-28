import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import Initials from "../../shared/components/Initials";
import StarRating from "../../shared/components/StarRating";
import { coursesData, submissionsData } from "../data/mockData";

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
      });
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
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
        title: `${form.type === "assignment" ? "Assignment" : "Project"} Posted!`,
        description: `"${form.title}" has been assigned to students.`,
        duration: 3000,
      });
    }, 600);
  };

  const handleGrade = (id: number) => {
    const g = grades[id];

    if (!g?.rating) {
      toast({
        title: "Rating required",
        description: "Please select a performance rating before submitting.",
        variant: "destructive",
      });
      return;
    }

    if (!g.feedback || g.feedback.trim() === "") {
      toast({
        title: "Feedback required",
        description: "Please provide written feedback before submitting.",
        variant: "destructive",
      });
      return;
    }
    setGradingId(null);
    toast({
      title: "Graded!",
      description: "Your feedback has been submitted.",
      duration: 3000,
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
