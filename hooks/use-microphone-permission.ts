// hooks/use-microphone-permission.ts
import { useState, useEffect } from 'react';
import { Audio } from 'expo-av';
import { Platform } from 'react-native';

export function useMicrophonePermission() {
  const [granted, setGranted] = useState(false);
  const [asked, setAsked] = useState(false);

  useEffect(() => {
    // Web handles its own permission via Web Speech API
    if (Platform.OS === 'web') {
      setGranted(true);
      return;
    }
    checkPermission();
  }, []);

  async function checkPermission() {
    const { status } = await Audio.getPermissionsAsync();
    setGranted(status === 'granted');
    setAsked(status !== 'undetermined');
  }

  async function requestPermission() {
    const { status } = await Audio.requestPermissionsAsync();
    setGranted(status === 'granted');
    setAsked(true);
    return status === 'granted';
  }

  return { granted, asked, requestPermission };
}