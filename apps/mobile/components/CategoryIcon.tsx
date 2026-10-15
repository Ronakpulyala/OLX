import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { COLORS } from '../lib/constants';

interface CategoryIconProps {
  name: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  onPress: () => void;
  selected?: boolean;
}

export function CategoryIcon({ name, icon, onPress, selected }: CategoryIconProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={[styles.iconContainer, selected && styles.iconContainerSelected]}>
        <MaterialIcons 
          name={icon} 
          size={32} 
          color={selected ? COLORS.surface : COLORS.primary} 
        />
      </View>
      <Text style={[styles.name, selected && styles.nameSelected]}>{name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginRight: 16,
    width: 70,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  iconContainerSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  name: {
    fontSize: 12,
    color: COLORS.text,
    textAlign: 'center',
  },
  nameSelected: {
    fontWeight: 'bold',
    color: COLORS.primary,
  }
});
