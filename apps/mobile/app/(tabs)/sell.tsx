import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, CATEGORIES } from '../../lib/constants';
import { useListingsStore } from '../../store/listings';
import { CameraVerificationModal } from '../../components/CameraVerificationModal';

export default function SellScreen() {
  const [images, setImages] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [negotiable, setNegotiable] = useState(false);
  const [category, setCategory] = useState('2'); // Default to Mobiles
  const [condition, setCondition] = useState('Like New');

  // AI Verification State
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [isAIVerified, setIsAIVerified] = useState(false);
  const [aiConfidence, setAiConfidence] = useState<number | undefined>(undefined);
  const [verificationAuditId, setVerificationAuditId] = useState<string | undefined>(undefined);

  const addListing = useListingsStore((state) => state.addListing);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 8 - images.length,
      quality: 0.8,
    });

    if (!result.canceled && result.assets) {
      setImages([...images, ...result.assets.map((a) => a.uri)]);
    }
  };

  const handlePost = () => {
    if (!title.trim()) {
      Alert.alert('Missing Field', 'Please enter a title for your ad.');
      return;
    }
    if (!price.trim() || isNaN(Number(price))) {
      Alert.alert('Missing Field', 'Please enter a valid price.');
      return;
    }
    if (images.length === 0) {
      Alert.alert('Missing Photo', 'Please attach at least one photo of the item.');
      return;
    }

    const selectedCategory = CATEGORIES.find((c) => c.id === category)?.name || 'General';

    const newAd = {
      id: `ad-${Date.now()}`,
      title: title.trim(),
      price: Number(price),
      location: 'Bangalore, Karnataka',
      image: images[0],
      createdAt: new Date().toISOString(),
      isFavorite: false,
      categoryId: category,
      condition,
      description: description.trim() || `Verified ad for ${title.trim()}`,
      isAIVerified,
      aiConfidence,
      verificationAuditId,
      seller: {
        id: 'user-me',
        name: 'You (Verified Seller)',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150',
        rating: 5.0,
        memberSince: '2024',
      },
    };

    addListing(newAd);

    Alert.alert(
      isAIVerified ? 'Ad Verified & Posted! 🛡️' : 'Ad Posted Successfully! ✅',
      isAIVerified
        ? `Your ad "${title}" has been published with the official AI Physical Verification Certificate (${verificationAuditId}).`
        : `Your ad "${title}" is now active in the marketplace.`,
      [{ text: 'OK' }],
    );

    // Reset Form
    setImages([]);
    setTitle('');
    setDescription('');
    setPrice('');
    setNegotiable(false);
    setIsAIVerified(false);
    setAiConfidence(undefined);
    setVerificationAuditId(undefined);
  };

  const selectedCategoryName = CATEGORIES.find((c) => c.id === category)?.name || 'General';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Post Your Ad</Text>
          <Text style={styles.headerSubtitle}>Include clear photos & verify physical authenticity</Text>
        </View>

        {/* AI Camera Verification Card */}
        <View style={styles.verificationSection}>
          <Text style={styles.sectionLabel}>AI Physical Verification</Text>
          
          {!isAIVerified ? (
            <View style={styles.verifyCardUnverified}>
              <View style={styles.verifyCardHeader}>
                <View style={styles.shieldIconWrapper}>
                  <Ionicons name="shield-checkmark" size={24} color="#059669" />
                </View>
                <View style={styles.verifyHeaderText}>
                  <Text style={styles.verifyCardTitle}>Physical Item Proof</Text>
                  <Text style={styles.verifyCardSubtitle}>
                    Enforces Zero-Phone-Screen Rule & Product Correspondence.
                  </Text>
                </View>
              </View>

              <View style={styles.rulesPillRow}>
                <View style={styles.rulePillRed}>
                  <Ionicons name="close-circle" size={13} color="#dc2626" />
                  <Text style={styles.rulePillRedText}>No photos on phone screens</Text>
                </View>
                <View style={styles.rulePillGreen}>
                  <Ionicons name="checkmark-circle" size={13} color="#16a34a" />
                  <Text style={styles.rulePillGreenText}>Physical item match only</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.verifyActionBtn}
                onPress={() => {
                  if (!title.trim()) {
                    Alert.alert('Enter Title First', 'Please enter your ad title before verifying the physical item.');
                    return;
                  }
                  setShowVerifyModal(true);
                }}
              >
                <Ionicons name="scan-outline" size={18} color="#ffffff" />
                <Text style={styles.verifyActionBtnText}>Launch AI Camera Inspection</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.verifyCardVerified}>
              <View style={styles.verifiedHeaderRow}>
                <View style={styles.verifiedBadge}>
                  <Ionicons name="shield-checkmark" size={18} color="#ffffff" />
                  <Text style={styles.verifiedBadgeText}>AI Physically Verified</Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    setIsAIVerified(false);
                    setVerificationAuditId(undefined);
                  }}
                >
                  <Text style={styles.removeVerifyText}>Remove</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.verifiedAuditId}>
                Certificate ID: <Text style={styles.bold}>{verificationAuditId}</Text>
              </Text>
              <Text style={styles.verifiedDetails}>
                Physical presence & title correspondence passed ({Math.round((aiConfidence || 0.98) * 100)}% Confidence).
              </Text>
            </View>
          )}
        </View>

        {/* Photos Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Photos ({images.length}/8)</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photosScroll}>
            {images.map((uri, index) => (
              <View key={index} style={styles.imageContainer}>
                <Image source={{ uri }} style={styles.uploadedImage} />
                <TouchableOpacity
                  style={styles.removeImageBtn}
                  onPress={() => setImages(images.filter((_, i) => i !== index))}
                >
                  <Ionicons name="close" size={16} color="#ffffff" />
                </TouchableOpacity>
              </View>
            ))}

            {images.length < 8 && (
              <TouchableOpacity style={styles.addPhotoCard} onPress={pickImage}>
                <Ionicons name="camera-outline" size={28} color={COLORS.primary} />
                <Text style={styles.addPhotoText}>Add Photo</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>

        {/* Category Selector */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
            {CATEGORIES.map((cat) => {
              const isSelected = category === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.categoryPill, isSelected && styles.categoryPillSelected]}
                  onPress={() => setCategory(cat.id)}
                >
                  <Text style={[styles.categoryText, isSelected && styles.categoryTextSelected]}>
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Ad Details */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Listing Details</Text>
          <TextInput
            style={styles.input}
            placeholder="Ad Title (e.g., iPhone 14 Pro 128GB)*"
            placeholderTextColor="#94a3b8"
            value={title}
            onChangeText={setTitle}
            maxLength={70}
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe what you are selling, key features, and accessories included*"
            placeholderTextColor="#94a3b8"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            maxLength={2000}
          />
        </View>

        {/* Condition Selector */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Condition</Text>
          <View style={styles.conditionRow}>
            {['Brand New', 'Like New', 'Used', 'Fair'].map((c) => (
              <TouchableOpacity
                key={c}
                style={[styles.conditionBtn, condition === c && styles.conditionBtnSelected]}
                onPress={() => setCondition(c)}
              >
                <Text style={[styles.conditionBtnText, condition === c && styles.conditionBtnTextSelected]}>
                  {c}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Price Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Price</Text>
          <View style={styles.priceContainer}>
            <Text style={styles.currencyPrefix}>₹</Text>
            <TextInput
              style={styles.priceInput}
              placeholder="0"
              placeholderTextColor="#94a3b8"
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Price is negotiable</Text>
            <Switch
              value={negotiable}
              onValueChange={setNegotiable}
              trackColor={{ false: '#cbd5e1', true: '#99f6e4' }}
              thumbColor={negotiable ? COLORS.primary : '#f8fafc'}
            />
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitBtn} onPress={handlePost} activeOpacity={0.88}>
          <Text style={styles.submitBtnText}>Post Ad Now</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Camera Verification Modal */}
      <CameraVerificationModal
        visible={showVerifyModal}
        onClose={() => setShowVerifyModal(false)}
        adTitle={title}
        categoryName={selectedCategoryName}
        onVerificationComplete={(res) => {
          setIsAIVerified(true);
          setAiConfidence(res.aiConfidence);
          setVerificationAuditId(res.verificationAuditId);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 18,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0f172a',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 4,
  },
  verificationSection: {
    marginBottom: 22,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  verifyCardUnverified: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#a7f3d0',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  verifyCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  shieldIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ecfdf5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifyHeaderText: {
    flex: 1,
  },
  verifyCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  verifyCardSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  rulesPillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 12,
  },
  rulePillRed: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#fef2f2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  rulePillRedText: {
    fontSize: 11,
    color: '#b91c1c',
    fontWeight: '600',
  },
  rulePillGreen: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  rulePillGreenText: {
    fontSize: 11,
    color: '#15803d',
    fontWeight: '600',
  },
  verifyActionBtn: {
    backgroundColor: '#059669',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 4,
  },
  verifyActionBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  verifyCardVerified: {
    backgroundColor: '#ecfdf5',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#10b981',
  },
  verifiedHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#059669',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  verifiedBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  removeVerifyText: {
    color: '#ef4444',
    fontSize: 12,
    fontWeight: '600',
  },
  verifiedAuditId: {
    fontSize: 12,
    color: '#065f46',
    marginTop: 4,
  },
  bold: {
    fontWeight: '700',
  },
  verifiedDetails: {
    fontSize: 11,
    color: '#047857',
    marginTop: 2,
  },
  section: {
    marginBottom: 22,
  },
  photosScroll: {
    flexDirection: 'row',
  },
  imageContainer: {
    position: 'relative',
    marginRight: 12,
  },
  uploadedImage: {
    width: 90,
    height: 90,
    borderRadius: 10,
  },
  removeImageBtn: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#ef4444',
    borderRadius: 12,
    width: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPhotoCard: {
    width: 90,
    height: 90,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
    backgroundColor: '#f0fdfa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPhotoText: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: '700',
    marginTop: 4,
  },
  categoryScroll: {
    flexDirection: 'row',
  },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    marginRight: 8,
  },
  categoryPillSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryText: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '600',
  },
  categoryTextSelected: {
    color: '#ffffff',
    fontWeight: '700',
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    color: '#0f172a',
    marginBottom: 12,
  },
  textArea: {
    height: 96,
    textAlignVertical: 'top',
  },
  conditionRow: {
    flexDirection: 'row',
    gap: 8,
  },
  conditionBtn: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    alignItems: 'center',
  },
  conditionBtnSelected: {
    backgroundColor: '#0f172a',
    borderColor: '#0f172a',
  },
  conditionBtnText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
  },
  conditionBtnTextSelected: {
    color: '#ffffff',
    fontWeight: '700',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingHorizontal: 14,
  },
  currencyPrefix: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
    marginRight: 6,
  },
  priceInput: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
    paddingVertical: 12,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  switchLabel: {
    fontSize: 14,
    color: '#475569',
  },
  submitBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
});
