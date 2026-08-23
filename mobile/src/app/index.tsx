import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Movie Recommender</Text>
        <Text style={styles.subtitle}>Fast decision movie picker for low-willpower moments</Text>
      </View>

      <View style={styles.cardContainer}>
        {/* Step 1: Onboarding Taste Setup */}
        <TouchableOpacity 
          style={[styles.card, { borderLeftColor: Colors.dark.thumbsUp }]} 
          onPress={() => router.push('/onboarding')}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.stepBadge}>Step 1</Text>
            <Text style={styles.cardTitle}>Taste Profile Onboarding</Text>
          </View>
          <Text style={styles.cardDesc}>Rate ~10 movies with Thumbs Up 👍 / Down 👎 to compute your silent taste profile.</Text>
        </TouchableOpacity>

        {/* Step 2: Quick Filter Questions */}
        <TouchableOpacity 
          style={[styles.card, { borderLeftColor: Colors.dark.primary }]} 
          onPress={() => router.push('/filter')}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.stepBadge}>Step 2</Text>
            <Text style={styles.cardTitle}>Quick Filter Taps</Text>
          </View>
          <Text style={styles.cardDesc}>Answer 2 blunt questions (Runtime & Energy level) to cut down candidate pool.</Text>
        </TouchableOpacity>

        {/* Step 3: Swipe Deck */}
        <TouchableOpacity 
          style={[styles.card, { borderLeftColor: Colors.dark.starGold }]} 
          onPress={() => router.push('/swipe')}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.stepBadge}>Step 3</Text>
            <Text style={styles.cardTitle}>Swipe Deck</Text>
          </View>
          <Text style={styles.cardDesc}>Swipe through minimal cards (Poster + Title + Rating) to decide fast.</Text>
        </TouchableOpacity>

        {/* Step 4: Watchlist & Post-Watch Rating */}
        <TouchableOpacity 
          style={[styles.card, { borderLeftColor: Colors.dark.textSecondary }]} 
          onPress={() => router.push('/watchlist')}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.stepBadge}>Watchlist</Text>
            <Text style={styles.cardTitle}>Post-Watch 1–5 Star Rating</Text>
          </View>
          <Text style={styles.cardDesc}>View saved movies & rate 1–5 stars once movie duration has elapsed.</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  content: {
    padding: 20,
    paddingTop: 60,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.dark.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    marginTop: 6,
  },
  cardContainer: {
    gap: 16,
  },
  card: {
    backgroundColor: Colors.dark.cardBg,
    borderRadius: 14,
    padding: 18,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 10,
  },
  stepBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.dark.primary,
    backgroundColor: 'rgba(140, 122, 230, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    textTransform: 'uppercase',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.dark.text,
  },
  cardDesc: {
    fontSize: 13,
    color: Colors.dark.textSecondary,
    lineHeight: 18,
  },
});
