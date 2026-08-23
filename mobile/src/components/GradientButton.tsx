import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/constants/theme';

interface GradientButtonProps {
  onPress: () => void;
  title?: string;
  children?: React.ReactNode;
  variant?: 'pill' | 'circle';
  size?: number;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function GradientButton({
  onPress,
  title,
  children,
  variant = 'pill',
  size = 56,
  style,
  textStyle,
}: GradientButtonProps) {
  if (variant === 'circle') {
    return (
      <TouchableOpacity 
        onPress={onPress} 
        activeOpacity={0.8} 
        style={[{ width: size, height: size, borderRadius: size / 2 }, style]}
      >
        <LinearGradient
          colors={[Colors.primaryPink, Colors.primaryPurple]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.circle, { width: size, height: size, borderRadius: size / 2 }]}
        >
          {children}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={[styles.container, style]}>
      <LinearGradient
        colors={[Colors.primaryPink, Colors.primaryPurple]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.pill}
      >
        {children || <Text style={[styles.text, textStyle]}>{title}</Text>}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 28,
    overflow: 'hidden',
  },
  pill: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primaryPink,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  text: {
    color: Colors.textLight,
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.3,
  },
});
