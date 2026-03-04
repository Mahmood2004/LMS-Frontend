import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, ChevronDown, ChevronUp, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import ModuleIcon from "../../shared/components/ModuleIcon";
import { courses } from "../data/mockData";
import { Input } from "@/components/ui/input";

const CoursesSection = () => {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [expandedCourse, setExpandedCourse] = useState<number | null>(null);
  const [viewingContent, setViewingContent] = useState<{
    title: string;
    desc: string;
    url: string;
    createdAt: number;
  } | null>(null);

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
      <div className="mt-6 sm:mt-8 space-y-4">
        {[...courses]
          .filter((course) =>
            course.name.toLowerCase().includes(search.toLowerCase()),
          )
          .sort((a, b) => b.createdAt - a.createdAt)
          .map((course) => (
            <motion.div
              key={course.id}
              whileHover={{ y: -2 }}
              className="rounded-xl bg-card border border-border shadow-card overflow-hidden"
            >
              <button
                onClick={() =>
                  setExpandedCourse(
                    expandedCourse === course.id ? null : course.id,
                  )
                }
                className="w-full p-4 sm:p-6 flex items-center gap-3 sm:gap-4 text-left hover:bg-accent/30 transition-colors"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-hero-gradient flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold font-display text-foreground">
                    {course.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Instructor: {course.instructor}
                  </p>
                </div>
                {expandedCourse === course.id ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />
                )}
              </button>
              <AnimatePresence>
                {expandedCourse === course.id && (
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
                        {[...course.modules]
                          .sort((a, b) => b.createdAt - a.createdAt)
                          .map((mod, i) => (
                            <div
                              key={i}
                              className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-accent/50 transition-colors group"
                            >
                              <ModuleIcon type={mod.type} />
                              <span className="flex-1 text-sm text-foreground">
                                {mod.title}
                              </span>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity text-primary hover:text-primary text-xs sm:text-sm"
                                onClick={() => setViewingContent(mod)}
                              >
                                View
                              </Button>
                            </div>
                          ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
      </div>

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
                {viewingContent.desc}
              </div>
              <Button
                asChild
                variant="hero"
                className="w-full mt-4 cursor-pointer"
              >
                <a
                  download={viewingContent.title}
                  href={viewingContent.url}
                  onClick={() =>
                    toast({
                      title: "Download started",
                      description: `Downloading "${viewingContent.title}"...`,
                      duration: 3000,
                    })
                  }
                  className="w-full block text-center"
                >
                  Download Content
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
