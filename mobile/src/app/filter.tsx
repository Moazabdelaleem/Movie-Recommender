import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';

export default function FilterScreen() {
  const router = useRouter();
  
  // Filter 1: Runtime (<100 mins vs Any)
  const [runtimeFilter, setRuntimeFilter] = useState<'short' | 'any'>('any');

  // Filter 2: Energy (Chill / Zone Out vs Focus / Engage)
  const [energyFilter, setEnergyFilter] = useState<'chill' | 'focus'>('chill');

  // Calculate estimated candidate pool size
  const poolSize = runtimeFilter === 'short' ? 12 : 24;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>2-Tap Filters</Text>
        <Text style={styles.subtitle}>Narrow candidate pool instantly before swiping</Text>
      </View>

      <View style={styles.questionsContainer}>
        {/* Question 1: Duration */}
        <View style={styles.questionCard}>
          <Text style={styles.questionTitle}>1. Available Time</Text>
          <View style={styles.optionsRow}>
            <TouchableOpacity 
              style={[
                styles.optionBtn, 
                runtimeFilter === 'short' && styles.optionSelected
              ]}
              onPress={() => setRuntimeFilter('short')}
            >
              <Text style={styles.optionEmoji}>⏱️</Text>
              <Text style={[styles.optionText, runtimeFilter === 'short' && styles.optionTextSelected]}>
                Short (&lt; 100 min)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.optionBtn, 
                runtimeFilter === 'any' && styles.optionSelected
              ]}
              onPress={() => setRuntimeFilter('any')}
            >
              <Text style={styles.optionEmoji}>🍿</Text>
              <Text style={[styles.optionText, runtimeFilter === 'any' && styles.optionTextSelected]}>
                Any Duration
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Question 2: Energy / Mood */}
        <View style={styles.questionCard}>
          <Text style={styles.questionTitle}>2. Energy Level</Text>
          <View style={styles.optionsRow}>
            <TouchableOpacity 
              style={[
                styles.optionBtn, 
                energyFilter === 'chill' && styles.optionSelected
              ]}
              onPress={() => setEnergyFilter('chill')}
            >
              <Text style={styles.optionEmoji}>😴</Text>
              <Text style={[styles.optionText, energyFilter === 'chill' && styles.optionTextSelected]}>
                Zone-Out / Easy
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[
                styles.optionBtn, 
                energyFilter === 'focus' && styles.optionSelected
              ]}
              onPress={() => setEnergyFilter('focus')}
            >
              <Text style={styles.optionEmoji}>🧠</Text>
              <Text style={[styles.optionText, energyFilter === 'focus' && styles.optionTextSelected]}>
                High Focus / Plot
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Pool Summary & Start Swiping */}
      <View style={styles.footer}>
        <View style={styles.poolInfo}>
          <Text style={styles.poolLabel}>Candidate Pool:</Text>
          <Text style={styles.poolCount}>{poolSize} Movies</Text>
        </View>
        <TouchableOpacity style={styles.startBtn} onPress={() => router.push('/swipe')}>
          <Text style={styles.startBtnText}>Start Swiping Deck →</Text>
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
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: Colors.dark.text,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.dark.textSecondary,
    marginTop: 4,
  },
  questionsContainer: {
    gap: 24,
    marginVertical: 20,
  },
  questionCard: {
    backgroundColor: Colors.dark.cardBg,
    padding: 18,
    borderRadius: 16,
  },
  questionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.dark.text,
    marginBottom: 14,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  optionBtn: {
    flex: 1,
    backgroundColor: Colors.dark.backgroundElement,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  optionSelected: {
    borderColor: Colors.dark.primary,
    backgroundColor: 'rgba(140, 122, 230, 0.15)',
  },
  optionEmoji: {
    fontSize: 24,
    marginBottom: 6,
  },
  optionText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.dark.textSecondary,
    textAlign: 'center',
  },
  optionTextSelected: {
    color: Colors.dark.text,
    fontWeight: 'bold',
  },
  footer: {
    marginBottom: 30,
    gap: 16,
  },
  poolInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.dark.backgroundElement,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
  },
  poolLabel: {
    color: Colors.dark.textSecondary,
    fontSize: 14,
  },
  poolCount: {
    color: Colors.dark.primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
  startBtn: {
    backgroundColor: Colors.dark.primary,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  startBtnText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
