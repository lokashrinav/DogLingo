import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Dog, Flame, User } from "lucide-react";
import ProgressCircle from "@/components/ui/progress-circle";
import AchievementCard from "@/components/achievement-card";
import LessonCard from "@/components/lesson-card";
import { type User as UserType, type Lesson, type UserProgress, type UserAchievement } from "@shared/schema";

export default function Home() {
  const { data: user, isLoading: userLoading } = useQuery<UserType>({
    queryKey: ["/api/user"]
  });

  const { data: lessons, isLoading: lessonsLoading } = useQuery<Lesson[]>({
    queryKey: ["/api/lessons"]
  });

  const { data: progress } = useQuery<UserProgress[]>({
    queryKey: ["/api/user", user?.id, "progress"],
    enabled: !!user?.id
  });

  const { data: userAchievements } = useQuery<UserAchievement[]>({
    queryKey: ["/api/user", user?.id, "achievements"],
    enabled: !!user?.id
  });

  // Calculate overall progress
  const totalLessons = lessons?.length || 0;
  const completedLessons = progress?.filter(p => p.completed).length || 0;
  const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  // Get current lesson (first incomplete lesson)
  const currentLesson = lessons?.find(lesson => {
    const lessonProgress = progress?.find(p => p.lessonId === lesson.id);
    return !lessonProgress?.completed;
  });

  if (userLoading || lessonsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="pb-20 min-h-screen bg-muted/30 polka-dots-accent">
      {/* Header */}
      <header className="bg-muted/30 backdrop-blur-sm border-b border-border sticky top-0 z-50 polka-dots-accent">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center polka-dots-card">
                <Dog className="text-secondary" size={20} />
              </div>
              <h1 className="text-2xl font-bold text-secondary" data-testid="app-title">DogLingo</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Streak Counter */}
              <div className="flex items-center space-x-2 bg-secondary/20 px-3 py-2 rounded-full polka-dots-subtle">
                <Flame className="text-secondary" size={16} />
                <span className="font-semibold text-secondary" data-testid="streak-counter">
                  {user?.streak || 0}
                </span>
              </div>
              
              {/* Profile */}
              <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center polka-dots-subtle">
                <User className="text-accent" size={16} />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Progress Overview */}
        <Card className="mb-8 border border-border polka-dots-card">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="text-center lg:text-left">
                <h2 className="text-3xl font-bold mb-2" data-testid="welcome-message">
                  Welcome back, {user?.username || 'Human'}!
                </h2>
                <p className="text-muted-foreground text-lg">
                  Ready to learn how to <span className="text-secondary font-semibold">BARK</span> like a real dog?
                </p>
              </div>
              
              <ProgressCircle percentage={progressPercentage} />
            </div>
          </CardContent>
        </Card>

        {/* Current Lesson */}
        {currentLesson && (
          <Card className="mb-8 border border-border overflow-hidden polka-dots-card">
            <div className="bg-secondary text-secondary-foreground p-6 polka-dots-subtle">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold mb-2" data-testid="current-lesson-title">
                    {currentLesson.title}
                  </h3>
                  <p className="opacity-90" data-testid="current-lesson-description">
                    {currentLesson.description}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">
                    {progress?.find(p => p.lessonId === currentLesson.id)?.score || 0}%
                  </div>
                  <div className="text-sm opacity-90">complete</div>
                </div>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="flex gap-4">
                <button 
                  className="flex-1 bg-secondary text-secondary-foreground py-3 px-6 rounded-lg font-semibold hover:bg-secondary/90 transition-all transform hover:scale-105"
                  data-testid="continue-lesson-button"
                  onClick={() => window.location.href = `/lesson/${currentLesson.id}`}
                >
                  Continue Lesson
                </button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Achievements */}
        {userAchievements && userAchievements.length > 0 && (
          <Card className="mb-8 border border-border polka-dots-card">
            <CardContent className="p-6">
              <div className="border-b border-border pb-4 mb-6">
                <h3 className="text-xl font-bold flex items-center gap-2" data-testid="achievements-title">
                  <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center polka-dots-subtle">
                    <i className="fas fa-trophy text-accent"></i>
                  </div>
                  Recent Achievements
                </h3>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {userAchievements.slice(-3).map((userAchievement) => (
                  <AchievementCard 
                    key={userAchievement.id} 
                    userAchievement={userAchievement}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Lesson Library */}
        <Card className="border border-border polka-dots-card">
          <CardContent className="p-6">
            <div className="border-b border-border pb-4 mb-6">
              <h3 className="text-xl font-bold" data-testid="lessons-title">Barking Lessons</h3>
              <p className="text-muted-foreground mt-1">Choose your next lesson to master dog language</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {lessons?.map((lesson) => {
                const lessonProgress = progress?.find(p => p.lessonId === lesson.id);
                return (
                  <LessonCard 
                    key={lesson.id} 
                    lesson={lesson} 
                    progress={lessonProgress}
                  />
                );
              })}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
