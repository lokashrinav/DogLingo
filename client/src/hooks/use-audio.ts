import { useState, useCallback } from "react";

export function useAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

  // Text-to-Speech function for commands
  const speakText = useCallback((text: string, options?: { rate?: number; pitch?: number; volume?: number }) => {
    if ('speechSynthesis' in window) {
      // Stop any current speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = options?.rate || 0.8;  // Slightly slower for clarity
      utterance.pitch = options?.pitch || 1.0;
      utterance.volume = options?.volume || 1.0;
      
      // Try to find a good voice for dog training commands
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.lang.includes('en') && (voice.name.includes('Google') || voice.name.includes('Microsoft'))
      ) || voices.find(voice => voice.lang.includes('en')) || voices[0];
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      setIsPlaying(true);
      
      utterance.onend = () => {
        setIsPlaying(false);
      };
      
      utterance.onerror = () => {
        setIsPlaying(false);
        console.warn(`Failed to speak text: ${text}`);
      };

      window.speechSynthesis.speak(utterance);
      return true;
    }
    return false;
  }, []);

  // Generate bark sounds using Web Audio API
  const generateBarkSound = useCallback((barkType: 'alert' | 'happy' | 'demand' | 'anxiety' | 'play') => {
    if (!('AudioContext' in window)) return false;

    try {
      const audioContext = new AudioContext();
      const duration = barkType === 'demand' ? 2.0 : barkType === 'alert' ? 0.3 : 0.5;
      
      setIsPlaying(true);

      // Create different bark patterns based on type
      const createBark = (frequency: number, startTime: number, barkDuration: number, volume: number = 0.3) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Create bark-like sound
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(frequency, startTime);
        oscillator.frequency.exponentialRampToValueAtTime(frequency * 0.7, startTime + barkDuration * 0.8);
        
        // Bark envelope
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + barkDuration);
        
        oscillator.start(startTime);
        oscillator.stop(startTime + barkDuration);
      };

      switch (barkType) {
        case 'alert':
          // Sharp, high-pitched, single bark
          createBark(800, 0, 0.2, 0.4);
          break;
        case 'happy':
          // Multiple bouncy barks
          createBark(600, 0, 0.15, 0.3);
          createBark(650, 0.2, 0.15, 0.3);
          createBark(580, 0.4, 0.15, 0.3);
          break;
        case 'demand':
          // Repetitive, rhythmic barking
          for (let i = 0; i < 4; i++) {
            createBark(700, i * 0.4, 0.25, 0.35);
          }
          break;
        case 'anxiety':
          // Higher pitched, trembling quality
          createBark(900, 0, 0.3, 0.25);
          createBark(950, 0.4, 0.3, 0.25);
          break;
        case 'play':
          // Lower, playful barks
          createBark(500, 0, 0.2, 0.3);
          createBark(520, 0.3, 0.2, 0.3);
          break;
      }

      setTimeout(() => {
        setIsPlaying(false);
        audioContext.close();
      }, duration * 1000 + 100);

      return true;
    } catch (error) {
      console.warn(`Failed to generate bark sound: ${barkType}`, error);
      setIsPlaying(false);
      return false;
    }
  }, []);

  const playAudio = useCallback((audioUrl: string) => {
    // Stop any currently playing audio or speech
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }
    window.speechSynthesis?.cancel();

    // Handle different types of audio URLs
    if (audioUrl.includes('/audio/commands/')) {
      // Extract command from URL and speak it
      const command = audioUrl.split('/').pop()?.replace('.mp3', '').replace('-correct', '').replace('-', ' ').toUpperCase();
      if (command) {
        const success = speakText(command, { rate: 0.7, pitch: 0.9 });
        if (success) return;
      }
    } else if (audioUrl.includes('/audio/barks/')) {
      // Generate bark sounds
      if (audioUrl.includes('alert')) {
        if (generateBarkSound('alert')) return;
      } else if (audioUrl.includes('happy')) {
        if (generateBarkSound('happy')) return;
      } else if (audioUrl.includes('demand')) {
        if (generateBarkSound('demand')) return;
      } else if (audioUrl.includes('anxiety')) {
        if (generateBarkSound('anxiety')) return;
      } else if (audioUrl.includes('play')) {
        if (generateBarkSound('play')) return;
      }
    } else if (audioUrl.includes('/audio/explanations/') || audioUrl.includes('/audio/training/')) {
      // Speak explanatory text with a different tone
      const text = "Listen carefully to understand the proper technique and timing for this command.";
      const success = speakText(text, { rate: 0.9, pitch: 1.1 });
      if (success) return;
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
        speakText("Audio content for this exercise");
      });

      audio.play().catch((error) => {
        console.warn(`Failed to play audio: ${audioUrl}`, error);
        setIsPlaying(false);
        setCurrentAudio(null);
        // Final fallback: speak generic message
        speakText("Audio content for this exercise");
      });
    } catch (error) {
      console.warn(`Error creating audio element for: ${audioUrl}`, error);
      setIsPlaying(false);
      // Final fallback: speak generic message
      speakText("Audio content for this exercise");
    }
  }, [currentAudio, speakText, generateBarkSound]);

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
    stopAudio,
    speakText,
    generateBarkSound
  };
}
