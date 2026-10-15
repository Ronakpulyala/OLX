import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';
import { formatPrice } from '../lib/utils';
import { COLORS } from '../lib/constants';

interface PriceTagProps {
  price: number;
  style?: TextStyle;
}

export function PriceTag({ price, style }: PriceTagProps) {
  return (
    <Text style={[styles.price, style]}>{formatPrice(price)}</Text>
  );
}

const styles = StyleSheet.create({
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  }
});
