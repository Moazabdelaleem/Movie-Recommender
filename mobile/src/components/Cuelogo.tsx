import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Svg, Defs, LinearGradient, Stop, Path } from 'react-native-svg';
import { Colors } from '@/constants/theme';

interface CueLogoProps {
  size?: 'small' | 'medium' | 'large';
  showWordmark?: boolean;
  showTagline?: boolean;
}

export default function CueLogo({ size = 'medium', showWordmark = true, showTagline = false }: CueLogoProps) {
  const markSize = size === 'small' ? 28 : size === 'large' ? 56 : 40;
  const fontSize = size === 'small' ? 20 : size === 'large' ? 38 : 28;

  return (
    <View style={styles.container}>
      <View style={styles.lockup}>
        {/* Play Triangle Mark with Pink to Purple Diagonal Gradient */}
        <Svg width={markSize} height={markSize} viewBox="0 0 100 100" fill="none">
          <Defs>
            <LinearGradient id="cueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={Colors.primaryPink} />
              <Stop offset="100%" stopColor={Colors.primaryPurple} />
            </LinearGradient>
          </Defs>
          {/* Rounded Play Triangle */}
          <Path 
            d="M 28,18 C 22,14 15,18 15,26 L 15,74 C 15,82 22,86 28,82 L 78,54 C 84,50 84,42 78,38 Z" 
            fill="url(#cueGrad)" 
          />
        </Svg>

        {showWordmark && (
          <Text style={[styles.wordmark, { fontSize }]}>CUE</Text>
        )}
      </View>

      {showTagline && (
        <Text style={styles.tagline}>A movie decision, in under a minute.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  lockup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  wordmark: {
    fontWeight: '900',
    color: Colors.textLight,
    letterSpacing: 2,
  },
  tagline: {
    color: Colors.textMuted,
    fontSize: 13,
    marginTop: 6,
    fontWeight: '500',
  },
});
