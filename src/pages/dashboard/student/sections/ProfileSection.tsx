import { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Upload,
  Linkedin,
  Github,
  Globe,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const ProfileSection = () => {
  const { toast } = useToast();
  const [name, setName] = useState("Alex Rivera");
  const [bio, setBio] = useState(
    "Computer Science student passionate about AI and distributed systems.",
  );
  const [phone, setPhone] = useState("+1 (555) 000-1234");
  const [cvFile, setCvFile] = useState<string | null>(null);
  const [linkedin, setLinkedin] = useState("");
  const [github, setGithub] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [dragging, setDragging] = useState(false);

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

  const handleSave = () => {
    toast({
      title: "Profile saved!",
      description: "Your changes have been updated.",
      duration: 3000,
    });
  };

  const handleSaveLinks = () => {
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

    toast({
      title: "Profile saved!",
      description: "Your changes have been updated.",
      duration: 3000,
    });
  };

  const handleCvDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) setCvFile(file.name);
  };

  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

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
              <p className="text-sm text-muted-foreground">student@edu.com</p>
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
            <label className="text-sm font-medium text-foreground">Email</label>
            <Input defaultValue="student@edu.com" className="mt-1" disabled />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Phone</label>
            <Input
              value={phone}
              onChange={(e) => {
                const numbersOnly = e.target.value.replace(/\D/g, "");
                setPhone(numbersOnly);
              }}
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground">Bio</label>
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="mt-1 min-h-[90px]"
            />
          </div>
          <Button variant="hero" onClick={handleSave}>
            Save Changes
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
                <p className="text-xs text-muted-foreground">
                  Uploaded just now
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCvFile(null)}
                className="shrink-0 text-muted-foreground"
              >
                Remove
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
                el.onchange = (ev) => {
                  const f = (ev.target as HTMLInputElement).files?.[0];
                  if (f) setCvFile(f.name);
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
            <Button variant="hero" onClick={handleSaveLinks}>
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileSection;
