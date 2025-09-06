import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Volume2, VolumeX, Play, CheckCircle, XCircle, RotateCcw } from "lucide-react";
import { useAudio } from "@/hooks/use-audio";
import { type Exercise } from "@shared/schema";

interface AudioExerciseProps {
  exercise: Exercise;
}

export default function AudioExercise({ exercise }: AudioExerciseProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const { playAudio, isPlaying, stopAudio } = useAudio();

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

  const handlePlayMainAudio = () => {
    if (exercise.audioUrl) {
      playAudio(exercise.audioUrl);
    } else {
      // Fallback for demonstration
      console.log("Playing main exercise audio");
    }
  };

  const handleTryAgain = () => {
    setSelectedAnswer(null);
    setIsAnswered(false);
    setIsCorrect(false);
    stopAudio();
  };

  const getOptionIcon = (optionId: string) => {
    if (!isAnswered) return null;
    
    if (optionId === correctAnswer) {
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    } else if (optionId === selectedAnswer && !isCorrect) {
      return <XCircle className="w-5 h-5 text-red-600" />;
    }
    return null;
  };

  const getOptionStyle = (optionId: string) => {
    const baseStyle = "p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 lesson-card";
    
    if (!isAnswered) {
      if (selectedAnswer === optionId) {
        return `${baseStyle} border-primary bg-primary/10 shadow-md scale-105`;
      }
      return `${baseStyle} border-border hover:border-primary/50 hover:bg-primary/5`;
    }
    
    // After answer is submitted
    if (optionId === correctAnswer) {
      return `${baseStyle} border-green-500 bg-green-50 dark:bg-green-900/20`;
    } else if (optionId === selectedAnswer && !isCorrect) {
      return `${baseStyle} border-red-500 bg-red-50 dark:bg-red-900/20`;
    }
    
    return `${baseStyle} border-border bg-muted/30 opacity-60`;
  };

  return (
    <div className="space-y-6">
      {/* Audio Player Section */}
      <div className="text-center space-y-4">
        <h3 className="text-lg font-semibold mb-4" data-testid="exercise-question">
          {exercise.question}
        </h3>
        
        <div className="flex justify-center">
          <Button
            onClick={handlePlayMainAudio}
            disabled={isPlaying}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-full shadow-lg"
            data-testid="play-main-audio"
          >
            {isPlaying ? (
              <>
                <VolumeX className="mr-2" size={20} />
                Playing Audio...
              </>
            ) : (
              <>
                <Play className="mr-2" size={20} />
                🎵 Play Audio
              </>
            )}
          </Button>
        </div>
        
        {exercise.audioUrl && (
          <p className="text-sm text-muted-foreground">
            🎧 Listen carefully and select the correct answer below
          </p>
        )}
      </div>

      {/* Answer Options */}
      <div className="space-y-3">
        <h4 className="font-medium text-muted-foreground mb-3">Choose your answer:</h4>
        
        {options.map((option) => (
          <div
            key={option.id}
            onClick={() => handleAnswerSelect(option.id)}
            className={getOptionStyle(option.id)}
            data-testid={`option-${option.id}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Volume2 className="text-primary" size={16} />
                  </div>
                  <div>
                    <div className="font-semibold">{option.text}</div>
                    <div className="text-sm text-muted-foreground">
                      {option.description}
                    </div>
                  </div>
                </div>
              </div>
              
              {getOptionIcon(option.id)}
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
                </div>
                
                <p className="text-sm text-muted-foreground">
                  {exercise.explanation}
                </p>
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
              
              <Button
                onClick={handlePlayMainAudio}
                variant="outline"
                className="flex items-center space-x-2"
                data-testid="replay-audio"
              >
                <Volume2 size={16} />
                <span>Replay Audio</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}