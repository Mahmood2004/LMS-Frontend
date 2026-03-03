import { useState } from "react";
import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { PRESET_SKILLS } from "../data/skills";

const SkillsSection = () => {
  const { toast } = useToast();
  const [skills, setSkills] = useState<string[]>([...PRESET_SKILLS]);
  const [newSkill, setNewSkill] = useState("");

  const handleAddSkill = () => {
    const trimmed = newSkill.trim();
    if (!trimmed) return;

    if (skills.includes(trimmed)) {
      toast({
        title: "Skill already exists",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    setSkills([...skills, trimmed]);
    setNewSkill("");
    toast({
      title: "Skill added",
      duration: 3000,
    });
  };

  const handleDeleteSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
    toast({
      title: "Skill removed",
      variant: "destructive",
      duration: 3000,
    });
  };

  return (
    <>
      <h1 className="text-3xl font-bold font-display text-foreground">
        <span className="text-gradient">Skills</span>
      </h1>
      <p className="mt-1 text-muted-foreground">
        View, add, or remove preset skills available to students.
      </p>

      <div className="mt-6 max-w-2xl p-6 rounded-2xl bg-card border border-border shadow-card space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Add new skill..."
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddSkill()}
          />
          <Button onClick={handleAddSkill} variant="hero">
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 mt-2">
          {skills.map((skill) => (
            <div
              key={skill}
              className="flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
            >
              {skill}
              <button onClick={() => handleDeleteSkill(skill)}>
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
