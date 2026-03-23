import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  StatusBar,
  Platform,
  useColorScheme,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePalette } from '@/constants/colors';
import OracleAiPond from '@/components/chat/ai-pond';

const { width } = Dimensions.get('window');

// ── Pulsing Orb ───────────────────────────────────────────────────────────────
function OracleOrb() {
  const p = usePalette();
  const pulse1 = useRef(new Animated.Value(1)).current;
  const pulse2 = useRef(new Animated.Value(1)).current;
  const pulse3 = useRef(new Animated.Value(1)).current;
  const glow   = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const createPulse = (anim: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, { toValue: 1.18, duration: 2200, useNativeDriver: true }),
          Animated.timing(anim, { toValue: 1,    duration: 2200, useNativeDriver: true }),
        ])
      );
    const glowAnim = Animated.loop(
      Animated.sequence([
        Animated.timing(glow, { toValue: 0.85, duration: 2800, useNativeDriver: true }),
        Animated.timing(glow, { toValue: 0.4,  duration: 2800, useNativeDriver: true }),
      ])
    );
    createPulse(pulse1, 0).start();
    createPulse(pulse2, 700).start();
    createPulse(pulse3, 1400).start();
    glowAnim.start();
  }, []);

  return (
    <View style={styles.orbContainer}>
      <Animated.View style={[
        styles.orbRing, styles.orbRing3,
        { borderColor: p.orbRing3, backgroundColor: p.orbBg3, transform: [{ scale: pulse3 }], opacity: glow }
      ]} />
      <Animated.View style={[
        styles.orbRing, styles.orbRing2,
        { borderColor: p.orbRing2, backgroundColor: p.orbBg2, transform: [{ scale: pulse2 }] }
      ]} />
      <Animated.View style={[
        styles.orbRing, styles.orbRing1,
        { borderColor: p.orbRing1, backgroundColor: p.orbBg1, transform: [{ scale: pulse1 }] }
      ]} />
      <LinearGradient
        colors={p.accentGradient}
        style={[styles.orbCore, { shadowColor: p.accentPrimary }]}
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
      >
        <Text style={styles.orbSymbol}>◉</Text>
      </LinearGradient>
    </View>
  );
}

// ── Insight Card ──────────────────────────────────────────────────────────────
interface InsightCardProps {
  icon: string; label: string; value: string; sub: string; delay: number;
}
function InsightCard({ icon, label, value, sub, delay }: InsightCardProps) {
  const p = usePalette();
  const scheme = useColorScheme();
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 600, delay, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, delay, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }], flex: 1 }}>
      <BlurView intensity={scheme === 'dark' ? 18 : 60} tint={p.blurTint}
        style={[styles.cardBlur, { borderColor: p.bgCardBorder }]}>
        <View style={styles.cardInner}>
          <Text style={[styles.cardIcon, { color: p.accentPrimary }]}>{icon}</Text>
          <Text style={[styles.cardLabel, { color: p.textDim }]}>{label}</Text>
          <Text style={[styles.cardValue, { color: p.textPrimary }]}>{value}</Text>
          <Text style={[styles.cardSub,   { color: p.textDim }]}>{sub}</Text>
        </View>
      </BlurView>
    </Animated.View>
  );
}

