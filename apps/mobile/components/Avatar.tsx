import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../lib/constants';

interface AvatarProps {
  url?: string;
  size?: number;
}

export function Avatar({ url, size = 48 }: AvatarProps) {
  const dimensions = { width: size, height: size, borderRadius: size / 2 };

  if (!url) {
    return (
      <View style={[styles.placeholder, dimensions]}>
        <Ionicons name="person" size={size * 0.6} color={COLORS.textLight} />
      </View>
    );
  }

  return (
    <Image source={{ uri: url }} style={[styles.image, dimensions]} />
  );
}

const styles = StyleSheet.create({
  image: {
    backgroundColor: COLORS.border,
  },
  placeholder: {
    backgroundColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
