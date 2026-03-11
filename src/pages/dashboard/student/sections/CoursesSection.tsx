import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, ChevronDown, ChevronUp, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import ModuleIcon from "../../shared/components/ModuleIcon";
import courseService from "@/services/student/courseService";
import contentService from "@/services/student/contentService";
import { Input } from "@/components/ui/input";

const CoursesSection = () => {
  const { toast } = useToast();
  const [courses, setCourses] = useState<any[]>([]);
  const [courseContent, setCourseContent] = useState<Record<string, any[]>>({});
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [search, setSearch] = useState("");
  const [expandedCourse, setExpandedCourse] = useState<number | null>(null);
  const [loadingContent, setLoadingContent] = useState<Record<string, boolean>>(
    {},
  );
  const [viewingContent, setViewingContent] = useState<{
    title: string;
    desc: string;
    url: string;
  } | null>(null);

  const loadCourseContent = async (courseId: string) => {
    try {
      setLoadingContent((prev) => ({ ...prev, [courseId]: true }));

      const content = await contentService.getCourseContent(courseId);

      setCourseContent((prev) => ({
        ...prev,
        [courseId]: content,
      }));
    } catch (err: any) {
      if (err?.response?.status === 404) {
        setCourseContent((prev) => ({
          ...prev,
          [courseId]: [],
        }));
      } else {
        toast({
          title: "Failed to load content",
          description: "Could not fetch course content.",
          variant: "destructive",
          duration: 2000,
        });
      }
    } finally {
      setLoadingContent((prev) => ({ ...prev, [courseId]: false }));
    }
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await courseService.getMyCourses();
        setCourses(data);
      } catch {
        toast({
          title: "Failed to load courses",
          description: "Could not fetch enrolled courses.",
          variant: "destructive",
          duration: 2000,
        });
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <>
      <h1 className="text-2xl sm:text-3xl font-bold font-display text-foreground">
        My <span className="text-gradient">Courses</span>
      </h1>
      <p className="mt-1 text-muted-foreground">
        Browse your enrolled courses and study materials.
      </p>
      <div className="mt-6 relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search courses..."
          className="pl-9"
        />
      </div>
      {loadingCourses && (
        <div className="mt-8 text-center text-muted-foreground">
          Loading your courses...
        </div>
      )}
      {!loadingCourses && courses.length === 0 && (
        <div className="mt-8 text-center border border-border rounded-xl p-10 bg-card">
          <BookOpen className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
          <p className="text-sm font-medium text-foreground">
            No enrolled courses yet
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Once you enroll in a course, it will appear here.
          </p>
        </div>
      )}
      {!loadingCourses && courses.length > 0 && (
        <div className="mt-6 sm:mt-8 space-y-4">
          {[...courses]
            .filter((course) =>
              course.courses?.title
                .toLowerCase()
                .includes(search.toLowerCase()),
            )
            .sort(
              (a, b) =>
                new Date(b.enrolled_at).getTime() -
                new Date(a.enrolled_at).getTime(),
            )
            .map((course) => (
              <motion.div
                key={`${course.user_id}-${course.course_id}`}
                whileHover={{ y: -2 }}
                className="rounded-xl bg-card border border-border shadow-card overflow-hidden"
              >
                <button
                  onClick={async () => {
                    const isOpening = expandedCourse !== course.course_id;

                    setExpandedCourse(isOpening ? course.course_id : null);

                    if (isOpening && !courseContent[course.course_id]) {
                      await loadCourseContent(course.course_id);
                    }
                  }}
                  className="w-full p-4 sm:p-6 flex items-center gap-3 sm:gap-4 text-left hover:bg-accent/30 transition-colors"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-hero-gradient flex items-center justify-center shrink-0">
                    <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-semibold font-display text-foreground">
                      {course.courses?.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Instructor:{" "}
                      {course.courses?.users?.profiles?.full_name || "N/A"}
                    </p>
                  </div>
                  {expandedCourse === course.course_id ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />
                  )}
                </button>
                <AnimatePresence>
                  {expandedCourse === course.course_id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden border-t border-border"
                    >
                      <div className="p-4 sm:p-6 space-y-2">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                          Course Content
                        </p>

                        <div className="max-h-[200px] overflow-y-auto space-y-2">
                          {loadingContent[course.course_id] ? (
                            <p className="text-sm text-muted-foreground text-center py-4">
                              Loading modules...
                            </p>
                          ) : (
                            (courseContent[course.course_id] || [])
                              .sort(
                                (a, b) =>
                                  new Date(b.created_at).getTime() -
                                  new Date(a.created_at).getTime(),
                              )
                              .map((mod: any) => (
                                <div
                                  key={mod.id}
                                  className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-accent/50 transition-colors group"
                                >
                                  <ModuleIcon
                                    type={mod.content_type || "file"}
                                  />
                                  <span className="flex-1 text-sm text-foreground">
                                    {mod.title}
                                  </span>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity text-primary hover:text-primary text-xs sm:text-sm"
                                    onClick={() =>
                                      setViewingContent({
                                        title: mod.title,
                                        desc: mod.text_body,
                                        url: mod.content_url,
                                      })
                                    }
                                  >
                                    View
                                  </Button>
                                </div>
                              ))
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
        </div>
      )}

      {/* Module Detail Modal */}
      <AnimatePresence>
        {viewingContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm p-4"
            onClick={() => setViewingContent(null)}
          >
            <motion.div
              initial={{ scale: 0.93, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.93, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card border border-border rounded-2xl shadow-elevated p-6 sm:p-8 max-w-md w-full"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold font-display text-foreground pr-4">
                  {viewingContent.title}
                </h3>
                <button
                  onClick={() => setViewingContent(null)}
                  className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed"></p>
              <div className="mt-6 p-4 rounded-xl bg-accent/50 border border-border text-center text-sm text-muted-foreground">
                {viewingContent.desc || "no description available"}
              </div>
              <Button
                asChild
                variant="hero"
                className="w-full mt-4 cursor-pointer"
              >
                <a
                  href={viewingContent.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    toast({
                      title: "Opening content",
                      description: `Opening "${viewingContent.title}"...`,
                      duration: 2000,
                    })
                  }
                  className="w-full block text-center"
                >
                  Open Content
                </a>
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CoursesSection;
