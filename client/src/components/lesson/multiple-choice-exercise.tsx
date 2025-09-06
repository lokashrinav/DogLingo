import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, RotateCcw, Volume2, BookOpen } from "lucide-react";
import { useAudio } from "@/hooks/use-audio";
import { type Exercise } from "@shared/schema";

interface MultipleChoiceExerciseProps {
  exercise: Exercise;
}

export default function MultipleChoiceExercise({ exercise }: MultipleChoiceExerciseProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const { playAudio } = useAudio();

  const options = exercise.options as Array<{
    id: string;
    text: string;
    description: string;
  }>;

  const correctAnswer = exercise.correctAnswer;

  const handleAnswerSelect = (answerId: string) => {
    if (isAnswered) return;
    setSelectedAnswer(answerId);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return;
    
    const correct = selectedAnswer === correctAnswer;
    setIsCorrect(correct);
    setIsAnswered(true);
  };

  const handleSkip = () => {
    setIsAnswered(true);
    setIsCorrect(false);
  };

  const handleTryAgain = () => {
    setSelectedAnswer(null);
    setIsAnswered(false);
    setIsCorrect(false);
  };

  const handlePlayExplanationAudio = () => {
    if (exercise.audioUrl) {
      playAudio(exercise.audioUrl);
    }
  };

  const getOptionIcon = (optionId: string) => {
    if (!isAnswered) {
      return (
        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
          selectedAnswer === optionId 
            ? 'border-primary bg-primary' 
            : 'border-muted-foreground/30'
        }`}>
          {selectedAnswer === optionId && (
            <div className="w-3 h-3 rounded-full bg-white"></div>
          )}
        </div>
      );
    }
    
    if (optionId === correctAnswer) {
      return <CheckCircle className="w-6 h-6 text-green-600" />;
    } else if (optionId === selectedAnswer && !isCorrect) {
      return <XCircle className="w-6 h-6 text-red-600" />;
    }
    
    return (
      <div className="w-6 h-6 rounded-full border-2 border-muted-foreground/20 bg-muted/30"></div>
    );
  };

  const getOptionStyle = (optionId: string) => {
    const baseStyle = "p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 lesson-card";
    
    if (!isAnswered) {
      if (selectedAnswer === optionId) {
        return `${baseStyle} border-primary bg-primary/10 shadow-md scale-[1.02]`;
      }
      return `${baseStyle} border-border hover:border-primary/50 hover:bg-primary/5 hover:shadow-sm`;
    }
    
    // After answer is submitted
    if (optionId === correctAnswer) {
      return `${baseStyle} border-green-500 bg-green-50 dark:bg-green-900/20`;
    } else if (optionId === selectedAnswer && !isCorrect) {
      return `${baseStyle} border-red-500 bg-red-50 dark:bg-red-900/20`;
    }
    
    return `${baseStyle} border-border bg-muted/30 opacity-60`;
  };

  const getQuestionIcon = () => {
    if (exercise.audioUrl) {
      return <Volume2 className="text-primary" size={20} />;
    }
    return <BookOpen className="text-primary" size={20} />;
  };

  return (
    <div className="space-y-6">
      {/* Question Section */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3 mb-4">
          {getQuestionIcon()}
          <h3 className="text-lg font-semibold" data-testid="exercise-question">
            {exercise.question}
          </h3>
        </div>
        
        {exercise.audioUrl && (
          <div className="flex justify-center">
            <Button
              onClick={handlePlayExplanationAudio}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2"
              data-testid="play-question-audio"
            >
              <Volume2 size={16} />
              <span>🎧 Listen to Explanation</span>
            </Button>
          </div>
        )}
      </div>

      {/* Answer Options */}
      <div className="space-y-3">
        <h4 className="font-medium text-muted-foreground mb-3">Select the correct answer:</h4>
        
        {options.map((option, index) => (
          <div
            key={option.id}
            onClick={() => handleAnswerSelect(option.id)}
            className={getOptionStyle(option.id)}
            data-testid={`option-${option.id}`}
          >
            <div className="flex items-center space-x-4">
              {getOptionIcon(option.id)}
              
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium text-sm text-muted-foreground">
                    Option {String.fromCharCode(65 + index)}:
                  </span>
                  <span className="font-semibold">{option.text}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {option.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      {!isAnswered ? (
        <div className="flex justify-between items-center pt-4">
          <Button 
            variant="outline" 
            onClick={handleSkip}
            data-testid="skip-button"
          >
            Skip Exercise
          </Button>
          
          <Button
            onClick={handleSubmitAnswer}
            disabled={!selectedAnswer}
            className="bg-primary hover:bg-primary/90"
            data-testid="submit-answer"
          >
            Submit Answer
          </Button>
        </div>
      ) : (
        <Card className={`mt-6 ${isCorrect ? 'border-green-500' : 'border-red-500'}`}>
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              {isCorrect ? (
                <CheckCircle className="w-6 h-6 text-green-600 mt-1" />
              ) : (
                <XCircle className="w-6 h-6 text-red-600 mt-1" />
              )}
              
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <Badge className={isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                    {isCorrect ? "Correct!" : "Incorrect"}
                  </Badge>
                  {isCorrect && (
                    <Badge className="bg-blue-100 text-blue-800">
                      +10 XP
                    </Badge>
                  )}
                </div>
                
                <p className="text-sm text-muted-foreground mb-3">
                  {exercise.explanation}
                </p>
                
                {!isCorrect && (
                  <div className="text-sm">
                    <span className="font-medium text-green-600">Correct answer: </span>
                    <span className="text-muted-foreground">
                      {options.find(opt => opt.id === correctAnswer)?.text}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-4">
              <Button
                variant="outline"
                onClick={handleTryAgain}
                className="flex items-center space-x-2"
                data-testid="try-again"
              >
                <RotateCcw size={16} />
                <span>Try Again</span>
              </Button>
              
              {exercise.audioUrl && (
                <Button
                  onClick={handlePlayExplanationAudio}
                  variant="outline"
                  className="flex items-center space-x-2"
                  data-testid="replay-explanation"
                >
                  <Volume2 size={16} />
                  <span>Replay Explanation</span>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}