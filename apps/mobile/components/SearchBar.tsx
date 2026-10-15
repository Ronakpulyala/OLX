import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../lib/constants';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onPress?: () => void;
  placeholder?: string;
  readOnly?: boolean;
}

export function SearchBar({ value, onChangeText, onPress, placeholder = 'Find Cars, Mobile Phones and more...', readOnly = false }: SearchBarProps) {
  const content = (
    <View style={styles.container}>
      <Ionicons name="search" size={20} color={COLORS.textLight} style={styles.icon} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textLight}
        editable={!readOnly}
        pointerEvents={readOnly ? 'none' : 'auto'}
      />
    </View>
  );

  if (readOnly && onPress) {
    return <TouchableOpacity onPress={onPress}>{content}</TouchableOpacity>;
  }

  return content;
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    padding: 0, // Android fix
  }
});
