import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withRepeat, 
  withTiming, 
  interpolate,
  Easing,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

// --- Sub-Component: The 3D Orbital Rings ---
const OracleRings = () => {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(1, { duration: 6000, easing: Easing.linear }),
      -1,
      false
    );
  }, [rotation]);

  // Generate styles for 3 unique rings
  const createRingStyle = (index: number) => {
    return useAnimatedStyle(() => {
      const rotateZ = interpolate(rotation.value, [0, 1], [0, 360]);
      return {
        transform: [
          { rotateZ: `${rotateZ + (index * 60)}deg` },
          { rotateX: '70deg' }, // The "Apple" depth tilt
        ],
      };
    });
  };

  return (
    <View style={styles.ringContainer}>
      {[0, 1, 2].map((i) => (
        <Animated.View key={i} style={[styles.ring, createRingStyle(i)]} />
      ))}
    </View>
  );
};

// --- Sub-Component: The Pulsing Core ---
const GlowingOrb = () => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.7);

  useEffect(() => {
    scale.value = withRepeat(
      withTiming(1.2, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    opacity.value = withRepeat(
      withTiming(1, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, [scale, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <View style={styles.orbWrapper}>
      <Animated.View style={[styles.orb, animatedStyle]} />
    </View>
  );
};

// --- MAIN EXPORT ---
export default function OracleLoader() {
  return (
    <View style={styles.container}>
      <OracleRings />
      <GlowingOrb />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ringContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ring: {
    position: 'absolute',
    width: width * 0.6, // Responsive sizing
    height: width * 0.6,
    borderRadius: (width * 0.6) / 2,
    borderWidth: 0.5, // Ultra-thin premium lines
    borderColor: 'rgba(212, 175, 55, 0.4)', // Soft gold
  },
  orbWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  orb: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFF',
    // Glow effect
    shadowColor: '#FFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 15,
  },
});