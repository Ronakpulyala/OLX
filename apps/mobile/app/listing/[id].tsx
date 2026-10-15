import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Share } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ImageCarousel } from '../../components/ImageCarousel';
import { Avatar } from '../../components/Avatar';
import { PriceTag } from '../../components/PriceTag';
import { Badge } from '../../components/Badge';
import { COLORS } from '../../lib/constants';
import { useListingsStore } from '../../store/listings';
import { formatTimeAgo } from '../../lib/utils';

export default function ListingDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { listings, toggleFavorite } = useListingsStore();
  
  const listing = listings.find(l => l.id === id);

  if (!listing) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Listing not found</Text>
      </SafeAreaView>
    );
  }

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this ${listing.title} for ${listing.price} on Sell!`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ImageCarousel images={[listing.image]} />
        
        {/* Header Actions */}
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.circleBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <View style={styles.rightActions}>
            <TouchableOpacity style={styles.circleBtn} onPress={handleShare}>
              <Ionicons name="share-social" size={24} color={COLORS.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.circleBtn} onPress={() => toggleFavorite(listing.id)}>
              <Ionicons 
                name={listing.isFavorite ? 'heart' : 'heart-outline'} 
                size={24} 
                color={listing.isFavorite ? COLORS.error : COLORS.text} 
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.mainInfo}>
            <PriceTag price={listing.price} style={styles.price} />
            <Text style={styles.title}>{listing.title}</Text>
            
            {listing.isAIVerified && (
              <View style={styles.verifiedCard}>
                <View style={styles.verifiedHeader}>
                  <View style={styles.verifiedBadgePill}>
                    <Ionicons name="shield-checkmark" size={16} color="#ffffff" />
                    <Text style={styles.verifiedBadgeTitle}>AI Verified Physical Inspection</Text>
                  </View>
                  <Text style={styles.confidenceScore}>
                    {Math.round((listing.aiConfidence || 0.98) * 100)}% Match
                  </Text>
                </View>

                <View style={styles.certRow}>
                  <View style={styles.checkItem}>
                    <Ionicons name="checkmark-circle" size={14} color="#059669" />
                    <Text style={styles.checkText}>Anti-Screen Spoof Passed (Real 3D Item)</Text>
                  </View>
                  <View style={styles.checkItem}>
                    <Ionicons name="checkmark-circle" size={14} color="#059669" />
                    <Text style={styles.checkText}>Product Correspondence Verified</Text>
                  </View>
                </View>

                <View style={styles.certFooter}>
                  <Text style={styles.certId}>
                    Certificate: <Text style={styles.certBold}>{listing.verificationAuditId || 'CERT-AI-VAL902'}</Text>
                  </Text>
                  <Text style={styles.auditProtectedText}>Zero-Phone-Screen Protected</Text>
                </View>
              </View>
            )}

            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Ionicons name="location-outline" size={16} color={COLORS.textLight} />
                <Text style={styles.metaText}>{listing.location}</Text>
              </View>
              <Text style={styles.metaText}>{formatTimeAgo(listing.createdAt)}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Details</Text>
            <View style={styles.detailsGrid}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Condition</Text>
                <Badge label={listing.condition} />
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{listing.description}</Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sellerCard}>
              <Avatar url={listing.seller.avatar} size={60} />
              <View style={styles.sellerInfo}>
                <Text style={styles.sellerName}>{listing.seller.name}</Text>
                <Text style={styles.memberSince}>Member since {listing.seller.memberSince}</Text>
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={16} color={COLORS.secondary} />
                  <Text style={styles.ratingText}>{listing.seller.rating}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={24} color={COLORS.border} />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.chatBtn} onPress={() => router.push(`/chat/new?listingId=${listing.id}`)}>
          <Ionicons name="chatbubbles" size={24} color={COLORS.primary} />
          <Text style={styles.chatBtnText}>Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.offerBtn}>
          <Text style={styles.offerBtnText}>Make Offer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  headerActions: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  rightActions: {
    flexDirection: 'row',
    gap: 12,
  },
  circleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    padding: 16,
  },
  mainInfo: {
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  price: {
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    color: COLORS.text,
    marginBottom: 12,
  },
  verifiedCard: {
    backgroundColor: '#ecfdf5',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#a7f3d0',
    marginBottom: 14,
  },
  verifiedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  verifiedBadgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#059669',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  verifiedBadgeTitle: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  confidenceScore: {
    fontSize: 11,
    color: '#059669',
    fontWeight: '700',
  },
  certRow: {
    gap: 4,
    marginVertical: 4,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  checkText: {
    fontSize: 11,
    color: '#065f46',
  },
  certFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#d1fae5',
    paddingTop: 6,
    marginTop: 6,
  },
  certId: {
    fontSize: 10,
    color: '#047857',
  },
  certBold: {
    fontWeight: '700',
  },
  auditProtectedText: {
    fontSize: 9,
    color: '#059669',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    color: COLORS.textLight,
    fontSize: 12,
  },
  section: {
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  detailItem: {
    width: '50%',
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 22,
  },
  sellerCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sellerInfo: {
    flex: 1,
    marginLeft: 16,
  },
  sellerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  memberSince: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  ratingText: {
    fontSize: 12,
    color: COLORS.text,
    marginLeft: 4,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.surface,
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 32, // for safe area
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: 12,
  },
  chatBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 12,
    gap: 8,
  },
  chatBtnText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  offerBtn: {
    flex: 1,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 12,
  },
  offerBtnText: {
    color: COLORS.surface,
    fontSize: 16,
    fontWeight: 'bold',
  }
});
