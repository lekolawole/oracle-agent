import React, { useEffect, useRef } from 'react';
import { Platform, TouchableOpacity, View, Text, StyleSheet, Animated } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { usePalette } from '@/constants/colors';

interface WebVoiceButtonProps {
  isListening: boolean;
  isSupported: boolean;
  isMuted: boolean;
  isOracleSpeaking: boolean;
  onPress: () => void; // single tap
  onLongPress: () => void; // long press - toggle mute
}

export function WebVoiceButton({
  isListening,
  isSupported,
  isMuted,
  isOracleSpeaking,
  onPress,
  onLongPress,
}: WebVoiceButtonProps) {
  const p = usePalette();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  // Pulse animation when listening
  useEffect(() => {
    if (isListening || isOracleSpeaking) {
      Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(pulseAnim, { toValue: 1.3, duration: 600, useNativeDriver: true }),
            Animated.timing(opacityAnim, { toValue: 0.3, duration: 600, useNativeDriver: true }),
          ]),
          Animated.parallel([
            Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
            Animated.timing(opacityAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
          ]),
        ])
      ).start();
    } else {
      pulseAnim.stopAnimation();
      opacityAnim.stopAnimation();
      pulseAnim.setValue(1);
      opacityAnim.setValue(1);
    }
  }, [isListening, isOracleSpeaking]);

  // Only render on web
  if (Platform.OS !== 'web') return null;

  // Unsupported browser fallback
  if (!isSupported) {
    return (
      <View style={styles.unsupported}>
        <Text style={{ color: p.textDim, fontSize: 12 }}>
          Voice not supported in this browser. Try Chrome or Safari.
        </Text>
      </View>
    );
  }

  const getIcon = () => {
    if (isMuted) return 'mic-off';
    if (isListening) return 'x';
    if (isOracleSpeaking) return 'volume-2';

    return 'mic';
  }

  const getBgColor = () => {
    if (isMuted) return p.bgCard;
    if (isListening) return p.accentPrimary;
    if (isOracleSpeaking) return p.accentDeep;
    return p.bgCard;
  };

  const getIconColor = () => {
    if (isMuted) return p.textDim;
    if (isListening || isOracleSpeaking) return '#FFFFFF';
    return p.textSecondary;
  };

  const getPulseColor = () => {
    if (isListening) return p.accentPrimary;
    if (isOracleSpeaking) return p.accentDeep;
    return 'transparent';
  };
 
  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      delayLongPress={500}
      activeOpacity={0.8}
      style={[
        styles.wrapper
      ]}>
        {/* Pulse ring — only visible when listening */}
      {(isListening || isOracleSpeaking) && (
        <Animated.View
          style={[
            styles.pulseRing,
            {
              borderColor: getPulseColor(),
              transform: [{ scale: pulseAnim }],
              opacity: opacityAnim,
            },
          ]}
        />
      )}

      {/* Pulse ring — only visible when listening */}
      {isListening && (
        <Animated.View
          style={[
            styles.pulseRing,
            {
              borderColor: p.accentPrimary,
              transform: [{ scale: pulseAnim }],
              opacity: opacityAnim,
            },
          ]}
        />
      )}

      {/* Main button */}
      <View
        style={[
          styles.button,
          {
            backgroundColor: getBgColor(),
            borderColor: isMuted ? p.bgCardBorder : isListening || isOracleSpeaking ? 'transparent' : p.bgCardBorder,
          },
        ]}
      >
        <Feather
          name={getIcon()}
          size={18}
          color={getIcon()}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  pulseRing: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
  },
  unsupported: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
});