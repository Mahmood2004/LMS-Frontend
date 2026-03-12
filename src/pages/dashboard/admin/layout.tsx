import { Shield, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { adminSidebarItems } from "../shared/data/data";
import { useAuth } from "@/context/AuthContext";

interface AdminLayoutProps {
  activeSection: string;
  onNavigate: (section: string) => void;
  children: React.ReactNode;
}

const AdminLayout = ({
  activeSection,
  onNavigate,
  children,
}: AdminLayoutProps) => {
  const { logout } = useAuth();
  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 border-r border-border bg-card p-6 hidden lg:flex flex-col z-40">
        <Link to="/" className="flex items-center gap-2 mb-10">
          <div className="w-9 h-9 rounded-lg bg-hero-gradient flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-foreground">
            DigitalHub<span className="text-primary">LMS</span>
          </span>
        </Link>

        {/* Admin Info */}
        <div className="mb-4 px-3 py-2 rounded-lg bg-accent/50 border border-border">
          <p className="text-xs font-medium text-accent-foreground">
            Admin Portal
          </p>
          <p className="text-xs text-muted-foreground">System Administrator</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          {adminSidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                activeSection === item.id
                  ? "bg-accent text-accent-foreground font-medium shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              }`}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Sign Out */}
        <Button
          variant="ghost"
          onClick={logout}
          className="w-full justify-start gap-3 text-muted-foreground"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </Button>
      </aside>

      {/* Main content */}
      <main className="lg:ml-64 p-6 lg:p-10 max-w-6xl">{children}</main>
    </div>
  );
};

export default AdminLayout;
