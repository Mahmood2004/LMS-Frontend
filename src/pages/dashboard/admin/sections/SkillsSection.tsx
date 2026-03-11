import { useState, useEffect } from "react";
import { X, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { skillsService } from "@/services/admin/skillsService";

const SkillsSection = () => {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [loading, setLoading] = useState(true);
  const [pendingSkills, setPendingSkills] = useState<string[]>([]);

  const handleAddSkill = async () => {
    const trimmed = newSkill.trim();
    if (!trimmed) return;

    if (skills.includes(trimmed)) {
      toast({
        title: "Skill already exists",
        variant: "destructive",
        duration: 2000,
      });
      return;
    }

    if (pendingSkills.includes(trimmed)) return;

    setPendingSkills((prev) => [...prev, trimmed]);

    setSkills((prev) => [...prev, trimmed]);
    setNewSkill("");

    try {
      await skillsService.addSkills([trimmed]);

      toast({
        title: "Skill added",
        duration: 2000,
      });
    } catch {
      setSkills((prev) => prev.filter((s) => s !== trimmed));

      toast({
        title: "Error",
        description: "Failed to add skill",
        variant: "destructive",
        duration: 2000,
      });
    } finally {
      setPendingSkills((prev) => prev.filter((s) => s !== trimmed));
    }
  };

  const handleDeleteSkill = async (skill: string) => {
    if (pendingSkills.includes(skill)) return;

    setPendingSkills((prev) => [...prev, skill]);
    setSkills((prev) => prev.filter((s) => s !== skill));

    try {
      await skillsService.deleteSkills([skill]);

      toast({
        title: "Skill removed",
        duration: 2000,
      });
    } catch {
      setSkills((prev) => [...prev, skill]);

      toast({
        title: "Error",
        description: "Failed to delete skill",
        variant: "destructive",
        duration: 2000,
      });
    } finally {
      setPendingSkills((prev) => prev.filter((s) => s !== skill));
    }
  };

  useEffect(() => {
    const fetchSkills = async () => {
      setLoading(true);
      try {
        const data = await skillsService.getAllSkills();

        const skillNames = data.map((s: any) => s.name);
        setSkills(skillNames);
      } catch {
        toast({
          title: "Error",
          description: "Failed to load skills",
          variant: "destructive",
          duration: 2000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  return (
    <>
      <h1 className="text-3xl font-bold font-display text-foreground">
        <span className="text-gradient">Skills</span>
      </h1>
      <p className="mt-1 text-muted-foreground">
        View, add, or remove preset skills available to students.
      </p>
      <div className="mt-6 relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search skills..."
          className="pl-9"
        />
      </div>

      <div className="mt-6 p-6 rounded-2xl bg-card border border-border shadow-card space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Add new skill..."
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddSkill()}
          />
          <Button onClick={handleAddSkill} variant="hero" disabled={loading}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 mt-2">
          {loading && (
            <p className="mt-8 text-center text-muted-foreground">
              Loading skills...
            </p>
          )}

          {!loading && skills.length === 0 && (
            <p className="mt-8 text-center text-muted-foreground">
              No skills found
            </p>
          )}
          {!loading &&
            skills
              .filter((skill) =>
                skill.toLowerCase().includes(search.toLowerCase()),
              )
              .map((skill) => (
                <div
                  key={skill}
                  className={`flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm ${
                    pendingSkills.includes(skill) ? "opacity-50" : ""
                  }`}
                >
                  {skill}
                  <button
                    onClick={() => handleDeleteSkill(skill)}
                    disabled={pendingSkills.includes(skill)}
                    className={`ml-1 ${
                      pendingSkills.includes(skill)
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-red-500"
                    }`}
                  >
                    <X className="w-3 h-3 text-red-500" />
                  </button>
                </div>
              ))}
        </div>
      </div>
    </>
  );
};

export default SkillsSection;
