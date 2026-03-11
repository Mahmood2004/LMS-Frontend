import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Initials from "../../shared/components/Initials";
import StarDisplay from "../../shared/components/StarDisplay";
import InstructorFeedbackServices, {
  Feedback,
} from "@/services/instructor/feedbackService";
import InstructorSubmissionServices, {
  Submission,
} from "@/services/instructor/submissionService";
import InstructorAssignmentServices from "@/services/instructor/assignmentServices";
import InstructorCourseServices, {
  Course,
} from "@/services/instructor/courseService";

const FeedbackSection = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [assignments, setAssignments] = useState<
    { id: number; title: string; course_id: number }[]
  >([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [expandedComments, setExpandedComments] = useState<string[]>([]);

  const [loadingFeedbacks, setLoadingFeedbacks] = useState(false);

  const [selectedCourseId, setSelectedCourseId] = useState<string>("0");
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>("0");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await InstructorCourseServices.getInstructorCourses();
        setCourses(data);
      } catch (err) {
        console.error("Failed to fetch courses", err);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingFeedbacks(true);

        // 1. Get assignments for selected course (or all)
        const assignmentsList =
          selectedCourseId === "0"
            ? await Promise.all(
                courses.map((c) =>
                  InstructorAssignmentServices.getAssignmentsByCourse(
                    String(c.id),
                  ),
                ),
              ).then((lists) => lists.flat())
            : await InstructorAssignmentServices.getAssignmentsByCourse(
                String(selectedCourseId),
              );

        setAssignments(assignmentsList);

        // 2. Get submissions for selected assignment or all assignments
        const assignmentIds =
          selectedAssignmentId !== "0"
            ? [selectedAssignmentId]
            : assignmentsList.map((a) => a.id);

        const submissionsList: Submission[] = [];

        for (const id of assignmentIds) {
          const res =
            await InstructorSubmissionServices.getSubmissionsByAssignment(
              String(id),
            );
          submissionsList.push(...res.submissions);
        }

        setSubmissions(submissionsList);

        // 3. Get feedbacks for these submissions
        const feedbackPromises = submissionsList.map(
          (s) =>
            InstructorFeedbackServices.viewFeedback(s.id)
              .then((res) => res.feedback)
              .catch(() => null), // ignore if no feedback
        );

        const feedbackList = (await Promise.all(feedbackPromises)).filter(
          (f): f is Feedback => f !== null,
        );

        setFeedbacks(feedbackList);
      } catch (err) {
        console.error("Failed to fetch feedbacks:", err);
      } finally {
        setLoadingFeedbacks(false);
      }
    };

    fetchData();
  }, [selectedCourseId, selectedAssignmentId]);

  const filtered = feedbacks.filter((f) => {
    const submission = submissions.find((s) => s.id === f.submission_id);
    if (!submission) return false;

    const matchesCourse =
      selectedCourseId === "0" || submission.course_id === selectedCourseId;
    const matchesAssignment =
      selectedAssignmentId === "0" ||
      submission.assignment_id === selectedAssignmentId;

    return matchesCourse && matchesAssignment;
  });

  return (
    <>
      <h1 className="text-3xl font-bold font-display text-foreground">
        Feedback <span className="text-gradient">& Ratings</span>
      </h1>
      <p className="mt-1 text-muted-foreground">
        History of all feedback you've provided.
      </p>

      {/* Filters */}
      <div className="mt-6 flex flex-wrap gap-4 items-end mb-4">
        {/* Course Dropdown */}
        <div className="space-y-1">
          <label className="text-sm font-medium text-foreground">Course</label>
          <select
            value={selectedCourseId}
            onChange={(e) => {
              setSelectedCourseId(e.target.value);
              setSelectedAssignmentId("0");
            }}
            className="mt-1 w-full text-sm rounded-lg border border-border bg-background text-foreground px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value={0}>All Courses</option>
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
            onChange={(e) => setSelectedAssignmentId(e.target.value)}
            className="mt-1 w-full text-sm rounded-lg border border-border bg-background text-foreground px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value={0}>All Assignments</option>
            {assignments
              .filter(
                (a) =>
                  selectedCourseId === "0" ||
                  String(a.course_id) === selectedCourseId,
              )
              .map((a) => (
                <option key={a.id} value={a.id}>
                  {a.title}
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* Feedback Cards */}
      {loadingFeedbacks ? (
        <p className="text-sm text-muted-foreground">Loading feedbacks...</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground">No feedback found.</p>
      ) : (
        <div className="mt-6 grid md:grid-cols-2 gap-4">
          {filtered.map((f) => {
            const submission = submissions.find(
              (s) => s.id === f.submission_id,
            );
            const assignmentTitle =
              submission?.assignment_title ?? "Unknown Assignment";
            const courseName = submission?.course_title ?? "Unknown Course";

            return (
              <motion.div
                key={f.id}
                whileHover={{ y: -3 }}
                className="p-6 rounded-2xl bg-card border border-border shadow-card"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Initials name={submission?.student_name} />
                    <div>
                      <p className="font-semibold text-foreground">
                        {submission?.student_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {courseName}
                      </p>
                      <p className="text-xs text-muted-foreground italic">
                        {assignmentTitle}
                      </p>
                    </div>
                  </div>
                </div>
                <StarDisplay rating={f.rating} />
                {(() => {
                  const isExpanded = expandedComments.includes(f.id);

                  return (
                    <>
                      <blockquote
                        className={`mt-3 text-sm text-muted-foreground italic border-l-2 border-primary/30 pl-3 leading-relaxed whitespace-pre-line break-words ${
                          !isExpanded ? "line-clamp-3" : ""
                        }`}
                      >
                        "{f.comment}"
                      </blockquote>

                      {f.comment.length > 120 && (
                        <button
                          className="text-xs text-primary mt-1 hover:underline"
                          onClick={() =>
                            setExpandedComments((prev) =>
                              isExpanded
                                ? prev.filter((id) => id !== f.id)
                                : [...prev, f.id],
                            )
                          }
                        >
                          {isExpanded ? "View Less" : "View More"}
                        </button>
                      )}
                    </>
                  );
                })()}
                <p className="text-xs text-muted-foreground mt-3">
                  {new Date(f.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </motion.div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default FeedbackSection;
