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

    // Handle different types of audio URLs with Text-to-Speech and generated sounds
    if (audioUrl.includes('/audio/commands/')) {
      // Extract command from URL and speak it
      const command = audioUrl.split('/').pop()?.replace('.mp3', '').replace('-correct', '').replace('-', ' ').toUpperCase();
      if (command && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(command);
        utterance.rate = 0.7;
        utterance.pitch = 0.9;
        utterance.volume = 1.0;
        
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(voice => 
          voice.lang.includes('en') && (voice.name.includes('Google') || voice.name.includes('Microsoft'))
        ) || voices.find(voice => voice.lang.includes('en')) || voices[0];
        
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }

        setIsPlaying(true);
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);
        window.speechSynthesis.speak(utterance);
        return;
      }
    } else if (audioUrl.includes('/audio/barks/')) {
      // Generate bark sounds using Web Audio API
      let barkType: 'alert' | 'happy' | 'demand' | 'anxiety' | 'play' = 'alert';
      if (audioUrl.includes('happy')) barkType = 'happy';
      else if (audioUrl.includes('demand')) barkType = 'demand';
      else if (audioUrl.includes('anxiety')) barkType = 'anxiety';
      else if (audioUrl.includes('play')) barkType = 'play';

      if ('AudioContext' in window) {
        try {
          const audioContext = new AudioContext();
          const duration = barkType === 'demand' ? 2.0 : barkType === 'alert' ? 0.3 : 0.5;
          
          setIsPlaying(true);

          const createBark = (frequency: number, startTime: number, barkDuration: number, volume: number = 0.3) => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.type = 'sawtooth';
            oscillator.frequency.setValueAtTime(frequency, startTime);
            oscillator.frequency.exponentialRampToValueAtTime(frequency * 0.7, startTime + barkDuration * 0.8);
            
            gainNode.gain.setValueAtTime(0, startTime);
            gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + barkDuration);
            
            oscillator.start(startTime);
            oscillator.stop(startTime + barkDuration);
          };

          switch (barkType) {
            case 'alert':
              createBark(800, 0, 0.2, 0.4);
              break;
            case 'happy':
              createBark(600, 0, 0.15, 0.3);
              createBark(650, 0.2, 0.15, 0.3);
              createBark(580, 0.4, 0.15, 0.3);
              break;
            case 'demand':
              for (let i = 0; i < 4; i++) {
                createBark(700, i * 0.4, 0.25, 0.35);
              }
              break;
            case 'anxiety':
              createBark(900, 0, 0.3, 0.25);
              createBark(950, 0.4, 0.3, 0.25);
              break;
            case 'play':
              createBark(500, 0, 0.2, 0.3);
              createBark(520, 0.3, 0.2, 0.3);
              break;
          }

          setTimeout(() => {
            setIsPlaying(false);
            audioContext.close();
          }, duration * 1000 + 100);
          return;
        } catch (error) {
          console.warn(`Failed to generate bark sound: ${barkType}`, error);
          setIsPlaying(false);
        }
      }
    } else if (audioUrl.includes('/audio/explanations/') || audioUrl.includes('/audio/training/')) {
      // Speak explanatory text
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance("Listen carefully to understand the proper technique and timing for this command.");
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        setIsPlaying(true);
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);
        window.speechSynthesis.speak(utterance);
        return;
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
