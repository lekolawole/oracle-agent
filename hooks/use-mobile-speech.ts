// hooks/use-mobile-speech.ts
import { useState, useRef } from 'react';
import { Platform } from 'react-native';
import { useMicrophonePermission } from '@/hooks/use-microphone-permission';

interface UseMobileSpeechReturn {
  isListening: boolean;
  isMuted: boolean;
  isSupported: boolean;
  transcript: string;
  startListening: () => Promise<void>;
  stopListening: () => void;
  toggleMute: () => void;
  error: string | null;
}

export function useMobileSpeech(
  onTranscript: (text: string) => void
): UseMobileSpeechReturn {
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { granted, requestPermission } = useMicrophonePermission();

  // Only available on native
  const isSupported = Platform.OS !== 'web';

  const startListening = async () => {
    if (!isSupported || isMuted) return;

    // Request permission if not granted
    if (!granted) {
      const allowed = await requestPermission();
      if (!allowed) {
        setError('Microphone permission denied');
        return;
      }
    }

    setError(null);
    setTranscript('');
    setIsListening(true);

    // ── whisper.rn plugs in here in Phase 2 native build ──────────────
    // const result = await Whisper.transcribe(audioFile);
    // onTranscript(result.text);
    // setTranscript(result.text);
    // setIsListening(false);
    // ─────────────────────────────────────────────────────────────────

    console.log('[Oracle] Mobile STT started — whisper.rn pending native build');
  };

  const stopListening = () => {
    if (!isListening) return;
    setIsListening(false);

    // ── whisper.rn stop recording plugs in here ───────────────────────
    // Whisper.stopRecording();
    // ─────────────────────────────────────────────────────────────────

    console.log('[Oracle] Mobile STT stopped');
  };

  const toggleMute = () => {
    if (isListening) stopListening();
    setIsMuted(prev => !prev);
  };

  return {
    isListening,
    isMuted,
    isSupported,
    transcript,
    startListening,
    stopListening,
    toggleMute,
    error,
  };
}