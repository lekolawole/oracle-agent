
import React, { useContext, useEffect, useRef } from 'react';
import { usePalette } from '@/constants/colors';
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
  Platform,
} from 'react-native';
import OracleAiPond from '@/components/chat/ai-pond';
import { ThemeContext } from '@/context/theme-context';

const { width } = Dimensions.get('window');

export default function Screen() {
  const p = usePalette();
  const bgAnim = useRef(new Animated.Value(0)).current;

  const { colorMode } = useContext(ThemeContext);
  const headerFade  = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(-10)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerFade,  { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(headerSlide, { toValue: 0, duration: 800, useNativeDriver: true }),
    ]).start();
  }, []);

  useEffect(() => {
    // Smoothly transition the background color over 400ms
    Animated.timing(bgAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: false,
    }).start(() => bgAnim.setValue(0));
  }, [p.background]);

  return (
    <View style={{ flex: 1, backgroundColor: p.background }}> 
        <StatusBar barStyle={colorMode === 'dark' ? 'light-content' : 'dark-content'} />
        
        <View style={styles.root}>
          {/* Header */}
          <View style={styles.header}>
            {/* Standard View, no animations */}
          </View>
  
          {/* AI Pond */}
          <View style={{ flex: 1 }}>
            <OracleAiPond />
          </View>
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