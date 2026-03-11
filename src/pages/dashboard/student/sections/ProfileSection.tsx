import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Upload,
  Linkedin,
  Github,
  Globe,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import profileService from "@/services/student/profileService";
import skillService from "@/services/student/skillService";

const ProfileSection = () => {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [cvFile, setCvFile] = useState<string | null>(null);
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [dragging, setDragging] = useState(false);
  const [skills, setSkills] = useState<string[]>([]);
  const [skillQuery, setSkillQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [allSkills, setAllSkills] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [linksSaving, setLinksSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [pendingSkills, setPendingSkills] = useState<string[]>([]);

  const validateUrl = (url: string, requiredDomain?: string) => {
    if (!url) return true;

    try {
      const parsed = new URL(url);

      if (requiredDomain && !parsed.hostname.includes(requiredDomain)) {
        return false;
      }

      return true;
    } catch {
      return false;
    }
  };

  const validateEmail = (email: string) => {
    if (!email) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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

  const addSkill = async (skill: string) => {
    if (pendingSkills.includes(skill)) return;

    setPendingSkills((prev) => [...prev, skill]);
    setSkills((prev) => [...prev, skill]);

    try {
      await skillService.addSkillsToUser([skill]);
      toast({
        title: "Skill added",
        description: `${skill} was added to your profile.`,
        duration: 3000,
      });
    } catch {
      setSkills((prev) => prev.filter((s) => s !== skill));
      toast({
        title: "Add failed",
        description: `Could not add ${skill}.`,
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setPendingSkills((prev) => prev.filter((s) => s !== skill));
    }
  };

  const removeSkill = async (skill: string) => {
    if (pendingSkills.includes(skill)) return;

    setPendingSkills((prev) => [...prev, skill]);
    setSkills((prev) => prev.filter((s) => s !== skill));

    try {
      await skillService.deleteSkillFromUser(skill);
      toast({
        title: "Skill removed",
        description: `${skill} was removed from your profile.`,
        duration: 3000,
      });
    } catch {
      setSkills((prev) => [...prev, skill]);
      toast({
        title: "Delete failed",
        description: `Could not remove ${skill}.`,
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setPendingSkills((prev) => prev.filter((s) => s !== skill));
    }
  };

  const handleSave = async () => {
    if (!validateEmail(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    try {
      setSaving(true);
      await profileService.updateProfile({
        fullName: name,
        bio,
        linkedin_url: linkedin,
        github_url: github,
        portfolio_url: portfolio,
        email,
      });

      toast({
        title: "Profile saved!",
        description: "Your changes have been updated.",
        duration: 3000,
      });
    } catch (err) {
      if (err?.response?.status === 500) {
        toast({
          title: "Profile saved!",
          description: "Your changes have been updated.",
          duration: 3000,
        });
      } else {
        toast({
          title: "Update failed",
          description: "Could not update profile.",
          variant: "destructive",
          duration: 3000,
        });
      }
    } finally {
      setSaving(false);
    }
  };

  const handleSaveLinks = async () => {
    const invalidLinks: string[] = [];

    if (!validateUrl(linkedin, "linkedin.com")) invalidLinks.push("LinkedIn");
    if (!validateUrl(github, "github.com")) invalidLinks.push("GitHub");
    if (!validateUrl(portfolio)) invalidLinks.push("Portfolio");

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

    try {
      setLinksSaving(true);
      await profileService.updateProfile({
        linkedin_url: linkedin,
        github_url: github,
        portfolio_url: portfolio,
      });

      toast({
        title: "Profile saved!",
        description: "Your changes have been updated.",
        duration: 3000,
      });
    } catch {
      toast({
        title: "Update failed",
        description: "Could not update profile.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setLinksSaving(false);
    }
  };

  const handleCvDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      try {
        await profileService.uploadCV(file);
        setCvFile(file.name);

        toast({
          title: "CV uploaded",
          description: "Your CV was uploaded successfully.",
          duration: 3000,
        });
      } catch {
        toast({
          title: "Upload failed",
          description: "Could not upload CV.",
          variant: "destructive",
          duration: 3000,
        });
      }
    }
  };

  const initials = name
    ? name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "ST";

  useEffect(() => {
    const fetchAllSkills = async () => {
      try {
        const skillsFromServer = await skillService.getAllSkills();
        setAllSkills(skillsFromServer.map((s) => s.name));
      } catch {
        setAllSkills([]);
      }
    };
    fetchAllSkills();
  }, []);

  const filteredSkills = allSkills.filter(
    (skill) =>
      skill.toLowerCase().includes(skillQuery.toLowerCase()) &&
      !skills.includes(skill),
  );

  useEffect(() => {
    const fetchProfileAndSkills = async () => {
      try {
        const profile = await profileService.getProfile();
        setName(profile.full_name ?? "");
        setUsername(profile.username ?? "");
        setEmail(profile.email ?? "");
        setBio(profile.bio ?? "");

        setLinkedin(profile.linkedin_url ?? "");
        setGithub(profile.github_url ?? "");
        setPortfolio(profile.portfolio_url ?? "");

        if (profile.cv_url) {
          const filename = profile.cv_url.split("/").pop();
          setCvFile(filename ?? "cv.pdf");
        }

        // Fetch user skills
        try {
          const userSkills = await skillService.getUserSkills();
          setSkills(userSkills.skills);
        } catch {
          setSkills([]);
        }

        setLoading(false);
      } catch (error) {
        toast({
          title: "Failed to load profile",
          description: "Could not fetch your profile data.",
          variant: "destructive",
          duration: 3000,
        });

        setLoading(false);
      }
    };

    fetchProfileAndSkills();
  }, []);

  if (loading) {
    return (
      <div className="py-16 text-center text-muted-foreground">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-2xl sm:text-3xl font-bold font-display text-foreground">
        Profile <span className="text-gradient">& CV</span>
      </h1>
      <p className="mt-1 text-muted-foreground">
        Manage your personal information and upload your CV.
      </p>

      <div className="mt-6 sm:mt-8 grid lg:grid-cols-5 gap-6">
        {/* Profile form */}
        <div className="lg:col-span-3 p-5 sm:p-7 rounded-2xl bg-card border border-border shadow-card space-y-5">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-16 h-16 rounded-full bg-hero-gradient flex items-center justify-center text-primary-foreground font-bold text-xl shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-foreground text-lg truncate">
                {name}
              </h3>
              <p className="text-sm text-muted-foreground">{email}</p>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">
              Full Name
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">
              Username
            </label>
            <Input value={username} className="mt-1" disabled />
            <p className="text-xs text-muted-foreground mt-1">
              Username is assigned by the administrator and cannot be changed.
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Email</label>
            <div className="relative">
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 pr-9"
              />

              {email && validateEmail(email) && (
                <CheckCircle2 className="absolute right-3 top-3 w-4 h-4 text-green-500" />
              )}

              {email && !validateEmail(email) && (
                <XCircle className="absolute right-3 top-3 w-4 h-4 text-red-500" />
              )}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Bio</label>
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="mt-1 min-h-[90px]"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">
              Skills
            </label>

            {/* Selected Skills */}
            <div className="flex flex-wrap gap-2 mt-2 mb-2">
              {skills.map((skill) => (
                <div
                  key={skill}
                  className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm flex items-center gap-2"
                >
                  {skill}
                  <button
                    onClick={() => removeSkill(skill)}
                    disabled={pendingSkills.includes(skill)}
                    className={`text-xs ${pendingSkills.includes(skill) ? "text-gray-400 cursor-not-allowed" : "hover:text-red-500"}`}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative">
              <Input
                placeholder="Search and add skills..."
                value={skillQuery}
                onChange={(e) => {
                  setSkillQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                className="mt-1"
              />

              {/* Suggestions Dropdown */}
              {showSuggestions && skillQuery && filteredSkills.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-xl shadow-lg max-h-48 overflow-y-auto">
                  {filteredSkills.map((skill) => (
                    <div
                      key={skill}
                      onClick={() =>
                        !pendingSkills.includes(skill) && addSkill(skill)
                      }
                      className={`px-4 py-2 text-sm hover:bg-accent cursor-pointer transition-colors ${
                        pendingSkills.includes(skill)
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      {skill}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <Button variant="hero" onClick={handleSave} disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {saving ? "Saving changes..." : "Save Changes"}
          </Button>
        </div>

        {/* Links & CV section */}
        <div className="lg:col-span-2 p-5 sm:p-7 rounded-2xl bg-card border border-border shadow-card space-y-4">
          <div>
            <h2 className="text-lg font-semibold font-display text-foreground">
              Links & CV
            </h2>
            <p className="text-sm text-muted-foreground">
              Share your professional links with recruiters.
            </p>
          </div>

          {/* CV Upload */}
          {cvFile ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 rounded-xl border border-border bg-secondary/50 flex items-center gap-3"
            >
              <FileText className="w-8 h-8 text-primary shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {cvFile}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                disabled={uploading}
                onClick={async () => {
                  try {
                    setUploading(true); // show "Removing..."
                    await profileService.deleteCV();
                    setCvFile(null);
                    setUploading(false);

                    toast({
                      title: "CV removed",
                      description: "Your CV has been deleted.",
                      duration: 3000,
                    });
                  } catch {
                    setUploading(false);
                    toast({
                      title: "Delete failed",
                      variant: "destructive",
                      duration: 3000,
                    });
                  }
                }}
                className="shrink-0 text-muted-foreground"
              >
                {uploading ? "Removing..." : "Remove"}
              </Button>
            </motion.div>
          ) : (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleCvDrop}
              onClick={() => {
                const el = document.createElement("input");
                el.type = "file";
                el.accept = ".pdf";

                el.onchange = async (ev) => {
                  const f = (ev.target as HTMLInputElement).files?.[0];
                  if (f) {
                    try {
                      setUploading(true);
                      await profileService.uploadCV(f);
                      setCvFile(f.name);
                      setUploading(false);

                      toast({
                        title: "CV uploaded",
                        description: "Your CV was uploaded successfully.",
                        duration: 3000,
                      });
                    } catch {
                      setUploading(false);
                      toast({
                        title: "Upload failed",
                        description: "Could not upload CV.",
                        variant: "destructive",
                        duration: 3000,
                      });
                    }
                  }
                };

                el.click();
              }}
              className={`border-2 border-dashed rounded-xl p-8 sm:p-10 text-center cursor-pointer transition-colors ${
                dragging
                  ? "border-primary bg-accent/50"
                  : "border-border hover:border-primary/50 hover:bg-accent/20"
              }`}
            >
              <Upload className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">
                Upload your CV (PDF)
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Drag & drop or click to browse
              </p>
            </div>
          )}

          {/* LinkedIn */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              LinkedIn Profile
            </label>

            <div className="relative">
              <Linkedin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />

              <Input
                className="pl-9 pr-9"
                placeholder="https://linkedin.com/in/yourname"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
              />

              {getValidationState(linkedin, "linkedin.com") === "valid" && (
                <CheckCircle2 className="absolute right-3 top-3 w-4 h-4 text-green-500" />
              )}

              {getValidationState(linkedin, "linkedin.com") === "invalid" && (
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
                placeholder="https://github.com/yourusername"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
              />

              {getValidationState(github, "github.com") === "valid" && (
                <CheckCircle2 className="absolute right-3 top-3 w-4 h-4 text-green-500" />
              )}

              {getValidationState(github, "github.com") === "invalid" && (
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
                value={portfolio}
                onChange={(e) => setPortfolio(e.target.value)}
              />

              {getValidationState(portfolio) === "valid" && (
                <CheckCircle2 className="absolute right-3 top-3 w-4 h-4 text-green-500" />
              )}

              {getValidationState(portfolio) === "invalid" && (
                <XCircle className="absolute right-3 top-3 w-4 h-4 text-red-500" />
              )}
            </div>
          </div>
          <div className="flex justify-end pt-4 ">
            <Button
              variant="hero"
              onClick={handleSaveLinks}
              disabled={linksSaving}
            >
              {linksSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {linksSaving ? "Saving changes..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileSection;
