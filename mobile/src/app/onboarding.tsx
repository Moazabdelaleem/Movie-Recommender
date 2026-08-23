import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { COLD_START_MOVIES } from '@/constants/mockData';
import { Colors } from '@/constants/theme';

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userRatings, setUserRatings] = useState<Record<number, 'thumbs_up' | 'thumbs_down'>>({});

  const currentMovie = COLD_START_MOVIES[currentIndex];
  const isFinished = currentIndex >= COLD_START_MOVIES.length;

  const handleRate = (ratingType: 'thumbs_up' | 'thumbs_down') => {
    if (currentMovie) {
      setUserRatings(prev => ({ ...prev, [currentMovie.tmdb_id]: ratingType }));
    }
    if (currentIndex + 1 >= COLD_START_MOVIES.length) {
      // Finished onboarding -> proceed to filter step
      router.push('/filter');
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  if (isFinished || !currentMovie) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.finishedBox}>
          <Text style={styles.finishedTitle}>Taste Profile Built! 🎉</Text>
          <Text style={styles.finishedSub}>Your silent taste vector is computed. Ready to filter and swipe.</Text>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => router.push('/filter')}>
            <Text style={styles.btnText}>Proceed to Filters →</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const posterUri = `https://image.tmdb.org/t/p/w500${currentMovie.poster_path}`;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.progressText}>Taste Onboarding ({currentIndex + 1} / {COLD_START_MOVIES.length})</Text>
        <View style={styles.progressBarBg}>
          <View 
            style={[
              styles.progressBarFill, 
              { width: `${((currentIndex + 1) / COLD_START_MOVIES.length) * 100}%` }
            ]} 
          />
        </View>
      </View>

      {/* Movie Card */}
      <View style={styles.cardContainer}>
        <Image 
          source={{ uri: posterUri }} 
          style={styles.poster} 
          resizeMode="cover"
        />
        <View style={styles.metaOverlay}>
          <Text style={styles.movieTitle}>{currentMovie.title}</Text>
          <Text style={styles.movieSub}>{currentMovie.release_date} • {currentMovie.genres.join(', ')}</Text>
        </View>
      </View>

      {/* Action Buttons: Thumbs Up / Down */}
      <View style={styles.actionRow}>
        <TouchableOpacity 
          style={[styles.rateBtn, { backgroundColor: 'rgba(255, 118, 117, 0.15)', borderColor: Colors.dark.thumbsDown }]}
          onPress={() => handleRate('thumbs_down')}
        >
          <Text style={styles.btnEmoji}>👎</Text>
          <Text style={[styles.rateBtnText, { color: Colors.dark.thumbsDown }]}>Dislike</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.rateBtn, { backgroundColor: 'rgba(0, 184, 148, 0.15)', borderColor: Colors.dark.thumbsUp }]}
          onPress={() => handleRate('thumbs_up')}
        >
          <Text style={styles.btnEmoji}>👍</Text>
          <Text style={[styles.rateBtnText, { color: Colors.dark.thumbsUp }]}>Liked It</Text>
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
  header: {
    marginTop: 20,
  },
  progressText: {
    color: Colors.dark.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  progressBarBg: {
    height: 6,
    backgroundColor: Colors.dark.backgroundElement,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.dark.primary,
  },
  cardContainer: {
    flex: 1,
    marginVertical: 20,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: Colors.dark.cardBg,
    position: 'relative',
  },
  poster: {
    width: '100%',
    height: '100%',
  },
  metaOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(13, 14, 18, 0.85)',
  },
  movieTitle: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
  },
  movieSub: {
    color: Colors.dark.textSecondary,
    fontSize: 13,
    marginTop: 4,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 30,
  },
  rateBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  btnEmoji: {
    fontSize: 22,
  },
  rateBtnText: {
    fontSize: 16,
    fontWeight: '700',
  },
  finishedBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  finishedTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginBottom: 10,
  },
  finishedSub: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  primaryBtn: {
    backgroundColor: Colors.dark.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
  },
  btnText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
