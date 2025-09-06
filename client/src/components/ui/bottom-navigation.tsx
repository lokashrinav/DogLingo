import { useLocation } from "wouter";
import { Home, BookOpen, Trophy, BarChart3, User } from "lucide-react";

const navItems = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/lessons", icon: BookOpen, label: "Lessons" },
  { path: "/achievements", icon: Trophy, label: "Achievements" },
  { path: "/progress", icon: BarChart3, label: "Progress" },
  { path: "/profile", icon: User, label: "Profile" },
];

export default function BottomNavigation() {
  const [location, setLocation] = useLocation();

  return (
    <nav className="bg-card border-t border-border fixed bottom-0 left-0 right-0 z-50">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-around py-3">
          {navItems.map(({ path, icon: Icon, label }) => {
            const isActive = location === path;
            return (
              <button
                key={path}
                onClick={() => setLocation(path)}
                className={`flex flex-col items-center space-y-1 p-2 transition-colors ${
                  isActive 
                    ? "text-primary" 
                    : "text-muted-foreground hover:text-primary"
                }`}
                data-testid={`nav-${label.toLowerCase()}`}
              >
                <Icon size={20} />
                <span className="text-xs font-medium">{label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
