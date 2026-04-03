// components/chat/audio-message.tsx
import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Audio } from 'expo-av';
import { Feather } from '@expo/vector-icons';
import { usePalette } from '@/constants/colors';

export default function AudioMessage({ uri }: { uri: string }) {
  const p = usePalette();
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  async function playPause() {
    if (sound) {
      if (isPlaying) {
        await sound.pauseAsync();
        setIsPlaying(false);
      } else {
        await sound.playAsync();
        setIsPlaying(true);
      }
    } else {
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true },
        onPlaybackStatusUpdate
      );
      setSound(newSound);
      setIsPlaying(true);
    }
  }

  const onPlaybackStatusUpdate = (status: any) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis);
      setDuration(status.durationMillis);
      if (status.didJustFinish) {
        setIsPlaying(false);
        setPosition(0);
      }
    }
  };

  useEffect(() => {
    return sound ? () => { sound.unloadAsync(); } : undefined;
  }, [sound]);

  return (
    <View style={{
      backgroundColor: p.accentPrimary, // Blue bubble for user
      padding: 12,
      borderRadius: 20,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      maxWidth: '80%',
      alignSelf: 'flex-end'
    }}>
      <TouchableOpacity onPress={playPause}>
        <Feather name={isPlaying ? "pause" : "play"} size={20} color="white" />
      </TouchableOpacity>
      
      {/* Waveform Placeholder (Simple Progress Bar) */}
      <View style={{ flex: 1, height: 4, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 2 }}>
        <View style={{ 
          width: `${(position / duration) * 100 || 0}%`, 
          height: '100%', 
          backgroundColor: 'white',
          borderRadius: 2 
        }} />
      </View>

      <Text style={{ color: 'white', fontSize: 12 }}>
        {Math.floor(duration / 1000)}s
      </Text>
    </View>
  );
}