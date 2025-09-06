import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import DragDropExercise from "@/components/lesson/drag-drop-exercise";
import { type Lesson, type Exercise } from "@shared/schema";

export default function Lesson() {
  const { id } = useParams();
  
  const { data: lesson, isLoading: lessonLoading } = useQuery<Lesson>({
    queryKey: ["/api/lessons", id],
    enabled: !!id
  });

  const { data: exercises, isLoading: exercisesLoading } = useQuery<Exercise[]>({
    queryKey: ["/api/lessons", id, "exercises"],
    enabled: !!id
  });

  if (lessonLoading || exercisesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">Lesson Not Found</h1>
          <button 
            onClick={() => window.history.back()}
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const currentExercise = exercises?.[0]; // For now, show the first exercise

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
            <div>
              <h1 className="text-xl font-bold" data-testid="lesson-title">{lesson.title}</h1>
              <p className="text-sm text-muted-foreground" data-testid="lesson-description">
                {lesson.description}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {currentExercise ? (
          <Card className="border border-border">
            <CardContent className="p-6">
              {currentExercise.type === 'drag-drop' ? (
                <DragDropExercise exercise={currentExercise} />
              ) : (
                <div className="text-center py-8">
                  <h3 className="text-lg font-semibold mb-4">{currentExercise.question}</h3>
                  <p className="text-muted-foreground">
                    Exercise type "{currentExercise.type}" not yet implemented
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="border border-border">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold mb-4">No Exercises Available</h3>
              <p className="text-muted-foreground">
                This lesson doesn't have any exercises yet.
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
