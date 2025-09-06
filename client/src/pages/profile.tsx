import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { User, ArrowLeft, Settings } from "lucide-react";
import { type User as UserType } from "@shared/schema";

export default function Profile() {
  const { data: user } = useQuery<UserType>({
    queryKey: ["/api/user"]
  });

  return (
    <div className="pb-20">
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => window.history.back()}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
              data-testid="back-button"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center space-x-3">
              <User className="text-primary" size={24} />
              <h1 className="text-2xl font-bold" data-testid="profile-title">Profile</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Profile Info */}
        <Card className="mb-8 border border-border">
          <CardContent className="p-6">
            <div className="flex items-center space-x-6 mb-6">
              <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center">
                <User className="text-primary" size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-bold" data-testid="username">{user?.username}</h2>
                <p className="text-muted-foreground" data-testid="user-email">{user?.email}</p>
                <p className="text-primary font-semibold" data-testid="dog-name">
                  Training {user?.dogName}
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary" data-testid="total-xp">
                  {user?.totalXp || 0}
                </div>
                <div className="text-sm text-muted-foreground">Total XP</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary" data-testid="current-streak">
                  {user?.streak || 0}
                </div>
                <div className="text-sm text-muted-foreground">Day Streak</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">Level 1</div>
                <div className="text-sm text-muted-foreground">Beginner</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card className="border border-border">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Settings className="text-muted-foreground" size={20} />
              <h3 className="text-xl font-bold">Settings</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <h4 className="font-semibold">Notifications</h4>
                  <p className="text-sm text-muted-foreground">Daily training reminders</p>
                </div>
                <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm">
                  Configure
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <h4 className="font-semibold">Audio Settings</h4>
                  <p className="text-sm text-muted-foreground">Sound effects and pronunciation</p>
                </div>
                <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm">
                  Configure
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <h4 className="font-semibold">Dog Profile</h4>
                  <p className="text-sm text-muted-foreground">Update {user?.dogName}'s info</p>
                </div>
                <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm">
                  Edit
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <h4 className="font-semibold">Privacy</h4>
                  <p className="text-sm text-muted-foreground">Data and privacy settings</p>
                </div>
                <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm">
                  Manage
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
