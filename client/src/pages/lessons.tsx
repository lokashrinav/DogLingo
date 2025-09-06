import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Star, Lock, Users } from "lucide-react";
import { type Lesson } from "@shared/schema";

export default function Lessons() {
  const { data: lessons, isLoading } = useQuery<Lesson[]>({
    queryKey: ["/api/lessons"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Group lessons by category
  const groupedLessons = lessons?.reduce((groups, lesson) => {
    const category = lesson.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(lesson);
    return groups;
  }, {} as Record<string, Lesson[]>) || {};

  const getCategoryDisplayName = (category: string) => {
    const categoryNames: Record<string, string> = {
      "basic-commands": "🎯 Basic Commands",
      "puppy-training": "🐶 Puppy Training", 
      "communication": "🗣️ Dog Communication & Barking",
      "advanced-commands": "⭐ Advanced Commands",
      "behavior-modification": "🔧 Behavior Modification",
      "tricks": "🎭 Trick Training",
      "body-language": "👁️ Body Language Reading",
      "agility": "🏃 Agility & Sports",
      "advanced-communication": "🧠 Advanced Communication",
      "specialized": "🎖️ Specialized Training",
      "master": "👑 Master Level"
    };
    return categoryNames[category] || category;
  };

  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1: return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case 2: return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case 3: return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case 4: return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case 5: return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getDifficultyText = (difficulty: number) => {
    switch (difficulty) {
      case 1: return "Beginner";
      case 2: return "Easy";
      case 3: return "Intermediate";
      case 4: return "Advanced";
      case 5: return "Master";
      default: return "Unknown";
    }
  };

  return (
    <div className="pb-20 min-h-screen">
      {/* Header */}
      <header className="bg-card shadow-sm border-b border-border sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2" data-testid="lessons-title">
              🎓 All Lessons
            </h1>
            <p className="text-muted-foreground" data-testid="lessons-subtitle">
              Master dog training from basic commands to advanced communication
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {Object.entries(groupedLessons)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([category, categoryLessons]) => (
          <div key={category} className="mb-8">
            <h2 className="text-2xl font-bold mb-4 polka-dots-pattern rounded-lg p-4 bg-gradient-to-r from-primary/10 to-accent/10">
              {getCategoryDisplayName(category)}
            </h2>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {categoryLessons
                .sort((a, b) => a.order - b.order)
                .map((lesson) => (
                <Link key={lesson.id} href={`/lesson/${lesson.id}`}>
                  <Card className="lesson-card hover:shadow-lg transition-all duration-200 cursor-pointer group border border-border/50 hover:border-primary/50">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center space-x-2">
                          <i className={`${lesson.icon} text-primary`}></i>
                          <Badge className={getDifficultyColor(lesson.difficulty)}>
                            {getDifficultyText(lesson.difficulty)}
                          </Badge>
                        </div>
                        {lesson.isLocked && (
                          <Lock className="text-muted-foreground" size={16} />
                        )}
                      </div>
                      
                      <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors" data-testid={`lesson-title-${lesson.id}`}>
                        {lesson.title}
                      </h3>
                      
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2" data-testid={`lesson-description-${lesson.id}`}>
                        {lesson.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-1">
                            <Users size={12} />
                            <span data-testid={`lesson-exercises-${lesson.id}`}>
                              {lesson.exercises} exercises
                            </span>
                          </div>
                          
                          <div className="flex items-center space-x-1">
                            <Clock size={12} />
                            <span data-testid={`lesson-duration-${lesson.id}`}>
                              {lesson.estimatedDuration}m
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <Star size={12} className="text-yellow-500" />
                          <span className="text-xs">
                            {lesson.difficulty}/5
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        ))}

        {lessons?.length === 0 && (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">No lessons available</h2>
            <p className="text-muted-foreground">Check back later for new content!</p>
          </div>
        )}
      </main>
    </div>
  );
}