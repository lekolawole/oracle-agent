import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Animated, Dimensions, StatusBar, Platform,
  LayoutAnimation, UIManager, useColorScheme,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePalette } from '@/constants/colors';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width } = Dimensions.get('window');

// ── Capability Section ────────────────────────────────────────────────────────
interface CapabilityItem { icon: string; title: string; body: string; }
interface CapabilitySectionProps { title: string; items: CapabilityItem[]; delay: number; }

function CapabilitySection({ title, items, delay }: CapabilitySectionProps) {
  const p = usePalette();
  const scheme = useColorScheme();
  const [expanded, setExpanded] = useState<number | null>(null);
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 600, delay, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, delay, useNativeDriver: true }),
    ]).start();
  }, []);

  const toggle = (i: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(prev => (prev === i ? null : i));
  };

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }], marginBottom: 28 }}>
      <Text style={[styles.sectionLabel, { color: p.textDim }]}>{title}</Text>
      <BlurView intensity={scheme === 'dark' ? 14 : 50} tint={p.blurTint}
        style={[styles.sectionBlur, { borderColor: p.bgCardBorder }]}>
        {items.map((item, i) => (
          <View key={i}>
            {i > 0 && <View style={[styles.rowDivider, { backgroundColor: p.divider }]} />}
            <TouchableOpacity style={styles.capRow} onPress={() => toggle(i)} activeOpacity={0.7}>
              <View style={[styles.capIconWrap, { backgroundColor: p.accentDim }]}>
                <Text style={[styles.capIcon, { color: p.accentPrimary }]}>{item.icon}</Text>
              </View>
              <Text style={[styles.capTitle, { color: p.textPrimary }]}>{item.title}</Text>
              <Text style={[
                styles.capChevron,
                { color: p.textDim },
                expanded === i && { transform: [{ rotate: '90deg' }] }
              ]}>›</Text>
            </TouchableOpacity>
            {expanded === i && (
              <View style={styles.capBody}>
                <Text style={[styles.capBodyText, { color: p.textSecondary }]}>{item.body}</Text>
              </View>
            )}
          </View>
        ))}
      </BlurView>
    </Animated.View>
  );
}

// ── Stat Badge ────────────────────────────────────────────────────────────────
function StatBadge({ value, label, delay }: { value: string; label: string; delay: number }) {
  const p = usePalette();
  const scheme = useColorScheme();
  const fadeAnim  = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.88)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 500, delay, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, delay, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[
      styles.statBadge,
      { opacity: fadeAnim, transform: [{ scale: scaleAnim }], borderColor: p.bgCardBorder }
    ]}>
      <LinearGradient
        colors={scheme === 'dark' ? ['#1E1810', '#141008'] : ['#FFFFFF', '#F5F0E8']}
        style={styles.statInner}
      >
        <Text style={[styles.statValue, { color: p.accentPrimary }]}>{value}</Text>
        <Text style={[styles.statLabel, { color: p.textDim }]}>{label}</Text>
      </LinearGradient>
    </Animated.View>
  );
}

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const p = usePalette();
  const scheme = useColorScheme();
  const headerFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(headerFade, { toValue: 1, duration: 700, useNativeDriver: true }).start();
  }, []);

  return (
    <View style={[styles.root, { backgroundColor: p.background}]}>
      <StatusBar barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'} />
      <LinearGradient colors={[p.background, p.bgMid, p.background]} style={StyleSheet.absoluteFill} />
      <View style={[styles.ambientGlow, { backgroundColor: p.glowColor, opacity: p.glowOpacity }]} />

      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 40 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View style={[styles.header, { opacity: headerFade }]}>
          <View>
            <Text style={[styles.eyebrow, { color: p.textDim }]}>ORACLE SYSTEM</Text>
            <Text style={[styles.pageTitle, { color: p.textPrimary }]}>Explore</Text>
          </View>
          <View style={[styles.statusPill, { backgroundColor: p.statusBg, borderColor: p.statusBorder }]}>
            <View style={[styles.statusDot, { backgroundColor: p.statusDot, shadowColor: p.statusDot }]} />
            <Text style={[styles.statusText, { color: p.statusText }]}>Active</Text>
          </View>
        </Animated.View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <StatBadge value="∞"    label="Knowledge" delay={200} />
          <StatBadge value="<1s"  label="Response"  delay={300} />
          <StatBadge value="24/7" label="Available" delay={400} />
          <StatBadge value="100%" label="Private"   delay={500} />
        </View>

        <View style={[styles.divider, { backgroundColor: p.divider }]} />

        {/* Capability sections */}
        <CapabilitySection title="REASONING" delay={300} items={[
          { icon: '◎', title: 'Deep Analysis',       body: 'Oracle breaks down complex problems into structured reasoning chains — giving you not just answers, but clarity on how those answers were reached.' },
          { icon: '◐', title: 'Multi-step Planning',  body: 'Lay out a goal and Oracle builds the path — sequencing tasks, identifying blockers, and surfacing the decisions that matter most.' },
          { icon: '◑', title: 'Hypothesis Testing',   body: 'Challenge your assumptions. Oracle stress-tests ideas with counterarguments and edge cases before you commit.' },
        ]} />

        <CapabilitySection title="INTELLIGENCE" delay={450} items={[
          { icon: '◈', title: 'Contextual Memory',    body: 'Oracle holds context across your entire session — no need to repeat yourself. It tracks what matters and builds on what came before.' },
          { icon: '◉', title: 'Pattern Recognition',  body: 'From your habits to market signals, Oracle identifies meaningful patterns in the noise and surfaces them at the right moment.' },
        ]} />

        <CapabilitySection title="INTERFACE" delay={600} items={[
          { icon: '◫', title: 'File-based Routing',   body: 'Screens are defined by files in the app/ directory. Add a file, get a route — no boilerplate. Powered by Expo Router.' },
          { icon: '▣', title: 'Adaptive Theming',     body: 'Oracle responds to your system appearance — deep blacks and warm gold in dark mode, cream and slate blue in light mode.' },
          { icon: '◲', title: 'Native Animations',    body: 'Every transition, press state, and reveal is choreographed with React Native Reanimated to feel truly native at 60fps.' },
          { icon: '◳', title: 'Platform Intelligence',body: 'Oracle adapts to iOS, Android, and web — rendering native components, respecting safe areas, and honoring platform conventions.' },
        ]} />

        {/* Manifesto */}
        <BlurView intensity={scheme === 'dark' ? 12 : 50} tint={p.blurTint}
          style={[styles.manifestoCard, { borderColor: p.bgCardBorder }]}>
          <LinearGradient colors={p.manifestoBg} style={styles.manifestoGradient}>
            <Text style={[styles.manifestoEyebrow, { color: p.accentDeep }]}>THE ORACLE PRINCIPLE</Text>
            <Text style={[styles.manifestoText, { color: p.textSecondary }]}>
              Intelligence without ego. Clarity without noise.{'\n'}
              Every answer earned, never assumed.
            </Text>
            <View style={[styles.manifestoRule, { backgroundColor: p.accentDim }]} />
            <Text style={[styles.manifestoSub, { color: p.textDim }]}>Built on Expo · Powered by reason</Text>
          </LinearGradient>
        </BlurView>

        <Text style={[styles.footerLabel, { color: p.textMuted }]}>
          ORACLE · BUILD {new Date().getFullYear()}
        </Text>
      </ScrollView>
    </View>
  );
}

