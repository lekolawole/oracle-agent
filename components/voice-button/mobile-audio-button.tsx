// components/voice-button/mobile-voice-button.tsx
import React, { useRef, useEffect } from 'react';
import { Platform, TouchableOpacity, Animated, StyleSheet, View, Alert, Linking } from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { usePalette } from '@/constants/colors';
import { useMicrophonePermission } from '@/hooks/use-microphone-permission';

interface MobileAudioButtonProps {
  isRecording: boolean;
  isMuted: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
}

export function MobileAudioButton({
  isMuted,
  isRecording,
  onStartRecording,
  onStopRecording,
}: MobileAudioButtonProps) {
  const p = usePalette();
  const { granted, requestPermission } = useMicrophonePermission();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  if (Platform.OS === 'web') return null;

  useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(pulseAnim, { toValue: 1.35, duration: 700, useNativeDriver: true }),
            Animated.timing(opacityAnim, { toValue: 0.2, duration: 700, useNativeDriver: true }),
          ]),
          Animated.parallel([
            Animated.timing(pulseAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
            Animated.timing(opacityAnim, { toValue: 1, duration: 700, useNativeDriver: true }),
          ]),
        ])
      ).start();
    } else {
      pulseAnim.stopAnimation();
      opacityAnim.stopAnimation();
      pulseAnim.setValue(1);
      opacityAnim.setValue(1);
    }
  }, [isRecording]);

  const handlePress = async () => {
    if (isMuted) return;

    if (isRecording) {
      onStopRecording();
      return;
    }

    // Request permission if needed
    if (!granted) {
      const allowed = await requestPermission();
      if (!allowed) {
        Alert.alert(
          'Microphone Required',
          'Oracle needs microphone access to hear your voice. Enable it in Settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() }
          ]
        );
        return;
      }
    }

    // ← whisper.rn plugs in here in Phase 2 native build
    onStartRecording();
  };

  const getBgColor = () => {
    if (isMuted) return p.bgCard;
    if (isRecording) return p.accentPrimary;
    return p.bgCard;
  };

  const getIconColor = () => {
    if (isMuted) return p.textDim;
    if (isRecording) return '#FFFFFF';
    return p.textSecondary;
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.8}
      style={styles.wrapper}
    >
      {(isRecording) && (
        <Animated.View style={[
          styles.pulseRing,
          {
            borderColor: isRecording ? p.accentPrimary : p.accentDeep,
            transform: [{ scale: pulseAnim }],
            opacity: opacityAnim,
          }
        ]} />
      )}
      <View style={[
        styles.button,
        {
          backgroundColor: getBgColor(),
          borderColor: isMuted
            ? p.bgCardBorder
            : isRecording
            ? 'transparent'
            : p.bgCardBorder
        }
      ]}>
        <MaterialIcons name='multitrack-audio' size={18} color={getIconColor()} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  pulseRing: { position: 'absolute', width: 36, height: 36, borderRadius: 22, borderWidth: 2 },
  button: { width: 36, height: 36, borderRadius: 22, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
});