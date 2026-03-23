// oracle-orb.tsx
import React, { useEffect, useRef } from 'react';
import { usePalette } from '@/constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { View, Animated, StyleSheet, Platform } from 'react-native';

export type OrbState = 'idle' | 'listening' | 'speaking';

export function OracleOrb({ 
  size = 160,
  state = 'idle'
}: { 
  size?: number;
  state?: OrbState;
}) {
  const p = usePalette();

  // Pulse animations — rings
  const pulse1 = useRef(new Animated.Value(1)).current;
  const pulse2 = useRef(new Animated.Value(1)).current;
  const pulse3 = useRef(new Animated.Value(1)).current;
  const glow   = useRef(new Animated.Value(0.4)).current;

  // Core scale — reacts to state
  const coreScale = useRef(new Animated.Value(1)).current;

  // Ring color interpolation
  const ringOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Stop all animations first
    pulse1.stopAnimation();
    pulse2.stopAnimation();
    pulse3.stopAnimation();
    glow.stopAnimation();
    coreScale.stopAnimation();

    if (state === 'idle') {
      // Slow breathing pulse — existing behavior
      const createPulse = (anim: Animated.Value, delay: number) =>
        Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.timing(anim, { toValue: 1.18, duration: 2200, useNativeDriver: true }),
            Animated.timing(anim, { toValue: 1,    duration: 2200, useNativeDriver: true }),
          ])
        );

      Animated.loop(
        Animated.sequence([
          Animated.timing(glow, { toValue: 0.85, duration: 2800, useNativeDriver: true }),
          Animated.timing(glow, { toValue: 0.4,  duration: 2800, useNativeDriver: true }),
        ])
      ).start();

      createPulse(pulse1, 0).start();
      createPulse(pulse2, 700).start();
      createPulse(pulse3, 1400).start();

      // Core rests at normal size
      Animated.spring(coreScale, { toValue: 1, useNativeDriver: true }).start();

    } else if (state === 'listening') {
      // Fast urgent pulse — user is being heard
      const createFastPulse = (anim: Animated.Value, delay: number) =>
        Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.timing(anim, { toValue: 1.28, duration: 600, useNativeDriver: true }),
            Animated.timing(anim, { toValue: 1,    duration: 600, useNativeDriver: true }),
          ])
        );

      Animated.loop(
        Animated.sequence([
          Animated.timing(glow, { toValue: 1, duration: 500, useNativeDriver: true }),
          Animated.timing(glow, { toValue: 0.6, duration: 500, useNativeDriver: true }),
        ])
      ).start();

      createFastPulse(pulse1, 0).start();
      createFastPulse(pulse2, 200).start();
      createFastPulse(pulse3, 400).start();

      // Core grows slightly — feels alive
      Animated.spring(coreScale, { 
        toValue: 1.15, 
        friction: 6,
        useNativeDriver: true 
      }).start();

    } else if (state === 'speaking') {
      // Ripple outward — Oracle is talking
      const createRipple = (anim: Animated.Value, delay: number) =>
        Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.timing(anim, { toValue: 1.35, duration: 900, useNativeDriver: true }),
            Animated.timing(anim, { toValue: 1,    duration: 900, useNativeDriver: true }),
          ])
        );

      Animated.loop(
        Animated.sequence([
          Animated.timing(glow, { toValue: 1, duration: 700, useNativeDriver: true }),
          Animated.timing(glow, { toValue: 0.5, duration: 700, useNativeDriver: true }),
        ])
      ).start();

      // Rings ripple outward in sequence — wave effect
      createRipple(pulse3, 0).start();
      createRipple(pulse2, 300).start();
      createRipple(pulse1, 600).start();

      // Core pulses with Oracle's speech rhythm
      Animated.loop(
        Animated.sequence([
          Animated.timing(coreScale, { toValue: 1.1, duration: 700, useNativeDriver: true }),
          Animated.timing(coreScale, { toValue: 1,   duration: 700, useNativeDriver: true }),
        ])
      ).start();
    }
  }, [state]);

  // Ring colors shift based on state
  const getRingColors = () => {
    if (state === 'listening') {
      return {
        ring3: p.accentPrimary.replace(')', ', 0.15)').replace('rgb', 'rgba'),
        ring2: p.accentPrimary.replace(')', ', 0.28)').replace('rgb', 'rgba'),
        ring1: p.accentPrimary.replace(')', ', 0.45)').replace('rgb', 'rgba'),
      };
    }
    if (state === 'speaking') {
      return {
        ring3: p.accentDeep.replace(')', ', 0.12)').replace('rgb', 'rgba'),
        ring2: p.accentDeep.replace(')', ', 0.25)').replace('rgb', 'rgba'),
        ring1: p.accentDeep.replace(')', ', 0.42)').replace('rgb', 'rgba'),
      };
    }
    // idle
    return {
      ring3: p.orbRing3,
      ring2: p.orbRing2,
      ring1: p.orbRing1,
    };
  };

  const rings = getRingColors();
  const containerSize = size * 1.5;

  return (
    <View style={{ 
      width: containerSize, 
      height: containerSize, 
      alignItems: 'center', 
      justifyContent: 'center',
      marginBottom: 20,
    }}>
      {/* Ring 3 — outermost */}
      <View style={[styles.ringWrapper, { width: containerSize, height: containerSize }]}>
        <Animated.View style={{
          width: size, height: size, borderRadius: size / 2,
          borderWidth: 1, borderColor: rings.ring3,
          backgroundColor: p.orbBg3,
          transform: [{ scale: pulse3 }], opacity: glow
        }} />
      </View>

      {/* Ring 2 */}
      <View style={[styles.ringWrapper, { width: containerSize, height: containerSize }]}>
        <Animated.View style={{
          width: size * 0.75, height: size * 0.75, borderRadius: (size * 0.75) / 2,
          borderWidth: 1, borderColor: rings.ring2,
          backgroundColor: p.orbBg2,
          transform: [{ scale: pulse2 }]
        }} />
      </View>

      {/* Ring 1 — innermost */}
      <View style={[styles.ringWrapper, { width: containerSize, height: containerSize }]}>
        <Animated.View style={{
          width: size * 0.53, height: size * 0.53, borderRadius: (size * 0.53) / 2,
          borderWidth: 1, borderColor: rings.ring1,
          backgroundColor: p.orbBg1,
          transform: [{ scale: pulse1 }]
        }} />
      </View>

      {/* Core */}
      <Animated.View style={{ transform: [{ scale: coreScale }] }}>
        <LinearGradient
          colors={p.accentGradient}
          style={{
            width: size * 0.37, height: size * 0.37,
            borderRadius: (size * 0.37) / 2,
            alignItems: 'center', justifyContent: 'center',
            shadowColor: p.accentPrimary,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.7, shadowRadius: 20, elevation: 20,
          }}
          start={{ x: 0.2, y: 0 }}
          end={{ x: 0.8, y: 1 }}
        >
        </LinearGradient>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  ringWrapper: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
});