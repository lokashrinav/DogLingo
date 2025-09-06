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
      // Generate the EXACT SAME bark sound for everything - that's the joke!
      if ('AudioContext' in window) {
        try {
          const audioContext = new AudioContext();
          
          setIsPlaying(true);

          // THE UNIVERSAL BARK - sounds identical no matter what "type" it claims to be
          const createIdenticalBark = () => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            // Always the exact same frequencies and timing - that's the comedy!
            oscillator.type = 'sawtooth';
            oscillator.frequency.setValueAtTime(650, 0);
            oscillator.frequency.exponentialRampToValueAtTime(450, 0.15);
            
            gainNode.gain.setValueAtTime(0, 0);
            gainNode.gain.linearRampToValueAtTime(0.3, 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, 0.2);
            
            oscillator.start(0);
            oscillator.stop(0.2);
          };

          // Every "different" bark is exactly the same - perfect for comedy!
          createIdenticalBark();

          setTimeout(() => {
            setIsPlaying(false);
            audioContext.close();
          }, 300);
          return;
        } catch (error) {
          console.warn(`Failed to generate the universal comedy bark`, error);
          setIsPlaying(false);
        }
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
