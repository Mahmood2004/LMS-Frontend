import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const ProfileSection = () => {
  const { toast } = useToast();
  const [name, setName] = useState("Dr. Sarah Chen");
  const [title, setTitle] = useState("Associate Professor · Computer Science");
  const [bio, setBio] = useState(
    "Researcher and educator specializing in distributed systems and React architecture.",
  );

  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <>
      <h1 className="text-3xl font-bold font-display text-foreground">
        My <span className="text-gradient">Profile</span>
      </h1>
      <p className="mt-1 text-muted-foreground">
        Manage your instructor profile.
      </p>
      <div className="mt-8 max-w-lg p-7 rounded-2xl bg-card border border-border shadow-card space-y-5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-hero-gradient flex items-center justify-center text-primary-foreground font-bold text-xl">
            {initials}
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-lg">{name}</h3>
            <p className="text-sm text-muted-foreground">instructor@edu.com</p>
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
            Title / Department
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground">Email</label>
          <Input defaultValue="instructor@edu.com" disabled className="mt-1" />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground">Bio</label>
          <Textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="mt-1 min-h-[90px]"
          />
        </div>
        <Button
          variant="hero"
          onClick={() =>
            toast({
              title: "Profile saved!",
              description: "Your changes have been updated.",
            })
          }
        >
          Save Changes
        </Button>
      </div>
    </>
  );
};

export default ProfileSection;
