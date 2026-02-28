import { useState } from "react";
import { motion } from "framer-motion";
import Initials from "../../shared/components/Initials";
import StarDisplay from "../../shared/components/StarDisplay";
// import RatingBadge from "../../shared/components/RatingBadge";
import { coursesData, feedbackHistoryData } from "../data/mockData";

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

export default FeedbackSection;
