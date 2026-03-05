import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Search,
  X,
  Linkedin,
  Github,
  Globe,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { studentsData } from "../data/mockData";
import { useToast } from "@/hooks/use-toast";
import Initials from "../../shared/components/Initials";

const AdminStudentsSection = () => {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<
    (typeof studentsData)[0] | null
  >(null);

  const filtered = studentsData.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSave = () => {
    if (!selectedStudent) return;

    // Email validation
    if (!validateEmail(selectedStudent.email)) {
      toast({
        title: "Cannot save profile",
        description: "Please enter a valid email address.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    const invalidLinks: string[] = [];

    if (
      selectedStudent.linkedin &&
      getValidationState(selectedStudent.linkedin, "linkedin.com") === "invalid"
    ) {
      invalidLinks.push("LinkedIn");
    }

    if (
      selectedStudent.github &&
      getValidationState(selectedStudent.github, "github.com") === "invalid"
    ) {
      invalidLinks.push("GitHub");
    }

    if (
      selectedStudent.portfolio &&
      getValidationState(selectedStudent.portfolio) === "invalid"
    ) {
      invalidLinks.push("Portfolio");
    }

    if (invalidLinks.length > 0) {
      toast({
        title: "Cannot save profile",
        description: `Please fix the following links: ${invalidLinks.join(
          ", ",
        )}.`,
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    // Everything valid
    toast({
      title: "Student saved!",
      description: "Changes have been updated.",
      duration: 3000,
    });

    setSelectedStudent(null);
  };

  const handleCvUpload = (file: File) => {
    if (!selectedStudent) return;

    const updatedStudent = {
      ...selectedStudent,
      cvUrl: URL.createObjectURL(file),
    };

    setSelectedStudent(updatedStudent);
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
              onClick={() => setSelectedStudent(s)}
            >
              View / Edit
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

                {/* Basic info */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-hero-gradient flex items-center justify-center text-primary-foreground font-bold text-xl">
                    {selectedStudent.name
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
                        value={selectedStudent.name}
                        onChange={(e) =>
                          setSelectedStudent({
                            ...selectedStudent,
                            name: e.target.value,
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

                  {/* Hidden file input */}
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    id="cv-upload"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleCvUpload(file);
                    }}
                  />

                  {/* Upload button */}
                  <div className="mt-3">
                    <label htmlFor="cv-upload">
                      <span className="inline-flex items-center gap-2 cursor-pointer text-sm px-4 py-2 rounded-lg border border-border bg-secondary hover:bg-accent transition-colors">
                        Upload New CV
                      </span>
                    </label>
                  </div>
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
                        value={selectedStudent.linkedin}
                        onChange={(e) =>
                          setSelectedStudent({
                            ...selectedStudent,
                            linkedin: e.target.value,
                          })
                        }
                      />

                      {getValidationState(
                        selectedStudent.linkedin ?? "",
                        "linkedin.com",
                      ) === "valid" && (
                        <CheckCircle2 className="absolute right-3 top-3 w-4 h-4 text-green-500" />
                      )}

                      {getValidationState(
                        selectedStudent.linkedin ?? "",
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
                        value={selectedStudent.github}
                        onChange={(e) =>
                          setSelectedStudent({
                            ...selectedStudent,
                            github: e.target.value,
                          })
                        }
                      />

                      {getValidationState(
                        selectedStudent.github ?? "",
                        "github.com",
                      ) === "valid" && (
                        <CheckCircle2 className="absolute right-3 top-3 w-4 h-4 text-green-500" />
                      )}
                      {getValidationState(
                        selectedStudent.github ?? "",
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
                        value={selectedStudent.portfolio}
                        onChange={(e) =>
                          setSelectedStudent({
                            ...selectedStudent,
                            portfolio: e.target.value,
                          })
                        }
                      />

                      {/* Portfolio */}
                      {getValidationState(selectedStudent.portfolio ?? "") ===
                        "valid" && (
                        <CheckCircle2 className="absolute right-3 top-3 w-4 h-4 text-green-500" />
                      )}
                      {getValidationState(selectedStudent.portfolio ?? "") ===
                        "invalid" && (
                        <XCircle className="absolute right-3 top-3 w-4 h-4 text-red-500" />
                      )}
                    </div>
                  </div>
                </div>

                <Button variant="hero" onClick={handleSave}>
                  Save Changes
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
