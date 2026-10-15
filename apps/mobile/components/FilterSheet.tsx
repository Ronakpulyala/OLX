import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { COLORS, CATEGORIES } from '../lib/constants';

interface FilterSheetProps {
  visible: boolean;
  onClose: () => void;
  onApply: () => void;
}

export function FilterSheet({ visible, onClose, onApply }: FilterSheetProps) {
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={styles.backdrop} onPress={onClose} />
      <View style={styles.sheet}>
        <View style={styles.header}>
          <Text style={styles.title}>Filters</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.clearText}>Clear All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.content}>
          <Text style={styles.sectionTitle}>Condition</Text>
          <View style={styles.chipsContainer}>
            {['All', 'New', 'Used', 'Like New'].map((condition) => (
              <TouchableOpacity key={condition} style={styles.chip}>
                <Text style={styles.chipText}>{condition}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
        <View style={styles.footer}>
          <TouchableOpacity style={styles.applyButton} onPress={onApply}>
            <Text style={styles.applyText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    height: '60%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  clearText: {
    color: COLORS.primary,
    fontSize: 16,
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipText: {
    color: COLORS.text,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  applyButton: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyText: {
    color: COLORS.surface,
    fontWeight: 'bold',
    fontSize: 16,
  }
});
