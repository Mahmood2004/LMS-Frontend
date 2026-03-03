import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import Initials from "../../shared/components/Initials";
import { instructorsData } from "../data/mockData"; // you'll create this similar to studentsData

const AdminInstructorsSection = () => {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [selectedInstructor, setSelectedInstructor] = useState<
    (typeof instructorsData)[0] | null
  >(null);

  const filtered = instructorsData.filter((inst) =>
    inst.name.toLowerCase().includes(search.toLowerCase()),
  );

  const validateEmail = (value: string) => {
    if (!value) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const handleSave = () => {
    if (!selectedInstructor) return;

    if (!validateEmail(selectedInstructor.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    toast({
      title: "Instructor saved!",
      description: "Changes have been updated.",
      duration: 3000,
    });

    setSelectedInstructor(null);
  };

  return (
    <>
      <h1 className="text-3xl font-bold font-display text-foreground">
        <span className="text-gradient">Instructors</span>
      </h1>
      <p className="mt-1 text-muted-foreground">
        Manage all instructor profiles.
      </p>

      <div className="mt-6 relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search instructors..."
          className="pl-9"
        />
      </div>

      <div className="mt-6 rounded-2xl bg-card border border-border shadow-card overflow-hidden">
        <div className="grid grid-cols-[2fr_2fr_auto] gap-4 px-5 py-3 border-b border-border bg-secondary/30">
          {["Name", "Email", ""].map((h) => (
            <span
              key={h}
              className="text-xs font-semibold text-muted-foreground uppercase tracking-wide"
            >
              {h}
            </span>
          ))}
        </div>

        {filtered.map((inst, i) => (
          <motion.div
            key={inst.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.04 }}
            className="grid grid-cols-[2fr_2fr_auto] gap-4 items-center px-5 py-4 border-b border-border last:border-0 hover:bg-accent/20 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Initials name={inst.name} />
              <span className="text-sm font-medium text-foreground">
                {inst.name}
              </span>
            </div>
            <span className="text-sm text-muted-foreground">{inst.email}</span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSelectedInstructor(inst)}
            >
              View / Edit
            </Button>
          </motion.div>
        ))}
      </div>

      {/* Side panel */}
      <AnimatePresence>
        {selectedInstructor && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedInstructor(null)}
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
                    Instructor Profile
                  </h2>
                  <button
                    onClick={() => setSelectedInstructor(null)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-hero-gradient flex items-center justify-center text-primary-foreground font-bold text-xl">
                    {selectedInstructor.name
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
                        value={selectedInstructor.name}
                        onChange={(e) =>
                          setSelectedInstructor({
                            ...selectedInstructor,
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
                        value={selectedInstructor.username}
                        onChange={(e) =>
                          setSelectedInstructor({
                            ...selectedInstructor,
                            username: e.target.value,
                          })
                        }
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
                      value={selectedInstructor.email}
                      onChange={(e) =>
                        setSelectedInstructor({
                          ...selectedInstructor,
                          email: e.target.value,
                        })
                      }
                      className="pr-9"
                      placeholder="instructor@edu.com"
                    />

                    {/* Validation icons */}
                    {selectedInstructor.email &&
                      validateEmail(selectedInstructor.email) && (
                        <CheckCircle2 className="absolute right-3 top-3 w-4 h-4 text-green-500" />
                      )}

                    {selectedInstructor.email &&
                      !validateEmail(selectedInstructor.email) && (
                        <XCircle className="absolute right-3 top-3 w-4 h-4 text-red-500" />
                      )}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground">
                    Bio
                  </label>
                  <Textarea
                    value={selectedInstructor.bio}
                    onChange={(e) =>
                      setSelectedInstructor({
                        ...selectedInstructor,
                        bio: e.target.value,
                      })
                    }
                    className="mt-1 min-h-[90px]"
                  />
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

export default AdminInstructorsSection;
