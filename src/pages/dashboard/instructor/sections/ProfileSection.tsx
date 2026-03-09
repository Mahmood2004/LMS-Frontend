import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { XCircle, CheckCircle2, Loader2 } from "lucide-react";
import profileServices from "@/services/instructor/profileServices";

const ProfileSection = () => {
  const { toast } = useToast();

  // ✅ All start as empty strings — hardcoded values were the bug
  const [name,     setName]     = useState("");
  const [username, setUsername] = useState("");
  const [email,    setEmail]    = useState("");
  const [bio,      setBio]      = useState("");
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);

  // Generates initials from name for the avatar
  // Falls back to "IN" while name is empty during loading
  const initials = name
    ? name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
    : "IN";

  const validateEmail = (value: string) => {
    if (!value) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  // Fetch profile once when component mounts
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const profile = await profileServices.getProfile();

        // Fill all states with real data from the backend
        setName(profile.full_name ?? "");
        setUsername(profile.username ?? "");
        setEmail(profile.email ?? "");
        setBio(profile.bio ?? "");

      } catch (err: any) {
        toast({
          title: "Failed to load profile",
          description: err.response?.data?.message ?? "Could not fetch profile data.",
          variant: "destructive",
          duration: 3000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []); // ← empty array: runs only once on mount

  // Save changes back to the backend
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
      await profileServices.updateProfile({
        fullName: name,
        bio,
        email,
      });

      toast({
        title: "Profile saved!",
        description: "Your changes have been updated.",
        duration: 3000,
      });
    } catch (err: any) {
      toast({
        title: "Update failed",
        description: err.response?.data?.message ?? "Could not update profile.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setSaving(false);
    }
  };

  // Show loading state while fetching
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        Loading profile...
      </div>
    );
  }

  return (
    <>
      <h1 className="text-3xl font-bold font-display text-foreground">
        My <span className="text-gradient">Profile</span>
      </h1>
      <p className="mt-1 text-muted-foreground">
        Manage your instructor profile.
      </p>

      <div className="mt-8 max-w-lg p-7 rounded-2xl bg-card border border-border shadow-card space-y-5">

        {/* Avatar + name + email header */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-hero-gradient flex items-center justify-center text-primary-foreground font-bold text-xl">
            {initials}
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-lg">{name}</h3>
            <p className="text-sm text-muted-foreground">{email}</p> {/* ✅ uses state, not hardcoded */}
          </div>
        </div>

        {/* Full Name */}
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

        {/* Username — read only, set by admin */}
        <div>
          <label className="text-sm font-medium text-foreground">
            Username
          </label>
          <Input
            value={username}
            className="mt-1"
            disabled
          />
          <p className="text-xs text-muted-foreground mt-1">
            Username is assigned by the administrator and cannot be changed.
          </p>
        </div>

        {/* Email with validation icon */}
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

        {/* Bio */}
        <div>
          <label className="text-sm font-medium text-foreground">Bio</label>
          <Textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="mt-1 min-h-[90px]"
          />
        </div>

        {/* Save button */}
        <Button
          variant="hero"
          onClick={handleSave}
          disabled={saving}
          className="w-full"
        >
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {saving ? "Saving..." : "Save Changes"}
        </Button>

      </div>
    </>
  );
};

export default ProfileSection;