import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Movie } from '@/constants/mockData';
import { Colors } from '@/constants/theme';
import GradientButton from '@/components/GradientButton';

interface SwipeableCardStackProps {
  movies: Movie[];
  onAccept: (movie: Movie) => void;
  onReject: (movie: Movie) => void;
  onFinished: () => void;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function SwipeableCardStack({
  movies,
  onAccept,
  onReject,
  onFinished,
}: SwipeableCardStackProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentMovie = movies[currentIndex];
  const nextMovie = movies[currentIndex + 1];

  const handleAccept = () => {
    if (!currentMovie) return;
    onAccept(currentMovie);
  };

  const handleReject = () => {
    if (!currentMovie) return;
    onReject(currentMovie);
    if (currentIndex + 1 >= movies.length) {
      onFinished();
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  if (currentIndex >= movies.length || !currentMovie) {
    return (
      <View style={styles.emptyBox}>
        <Text style={styles.emptyTitle}>Deck Finished</Text>
        <Text style={styles.emptySub}>No more candidates in this vibe filter session.</Text>
      </View>
    );
  }

  const posterUri = `https://image.tmdb.org/t/p/w500${currentMovie.poster_path}`;
  const nextPosterUri = nextMovie ? `https://image.tmdb.org/t/p/w500${nextMovie.poster_path}` : null;

  return (
    <View style={styles.container}>
      {/* Card Stack Container */}
      <View style={styles.stackContainer}>
        {/* Next Card underneath (Scale 0.95, Opacity 0.5) */}
        {nextMovie && nextPosterUri && (
          <View style={[styles.card, styles.nextCard]}>
            <Image source={{ uri: nextPosterUri }} style={styles.posterImage} resizeMode="cover" />
            <View style={styles.titleOverlay}>
              <Text style={styles.movieTitle} numberOfLines={2}>
                {nextMovie.title.toUpperCase()}
              </Text>
            </View>
          </View>
        )}

        {/* Current Active Top Card */}
        <View style={styles.card}>
          <Image source={{ uri: posterUri }} style={styles.posterImage} resizeMode="cover" />

          {/* Minimal Title Overlay Bottom-Left matching Brand Board */}
          <View style={styles.titleOverlay}>
            <Text style={styles.movieTitle} numberOfLines={2}>
              {currentMovie.title.toUpperCase()}
            </Text>
          </View>
        </View>
      </View>

      {/* Action Buttons: Circular Reject X & Circular Gradient Heart ♥️ */}
      <View style={styles.actionsRow}>
        <TouchableOpacity style={styles.rejectBtn} activeOpacity={0.8} onPress={handleReject}>
          <Text style={styles.rejectIcon}>✕</Text>
        </TouchableOpacity>

        <GradientButton 
          variant="circle" 
          size={64} 
          onPress={handleAccept}
        >
          <Text style={styles.heartIcon}>♥</Text>
        </GradientButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  stackContainer: {
    flex: 1,
    marginHorizontal: 24,
    marginVertical: 12,
    position: 'relative',
  },
  card: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: Colors.surfaceDark,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 10,
  },
  nextCard: {
    transform: [{ scale: 0.94 }, { translateY: 14 }],
    opacity: 0.5,
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
    backgroundColor: 'rgba(18, 18, 23, 0.88)',
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
  },
});
