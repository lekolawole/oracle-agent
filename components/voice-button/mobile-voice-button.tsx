// components/voice-button/mobile-voice-button.tsx
import React, { useRef, useEffect } from 'react';
import { Platform, TouchableOpacity, Animated, StyleSheet, View, Alert, Linking } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { usePalette } from '@/constants/colors';
import { useMicrophonePermission } from '@/hooks/use-microphone-permission';

interface MobileVoiceButtonProps {
  isListening: boolean;
  isMuted: boolean;
  oracleSpeaking: boolean;
  onStartListening: () => void;
  onStopListening: () => void;
  onLongPress: () => void;
}

export function MobileVoiceButton({
  isListening,
  isMuted,
  oracleSpeaking,
  onStartListening,
  onStopListening,
  onLongPress,
}: MobileVoiceButtonProps) {
  const p = usePalette();
  const { granted, requestPermission } = useMicrophonePermission();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  if (Platform.OS === 'web') return null;

  useEffect(() => {
    if (isListening || oracleSpeaking) {
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
  }, [isListening, oracleSpeaking]);

  const handlePress = async () => {
    if (isMuted) return;

    if (isListening) {
      onStopListening();
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
    onStartListening();
  };

  const getIcon = (): any => {
    if (isMuted) return 'mic-off';
    if (isListening) return 'x';
    if (oracleSpeaking) return 'volume-2';
    return 'mic';
  };

  const getBgColor = () => {
    if (isMuted) return p.bgCard;
    if (isListening) return p.accentPrimary;
    if (oracleSpeaking) return p.accentDeep;
    return p.bgCard;
  };

  const getIconColor = () => {
    if (isMuted) return p.textDim;
    if (isListening || oracleSpeaking) return '#FFFFFF';
    return p.textSecondary;
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      onLongPress={onLongPress}
      delayLongPress={500}
      activeOpacity={0.8}
      style={styles.wrapper}
    >
      {(isListening || oracleSpeaking) && (
        <Animated.View style={[
          styles.pulseRing,
          {
            borderColor: isListening ? p.accentPrimary : p.accentDeep,
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
            : isListening || oracleSpeaking
            ? 'transparent'
            : p.bgCardBorder,
        }
      ]}>
        <Feather name={getIcon()} size={18} color={getIconColor()} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  pulseRing: { position: 'absolute', width: 44, height: 44, borderRadius: 22, borderWidth: 2 },
  button: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
});