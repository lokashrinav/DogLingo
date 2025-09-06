import { useQuery } from "@tanstack/react-query";
import { type UserAchievement, type Achievement } from "@shared/schema";

interface AchievementCardProps {
  userAchievement: UserAchievement;
}

export default function AchievementCard({ userAchievement }: AchievementCardProps) {
  const { data: achievements } = useQuery<Achievement[]>({
    queryKey: ["/api/achievements"]
  });

  const achievement = achievements?.find(a => a.id === userAchievement.achievementId);

  if (!achievement) {
    return null;
  }

  return (
    <div 
      className="bg-card p-4 rounded-lg border border-secondary/20 bounce-in polka-dots-card hover:scale-105 transition-all transform"
      data-testid={`achievement-card-${achievement.id}`}
    >
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-3 bg-secondary/20 rounded-full flex items-center justify-center polka-dots-subtle">
          <i className={`${achievement.icon} text-2xl text-secondary`}></i>
        </div>
        <h4 className="font-semibold mb-1" data-testid="achievement-title">
          {achievement.title}
        </h4>
        <p className="text-sm text-muted-foreground" data-testid="achievement-description">
          {achievement.description}
        </p>
        <div className="mt-2 text-xs text-secondary font-medium">
          +{achievement.xpReward} XP
        </div>
      </div>
    </div>
  );
}
