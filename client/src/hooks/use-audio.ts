import { useState, useCallback } from "react";

export function useAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

  const playAudio = useCallback((audioUrl: string) => {
    // Stop any currently playing audio
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    try {
      const audio = new Audio(audioUrl);
      setCurrentAudio(audio);
      setIsPlaying(true);

      audio.addEventListener('ended', () => {
        setIsPlaying(false);
        setCurrentAudio(null);
      });

      audio.addEventListener('error', () => {
        console.warn(`Failed to load audio: ${audioUrl}`);
        setIsPlaying(false);
        setCurrentAudio(null);
      });

      audio.play().catch((error) => {
        console.warn(`Failed to play audio: ${audioUrl}`, error);
        setIsPlaying(false);
        setCurrentAudio(null);
      });
    } catch (error) {
      console.warn(`Error creating audio element for: ${audioUrl}`, error);
      setIsPlaying(false);
    }
  }, [currentAudio]);

  const stopAudio = useCallback(() => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setIsPlaying(false);
      setCurrentAudio(null);
    }
  }, [currentAudio]);

  return {
    isPlaying,
    playAudio,
    stopAudio
  };
}
