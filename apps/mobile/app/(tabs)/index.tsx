import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SearchBar } from '../../components/SearchBar';
import { CategoryIcon } from '../../components/CategoryIcon';
import { ListingCard } from '../../components/ListingCard';
import { COLORS, CATEGORIES } from '../../lib/constants';
import { useListingsStore } from '../../store/listings';

export default function HomeScreen() {
  const router = useRouter();
  const { listings, toggleFavorite, verifiedOnly, setVerifiedOnly } = useListingsStore();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  }, []);

  const displayedListings = verifiedOnly ? listings.filter((l) => l.isAIVerified) : listings;

  const renderHeader = () => (
    <View style={styles.header}>
      {/* Location Bar */}
      <View style={styles.locationBar}>
        <Ionicons name="location-sharp" size={20} color={COLORS.primary} />
        <View style={styles.locationTextContainer}>
          <Text style={styles.locationLabel}>Location</Text>
          <Text style={styles.locationValue}>Indiranagar, Bangalore</Text>
        </View>
        <Ionicons name="chevron-down" size={18} color={COLORS.textLight} />
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <SearchBar 
          value="" 
          onChangeText={() => {}} 
          readOnly 
          onPress={() => router.push('/search')} 
        />
      </View>

      {/* Trust & Anti-Spoof Banner */}
      <View style={styles.trustBanner}>
        <View style={styles.trustIconWrapper}>
          <Ionicons name="shield-checkmark" size={20} color="#059669" />
        </View>
        <View style={styles.trustBannerContent}>
          <Text style={styles.trustBannerTitle}>Zero-Phone-Screen Verification Active</Text>
          <Text style={styles.trustBannerSubtitle}>
            Our AI inspects live 3D physical items and blocks fake photos displayed on phone screens.
          </Text>
        </View>
      </View>

      {/* Categories */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Categories</Text>
      </View>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
      >
        {CATEGORIES.map((cat) => (
          <CategoryIcon 
            key={cat.id}
            name={cat.name}
            icon={cat.icon as any}
            onPress={() => router.push({ pathname: '/search', params: { category: cat.id } })}
          />
        ))}
      </ScrollView>

      {/* Recommendations & Filters */}
      <View style={styles.filterSection}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Fresh Recommendations</Text>
          <Text style={styles.itemCountText}>{displayedListings.length} ads</Text>
        </View>

        <View style={styles.filterPillsRow}>
          <TouchableOpacity
            style={[styles.filterPill, !verifiedOnly && styles.filterPillActive]}
            onPress={() => setVerifiedOnly(false)}
          >
            <Text style={[styles.filterPillText, !verifiedOnly && styles.filterPillTextActive]}>
              All Ads
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterPill, verifiedOnly && styles.filterPillVerifiedActive]}
            onPress={() => setVerifiedOnly(true)}
          >
            <Ionicons
              name="shield-checkmark"
              size={14}
              color={verifiedOnly ? '#ffffff' : '#059669'}
              style={{ marginRight: 4 }}
            />
            <Text
              style={[
                styles.filterPillText,
                verifiedOnly ? styles.filterPillTextActive : styles.filterPillTextEmerald,
              ]}
            >
              AI Verified Only
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={displayedListings}
        keyExtractor={(item) => item.id}
        numColumns={2}
        ListHeaderComponent={renderHeader}
        renderItem={({ item }) => (
          <ListingCard 
            item={item} 
            onPress={() => router.push(`/listing/${item.id}`)}
            onFavoritePress={() => toggleFavorite(item.id)}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 16,
    paddingBottom: 4,
  },
  locationBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  locationTextContainer: {
    flex: 1,
    marginLeft: 8,
  },
  locationLabel: {
    fontSize: 11,
    color: COLORS.textLight,
  },
  locationValue: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  searchContainer: {
    marginBottom: 14,
  },
  trustBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    gap: 12,
  },
  trustIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#d1fae5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  trustBannerContent: {
    flex: 1,
  },
  trustBannerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#065f46',
  },
  trustBannerSubtitle: {
    fontSize: 11,
    color: '#047857',
    marginTop: 2,
    lineHeight: 15,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
  },
  itemCountText: {
    fontSize: 12,
    color: COLORS.textLight,
    fontWeight: '600',
  },
  categoriesContainer: {
    marginBottom: 20,
  },
  filterSection: {
    marginBottom: 12,
  },
  filterPillsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 4,
  },
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  filterPillActive: {
    backgroundColor: '#0f172a',
    borderColor: '#0f172a',
  },
  filterPillVerifiedActive: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  filterPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  filterPillTextActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  filterPillTextEmerald: {
    color: '#059669',
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: 10,
    paddingBottom: 30,
  },
});
