import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, ArrowLeft } from "lucide-react";
import ProgressCircle from "@/components/ui/progress-circle";
import { type User, type Lesson, type UserProgress } from "@shared/schema";

export default function Progress() {
  const { data: user } = useQuery<User>({
    queryKey: ["/api/user"]
  });

  const { data: lessons } = useQuery<Lesson[]>({
    queryKey: ["/api/lessons"]
  });

  const { data: progress } = useQuery<UserProgress[]>({
    queryKey: ["/api/user", user?.id, "progress"],
    enabled: !!user?.id
  });

  // Calculate stats
  const totalLessons = lessons?.length || 0;
  const completedLessons = progress?.filter(p => p.completed).length || 0;
  const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  const averageScore = progress && progress.length > 0 ? 
    Math.round(progress.reduce((sum, p) => sum + p.score, 0) / progress.length) : 0;

  return (
    <div className="pb-20 min-h-screen bg-muted/30 polka-dots-accent">
      {/* Header */}
      <header className="bg-muted/30 backdrop-blur-sm border-b border-border sticky top-0 z-50 polka-dots-accent">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => window.history.back()}
              className="p-2 hover:bg-secondary/10 rounded-lg transition-all transform hover:scale-105"
              data-testid="back-button"
            >
              <ArrowLeft size={20} className="text-secondary" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center polka-dots-card">
                <BarChart3 className="text-secondary" size={20} />
              </div>
              <h1 className="text-2xl font-bold text-secondary" data-testid="progress-title">Your Progress</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Overall Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border border-border polka-dots-card">
            <CardContent className="p-6 text-center">
              <div className="mb-4">
                <ProgressCircle percentage={progressPercentage} size="small" />
              </div>
              <h3 className="font-semibold" data-testid="overall-progress">Overall Progress</h3>
              <p className="text-2xl font-bold text-secondary">{progressPercentage}%</p>
            </CardContent>
          </Card>

          <Card className="border border-border polka-dots-card">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-secondary/20 rounded-full flex items-center justify-center polka-dots-subtle">
                <i className="fas fa-graduation-cap text-secondary text-2xl"></i>
              </div>
              <h3 className="font-semibold" data-testid="completed-lessons">Completed Lessons</h3>
              <p className="text-2xl font-bold text-secondary">{completedLessons}/{totalLessons}</p>
            </CardContent>
          </Card>

          <Card className="border border-border polka-dots-card">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-accent/20 rounded-full flex items-center justify-center polka-dots-subtle">
                <i className="fas fa-star text-accent text-2xl"></i>
              </div>
              <h3 className="font-semibold" data-testid="average-score">Average Score</h3>
              <p className="text-2xl font-bold text-accent">{averageScore}%</p>
            </CardContent>
          </Card>

          <Card className="border border-border polka-dots-card">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-500/20 rounded-full flex items-center justify-center polka-dots-subtle">
                <i className="fas fa-fire text-green-600 text-2xl"></i>
              </div>
              <h3 className="font-semibold" data-testid="current-streak">Current Streak</h3>
              <p className="text-2xl font-bold text-green-600">{user?.streak || 0} days</p>
            </CardContent>
          </Card>
        </div>

        {/* Lesson Progress Details */}
        <Card className="border border-border polka-dots-card">
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4" data-testid="lesson-progress-title">Lesson Progress</h2>
            <div className="space-y-4">
              {lessons?.map((lesson) => {
                const lessonProgress = progress?.find(p => p.lessonId === lesson.id);
                const isCompleted = lessonProgress?.completed || false;
                const score = lessonProgress?.score || 0;
                
                return (
                  <div 
                    key={lesson.id}
                    className="flex items-center justify-between p-4 bg-muted/50 rounded-lg polka-dots-card hover:scale-105 transition-all transform"
                    data-testid={`lesson-progress-${lesson.id}`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        isCompleted ? 'bg-primary/20' : 'bg-muted/20'
                      }`}>
                        <i className={`${lesson.icon} ${
                          isCompleted ? 'text-primary' : 'text-muted-foreground'
                        }`}></i>
                      </div>
                      <div>
                        <h3 className="font-semibold">{lesson.title}</h3>
                        <p className="text-sm text-muted-foreground">{lesson.description}</p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      {isCompleted ? (
                        <>
                          <div className="text-lg font-bold text-primary">{score}%</div>
                          <div className="text-xs text-green-600">Completed</div>
                        </>
                      ) : (
                        <>
                          <div className="text-lg font-bold text-muted-foreground">
                            {lessonProgress ? `${score}%` : 'Not Started'}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {lessonProgress ? 'In Progress' : 'Locked'}
                          </div>
                        </>
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
