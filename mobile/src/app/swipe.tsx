import React, { useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MOCK_SWIPE_CANDIDATES, COLD_START_MOVIES, Movie } from '@/constants/mockData';
import { Colors } from '@/constants/theme';
import { filterMoviePool } from '@/services/filterEngine';
import SwipeableCardStack from '@/components/SwipeableCardStack';

export default function SwipeDeckScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const maxRuntimeParam = params.maxRuntime ? parseInt(params.maxRuntime as string, 10) : undefined;
  const includeGenresParam = params.includeGenres ? (params.includeGenres as string).split(',') : undefined;

  // Filter candidate movies based on vibe criteria
  const candidateDeck = useMemo(() => {
    const allCandidates = [...MOCK_SWIPE_CANDIDATES, ...COLD_START_MOVIES];
    return filterMoviePool(allCandidates, {
      maxRuntime: maxRuntimeParam,
      includeGenres: includeGenresParam,
    });
  }, [maxRuntimeParam, includeGenresParam]);

  const handleAccept = (movie: Movie) => {
    router.push({
      pathname: '/decision',
      params: {
        title: movie.title,
        poster_path: movie.poster_path,
        runtime: movie.runtime,
        vote_average: movie.vote_average,
      }
    });
  };

  const handleReject = (movie: Movie) => {
    console.log('Rejected movie:', movie.title);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header matching Brand Board */}
      <View style={styles.header}>
        <Text style={styles.title}>Swipe</Text>
        <Text style={styles.subtitle}>Right for yes, left for no</Text>
      </View>

      <SwipeableCardStack
        movies={candidateDeck}
        onAccept={handleAccept}
        onReject={handleReject}
        onFinished={() => console.log('Deck finished')}
      />
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
});
