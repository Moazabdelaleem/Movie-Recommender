import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';

export default function DecisionScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const title = (params.title as string) || 'Selected Movie';
  const posterPath = (params.poster_path as string) || '/oYuLEW9SpB15k12C21Bf2RtfU4b.jpg';
  const runtime = (params.runtime as string) || '120';
  const posterUri = `https://image.tmdb.org/t/p/w500${posterPath}`;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.successBadge}>
          <Text style={styles.successEmoji}>🍿</Text>
          <Text style={styles.successText}>Decision Made!</Text>
        </View>

        <View style={styles.posterCard}>
          <Image source={{ uri: posterUri }} style={styles.poster} resizeMode="cover" />
          <View style={styles.cardInfo}>
            <Text style={styles.movieTitle}>{title}</Text>
            <Text style={styles.runtimeInfo}>Duration: {runtime} minutes</Text>
          </View>
        </View>

        <View style={styles.unlockNotice}>
          <Text style={styles.unlockTitle}>⏰ Post-Watch 1–5 Star Rating</Text>
          <Text style={styles.unlockDesc}>
            Star rating unlocks in {runtime} mins once you finish watching. We'll send a rating reminder notification!
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.watchlistBtn} onPress={() => router.push('/watchlist')}>
          <Text style={styles.watchlistBtnText}>View Saved Watchlist →</Text>
        </TouchableOpacity>

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
    backgroundColor: Colors.dark.background,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  content: {
    alignItems: 'center',
    marginTop: 30,
  },
  successBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(0, 184, 148, 0.15)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
  },
  successEmoji: {
    fontSize: 20,
  },
  successText: {
    color: Colors.dark.thumbsUp,
    fontWeight: 'bold',
    fontSize: 16,
  },
  posterCard: {
    width: 220,
    backgroundColor: Colors.dark.cardBg,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
    alignItems: 'center',
    marginBottom: 24,
  },
  poster: {
    width: 220,
    height: 310,
  },
  cardInfo: {
    padding: 14,
    alignItems: 'center',
  },
  movieTitle: {
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  runtimeInfo: {
    color: Colors.dark.textSecondary,
    fontSize: 13,
    marginTop: 4,
  },
  unlockNotice: {
    backgroundColor: Colors.dark.backgroundElement,
    padding: 16,
    borderRadius: 14,
    borderLeftWidth: 4,
    borderLeftColor: Colors.dark.starGold,
  },
  unlockTitle: {
    color: Colors.dark.starGold,
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 4,
  },
  unlockDesc: {
    color: Colors.dark.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  actions: {
    gap: 12,
    marginBottom: 30,
  },
  watchlistBtn: {
    backgroundColor: Colors.dark.primary,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  watchlistBtnText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  homeBtn: {
    backgroundColor: Colors.dark.backgroundElement,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  homeBtnText: {
    color: Colors.dark.textSecondary,
    fontWeight: '600',
    fontSize: 15,
  },
});
