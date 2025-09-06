import { Volume2 } from "lucide-react";
import { useAudio } from "@/hooks/use-audio";

interface AudioButtonProps {
  audioUrl?: string;
  text: string;
  className?: string;
}

export default function AudioButton({ audioUrl, text, className = "" }: AudioButtonProps) {
  const { playAudio, isPlaying } = useAudio();

  const handlePlay = () => {
    if (audioUrl) {
      playAudio(audioUrl);
    } else {
      // Fallback: use text-to-speech or mock audio
      console.log(`Playing pronunciation for: ${text}`);
    }
  };

  return (
    <button
      onClick={handlePlay}
      disabled={isPlaying}
      className={`w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center hover:bg-primary/20 transition-colors disabled:opacity-50 ${className}`}
      data-testid={`audio-button-${text.toLowerCase()}`}
      title={`Play pronunciation for "${text}"`}
    >
      <Volume2 className={`text-primary ${isPlaying ? 'animate-pulse' : ''}`} size={16} />
    </button>
  );
}
