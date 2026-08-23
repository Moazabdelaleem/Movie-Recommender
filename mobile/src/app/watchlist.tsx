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
      title: 'Inception',
      poster_path: '/oYuLEW9SpB15k12C21Bf2RtfU4b.jpg',
      runtime: 148,
      swiped_at: '2 hours ago',
      isUnlocked: true, // Runtime passed -> Unlocked!
      starRating: 0,
    },
    {
      id: '2',
      title: 'Your Name',
      poster_path: '/q719jXXEzOoYaps6babgKnONONX.jpg',
      runtime: 106,
      swiped_at: 'Just now',
      isUnlocked: false, // Currently watching -> Locked
      starRating: 0,
    }
  ]);

  const handleStarRate = (id: string, stars: number) => {
    setSavedItems(prev => prev.map(item => item.id === id ? { ...item, starRating: stars } : item));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Watchlist & Post-Watch Ratings</Text>
        <Text style={styles.subtitle}>Rate 1–5 stars after finishing movies to refine your taste profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
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

              {/* Unlocked Post-Watch Star Rating Widget */}
              {item.isUnlocked ? (
                <View style={styles.ratingBox}>
                  <Text style={styles.ratingHeader}>Rate this movie (1–5 Stars):</Text>
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
                      Saved! {item.starRating} Stars added to taste vector ✨
                    </Text>
                  )}
                </View>
              ) : (
                <View style={styles.lockedBox}>
                  <Text style={styles.lockedText}>
                    🔒 Currently watching ({item.runtime}m duration)
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
    backgroundColor: Colors.dark.background,
    paddingHorizontal: 20,
  },
  header: {
    marginTop: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.dark.text,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.dark.textSecondary,
    marginTop: 4,
  },
  list: {
    gap: 16,
    paddingBottom: 20,
  },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: Colors.dark.cardBg,
    borderRadius: 14,
    overflow: 'hidden',
    padding: 12,
    gap: 14,
  },
  poster: {
    width: 80,
    height: 120,
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.dark.text,
  },
  itemMeta: {
    fontSize: 12,
    color: Colors.dark.textSecondary,
    marginTop: 2,
    marginBottom: 10,
  },
  ratingBox: {
    backgroundColor: Colors.dark.backgroundElement,
    padding: 8,
    borderRadius: 8,
  },
  ratingHeader: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.dark.textSecondary,
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
    fontSize: 22,
  },
  starFilled: {
    color: Colors.dark.starGold,
  },
  starEmpty: {
    color: '#44475A',
  },
  ratedSuccess: {
    fontSize: 11,
    color: Colors.dark.thumbsUp,
    fontWeight: '600',
    marginTop: 4,
  },
  lockedBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 8,
    borderRadius: 8,
  },
  lockedText: {
    fontSize: 12,
    color: Colors.dark.starGold,
    fontWeight: '600',
  },
  lockedSub: {
    fontSize: 11,
    color: Colors.dark.textSecondary,
    marginTop: 2,
  },
  backBtn: {
    marginVertical: 16,
    paddingVertical: 14,
    backgroundColor: Colors.dark.backgroundElement,
    borderRadius: 12,
    alignItems: 'center',
  },
  backBtnText: {
    color: Colors.dark.text,
    fontWeight: 'bold',
  },
});
