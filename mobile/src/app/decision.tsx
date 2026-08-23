import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import CueLogo from '@/components/Cuelogo';
import GradientButton from '@/components/GradientButton';

export default function DecisionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const title = (params.title as string) || 'Selected Movie';
  const posterPath = (params.poster_path as string) || '/oYuLEW9SpB15k12C21Bf2RtfU4b.jpg';
  const runtime = (params.runtime as string) || '120';
  const posterUri = `https://image.tmdb.org/t/p/w500${posterPath}`;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <CueLogo size="small" showWordmark={true} />
      </View>

      <View style={styles.content}>
        <View style={styles.decisionBadge}>
          <Text style={styles.badgeText}>MATCH FOUND</Text>
        </View>

        <View style={styles.posterCard}>
          <Image source={{ uri: posterUri }} style={styles.poster} resizeMode="cover" />
          <View style={styles.cardInfo}>
            <Text style={styles.movieTitle}>{title}</Text>
            <Text style={styles.runtimeInfo}>{runtime} mins</Text>
          </View>
        </View>

        <View style={styles.unlockNotice}>
          <Text style={styles.unlockTitle}>⏰ Post-Watch 1–5 Star Rating</Text>
          <Text style={styles.unlockDesc}>
            Unlocks in {runtime} mins once you finish watching. Star rating refines your taste profile for future decisions.
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <GradientButton 
          title="View Saved Watchlist →" 
          onPress={() => router.push('/watchlist')} 
        />

        <TouchableOpacity style={styles.homeBtn} onPress={() => router.push('/')}>
          <Text style={styles.homeBtnText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: 16,
  },
  content: {
    alignItems: 'center',
    marginVertical: 10,
  },
  decisionBadge: {
    backgroundColor: 'rgba(255, 90, 125, 0.15)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 20,
  },
  badgeText: {
    color: Colors.primaryPink,
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 1,
  },
  posterCard: {
    width: 220,
    backgroundColor: Colors.surfaceDark,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  poster: {
    width: 220,
    height: 300,
  },
  cardInfo: {
    padding: 16,
    alignItems: 'center',
  },
  movieTitle: {
    color: Colors.textLight,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  runtimeInfo: {
    color: Colors.textMuted,
    fontSize: 13,
    marginTop: 4,
  },
  unlockNotice: {
    backgroundColor: Colors.surfaceDark,
    padding: 16,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primaryPurple,
  },
  unlockTitle: {
    color: Colors.textLight,
    fontWeight: '700',
    fontSize: 14,
    marginBottom: 4,
  },
  unlockDesc: {
    color: Colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
  },
  actions: {
    gap: 12,
    marginBottom: 28,
  },
  homeBtn: {
    backgroundColor: Colors.surfaceDark,
    paddingVertical: 14,
    borderRadius: 28,
    alignItems: 'center',
  },
  homeBtnText: {
    color: Colors.textMuted,
    fontWeight: '600',
    fontSize: 15,
  },
});
