import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { MOCK_SWIPE_CANDIDATES } from '@/constants/mockData';
import { Colors } from '@/constants/theme';

export default function SwipeDeckScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentMovie = MOCK_SWIPE_CANDIDATES[currentIndex];
  const isDeckEmpty = currentIndex >= MOCK_SWIPE_CANDIDATES.length;

  const handleSwipeRight = () => {
    if (currentMovie) {
      // Picked movie -> Navigate directly to decision screen!
      router.push({
        pathname: '/decision',
        params: {
          title: currentMovie.title,
          poster_path: currentMovie.poster_path,
          runtime: currentMovie.runtime,
          vote_average: currentMovie.vote_average,
        }
      });
    }
  };

  const handleSwipeLeft = () => {
    setCurrentIndex(prev => prev + 1);
  };

  const handleSwipeUp = () => {
    // Marked as seen -> skip to next
    setCurrentIndex(prev => prev + 1);
  };

  if (isDeckEmpty || !currentMovie) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyDeckBox}>
          <Text style={styles.emptyTitle}>Deck Finished 🎬</Text>
          <Text style={styles.emptySub}>No more candidates in this filter session. Reset filters to see more.</Text>
          <TouchableOpacity style={styles.resetBtn} onPress={() => router.push('/filter')}>
            <Text style={styles.resetBtnText}>Adjust Filters</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const posterUri = `https://image.tmdb.org/t/p/w500${currentMovie.poster_path}`;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topHeader}>
        <Text style={styles.deckProgress}>Candidate {currentIndex + 1} of {MOCK_SWIPE_CANDIDATES.length}</Text>
        <Text style={styles.fastTip}>Swipe right or tap Watch to pick fast</Text>
      </View>

      {/* Swipe Card (POSTER + TITLE + RATING BADGE ONLY - NO TEXT PARAGRAPHS) */}
      <View style={styles.card}>
        <Image 
          source={{ uri: posterUri }} 
          style={styles.poster} 
          resizeMode="cover" 
        />

        {/* Rating Badge top-right */}
        <View style={styles.ratingBadge}>
          <Text style={styles.starIcon}>★</Text>
          <Text style={styles.ratingText}>{currentMovie.vote_average}</Text>
        </View>

        {/* Title Overlay at Bottom */}
        <View style={styles.titleOverlay}>
          <Text style={styles.movieTitle} numberOfLines={2}>{currentMovie.title}</Text>
          <Text style={styles.movieRuntime}>{currentMovie.runtime} mins • {currentMovie.release_date}</Text>
        </View>
      </View>

      {/* Swipe Action Control Buttons */}
      <View style={styles.controlsRow}>
        <TouchableOpacity style={styles.skipBtn} onPress={handleSwipeLeft}>
          <Text style={styles.btnIcon}>❌</Text>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.seenBtn} onPress={handleSwipeUp}>
          <Text style={styles.btnIcon}>👁️</Text>
          <Text style={styles.seenText}>Seen It</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.pickBtn} onPress={handleSwipeRight}>
          <Text style={styles.btnIcon}>🍿</Text>
          <Text style={styles.pickText}>WATCH THIS</Text>
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
  topHeader: {
    marginTop: 14,
    alignItems: 'center',
  },
  deckProgress: {
    color: Colors.dark.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  fastTip: {
    color: Colors.dark.primary,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  card: {
    flex: 1,
    marginVertical: 14,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: Colors.dark.cardBg,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  poster: {
    width: '100%',
    height: '100%',
  },
  ratingBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(13, 14, 18, 0.85)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(253, 203, 110, 0.4)',
  },
  starIcon: {
    color: Colors.dark.starGold,
    fontSize: 14,
  },
  ratingText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  titleOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingTop: 30,
    backgroundColor: 'rgba(13, 14, 18, 0.92)',
  },
  movieTitle: {
    color: '#FFF',
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  movieRuntime: {
    color: Colors.dark.textSecondary,
    fontSize: 14,
    fontWeight: '500',
    marginTop: 4,
  },
  controlsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  skipBtn: {
    flex: 1,
    backgroundColor: Colors.dark.backgroundElement,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  skipText: {
    color: Colors.dark.thumbsDown,
    fontWeight: '700',
    fontSize: 13,
    marginTop: 4,
  },
  seenBtn: {
    flex: 1,
    backgroundColor: Colors.dark.backgroundElement,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  seenText: {
    color: Colors.dark.textSecondary,
    fontWeight: '700',
    fontSize: 13,
    marginTop: 4,
  },
  pickBtn: {
    flex: 2,
    backgroundColor: Colors.dark.primary,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: Colors.dark.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  pickText: {
    color: '#FFF',
    fontWeight: '900',
    fontSize: 15,
    marginTop: 2,
  },
  btnIcon: {
    fontSize: 20,
  },
  emptyDeckBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginBottom: 10,
  },
  emptySub: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  resetBtn: {
    backgroundColor: Colors.dark.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  resetBtnText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});
