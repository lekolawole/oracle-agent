import { useState, useRef, useEffect } from 'react';
import { Platform } from 'react-native';

interface UseWebSpeechReturn {
  isListening: boolean;
  isSupported: boolean;
  transcript: string;
  isMuted: boolean;
  startListening: () => void;
  stopListening: () => void;
  toggleMute: () => void;
  error: string | null;
}

export function useWebSpeech(onTranscript: (text: string) => void): UseWebSpeechReturn {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  // Web Speech API only works on web
  const isSupported = Platform.OS === 'web' &&
    typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  useEffect(() => {
    if (!isSupported) return;

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      onTranscript(text); // fire directly to Oracle pipeline
    };

    recognition.onerror = (event: any) => {
      setError(`Voice error: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.abort();
    };
  }, [isSupported]);

  const startListening = () => {
    console.log('listening in hook...')
    if (!isSupported || !recognitionRef.current || isMuted) return;
    setError(null);
    setTranscript('');
    recognitionRef.current.start();
    setIsListening(true);
  };

  const stopListening = () => {
    if (!recognitionRef.current) return;
    recognitionRef.current.stop();
    setIsListening(false);
  };

  const toggleMute = () => {
    if (isListening) stopListening();
    setIsMuted(prev => !prev);
  }

  return { isListening, isSupported, transcript, isMuted, startListening, stopListening, toggleMute, error };
}