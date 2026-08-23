import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { COLD_START_MOVIES } from '@/constants/mockData';
import { Colors } from '@/constants/theme';
import GradientButton from '@/components/GradientButton';
import { computeUserTasteVector, UserRating } from '@/services/tasteEngine';

export default function OnboardingScreen() {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<Record<number, boolean>>({});

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const selectedCount = Object.values(selectedIds).filter(Boolean).length;

  const handleProceed = () => {
    // Generate user ratings array from selections
    const ratings: UserRating[] = COLD_START_MOVIES.map(movie => ({
      tmdb_id: movie.tmdb_id,
      rating_type: selectedIds[movie.tmdb_id] ? 'thumbs_up' : 'thumbs_down',
      movie
    }));

    // Compute 128-dim taste vector
    const tasteVec = computeUserTasteVector(ratings);
    console.log('Computed Taste Vector length:', tasteVec.length);

    router.push('/filter');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header matching Brand Board */}
      <View style={styles.header}>
        <Text style={styles.title}>Let's get a feel</Text>
        <Text style={styles.subtitle}>Rate a few movies you've seen and liked.</Text>
      </View>

      {/* 3-Column Poster Grid */}
      <ScrollView contentContainerStyle={styles.gridContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {COLD_START_MOVIES.map(movie => {
            const isSelected = !!selectedIds[movie.tmdb_id];
            const posterUri = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

            return (
              <TouchableOpacity
                key={movie.tmdb_id}
                style={[
                  styles.posterCard,
                  isSelected && styles.posterCardSelected
                ]}
                activeOpacity={0.8}
                onPress={() => toggleSelect(movie.tmdb_id)}
              >
                <Image 
                  source={{ uri: posterUri }} 
                  style={styles.posterImage} 
                  resizeMode="cover" 
                />

                {isSelected && (
                  <View style={styles.selectedOverlay}>
                    <View style={styles.checkCircle}>
                      <Text style={styles.checkChar}>✓</Text>
                    </View>
                  </View>
                )}

                <Text style={styles.movieTitle} numberOfLines={1}>
                  {movie.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Bottom CTA Pill matching Brand Board */}
      <View style={styles.footer}>
        <GradientButton 
          title={selectedCount > 0 ? `Looks good (${selectedCount})` : 'Looks good'} 
          onPress={handleProceed} 
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: Colors.textLight,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: 4,
  },
  gridContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  posterCard: {
    width: '30%',
    aspectRatio: 0.65,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: Colors.surfaceDark,
    position: 'relative',
    borderWidth: 2,
    borderColor: 'transparent',
    marginBottom: 6,
  },
  posterCardSelected: {
    borderColor: Colors.primaryPink,
  },
  posterImage: {
    width: '100%',
    height: '80%',
  },
  movieTitle: {
    color: Colors.textLight,
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'center',
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  selectedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 90, 125, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primaryPink,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkChar: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: 'rgba(18, 18, 23, 0.95)',
  },
});
