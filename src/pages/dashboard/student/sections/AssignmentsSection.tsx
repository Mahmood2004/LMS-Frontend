import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardCheck,
  Clock,
  Loader2,
  Paperclip,
  Send,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import StatusBadge from "../../shared/components/StatusBadge";
import StarDisplay from "../../shared/components/StarDisplay";
import assignmentService, {
  Assignment,
  AssignmentStatus,
} from "@/services/student/assignmentService";
import courseService, {
  EnrolledCourse,
} from "@/services/student/courseService";

const AssignmentsSection = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"assignment" | "project">(
    "assignment",
  );
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("0");
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loadingAssignments, setLoadingAssignments] = useState(false);
  const [submitting, setSubmitting] = useState<String | null>(null);
  const [submittedIds, setSubmittedIds] = useState<string[]>([]);
  const [submissionUrls, setSubmissionUrls] = useState<Record<string, string>>(
    {},
  );
  const [submittingAssignment, setSubmittingAssignment] = useState<
    string | null
  >(null);

  const statusOrder: Record<string, number> = {
    pending: 0,
    submitted: 1,
    graded: 2,
  };

  const filteredAssignments = assignments
    .filter((a) => a.type === activeTab)
    .filter(
      (a) =>
        selectedCourseId === "0" || a.course_id === String(selectedCourseId),
    )
    .sort((a, b) => {
      const statusA =
        a.submission_status === "ungraded"
          ? "submitted"
          : (a.submission_status ?? "pending");

      const statusB =
        b.submission_status === "ungraded"
          ? "submitted"
          : (b.submission_status ?? "pending");

      const statusDiff = statusOrder[statusA] - statusOrder[statusB];

      if (statusDiff !== 0) return statusDiff;

      return (
        new Date(a.due_date || "").getTime() -
        new Date(b.due_date || "").getTime()
      );
    });

  const handleSubmit = async (assignmentId: string) => {
    const url = submissionUrls[assignmentId];
    if (!url) {
      toast({
        title: "No URL provided",
        description: "Please enter your submission link.",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }

    let success = false;
    try {
      setSubmittingAssignment(assignmentId);
      // Try new submission
      await assignmentService.submitAssignment(assignmentId, url);
      success = true;

      toast({
        title: "Submitted!",
        description: "Your submission has been sent successfully.",
        duration: 3000,
      });
    } catch (err: any) {
      // If already submitted, edit it
      if (
        err.response?.status === 400 &&
        err.response?.data.message.includes("already submitted")
      ) {
        await assignmentService.editSubmission(assignmentId, url);
        success = true;

        toast({
          title: "Submission updated!",
          description: "Your submission has been updated successfully.",
          duration: 3000,
        });
      } else {
        success = false;
        toast({
          title: "Submission failed",
          description: "Could not submit your assignment",
          variant: "destructive",
          duration: 2000,
        });
        return;
      }

      if (success) {
        setSubmissionUrls((prev) => ({
          ...prev,
          [assignmentId]: "",
        }));
      }
    } finally {
      const updatedAssignments = await assignmentService.getAllAssignments();
      setAssignments(updatedAssignments);
      setSubmitting(null);
      setSubmittingAssignment(null);
    }
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const courses = await courseService.getMyCourses();
        setEnrolledCourses(courses);
      } catch (err) {
        toast({
          title: "Failed to load courses",
          description: "Could not fetch your enrolled courses",
          variant: "destructive",
        });
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoadingAssignments(true);
        const data = await assignmentService.getAllAssignments();
        setAssignments(data);
      } catch (err: any) {
        if (err.response?.status === 404) {
          setAssignments([]);
        } else {
          toast({
            title: "Failed to load assignments",
            description: "Could not fetch your assignments",
            variant: "destructive",
          });
        }
      } finally {
        setLoadingAssignments(false);
      }
    };

    fetchAssignments();
  }, []);

  return (
    <>
      <h1 className="text-2xl sm:text-3xl font-bold font-display text-foreground">
        Assignments <span className="text-gradient">& Projects</span>
      </h1>
      <p className="mt-1 text-muted-foreground">
        Submit your work and track your grades.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        {/* Tabs */}
        <div className="flex gap-2 p-1 bg-secondary rounded-xl w-fit">
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

        {/* Course Dropdown */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground">Course</label>
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="mt-1 w-full text-sm rounded-lg border border-border bg-background text-foreground px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="0">All Courses</option>

            {enrolledCourses.map((c) => (
              <option key={c.course_id} value={c.course_id}>
                {c.courses.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {loadingAssignments ? (
          <div className="py-16 text-center text-muted-foreground">
            <p>Loading assignments...</p>
          </div>
        ) : filteredAssignments.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground">
            <ClipboardCheck className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No assignments found.</p>
          </div>
        ) : null}
        {filteredAssignments.map((a) => {
          const isLocallySubmitted = submittedIds.includes(a.id);
          const isPastDue = new Date() > new Date(a.due_date);
          const backendStatus =
            a.submission_status === "ungraded"
              ? "submitted"
              : (a.submission_status ?? "pending");

          const effectiveStatus: AssignmentStatus = isLocallySubmitted
            ? "submitted"
            : backendStatus;
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
                    {a.course_title}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Due{" "}
                    {new Date(a.due_date!).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                  <StatusBadge
                    status={isPastDue ? "Deadline Passed" : effectiveStatus}
                  />
                  {effectiveStatus !== "graded" && (
                    <Button
                      size="sm"
                      variant="hero"
                      disabled={isPastDue}
                      onClick={() => {
                        setSubmitting(submitting === a.id ? null : a.id);
                      }}
                    >
                      {isPastDue
                        ? "Deadline Passed"
                        : effectiveStatus === "submitted"
                          ? "Edit Submission"
                          : "Submit"}
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
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          Submission URL
                        </label>

                        <input
                          type="text"
                          placeholder="Paste your Google Drive / GitHub / website link"
                          value={submissionUrls[a.id] ?? ""}
                          onChange={(e) =>
                            setSubmissionUrls((prev) => ({
                              ...prev,
                              [a.id]: e.target.value,
                            }))
                          }
                          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                        <p className="text-xs text-muted-foreground">
                          Example: Google Drive, GitHub repo, deployed project
                          link
                        </p>
                        {a.submission_url && (
                          <div className="text-xs text-muted-foreground">
                            Previous submission:{" "}
                            <a
                              href={a.submission_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary underline"
                            >
                              {a.submission_url}
                            </a>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSubmitting(null);
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="hero"
                          size="sm"
                          disabled={submittingAssignment === a.id}
                          onClick={() => handleSubmit(a.id)}
                        >
                          {submittingAssignment === a.id ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            <>
                              <Send className="w-3.5 h-3.5 mr-1.5" />
                              Submit
                            </>
                          )}
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
                    <StarDisplay rating={a.rating ?? 0} />
                  </div>
                  <p className="text-sm text-muted-foreground italic">
                    "{a.comment}"
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

export default AssignmentsSection;
