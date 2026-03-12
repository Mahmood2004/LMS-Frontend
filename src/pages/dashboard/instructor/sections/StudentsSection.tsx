import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Eye, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Initials from "../../shared/components/Initials";
import InstructorCourseServices, {
  InstructorStudent,
  CourseTitle,
} from "@/services/instructor/courseService";
// import studentService from "@/services/admin/studentService";

const StudentsSection = () => {
  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] =
    useState<InstructorStudent | null>(null);
  const [students, setStudents] = useState<InstructorStudent[]>([]);
  const [courses, setCourses] = useState<CourseTitle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAllCourses, setShowAllCourses] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const data = await InstructorCourseServices.getStudentsByInstructor();

        setStudents(data.formattedStudents);
        setCourses(data.coursesTitles);
      } catch (err) {
        console.error("Failed to fetch students:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // const handleViewCV = async () => {
  //   if (!selectedStudent?.id) return;

  //   try {
  //     const cvUrl = await studentService.getStudentCV(selectedStudent.id);

  //     if (cvUrl) {
  //       window.open(cvUrl, "_blank", "noopener,noreferrer");
  //     } else {
  //       console.error("CV URL not found");
  //     }
  //   } catch (err) {
  //     console.error("Failed to fetch CV:", err);
  //   }
  // };

  const filteredStudents = students
    .filter((s) =>
      (s.full_name ?? s.username).toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) =>
      (a.full_name ?? a.username).localeCompare(b.full_name ?? b.username),
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
        <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
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
        {loading ? (
          <div className="mt-8 mb-8 text-center text-muted-foreground">
            Loading students...
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="mt-8 mb-8 text-center text-muted-foreground">
            No students found.
          </div>
        ) : (
          filteredStudents.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.04 }}
              className="grid grid-cols-[2fr_2fr_1fr_auto] gap-4 items-center px-5 py-4 border-b border-border last:border-0 hover:bg-accent/20 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Initials name={s.full_name ?? s.username} />
                <span className="text-sm font-medium text-foreground">
                  {s.full_name ?? s.username}
                </span>
              </div>
              <span className="text-sm text-muted-foreground">{s.email}</span>
              <span className="text-sm text-muted-foreground">
                {courses.length}
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
          ))
        )}
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
                    {selectedStudent.full_name ??
                      selectedStudent.username
                        .split(" ")
                        .map((w) => w[0])
                        .join("")
                        .toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold font-display text-foreground">
                      {selectedStudent.full_name ?? selectedStudent.username}
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
                    {(showAllCourses ? courses : courses.slice(0, 5)).map(
                      (c) => (
                        <div
                          key={c.title}
                          className="text-sm text-muted-foreground flex items-center gap-2"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-primary" />
                          {c.title}
                        </div>
                      ),
                    )}
                  </div>

                  {courses.length > 5 && (
                    <button
                      onClick={() => setShowAllCourses((prev) => !prev)}
                      className="mt-2 text-xs text-primary hover:underline"
                    >
                      {showAllCourses ? "View less" : "View more"}
                    </button>
                  )}
                </div>
                {/* <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">
                    CV
                  </h4>

                  {selectedStudent.cv_url ? (
                    <button
                      onClick={handleViewCV}
                      className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                    >
                      <Eye className="w-4 h-4" />
                      View CV
                    </button>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      No CV uploaded.
                    </p>
                  )}
                </div> */}
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
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">
                    Links
                  </h4>

                  <div className="space-y-3">
                    {/* GitHub */}
                    <div>
                      <label className="text-xs text-muted-foreground">
                        GitHub
                      </label>
                      <Input
                        value={selectedStudent.github_url ?? "Not provided"}
                        readOnly
                        onClick={() =>
                          selectedStudent.github_url &&
                          window.open(selectedStudent.github_url, "_blank")
                        }
                        className="mt-1 cursor-pointer"
                      />
                    </div>

                    {/* LinkedIn */}
                    <div>
                      <label className="text-xs text-muted-foreground">
                        LinkedIn
                      </label>
                      <Input
                        value={selectedStudent.linkedin_url ?? "Not provided"}
                        readOnly
                        onClick={() =>
                          selectedStudent.linkedin_url &&
                          window.open(selectedStudent.linkedin_url, "_blank")
                        }
                        className="mt-1 cursor-pointer"
                      />
                    </div>

                    {/* Portfolio */}
                    <div>
                      <label className="text-xs text-muted-foreground">
                        Portfolio
                      </label>
                      <Input
                        value={selectedStudent.portfolio_url ?? "Not provided"}
                        readOnly
                        onClick={() =>
                          selectedStudent.portfolio_url &&
                          window.open(selectedStudent.portfolio_url, "_blank")
                        }
                        className="mt-1 cursor-pointer"
                      />
                    </div>
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
