import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SearchBar } from '../../components/SearchBar';
import { FilterSheet } from '../../components/FilterSheet';
import { ListingCard } from '../../components/ListingCard';
import { EmptyState } from '../../components/EmptyState';
import { COLORS } from '../../lib/constants';
import { useListingsStore } from '../../store/listings';

export default function SearchScreen() {
  const router = useRouter();
  const { listings, searchQuery, setSearchQuery, toggleFavorite } = useListingsStore();
  const [filterVisible, setFilterVisible] = useState(false);

  const filteredListings = listings.filter(l => 
    l.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchWrapper}>
          <SearchBar 
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search for anything..."
          />
        </View>
        <TouchableOpacity style={styles.filterButton} onPress={() => setFilterVisible(true)}>
          <Ionicons name="options-outline" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredListings}
        keyExtractor={item => item.id}
        numColumns={2}
        renderItem={({ item }) => (
          <ListingCard 
            item={item} 
            onPress={() => router.push(`/listing/${item.id}`)}
            onFavoritePress={() => toggleFavorite(item.id)}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState 
            icon="search-outline"
            title="No results found"
            subtitle="Try adjusting your search or filters to find what you're looking for."
          />
        }
      />

      <FilterSheet 
        visible={filterVisible} 
        onClose={() => setFilterVisible(false)} 
        onApply={() => setFilterVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  searchWrapper: {
    flex: 1,
  },
  filterButton: {
    padding: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    backgroundColor: COLORS.surface,
  },
  listContent: {
    padding: 8,
    paddingBottom: 20,
    flexGrow: 1,
  }
});
