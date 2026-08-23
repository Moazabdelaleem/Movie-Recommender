import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';

interface SavedItem {
  id: string;
  title: string;
  poster_path: string;
  runtime: number;
  swiped_at: string;
  isUnlocked: boolean;
  starRating: number;
}

export default function WatchlistScreen() {
  const router = useRouter();

  const [savedItems, setSavedItems] = useState<SavedItem[]>([
    {
      id: '1',
      title: 'INCEPTION',
      poster_path: '/oYuLEW9SpB15k12C21Bf2RtfU4b.jpg',
      runtime: 148,
      swiped_at: '2 hours ago',
      isUnlocked: true,
      starRating: 0,
    },
    {
      id: '2',
      title: 'YOUR NAME',
      poster_path: '/q719jXXEzOoYaps6babgKnONONX.jpg',
      runtime: 106,
      swiped_at: 'Just now',
      isUnlocked: false,
      starRating: 0,
    }
  ]);

  const handleStarRate = (id: string, stars: number) => {
    setSavedItems(prev => prev.map(item => item.id === id ? { ...item, starRating: stars } : item));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Post-Watch Ratings</Text>
        <Text style={styles.subtitle}>Rate 1–5 stars after watching to refine your taste profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {savedItems.map(item => (
          <View key={item.id} style={styles.itemCard}>
            <Image 
              source={{ uri: `https://image.tmdb.org/t/p/w200${item.poster_path}` }} 
              style={styles.poster} 
              resizeMode="cover"
            />
            <View style={styles.itemDetails}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemMeta}>{item.runtime} mins • Saved {item.swiped_at}</Text>

              {/* Post-Watch Star Rating Widget */}
              {item.isUnlocked ? (
                <View style={styles.ratingBox}>
                  <Text style={styles.ratingHeader}>Rate movie (1–5 Stars):</Text>
                  <View style={styles.starsRow}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <TouchableOpacity 
                        key={star} 
                        onPress={() => handleStarRate(item.id, star)}
                        style={styles.starBtn}
                      >
                        <Text style={[
                          styles.starChar, 
                          star <= item.starRating ? styles.starFilled : styles.starEmpty
                        ]}>
                          ★
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  {item.starRating > 0 && (
                    <Text style={styles.ratedSuccess}>
                      ✓ {item.starRating} Stars saved to taste vector
                    </Text>
                  )}
                </View>
              ) : (
                <View style={styles.lockedBox}>
                  <Text style={styles.lockedText}>
                    🔒 Watching now ({item.runtime}m)
                  </Text>
                  <Text style={styles.lockedSub}>Star rating unlocks after runtime passes</Text>
                </View>
              )}
            </View>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.backBtn} onPress={() => router.push('/')}>
        <Text style={styles.backBtnText}>← Back to Home</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 24,
  },
  header: {
    marginTop: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: Colors.textLight,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 4,
  },
  list: {
    gap: 16,
    paddingBottom: 20,
  },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceDark,
    borderRadius: 16,
    overflow: 'hidden',
    padding: 12,
    gap: 14,
  },
  poster: {
    width: 80,
    height: 120,
    borderRadius: 10,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textLight,
    letterSpacing: 0.5,
  },
  itemMeta: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
    marginBottom: 10,
  },
  ratingBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    padding: 8,
    borderRadius: 10,
  },
  ratingHeader: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textMuted,
    marginBottom: 4,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  starBtn: {
    padding: 2,
  },
  starChar: {
    fontSize: 20,
  },
  starFilled: {
    color: Colors.primaryPink,
  },
  starEmpty: {
    color: '#3A3A45',
  },
  ratedSuccess: {
    fontSize: 11,
    color: Colors.primaryPink,
    fontWeight: '700',
    marginTop: 4,
  },
  lockedBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    padding: 8,
    borderRadius: 10,
  },
  lockedText: {
    fontSize: 12,
    color: Colors.primaryPurple,
    fontWeight: '700',
  },
  lockedSub: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  backBtn: {
    marginVertical: 16,
    paddingVertical: 14,
    backgroundColor: Colors.surfaceDark,
    borderRadius: 28,
    alignItems: 'center',
  },
  backBtnText: {
    color: Colors.textMuted,
    fontWeight: '700',
  },
});
