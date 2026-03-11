import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import Initials from "../../shared/components/Initials";
import instructorService, {
  Instructor,
} from "@/services/admin/instructorService";

const AdminInstructorsSection = () => {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loadingInstructors, setLoadingInstructors] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedInstructor, setSelectedInstructor] =
    useState<Instructor | null>(null);

  const filtered = instructors
    .filter((inst) =>
      (inst.full_name || inst.username)
        .toLowerCase()
        .includes(search.toLowerCase()),
    )
    .sort((a, b) =>
      (a.full_name || a.username).localeCompare(b.full_name || b.username),
    );

  const validateEmail = (value: string) => {
    if (!value) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const handleSave = async () => {
    if (!selectedInstructor) return;

    if (!validateEmail(selectedInstructor.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }
    setSaving(true);
    try {
      const updated = await instructorService.updateById(
        selectedInstructor.id,
        {
          fullName: selectedInstructor.full_name || undefined,
          bio: selectedInstructor.bio || undefined,
          email: selectedInstructor.email,
        },
      );

      // update instructor in table
      setInstructors((prev) =>
        prev.map((inst) =>
          inst.id === selectedInstructor.id
            ? {
                ...inst,
                full_name: selectedInstructor.full_name,
                email: selectedInstructor.email,
              }
            : inst,
        ),
      );

      toast({
        title: "Instructor saved!",
        description: "Changes have been updated.",
        duration: 3000,
      });

      setSelectedInstructor(null);
    } catch (error) {
      toast({
        title: "Error saving instructor",
        description: "Please try again.",
        variant: "destructive",
        duration: 2000,
      });
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    const fetchInstructors = async () => {
      setLoadingInstructors(true);
      try {
        const data = await instructorService.getAll();
        setInstructors(data);
      } catch (error) {
        toast({
          title: "Error fetching instructors",
          description: "Could not load instructor data.",
          variant: "destructive",
          duration: 2000,
        });
      } finally {
        setLoadingInstructors(false);
      }
    };

    fetchInstructors();
  }, []);

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

        {loadingInstructors ? (
          <div className="mt-8 mb-8 text-center text-muted-foreground">
            Loading instructors...
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-8 mb-8 text-center text-muted-foreground">
            No instructors found.
          </div>
        ) : (
          filtered.map((inst, i) => (
            <motion.div
              key={inst.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.04 }}
              className="grid grid-cols-[2fr_2fr_auto] gap-4 items-center px-5 py-4 border-b border-border last:border-0 hover:bg-accent/20 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Initials name={inst.full_name || inst.username} />
                <span className="text-sm font-medium text-foreground">
                  {inst.full_name || inst.username}
                </span>
              </div>
              <span className="text-sm text-muted-foreground">
                {inst.email}
              </span>
              <Button
                size="sm"
                variant="outline"
                onClick={async () => {
                  try {
                    const profile = await instructorService.getById(inst.id);
                    setSelectedInstructor(profile);
                  } catch (error) {
                    toast({
                      title: "Error",
                      description: "Could not load instructor profile.",
                      variant: "destructive",
                      duration: 2000,
                    });
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
              {loadingProfile ? (
                <div className="mt-8 text-center text-muted-foreground">
                  Loading instructor profile...
                </div>
              ) : (
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
                      {selectedInstructor.full_name
                        ? selectedInstructor.full_name
                            .split(" ")
                            .map((w) => w[0])
                            .join("")
                            .toUpperCase()
                        : selectedInstructor.username
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
                          value={selectedInstructor.full_name || ""}
                          onChange={(e) =>
                            setSelectedInstructor({
                              ...selectedInstructor,
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
                          value={selectedInstructor.username}
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

                  <Button variant="hero" onClick={handleSave} disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminInstructorsSection;
