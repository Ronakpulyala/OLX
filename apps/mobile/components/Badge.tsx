import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../lib/constants';

interface BadgeProps {
  label: string;
}

export function Badge({ label }: BadgeProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  text: {
    fontSize: 12,
    color: COLORS.textLight,
    fontWeight: '500',
  }
});