// ── Action Button ─────────────────────────────────────────────────────────────
interface ActionButtonProps {
  icon: string; label: string; onPress?: () => void; primary?: boolean;
}
function ActionButton({ icon, label, onPress, primary }: ActionButtonProps) {
  const p = usePalette();
  const scheme = useColorScheme();
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn  = () => Animated.spring(scale, { toValue: 0.94, useNativeDriver: true }).start();
  const onPressOut = () => Animated.spring(scale, { toValue: 1,    useNativeDriver: true }).start();

  return (
    <Animated.View style={{ transform: [{ scale }], flex: primary ? 2 : 1 }}>
      <TouchableOpacity onPress={onPress} onPressIn={onPressIn} onPressOut={onPressOut} activeOpacity={1}>
        {primary ? (
          <LinearGradient
            colors={p.accentGradient}
            style={[styles.actionBtn, styles.actionBtnPrimary, { shadowColor: p.accentPrimary }]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          >
            <Text style={styles.actionIconPrimary}>{icon}</Text>
            <Text style={styles.actionLabelPrimary}>{label}</Text>
          </LinearGradient>
        ) : (
          <BlurView intensity={scheme === 'dark' ? 20 : 60} tint={p.blurTint}
            style={[styles.actionBtn, styles.actionBtnSecondary, { borderColor: p.bgCardBorder }]}>
            <Text style={[styles.actionIcon,  { color: p.textSecondary }]}>{icon}</Text>
            <Text style={[styles.actionLabel, { color: p.textSecondary }]}>{label}</Text>
          </BlurView>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

// ── Thread Row ────────────────────────────────────────────────────────────────
interface ThreadRowProps {
  title: string; preview: string; time: string; index: number;
}
function ThreadRow({ title, preview, time, index }: ThreadRowProps) {
  const p = usePalette();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1, duration: 500, delay: 800 + index * 120, useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      <TouchableOpacity style={styles.threadRow} activeOpacity={0.7}>
        <View style={[styles.threadDot, { backgroundColor: p.accentDeep }]} />
        <View style={styles.threadContent}>
          <Text style={[styles.threadTitle,   { color: p.textPrimary }]}   numberOfLines={1}>{title}</Text>
          <Text style={[styles.threadPreview, { color: p.textDim }]} numberOfLines={1}>{preview}</Text>
        </View>
        <Text style={[styles.threadTime, { color: p.textDim }]}>{time}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const p = usePalette();
  const scheme = useColorScheme();

  const headerFade  = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(-10)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerFade,  { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(headerSlide, { toValue: 0, duration: 800, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <View style={[styles.root, { backgroundColor: p.background}]}>
      <StatusBar barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'} />

      <LinearGradient
        colors={[p.background, p.bgMid, p.background ]}
        style={StyleSheet.absoluteFill}
      />

      {/* Ambient glow */}
      <View style={[styles.ambientGlow, { backgroundColor: p.glowColor, opacity: p.glowOpacity }]} />

        {/* Header */}
        <Animated.View style={[styles.header, { opacity: headerFade, transform: [{ translateY: headerSlide }] }]}>
          
        </Animated.View>

        {/* Orb */}
        <View style={styles.orbSection}>
          <OracleOrb />
          <Text style={[styles.tagline,    { color: p.textPrimary }]}>Ask anything. Know everything.</Text>
          <Text style={[styles.taglineSub, { color: p.textDim }]}>Powered by deep reasoning</Text>
        </View>

        {/* AI Pond */}
        <View>
          <OracleAiPond />
        </View>
    </View>
  );
}

// ── Styles (non-color only) ───────────────────────────────────────────────────
const styles = StyleSheet.create({
  root:   { flex: 1 },
  scroll: { paddingHorizontal: 20 },
  ambientGlow: {
    position: 'absolute', top: -80, left: width * 0.15,
    width: width * 0.7, height: 300, borderRadius: 200,
  },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', marginBottom: 36,
  },
  greetingText: {
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    fontSize: 14, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4,
  },
  nameText: {
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    fontSize: 26, letterSpacing: 0.5, fontWeight: '600',
  },
  avatarBtn: { marginTop: 4 },
  avatar: {
    width: 42, height: 42, borderRadius: 21,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1,
  },
  avatarText: { fontSize: 18 },
  orbSection: { alignItems: 'center', marginBottom: 36 },
  orbContainer: {
    width: 160, height: 160, alignItems: 'center', justifyContent: 'center', marginBottom: 20,
  },
  orbRing: { position: 'absolute', borderRadius: 999, borderWidth: 1 },
  orbRing3: { width: 160, height: 160 },
  orbRing2: { width: 120, height: 120 },
  orbRing1: { width: 86,  height: 86  },
  orbCore: {
    width: 60, height: 60, borderRadius: 30,
    alignItems: 'center', justifyContent: 'center',
    shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.7, shadowRadius: 20, elevation: 20,
  },
  orbSymbol: { fontSize: 22, color: '#0A0A0A' },
  tagline: {
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    fontSize: 20, textAlign: 'center', letterSpacing: 0.3, marginBottom: 6,
  },
  taglineSub: { fontSize: 12, letterSpacing: 2.5, textTransform: 'uppercase', textAlign: 'center' },
  actionsRow: { flexDirection: 'row', gap: 10, marginBottom: 32 },
  actionBtn: { borderRadius: 14, paddingVertical: 14, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  actionBtnPrimary: {
    paddingHorizontal: 20, flexDirection: 'row', gap: 8,
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 12, elevation: 10,
  },
  actionBtnSecondary: { borderWidth: 1, paddingHorizontal: 12 },
  actionIconPrimary:  { fontSize: 16, color: '#0A0A0A' },
  actionLabelPrimary: { fontSize: 15, fontWeight: '700', color: '#0A0A0A', letterSpacing: 0.3 },
  actionIcon:  { fontSize: 16, marginBottom: 2 },
  actionLabel: { fontSize: 11, letterSpacing: 1, textTransform: 'uppercase' },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12,
  },
  sectionTitle: { fontSize: 11, letterSpacing: 2.5, textTransform: 'uppercase', fontWeight: '600' },
  sectionLink:  { fontSize: 12, letterSpacing: 1 },
  cardsRow: { flexDirection: 'row', gap: 10, marginBottom: 28 },
  cardBlur:  { borderRadius: 14, overflow: 'hidden', borderWidth: 1 },
  cardInner: { padding: 14, minHeight: 100, justifyContent: 'space-between' },
  cardIcon:  { fontSize: 18, marginBottom: 6 },
  cardLabel: { fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 },
  cardValue: { fontSize: 15, fontWeight: '700', letterSpacing: 0.2 },
  cardSub:   { fontSize: 10, marginTop: 2 },
  divider:   { height: 1, marginBottom: 24 },
  threadsList: { borderRadius: 16, overflow: 'hidden', borderWidth: 1, marginBottom: 36 },
  threadRow:   { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, gap: 12 },
  threadDot:   { width: 6, height: 6, borderRadius: 3, opacity: 0.7 },
  threadContent: { flex: 1 },
  threadTitle:   { fontSize: 14, fontWeight: '600', marginBottom: 2 },
  threadPreview: { fontSize: 12 },
  threadTime:    { fontSize: 11, letterSpacing: 0.5 },
  threadDivider: { height: 1, marginHorizontal: 16 },
  footerLabel: {
    textAlign: 'center', fontSize: 9, letterSpacing: 4, textTransform: 'uppercase',
  },
});
