import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import CueLogo from '@/components/Cuelogo';
import GradientButton from '@/components/GradientButton';
import { Colors } from '@/constants/theme';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header / Logo Lockup */}
        <View style={styles.header}>
          <CueLogo size="large" showWordmark={true} showTagline={true} />
        </View>

        {/* Hero Banner / Positioning */}
        <View style={styles.heroCard}>
          <Text style={styles.positioningText}>Less scrolling.{'\n'}
            <Text style={styles.gradientText}>More watching.</Text>
          </Text>
          <Text style={styles.heroDesc}>
            CUE helps you stop scrolling and start watching. Rate once, filter fast, swipe right. One decision. Zero friction.
          </Text>

          <GradientButton 
            title="Start Movie Selection →" 
            onPress={() => router.push('/onboarding')} 
            style={{ marginTop: 20 }}
          />
        </View>

        {/* 3 Core Value Pillars matching brand board */}
        <View style={styles.pillarsGrid}>
          <View style={styles.pillarCard}>
            <Text style={styles.pillarIcon}>⚡</Text>
            <Text style={styles.pillarTitle}>FAST</Text>
            <Text style={styles.pillarSub}>Decisions in under 60 seconds</Text>
          </View>

          <View style={styles.pillarCard}>
            <Text style={styles.pillarIcon}>🎯</Text>
            <Text style={styles.pillarTitle}>PERSONAL</Text>
            <Text style={styles.pillarSub}>Learns your taste vector automatically</Text>
          </View>

          <View style={styles.pillarCard}>
            <Text style={styles.pillarIcon}>😊</Text>
            <Text style={styles.pillarTitle}>EFFORTLESS</Text>
            <Text style={styles.pillarSub}>Blunt filters. Simple swipes. No friction.</Text>
          </View>
        </View>

        {/* Direct Screen Navigation Shortcuts */}
        <View style={styles.navSection}>
          <Text style={styles.sectionHeading}>Screen Flow Preview</Text>

          <TouchableOpacity style={styles.rowCard} onPress={() => router.push('/onboarding')}>
            <View style={styles.rowLeft}>
              <Text style={styles.rowNumber}>01</Text>
              <View>
                <Text style={styles.rowTitle}>Let's get a feel</Text>
                <Text style={styles.rowSub}>Rate 3-column movie poster grid</Text>
              </View>
            </View>
            <Text style={styles.rowChevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.rowCard} onPress={() => router.push('/filter')}>
            <View style={styles.rowLeft}>
              <Text style={styles.rowNumber}>02</Text>
              <View>
                <Text style={styles.rowTitle}>What's the vibe?</Text>
                <Text style={styles.rowSub}>Blunt filter rows & circular CTA</Text>
              </View>
            </View>
            <Text style={styles.rowChevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.rowCard} onPress={() => router.push('/swipe')}>
            <View style={styles.rowLeft}>
              <Text style={styles.rowNumber}>03</Text>
              <View>
                <Text style={styles.rowTitle}>Swipe Deck</Text>
                <Text style={styles.rowSub}>Full-bleed poster, reject X & heart ♥️</Text>
              </View>
            </View>
            <Text style={styles.rowChevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.rowCard} onPress={() => router.push('/watchlist')}>
            <View style={styles.rowLeft}>
              <Text style={styles.rowNumber}>04</Text>
              <View>
                <Text style={styles.rowTitle}>Saved & Post-Watch</Text>
                <Text style={styles.rowSub}>1–5 Star rating unlocked after movie</Text>
              </View>
            </View>
            <Text style={styles.rowChevron}>›</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 24,
    paddingTop: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  heroCard: {
    backgroundColor: Colors.surfaceDark,
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
  },
  positioningText: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.textLight,
    lineHeight: 34,
  },
  gradientText: {
    color: Colors.primaryPink,
  },
  heroDesc: {
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: 12,
    lineHeight: 20,
  },
  pillarsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 32,
  },
  pillarCard: {
    flex: 1,
    backgroundColor: Colors.surfaceDark,
    padding: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  pillarIcon: {
    fontSize: 22,
    marginBottom: 8,
  },
  pillarTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.textLight,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  pillarSub: {
    fontSize: 10,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 13,
  },
  navSection: {
    gap: 12,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  rowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surfaceDark,
    padding: 16,
    borderRadius: 16,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  rowNumber: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.primaryPink,
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textLight,
  },
  rowSub: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  rowChevron: {
    fontSize: 22,
    color: Colors.textMuted,
    fontWeight: '300',
  },
});