// ── Styles (non-color) ────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root:   { flex: 1 },
  scroll: { paddingHorizontal: 20 },
  ambientGlow: {
    position: 'absolute', top: -60, right: -40,
    width: width * 0.6, height: 240, borderRadius: 160,
  },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-end', marginBottom: 24,
  },
  eyebrow: { fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 4 },
  pageTitle: {
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    fontSize: 32, fontWeight: '600', letterSpacing: 0.3,
  },
  statusPill: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    borderWidth: 1, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6,
  },
  statusDot: {
    width: 6, height: 6, borderRadius: 3,
    shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 4,
  },
  statusText: { fontSize: 11, letterSpacing: 1, textTransform: 'uppercase' },
  statsRow:   { flexDirection: 'row', gap: 8, marginBottom: 28 },
  statBadge:  { flex: 1, borderRadius: 12, overflow: 'hidden', borderWidth: 1 },
  statInner:  { alignItems: 'center', paddingVertical: 12, paddingHorizontal: 4 },
  statValue:  {
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    fontSize: 16, fontWeight: '700', marginBottom: 3,
  },
  statLabel:  { fontSize: 8, letterSpacing: 1.5, textTransform: 'uppercase' },
  divider:    { height: 1, marginBottom: 28 },
  sectionLabel: { fontSize: 10, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 10, paddingLeft: 2 },
  sectionBlur:  { borderRadius: 16, overflow: 'hidden', borderWidth: 1 },
  rowDivider:   { height: 1, marginHorizontal: 16 },
  capRow:       { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 15, gap: 14 },
  capIconWrap:  { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  capIcon:      { fontSize: 15 },
  capTitle:     { flex: 1, fontSize: 15, fontWeight: '500', letterSpacing: 0.2 },
  capChevron:   { fontSize: 20, fontWeight: '300' },
  capBody:      { paddingHorizontal: 62, paddingBottom: 16, paddingTop: 2 },
  capBodyText:  { fontSize: 13, lineHeight: 20, letterSpacing: 0.2 },
  manifestoCard: { borderRadius: 18, overflow: 'hidden', borderWidth: 1, marginBottom: 36 },
  manifestoGradient: { padding: 24, alignItems: 'center' },
  manifestoEyebrow:  { fontSize: 9, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 14 },
  manifestoText: {
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    fontSize: 17, textAlign: 'center', lineHeight: 26,
    letterSpacing: 0.3, fontStyle: 'italic', marginBottom: 18,
  },
  manifestoRule: { width: 40, height: 1, marginBottom: 14 },
  manifestoSub:  { fontSize: 10, letterSpacing: 2, textTransform: 'uppercase' },
  footerLabel:   { textAlign: 'center', fontSize: 9, letterSpacing: 4, textTransform: 'uppercase' },
});
