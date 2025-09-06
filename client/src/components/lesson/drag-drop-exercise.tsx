import { useState } from "react";
import { Check, Volume2 } from "lucide-react";
import { useDragDrop } from "@/hooks/use-drag-drop";
import { useAudio } from "@/hooks/use-audio";
import { type Exercise } from "@shared/schema";

interface DragDropExerciseProps {
  exercise: Exercise;
}

export default function DragDropExercise({ exercise }: DragDropExerciseProps) {
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const { playAudio } = useAudio();
  
  const { 
    draggedItem, 
    dropZones, 
    handleDragStart, 
    handleDragEnd, 
    handleDragOver, 
    handleDrop 
  } = useDragDrop();

  const options = exercise.options as Array<{
    id: string;
    text: string;
    description: string;
  }>;

  const correctAnswer = JSON.parse(exercise.correctAnswer as string);

  const handleCheckAnswer = () => {
    // Check if all drop zones have correct matches
    const isAnswerCorrect = Object.keys(correctAnswer).every(key => {
      return dropZones[correctAnswer[key]] === key;
    });
    
    setIsCorrect(isAnswerCorrect);
    setIsAnswered(true);
  };

  const handleSkip = () => {
    setIsAnswered(true);
    setIsCorrect(false);
  };

  const handlePlayAudio = (command: string) => {
    // In a real app, this would play the actual audio file
    playAudio(`/audio/${command.toLowerCase()}.mp3`);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h4 className="text-lg font-semibold mb-4" data-testid="exercise-question">
          {exercise.question}
        </h4>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Commands Column */}
        <div className="space-y-4">
          <h5 className="font-medium text-muted-foreground mb-3">Commands</h5>
          {options.map((option) => (
            <div
              key={option.id}
              draggable
              onDragStart={(e) => handleDragStart(e, option.id)}
              onDragEnd={handleDragEnd}
              className={`drag-zone p-4 rounded-lg bg-muted/50 cursor-move lesson-card draggable ${
                draggedItem === option.id ? 'opacity-50' : ''
              }`}
              data-testid={`command-${option.id}`}
            >
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handlePlayAudio(option.text)}
                  className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors"
                  data-testid={`audio-${option.id}`}
                >
                  <Volume2 className="text-primary" size={16} />
                </button>
                <div>
                  <div className="font-semibold">{option.text}</div>
                  <div className="text-sm text-muted-foreground">{option.description}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Drop Zones Column */}
        <div className="space-y-4">
          <h5 className="font-medium text-muted-foreground mb-3">Hand Signals</h5>
          
          {['open-palm', 'palm-up', 'pointing-down'].map((signalId) => (
            <div
              key={signalId}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, signalId)}
              className={`drop-zone p-4 rounded-lg border-2 border-dashed min-h-[80px] flex items-center justify-center ${
                dropZones[signalId] ? 'border-primary bg-primary/10' : 'border-muted'
              }`}
              data-testid={`drop-zone-${signalId}`}
            >
              {dropZones[signalId] ? (
                <div className="text-center">
                  <div className="font-semibold text-primary">
                    {options.find(opt => opt.id === dropZones[signalId])?.text}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {signalId.replace('-', ' ')} gesture
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  <div className="text-sm">Drop {signalId.replace('-', ' ')} command here</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mt-8">
        {!isAnswered ? (
          <>
            <button
              onClick={handleCheckAnswer}
              disabled={Object.keys(dropZones).length === 0}
              className="flex-1 bg-primary text-primary-foreground py-3 px-6 rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="check-answer-button"
            >
              <Check className="inline mr-2" size={16} />
              Check Answer
            </button>
            <button
              onClick={handleSkip}
              className="px-6 py-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
              data-testid="skip-button"
            >
              Skip
            </button>
          </>
        ) : (
          <div className={`flex-1 py-3 px-6 rounded-lg text-center font-semibold ${
            isCorrect 
              ? 'bg-green-100 text-green-700 border border-green-300'
              : 'bg-red-100 text-red-700 border border-red-300'
          }`}>
            {isCorrect ? '🎉 Correct! Great job!' : '❌ Not quite right. Try again!'}
          </div>
        )}
      </div>

      {isAnswered && exercise.explanation && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h6 className="font-semibold text-blue-800 mb-2">Explanation:</h6>
          <p className="text-blue-700 text-sm">{exercise.explanation}</p>
        </div>
      )}
    </div>
  );
}
