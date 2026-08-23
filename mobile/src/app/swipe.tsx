import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MOCK_SWIPE_CANDIDATES, COLD_START_MOVIES } from '@/constants/mockData';
import { Colors } from '@/constants/theme';
import GradientButton from '@/components/GradientButton';
import { filterMoviePool } from '@/services/filterEngine';

export default function SwipeDeckScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [currentIndex, setCurrentIndex] = useState(0);

  const maxRuntimeParam = params.maxRuntime ? parseInt(params.maxRuntime as string, 10) : undefined;
  const includeGenresParam = params.includeGenres ? (params.includeGenres as string).split(',') : undefined;

  // Combine candidates & filter based on parameters
  const candidateDeck = useMemo(() => {
    const allCandidates = [...MOCK_SWIPE_CANDIDATES, ...COLD_START_MOVIES];
    return filterMoviePool(allCandidates, {
      maxRuntime: maxRuntimeParam,
      includeGenres: includeGenresParam,
    });
  }, [maxRuntimeParam, includeGenresParam]);

  const currentMovie = candidateDeck[currentIndex];
  const isDeckEmpty = currentIndex >= candidateDeck.length;

  const handleAccept = () => {
    if (currentMovie) {
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

  const handleReject = () => {
    setCurrentIndex(prev => prev + 1);
  };

  if (isDeckEmpty || !currentMovie) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyBox}>
          <Text style={styles.emptyTitle}>Deck Finished</Text>
          <Text style={styles.emptySub}>No more candidates in this vibe filter session.</Text>
          <TouchableOpacity style={styles.resetBtn} onPress={() => router.push('/filter')}>
            <Text style={styles.resetBtnText}>Adjust Vibe Filters</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const posterUri = `https://image.tmdb.org/t/p/w500${currentMovie.poster_path}`;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header matching Brand Board */}
      <View style={styles.header}>
        <Text style={styles.title}>Swipe</Text>
        <Text style={styles.subtitle}>Right for yes, left for no ({currentIndex + 1}/{candidateDeck.length})</Text>
      </View>

      {/* Full-Bleed Poster Card with Minimal Title Overlay (Title ONLY) */}
      <View style={styles.card}>
        <Image 
          source={{ uri: posterUri }} 
          style={styles.posterImage} 
          resizeMode="cover" 
        />

        {/* Minimal Title Overlay Bottom-Left */}
        <View style={styles.titleOverlay}>
          <Text style={styles.movieTitle} numberOfLines={2}>
            {currentMovie.title.toUpperCase()}
          </Text>
        </View>
      </View>

      {/* Bottom Circular Action Buttons (X reject, Gradient Heart accept) */}
      <View style={styles.actionsRow}>
        {/* Reject Circular Button X */}
        <TouchableOpacity style={styles.rejectBtn} activeOpacity={0.8} onPress={handleReject}>
          <Text style={styles.rejectIcon}>✕</Text>
        </TouchableOpacity>

        {/* Accept Gradient Circular Heart Button */}
        <GradientButton 
          variant="circle" 
          size={64} 
          onPress={handleAccept}
        >
          <Text style={styles.heartIcon}>♥</Text>
        </GradientButton>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'space-between',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: Colors.textLight,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 2,
  },
  card: {
    flex: 1,
    marginHorizontal: 24,
    marginVertical: 16,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: Colors.surfaceDark,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 10,
  },
  posterImage: {
    width: '100%',
    height: '100%',
  },
  titleOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingTop: 40,
    backgroundColor: 'rgba(18, 18, 23, 0.85)',
  },
  movieTitle: {
    color: Colors.textLight,
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1,
    lineHeight: 28,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 40,
    paddingBottom: 32,
    paddingTop: 8,
  },
  rejectBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.surfaceDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rejectIcon: {
    color: Colors.textMuted,
    fontSize: 24,
    fontWeight: '700',
  },
  heartIcon: {
    color: Colors.textLight,
    fontSize: 28,
  },
  emptyBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textLight,
    marginBottom: 8,
  },
  emptySub: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: 20,
  },
  resetBtn: {
    backgroundColor: Colors.surfaceDark,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
  },
  resetBtnText: {
    color: Colors.textLight,
    fontWeight: '700',
  },
});
