import { useState, useCallback } from "react";

export function useAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

  const playAudio = useCallback((audioUrl: string) => {
    // Stop any currently playing audio or speech
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }
    window.speechSynthesis?.cancel();

    // 🎭 COMEDY HACK: ALL BARKS SOUND EXACTLY THE SAME! 
    // But we pretend they're totally different for the joke!
    if (audioUrl.includes('/audio/') || audioUrl.includes('bark') || audioUrl.includes('woof')) {
      // Use the EXACT SAME real dog bark for everything - that's the joke!
      try {
        // This is a real dog bark sound from a free source - perfect for comedy!
        const realBarkUrl = 'https://www.soundjay.com/misc/sounds/bark.wav'; // Fallback 1
        
        // If that doesn't work, try another free source
        const backupBarkUrl = 'https://filesamples.com/samples/audio/wav/SampleAudio_0.4mb_wav.wav';
        
        // Try a known working free sound
        const comedyBarkUrl = 'https://www2.cs.uic.edu/~i101/SoundFiles/bark.wav';

        const audio = new Audio(comedyBarkUrl);
        setCurrentAudio(audio);
        setIsPlaying(true);

        audio.addEventListener('ended', () => {
          setIsPlaying(false);
          setCurrentAudio(null);
        });

        audio.addEventListener('error', () => {
          // Try backup bark sound
          console.log("Trying backup bark sound...");
          const backupAudio = new Audio(realBarkUrl);
          backupAudio.addEventListener('ended', () => {
            setIsPlaying(false);
            setCurrentAudio(null);
          });
          
          backupAudio.addEventListener('error', () => {
            // Final fallback: speak "woof"
            setIsPlaying(false);
            setCurrentAudio(null);
            if ('speechSynthesis' in window) {
              const utterance = new SpeechSynthesisUtterance("WOOF!");
              utterance.rate = 1.5;
              utterance.pitch = 0.7;
              window.speechSynthesis.speak(utterance);
            }
          });

          backupAudio.play().catch(() => {
            // Even backup failed, use TTS
            setIsPlaying(false);
            setCurrentAudio(null);
            if ('speechSynthesis' in window) {
              const utterance = new SpeechSynthesisUtterance("WOOF!");
              utterance.rate = 1.5;
              utterance.pitch = 0.7;
              window.speechSynthesis.speak(utterance);
            }
          });
        });

        audio.play().catch((error) => {
          console.warn("Real bark failed, trying backup...", error);
          audio.dispatchEvent(new Event('error'));
        });
        
        return;
      } catch (error) {
        console.warn(`Failed to play real bark sound`, error);
        setIsPlaying(false);
      }
    }

    // Fallback: try to load the actual audio file
    try {
      const audio = new Audio(audioUrl);
      setCurrentAudio(audio);
      setIsPlaying(true);

      audio.addEventListener('ended', () => {
        setIsPlaying(false);
        setCurrentAudio(null);
      });

      audio.addEventListener('error', () => {
        console.warn(`Audio file not found: ${audioUrl}, using text-to-speech fallback`);
        setIsPlaying(false);
        setCurrentAudio(null);
        // Final fallback: speak generic message
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance("Audio content for this exercise");
          window.speechSynthesis.speak(utterance);
        }
      });

      audio.play().catch((error) => {
        console.warn(`Failed to play audio: ${audioUrl}`, error);
        setIsPlaying(false);
        setCurrentAudio(null);
        // Final fallback: speak generic message
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance("Audio content for this exercise");
          window.speechSynthesis.speak(utterance);
        }
      });
    } catch (error) {
      console.warn(`Error creating audio element for: ${audioUrl}`, error);
      setIsPlaying(false);
      // Final fallback: speak generic message
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance("Audio content for this exercise");
        window.speechSynthesis.speak(utterance);
      }
    }
  }, [currentAudio]);

  const stopAudio = useCallback(() => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setIsPlaying(false);
      setCurrentAudio(null);
    }
    window.speechSynthesis?.cancel();
    setIsPlaying(false);
  }, [currentAudio]);

  return {
    isPlaying,
    playAudio,
    stopAudio
  };
}
