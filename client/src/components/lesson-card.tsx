import { type Lesson, type UserProgress } from "@shared/schema";

interface LessonCardProps {
  lesson: Lesson;
  progress?: UserProgress;
}

export default function LessonCard({ lesson, progress }: LessonCardProps) {
  const isCompleted = progress?.completed || false;
  const isInProgress = progress && !progress.completed;
  const isLocked = lesson.isLocked;

  const getStatusInfo = () => {
    if (isCompleted) {
      return {
        label: "Completed",
        className: "bg-green-100 text-green-700",
        cardClass: "from-primary/5 to-primary/10 border-primary/20",
        iconClass: "bg-primary/20 text-primary",
        opacity: ""
      };
    }
    if (isInProgress) {
      return {
        label: "In Progress",
        className: "bg-blue-100 text-blue-700",
        cardClass: "from-secondary/5 to-secondary/10 border-secondary/20",
        iconClass: "bg-secondary/20 text-secondary",
        opacity: ""
      };
    }
    if (isLocked) {
      return {
        label: "Locked",
        className: "bg-gray-100 text-gray-600",
        cardClass: "from-muted/5 to-muted/10 border-muted/20",
        iconClass: "bg-muted/20 text-muted-foreground",
        opacity: "opacity-75"
      };
    }
    return {
      label: "Available",
      className: "bg-blue-100 text-blue-700",
      cardClass: "from-accent/5 to-accent/10 border-accent/20",
      iconClass: "bg-accent/20 text-accent",
      opacity: ""
    };
  };

  const statusInfo = getStatusInfo();

  const handleClick = () => {
    if (!isLocked) {
      window.location.href = `/lesson/${lesson.id}`;
    }
  };

  return (
    <div 
      className={`lesson-card bg-gradient-to-br ${statusInfo.cardClass} p-4 rounded-lg border cursor-pointer ${statusInfo.opacity}`}
      onClick={handleClick}
      data-testid={`lesson-card-${lesson.id}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`w-12 h-12 ${statusInfo.iconClass} rounded-full flex items-center justify-center`}>
          {isLocked ? (
            <i className="fas fa-lock"></i>
          ) : (
            <i className={lesson.icon}></i>
          )}
        </div>
        <span className={`${statusInfo.className} text-xs px-2 py-1 rounded-full font-medium`}>
          {statusInfo.label}
        </span>
      </div>
      
      <h4 className="font-semibold mb-2" data-testid="lesson-title">{lesson.title}</h4>
      <p className="text-sm text-muted-foreground mb-3" data-testid="lesson-description">
        {lesson.description}
      </p>
      
      <div className="flex justify-between items-center text-xs text-muted-foreground">
        <span data-testid="lesson-exercises">{lesson.exercises} exercises</span>
        <span data-testid="lesson-duration">{lesson.estimatedDuration} min</span>
      </div>
      
      {progress && (
        <div className="mt-2 text-xs font-medium text-right">
          Score: {progress.score}%
        </div>
      )}
    </div>
  );
}
