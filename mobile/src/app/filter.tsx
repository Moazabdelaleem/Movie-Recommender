import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import GradientButton from '@/components/GradientButton';

interface FilterOption {
  id: string;
  icon: string;
  title: string;
  options: string[];
}

const FILTER_ROWS: FilterOption[] = [
  { id: 'short', icon: '⏱️', title: 'Short', options: ['Any runtime', '< 90 min', '< 110 min'] },
  { id: 'focus', icon: '🎯', title: 'Focus', options: ['Something thoughtful', 'Easy watching', 'Mind-bending'] },
  { id: 'energy', icon: '⚡', title: 'Energy', options: ['Medium', 'High energy', 'Low key / Relaxed'] },
  { id: 'mood', icon: '😊', title: 'Mood', options: ["Doesn't matter", 'Feel good', 'Dark & Intense'] },
];

export default function FilterScreen() {
  const router = useRouter();
  const [selectedOptions, setSelectedOptions] = useState<Record<string, number>>({
    short: 0,
    focus: 0,
    energy: 0,
    mood: 0,
  });

  const cycleOption = (rowId: string, max: number) => {
    setSelectedOptions(prev => ({
      ...prev,
      [rowId]: (prev[rowId] + 1) % max,
    }));
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header matching Brand Board */}
      <View style={styles.header}>
        <Text style={styles.title}>What's the vibe?</Text>
        <Text style={styles.subtitle}>Pick 1 or more</Text>
      </View>

      {/* Stacked Rows matching Brand Board */}
      <ScrollView contentContainerStyle={styles.rowsList} showsVerticalScrollIndicator={false}>
        {FILTER_ROWS.map(row => {
          const selectedIdx = selectedOptions[row.id] || 0;
          const currentVal = row.options[selectedIdx];

          return (
            <TouchableOpacity
              key={row.id}
              style={styles.rowCard}
              activeOpacity={0.8}
              onPress={() => cycleOption(row.id, row.options.length)}
            >
              <View style={styles.rowLeft}>
                <View style={styles.iconCircle}>
                  <Text style={styles.iconEmoji}>{row.icon}</Text>
                </View>
                <View>
                  <Text style={styles.rowTitle}>{row.title}</Text>
                  <Text style={styles.rowSubtext}>{currentVal}</Text>
                </View>
              </View>

              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Bottom Floating Circular Gradient Button matching Brand Board (Icon only, no text) */}
      <View style={styles.footerCircle}>
        <GradientButton 
          variant="circle" 
          size={64} 
          onPress={() => router.push('/swipe')}
        >
          <Text style={styles.arrowIcon}>→</Text>
        </GradientButton>
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
    paddingBottom: 20,
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
  rowsList: {
    paddingHorizontal: 24,
    gap: 16,
  },
  rowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surfaceDark,
    padding: 16,
    borderRadius: 20,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconEmoji: {
    fontSize: 18,
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textLight,
  },
  rowSubtext: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 2,
  },
  chevron: {
    fontSize: 24,
    color: Colors.textMuted,
    fontWeight: '300',
  },
  footerCircle: {
    alignItems: 'center',
    paddingBottom: 32,
    paddingTop: 16,
  },
  arrowIcon: {
    fontSize: 28,
    color: Colors.textLight,
    fontWeight: 'bold',
  },
});
