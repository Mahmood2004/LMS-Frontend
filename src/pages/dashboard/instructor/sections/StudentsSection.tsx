import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Initials from "../../shared/components/Initials";
import { studentsData } from "../data/mockData";

const StudentsSection = () => {
  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<
    (typeof studentsData)[0] | null
  >(null);

  const filtered = studentsData.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <h1 className="text-3xl font-bold font-display text-foreground">
        <span className="text-gradient">Students</span>
      </h1>
      <p className="mt-1 text-muted-foreground">
        Directory of all your enrolled students.
      </p>

      <div className="mt-6 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search students..."
          className="pl-9"
        />
      </div>

      <div className="mt-6 rounded-2xl bg-card border border-border shadow-card overflow-hidden">
        <div className="grid grid-cols-[2fr_2fr_1fr_auto] gap-4 px-5 py-3 border-b border-border bg-secondary/30">
          {["Name", "Email", "Courses", ""].map((h) => (
            <span
              key={h}
              className="text-xs font-semibold text-muted-foreground uppercase tracking-wide"
            >
              {h}
            </span>
          ))}
        </div>
        {filtered.map((s, i) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.04 }}
            className="grid grid-cols-[2fr_2fr_1fr_auto] gap-4 items-center px-5 py-4 border-b border-border last:border-0 hover:bg-accent/20 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Initials name={s.name} />
              <span className="text-sm font-medium text-foreground">
                {s.name}
              </span>
            </div>
            <span className="text-sm text-muted-foreground">{s.email}</span>
            <span className="text-sm text-muted-foreground">
              {s.courses.length}
            </span>
            <Button
              size="sm"
              variant="outline"
              className="text-foreground"
              onClick={() => setSelectedStudent(s)}
            >
              View Profile
            </Button>
          </motion.div>
        ))}
      </div>

      {/* Side panel */}
      <AnimatePresence>
        {selectedStudent && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedStudent(null)}
              className="fixed inset-0 z-40 bg-foreground"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-card border-l border-border shadow-elevated overflow-y-auto"
            >
              <div className="p-7 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold font-display text-foreground">
                    Student Profile
                  </h2>
                  <button
                    onClick={() => setSelectedStudent(null)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-hero-gradient flex items-center justify-center text-primary-foreground font-bold text-xl">
                    {selectedStudent.name
                      .split(" ")
                      .map((w) => w[0])
                      .join("")
                      .toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold font-display text-foreground">
                      {selectedStudent.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedStudent.email}
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">
                    Enrolled Courses
                  </h4>
                  <div className="space-y-1">
                    {selectedStudent.courses.map((c) => (
                      <div
                        key={c}
                        className="text-sm text-muted-foreground flex items-center gap-2"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-primary" /> {c}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">
                    Latest Instructor Feedback
                  </h4>
                  <blockquote className="text-sm text-muted-foreground italic border-l-2 border-primary/30 pl-3 leading-relaxed">
                    "{selectedStudent.feedback}"
                  </blockquote>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">
                    {selectedStudent.name}'s CV
                  </h4>

                  {selectedStudent.cvUrl ? (
                    <a
                      href={selectedStudent.cvUrl}
                      download
                      className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                    >
                      <BookOpen className="w-4 h-4" />
                      Download CV
                    </a>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      No CV uploaded.
                    </p>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">
                    Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedStudent.skills?.map((skill: string) => (
                      <span
                        key={skill}
                        className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default StudentsSection;
