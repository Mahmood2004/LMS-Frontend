import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Brain, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulated login - will be replaced with real auth
    setTimeout(() => {
      setIsLoading(false);
      // Demo routing based on email pattern
      if (email.includes("instructor")) {
        navigate("/dashboard/instructor");
      } else {
        navigate("/dashboard/student");
      }
      toast({
        title: "Welcome back!",
        description: "You've been signed in successfully.",
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left panel - branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-hero-gradient relative items-center justify-center p-12">
        <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-5" />
        <div className="relative z-10 max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center backdrop-blur-sm">
              <Brain className="w-7 h-7 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-2xl text-primary-foreground">
              EduRecruitAI
            </span>
          </div>
          <h2 className="text-3xl font-bold font-display text-primary-foreground leading-tight">
            AI-Verified Skills.
            <br />
            Trusted Talent Pipeline.
          </h2>
          <p className="mt-4 text-primary-foreground/80 text-lg leading-relaxed">
            Your organization has pre-provisioned your account. Sign in with
            your credentials to access courses, grades, and AI-powered tools.
          </p>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>

          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-lg bg-hero-gradient flex items-center justify-center">
              <Brain className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-lg text-foreground">
              EduRecruit<span className="text-primary">AI</span>
            </span>
          </div>

          <h1 className="text-2xl font-bold font-display text-foreground">
            Welcome back
          </h1>
          <p className="mt-2 text-muted-foreground">
            Sign in with your pre-provisioned credentials.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@organization.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="hero"
              className="w-full py-5"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 p-4 rounded-lg bg-accent/50 border border-border">
            <p className="text-xs font-semibold text-foreground mb-2">
              🔑 Test Credentials:
            </p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p>
                <span className="font-medium text-foreground">Instructor:</span>{" "}
                instructor@edu.com / pass123
              </p>
              <p>
                <span className="font-medium text-foreground">Student:</span>{" "}
                student@edu.com / pass123
              </p>
            </div>
          </div>

          <p className="mt-4 text-xs text-center text-muted-foreground">
            No public registration. Accounts are provisioned by your
            organization.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
