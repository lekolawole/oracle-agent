// hooks/use-mobile-speech.ts
import { useState, useRef } from 'react';
import { Platform } from 'react-native';
import { useMicrophonePermission } from '@/hooks/use-microphone-permission';
import { File } from 'expo-file-system';
import { Audio } from 'expo-av';

interface UseMobileRecordingReturn {
  isRecording: boolean;
  isMuted: boolean;
  isSupported: boolean;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  toggleMute: () => void;
  clearRecording: () => void;
  error: string | null;
}

export function useMobileRecording(
  onFileReady: (fileUri: string) => void
): UseMobileRecordingReturn {
  const [isRecording, setisRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { granted, requestPermission } = useMicrophonePermission();

  const recordingRef = useRef<Audio.Recording | null>(null);

  // Only available on native
  const isSupported = Platform.OS !== 'web';

  const startRecording = async () => {
    if (!isSupported || isMuted) return;

    // AWAIT to prepare hardware on older android devices
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      interruptionModeAndroid: 1,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false
    })

    // Request permission if not granted
    if (!granted) {
      const allowed = await requestPermission();
      if (!allowed) {
        setError('Microphone permission denied');
        return;
      }
    }

    setError(null);
    setisRecording(true);

    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true
      });

    // Start Recording
      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      recordingRef.current = newRecording;
      setisRecording(true)
    } catch (err) {
      console.error('Failed to start recording', err);

      stopRecording();
    }
  };

  const stopRecording = async (): Promise<string | null> => {
    if (!isRecording || !recordingRef.current) return null;
    setisRecording(false);

    // ── whisper.rn stop recording plugs in here ───────────────────────
    // Whisper.stopRecording();
    // ─────────────────────────────────────────────────────────────────

    try {
      await recordingRef.current.stopAndUnloadAsync();

      const fileUri = recordingRef.current.getURI();
      // setUri(fileUri);

      recordingRef.current = null;

      // Confirm file accessibility
      if (fileUri) {
        const fileInfo = new File(fileUri);

        if (fileInfo.exists) {
          console.log(`Audio captured at: ${fileUri}, exists: ${fileInfo.exists}, size: ${fileInfo.size}`);
          onFileReady(fileUri);

          return fileUri;
        }
      }

      setError('Recording file not found');
      return null;
    } catch (err) {
      console.error('Failed to stop recording', err);

      setError('Failed to stop recording');
      return null;
    }
  };

  const toggleMute = () => {
    if (isRecording) stopRecording();
    setIsMuted(prev => !prev);
  };

  const clearRecording = () => {
    recordingRef.current = null;
  }

  return {
    isRecording,
    isMuted,
    isSupported,
    startRecording,
    stopRecording,
    toggleMute,
    clearRecording,
    error,
  };
}