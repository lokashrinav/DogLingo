import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, ArrowLeft } from "lucide-react";
import AchievementCard from "@/components/achievement-card";
import { type Achievement, type UserAchievement } from "@shared/schema";

export default function Achievements() {
  const { data: allAchievements } = useQuery<Achievement[]>({
    queryKey: ["/api/achievements"]
  });

  const { data: userAchievements } = useQuery<UserAchievement[]>({
    queryKey: ["/api/user", "user-1", "achievements"]
  });

  const unlockedIds = new Set(userAchievements?.map(ua => ua.achievementId) || []);

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
              <Trophy className="text-secondary" size={24} />
              <h1 className="text-2xl font-bold" data-testid="achievements-title">Achievements</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Unlocked Achievements */}
        {userAchievements && userAchievements.length > 0 && (
          <Card className="mb-8 border border-border">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4" data-testid="unlocked-achievements-title">
                Unlocked Achievements ({userAchievements.length})
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {userAchievements.map((userAchievement) => (
                  <AchievementCard 
                    key={userAchievement.id} 
                    userAchievement={userAchievement}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* All Achievements */}
        <Card className="border border-border">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4" data-testid="all-achievements-title">
              All Achievements
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {allAchievements?.map((achievement) => {
                const isUnlocked = unlockedIds.has(achievement.id);
                return (
                  <div 
                    key={achievement.id}
                    className={`p-4 rounded-lg border transition-all ${
                      isUnlocked 
                        ? 'bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20' 
                        : 'bg-muted/50 border-muted/20 opacity-60'
                    }`}
                    data-testid={`achievement-${achievement.id}`}
                  >
                    <div className="text-center">
                      <div className={`w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center ${
                        isUnlocked ? 'bg-secondary/20' : 'bg-muted/20'
                      }`}>
                        <i className={`${achievement.icon} text-2xl ${
                          isUnlocked ? 'text-secondary' : 'text-muted-foreground'
                        }`}></i>
                      </div>
                      <h4 className="font-semibold mb-1">{achievement.title}</h4>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      {!isUnlocked && (
                        <div className="mt-2 text-xs text-muted-foreground">
                          Requirement: {achievement.requirement} {achievement.type}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
