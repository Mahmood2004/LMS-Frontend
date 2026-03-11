import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  Linkedin,
  Github,
  Globe,
  CheckCircle2,
  XCircle,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import Initials from "../../shared/components/Initials";
import studentService, {
  Student,
  StudentProfile,
} from "@/services/admin/studentService";

const AdminStudentsSection = () => {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(
    null,
  );

  const [loadingStudents, setLoadingStudents] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [saving, setSaving] = useState(false);

  const filtered = students
    .filter((s) =>
      (s.full_name || s.username).toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) =>
      (a.full_name || a.username).localeCompare(
        b.full_name || b.username,
        undefined,
        { sensitivity: "base" },
      ),
    );

  const handleSave = async () => {
    if (!selectedStudent) return;

    // Email validation
    if (!validateEmail(selectedStudent.email)) {
      toast({
        title: "Cannot save profile",
        description: "Please enter a valid email address.",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }

    // Link validation
    const invalidLinks: string[] = [];

    if (
      selectedStudent.linkedin_url &&
      getValidationState(selectedStudent.linkedin_url, "linkedin.com") ===
        "invalid"
    ) {
      invalidLinks.push("LinkedIn");
    }

    if (
      selectedStudent.github_url &&
      getValidationState(selectedStudent.github_url, "github.com") === "invalid"
    ) {
      invalidLinks.push("GitHub");
    }

    if (
      selectedStudent.portfolio_url &&
      getValidationState(selectedStudent.portfolio_url) === "invalid"
    ) {
      invalidLinks.push("Portfolio");
    }

    if (invalidLinks.length > 0) {
      toast({
        title: "Cannot save profile",
        description: `Please fix the following links: ${invalidLinks.join(", ")}`,
        variant: "destructive",
        duration: 2000,
      });
      return;
    }

    setSaving(true);

    try {
      await studentService.updateById(selectedStudent.id, {
        fullName: selectedStudent.full_name || undefined,
        bio: selectedStudent.bio || undefined,
        email: selectedStudent.email,
        linkedin_url: selectedStudent.linkedin_url || undefined,
        github_url: selectedStudent.github_url || undefined,
        portfolio_url: selectedStudent.portfolio_url || undefined,
      });

      // update table immediately
      setStudents((prev) =>
        prev.map((s) =>
          s.id === selectedStudent.id
            ? {
                ...s,
                full_name: selectedStudent.full_name,
                email: selectedStudent.email,
              }
            : s,
        ),
      );

      toast({
        title: "Student saved!",
        description: "Changes have been updated.",
        duration: 3000,
      });

      setSelectedStudent(null);
    } catch {
      toast({
        title: "Error",
        description: "Failed to update student",
        variant: "destructive",
        duration: 2000,
      });
    } finally {
      setSaving(false);
    }
  };

  const validateEmail = (value: string) => {
    if (!value) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const getValidationState = (value: string, requiredDomain?: string) => {
    if (!value) return "empty";

    try {
      const parsed = new URL(value);

      if (requiredDomain && !parsed.hostname.includes(requiredDomain)) {
        return "invalid";
      }

      return "valid";
    } catch {
      return "invalid";
    }
  };

  useEffect(() => {
    const fetchStudents = async () => {
      setLoadingStudents(true);

      try {
        const data = await studentService.getAll();
        setStudents(data);
      } catch {
        toast({
          title: "Error",
          description: "Failed to load students",
          variant: "destructive",
        });
      } finally {
        setLoadingStudents(false);
      }
    };

    fetchStudents();
  }, []);

  return (
    <>
      <h1 className="text-3xl font-bold font-display text-foreground">
        <span className="text-gradient">Students</span>
      </h1>
      <p className="mt-1 text-muted-foreground">Manage all student profiles.</p>

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

        {loadingStudents ? (
          <div className="mt-8 mb-8 text-center text-muted-foreground">
            Loading students...
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-8 mb-8 text-center text-muted-foreground">
            No students found.
          </div>
        ) : (
          filtered.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.04 }}
              className="grid grid-cols-[2fr_2fr_1fr_auto] gap-4 items-center px-5 py-4 border-b border-border last:border-0 hover:bg-accent/20 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Initials name={s.full_name || s.username} />
                <span className="text-sm font-medium text-foreground">
                  {s.full_name || s.username}
                </span>
              </div>
              <span className="text-sm text-muted-foreground">{s.email}</span>
              <span className="text-sm text-muted-foreground">
                {s.courses_count}
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={async () => {
                  setLoadingProfile(true);

                  try {
                    const profile = await studentService.getById(s.id);
                    setSelectedStudent(profile);
                  } catch {
                    toast({
                      title: "Error",
                      description: "Failed to load student profile",
                      variant: "destructive",
                    });
                  } finally {
                    setLoadingProfile(false);
                  }
                }}
              >
                View / Edit
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

                {/* Basic info */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-hero-gradient flex items-center justify-center text-primary-foreground font-bold text-xl">
                    {selectedStudent.full_name
                      ? selectedStudent.full_name
                          .split(" ")
                          .map((w) => w[0])
                          .join("")
                          .toUpperCase()
                      : selectedStudent.username
                          .split(" ")
                          .map((w) => w[0])
                          .join("")
                          .toUpperCase()}
                  </div>
                  <div className="flex-1 space-y-3">
                    <div>
                      <label className="text-sm font-medium text-foreground">
                        Name
                      </label>
                      <Input
                        value={selectedStudent.full_name || ""}
                        onChange={(e) =>
                          setSelectedStudent({
                            ...selectedStudent,
                            full_name: e.target.value,
                          })
                        }
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">
                        Username
                      </label>
                      <Input
                        value={selectedStudent.username}
                        disabled
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground">
                    Email
                  </label>
                  <div className="relative mt-1">
                    <Input
                      value={selectedStudent.email}
                      onChange={(e) =>
                        setSelectedStudent({
                          ...selectedStudent,
                          email: e.target.value,
                        })
                      }
                      className="mt-1"
                      placeholder="student@edu.com"
                    />

                    {/* Validation icons */}
                    {selectedStudent.email &&
                      validateEmail(selectedStudent.email) && (
                        <CheckCircle2 className="absolute right-3 top-3 w-4 h-4 text-green-500" />
                      )}

                    {selectedStudent.email &&
                      !validateEmail(selectedStudent.email) && (
                        <XCircle className="absolute right-3 top-3 w-4 h-4 text-red-500" />
                      )}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground">
                    Bio
                  </label>
                  <Textarea
                    value={selectedStudent.bio}
                    onChange={(e) =>
                      setSelectedStudent({
                        ...selectedStudent,
                        bio: e.target.value,
                      })
                    }
                    className="mt-1 min-h-[90px]"
                  />
                </div>

                {/* Skills */}
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">
                    Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedStudent.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CV */}
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">
                    CV
                  </h4>

                  {selectedStudent.cv_url ? (
                    <a
                      href={selectedStudent.cv_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                    >
                      <Eye className="w-4 h-4" />
                      View CV
                    </a>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      No CV uploaded.
                    </p>
                  )}
                </div>

                {/* Links */}
                <div className="space-y-5">
                  {/* LinkedIn */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      LinkedIn Profile
                    </label>

                    <div className="relative">
                      <Linkedin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />

                      <Input
                        className="pl-9 pr-9"
                        placeholder="https://linkedin.com/in/username"
                        value={selectedStudent.linkedin_url}
                        onChange={(e) =>
                          setSelectedStudent({
                            ...selectedStudent,
                            linkedin_url: e.target.value,
                          })
                        }
                      />

                      {getValidationState(
                        selectedStudent.linkedin_url ?? "",
                        "linkedin.com",
                      ) === "valid" && (
                        <CheckCircle2 className="absolute right-3 top-3 w-4 h-4 text-green-500" />
                      )}

                      {getValidationState(
                        selectedStudent.linkedin_url ?? "",
                        "linkedin.com",
                      ) === "invalid" && (
                        <XCircle className="absolute right-3 top-3 w-4 h-4 text-red-500" />
                      )}
                    </div>
                  </div>

                  {/* GitHub */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      GitHub Profile
                    </label>

                    <div className="relative">
                      <Github className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />

                      <Input
                        className="pl-9 pr-9"
                        placeholder="https://github.com/username"
                        value={selectedStudent.github_url}
                        onChange={(e) =>
                          setSelectedStudent({
                            ...selectedStudent,
                            github_url: e.target.value,
                          })
                        }
                      />

                      {getValidationState(
                        selectedStudent.github_url ?? "",
                        "github.com",
                      ) === "valid" && (
                        <CheckCircle2 className="absolute right-3 top-3 w-4 h-4 text-green-500" />
                      )}
                      {getValidationState(
                        selectedStudent.github_url ?? "",
                        "github.com",
                      ) === "invalid" && (
                        <XCircle className="absolute right-3 top-3 w-4 h-4 text-red-500" />
                      )}
                    </div>
                  </div>

                  {/* Portfolio */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Portfolio Website
                    </label>

                    <div className="relative">
                      <Globe className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />

                      <Input
                        className="pl-9 pr-9"
                        placeholder="https://yourportfolio.com"
                        value={selectedStudent.portfolio_url}
                        onChange={(e) =>
                          setSelectedStudent({
                            ...selectedStudent,
                            portfolio_url: e.target.value,
                          })
                        }
                      />

                      {/* Portfolio */}
                      {getValidationState(
                        selectedStudent.portfolio_url ?? "",
                      ) === "valid" && (
                        <CheckCircle2 className="absolute right-3 top-3 w-4 h-4 text-green-500" />
                      )}
                      {getValidationState(
                        selectedStudent.portfolio_url ?? "",
                      ) === "invalid" && (
                        <XCircle className="absolute right-3 top-3 w-4 h-4 text-red-500" />
                      )}
                    </div>
                  </div>
                </div>

                <Button variant="hero" onClick={handleSave} disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminStudentsSection;
