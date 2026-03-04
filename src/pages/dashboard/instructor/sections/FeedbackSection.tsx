import { useState } from "react";
import { motion } from "framer-motion";
import Initials from "../../shared/components/Initials";
import StarDisplay from "../../shared/components/StarDisplay";
// import RatingBadge from "../../shared/components/RatingBadge";
import {
  coursesData,
  feedbackHistoryData,
  submissionsData,
  assignmentsData,
} from "../data/mockData";

const FeedbackSection = () => {
  const [selectedCourseId, setSelectedCourseId] = useState<number>(1);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<number>(0);

  // Filter feedbacks based on course and assignment
  const filtered = feedbackHistoryData.filter((f) => {
    const submission = submissionsData.find((s) => s.id === f.id);
    if (!submission) return false;

    const matchesCourse =
      selectedCourseId === 0 || submission.course_id === selectedCourseId;
    const matchesAssignment =
      selectedAssignmentId === 0 ||
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
              setSelectedCourseId(Number(e.target.value));
              setSelectedAssignmentId(0); // reset assignment when course changes
            }}
            className="mt-1 w-full text-sm rounded-lg border border-border bg-background text-foreground px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value={0}>All Courses</option>
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
            onChange={(e) => setSelectedAssignmentId(Number(e.target.value))}
            className="mt-1 w-full text-sm rounded-lg border border-border bg-background text-foreground px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value={0}>All Assignments</option>
            {assignmentsData
              .filter(
                (a) =>
                  selectedCourseId === 0 || a.course_id === selectedCourseId,
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
      <div className="mt-6 grid md:grid-cols-2 gap-4">
        {filtered.map((f) => {
          const submission = submissionsData.find((s) => s.id === f.id);
          const assignmentTitle = submission?.title ?? "Unknown Assignment";

          return (
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
                    <p className="text-xs text-muted-foreground">
                      {submission?.course_id
                        ? coursesData.find((c) => c.id === submission.course_id)
                            ?.name
                        : "Unknown Course"}
                    </p>
                    <p className="text-xs text-muted-foreground italic">
                      {assignmentTitle}
                    </p>
                  </div>
                </div>
              </div>
              <StarDisplay rating={f.rating} />
              <blockquote className="mt-3 text-sm text-muted-foreground italic border-l-2 border-primary/30 pl-3 leading-relaxed">
                "{f.feedback}"
              </blockquote>
              <p className="text-xs text-muted-foreground mt-3">{f.date}</p>
            </motion.div>
          );
        })}
      </div>
    </>
  );
};

export default FeedbackSection;
