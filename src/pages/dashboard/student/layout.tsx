import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { navItems, notificationsData } from "./data/mockData";

interface StudentLayoutProps {
  activeSection: string;
  onNavigate: (section: string) => void;
  children: React.ReactNode;
}

const StudentLayout = ({ activeSection, onNavigate, children }: StudentLayoutProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigate = (section: string) => {
    onNavigate(section);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ── Top Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 h-16 z-40 bg-card border-b border-border">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-hero-gradient flex items-center justify-center">
              <Brain className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-foreground text-sm sm:text-base">
              EduRecruit<span className="text-primary">AI</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.slice(0, 3).map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all relative ${
                  activeSection === item.id
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                }`}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-2 ml-auto">
            {/* Utility Icons */}
            <div className="flex items-center gap-1 mr-2 border-r border-border pr-2">
              {navItems.slice(4, 6).map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigate(item.id)}
                  className={`flex items-center justify-center w-9 h-9 rounded-lg text-sm transition-all relative ${
                    activeSection === item.id
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  }`}
                  title={item.label}
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  {item.id === "notifications" &&
                    notificationsData.some((n) => !n.read) && (
                      <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-primary" />
                    )}
                </button>
              ))}
            </div>

            {/* Desktop sign out */}
            <Link to="/login">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-muted-foreground"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* ── Mobile Drawer ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm lg:hidden"
            />
            {/* Slide-down drawer */}
            <motion.div
              initial={{ y: "-100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border shadow-elevated lg:hidden"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-5 h-16 border-b border-border">
                <Link
                  to="/"
                  className="flex items-center gap-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div className="w-8 h-8 rounded-lg bg-hero-gradient flex items-center justify-center">
                    <Brain className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <span className="font-display font-bold text-foreground">
                    EduRecruit<span className="text-primary">AI</span>
                  </span>
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {/* Nav items */}
              <div className="p-4 space-y-1">
                {navItems.filter(item => item.id !== "assistant").map((item) => (
                  <button
                    key={item.id}
                    onClick={() => navigate(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all ${
                      activeSection === item.id
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                    }`}
                  >
                    <item.icon className="w-5 h-5 shrink-0" />
                    {item.label}
                    {item.id === "notifications" &&
                      notificationsData.some((n) => !n.read) && (
                        <div className="ml-auto w-2 h-2 rounded-full bg-primary" />
                      )}
                  </button>
                ))}
                <div className="pt-2 border-t border-border mt-2">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <button className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all">
                      <LogOut className="w-5 h-5 shrink-0" />
                      Sign Out
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Floating AI Button ── */}
      <AnimatePresence>
        {activeSection !== "assistant" && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("assistant")}
            className="fixed bottom-6 right-6 z-40 bg-hero-gradient text-primary-foreground px-5 py-3 rounded-full shadow-elevated flex items-center gap-2 font-medium hover:shadow-2xl transition-shadow"
          >
            <Brain className="w-5 h-5" />
            <span>AI Assistant</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Main content ── */}
      <main className="pt-16 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default StudentLayout;
