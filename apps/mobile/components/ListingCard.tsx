import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatPrice, formatTimeAgo } from '../lib/utils';
import { COLORS } from '../lib/constants';

interface ListingCardProps {
  item: any;
  onPress: () => void;
  onFavoritePress: () => void;
}

export function ListingCard({ item, onPress, onFavoritePress }: ListingCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.88}>
      <View style={styles.imageWrapper}>
        <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
        
        {/* Favorite Button */}
        <TouchableOpacity style={styles.favoriteButton} onPress={onFavoritePress} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons 
            name={item.isFavorite ? 'heart' : 'heart-outline'} 
            size={20} 
            color={item.isFavorite ? COLORS.error : '#ffffff'} 
          />
        </TouchableOpacity>

        {/* AI Verified Badge */}
        {item.isAIVerified && (
          <View style={styles.verifiedBadge}>
            <Ionicons name="shield-checkmark" size={13} color="#ffffff" style={styles.shieldIcon} />
            <Text style={styles.verifiedText}>AI Verified</Text>
          </View>
        )}

        {/* Condition Tag */}
        {item.condition && (
          <View style={styles.conditionTag}>
            <Text style={styles.conditionText}>{item.condition}</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.priceRow}>
          <Text style={styles.price}>{formatPrice(item.price)}</Text>
          {item.isAIVerified && (
            <View style={styles.auditIndicator}>
              <Ionicons name="checkmark-circle" size={12} color={COLORS.verified} />
              <Text style={styles.auditText}>Physical Proof</Text>
            </View>
          )}
        </View>

        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
        
        <View style={styles.footer}>
          <View style={styles.locationWrapper}>
            <Ionicons name="location-sharp" size={12} color={COLORS.textLight} />
            <Text style={styles.location} numberOfLines={1}>{item.location}</Text>
          </View>
          <Text style={styles.time}>{formatTimeAgo(item.createdAt)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    marginHorizontal: 6,
    marginBottom: 16,
    flex: 1,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  imageWrapper: {
    position: 'relative',
    width: '100%',
    height: 154,
    backgroundColor: '#f1f5f9',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    borderRadius: 20,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: '#059669',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  shieldIcon: {
    marginRight: 4,
  },
  verifiedText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  conditionTag: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 4,
  },
  conditionText: {
    color: '#f8fafc',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  content: {
    padding: 12,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  price: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.text,
  },
  auditIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  auditText: {
    fontSize: 10,
    color: '#059669',
    fontWeight: '600',
    marginLeft: 3,
  },
  title: {
    fontSize: 13,
    fontWeight: '500',
    color: '#334155',
    marginBottom: 8,
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 8,
    marginTop: 2,
  },
  locationWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 6,
  },
  location: {
    fontSize: 11,
    color: COLORS.textLight,
    marginLeft: 2,
  },
  time: {
    fontSize: 10,
    color: COLORS.textLight,
  },
});
