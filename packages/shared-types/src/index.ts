// ─────────────────────────────────────────────
//  Sell Marketplace — Shared Type Definitions
// ─────────────────────────────────────────────

// ═══════════════════════════════════════════
//  User & Auth
// ═══════════════════════════════════════════

export interface User {
  id: string;
  phone: string;
  email?: string;
  name: string;
  avatarUrl?: string;
  isVerified: boolean;
  isBanned: boolean;
  memberSince: string; // ISO date
  location?: GeoLocation;
  rating: number;
  totalListings: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginRequest {
  phone: string;
  otp: string;
}

export interface OtpRequest {
  phone: string;
}

// ═══════════════════════════════════════════
//  Location
// ═══════════════════════════════════════════

export interface GeoLocation {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
}

// ═══════════════════════════════════════════
//  Category
// ═══════════════════════════════════════════

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  parentId?: string;
  children?: Category[];
  listingCount: number;
  order: number;
}

// ═══════════════════════════════════════════
//  Listing
// ═══════════════════════════════════════════

export type ListingCondition = 'new' | 'like_new' | 'good' | 'fair' | 'poor';
export type ListingStatus = 'draft' | 'active' | 'sold' | 'expired' | 'removed' | 'under_review';

export interface ListingImage {
  id: string;
  url: string;
  thumbnailUrl: string;
  width: number;
  height: number;
  order: number;
}

export interface Listing {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  currency: string;
  isNegotiable: boolean;
  condition: ListingCondition;
  status: ListingStatus;
  images: ListingImage[];
  category: Category;
  categoryId: string;
  seller: User;
  sellerId: string;
  location: GeoLocation;
  attributes: Record<string, string | number | boolean>; // Dynamic category-specific attributes
  viewCount: number;
  favoriteCount: number;
  isFeatured: boolean;
  // ─── AI Verification & Anti-Spoof Fields ───
  isAIVerified: boolean;
  aiConfidence?: number;
  verificationAuditId?: string;
  aiDetectionData?: AIDetectionResult;
  verifiedAt?: string;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateListingRequest {
  title: string;
  description: string;
  price: number;
  currency?: string;
  isNegotiable?: boolean;
  condition: ListingCondition;
  categoryId: string;
  location: GeoLocation;
  attributes?: Record<string, string | number | boolean>;
  imageIds?: string[];
  isAIVerified?: boolean;
  aiConfidence?: number;
  verificationAuditId?: string;
  aiDetectionData?: AIDetectionResult;
}

export interface UpdateListingRequest extends Partial<CreateListingRequest> {
  status?: ListingStatus;
}

// ═══════════════════════════════════════════
//  Search & Filtering
// ═══════════════════════════════════════════

export type SortBy = 'relevance' | 'price_asc' | 'price_desc' | 'date_desc' | 'date_asc' | 'distance';

export interface SearchFilters {
  query?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: ListingCondition[];
  location?: GeoLocation;
  radiusKm?: number;
  sortBy?: SortBy;
  sellerId?: string;
  aiVerifiedOnly?: boolean;
}

export interface PaginatedRequest {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
}

export interface SearchResponse extends PaginatedResponse<Listing> {
  facets?: {
    categories: { id: string; name: string; count: number }[];
    conditions: { value: ListingCondition; count: number }[];
    priceRange: { min: number; max: number };
  };
}

// ═══════════════════════════════════════════
//  AI Camera Verification & Anti-Spoofing
// ═══════════════════════════════════════════

export type VerificationRejectionCode = 
  | 'SCREEN_SPOOF_DETECTED'
  | 'PRODUCT_MISMATCH'
  | 'INSUFFICIENT_LUMINANCE'
  | 'NO_OBJECT_DETECTED'
  | 'SUSPICIOUS_MOTION';

export interface InspectionCheck {
  check: string;
  status: 'Passed' | 'Failed' | 'Warning';
  details: string;
}

export interface AIDetectionResult {
  auditId: string;
  detectedObject: string;
  confidenceScore: number;
  timestamp: string;
  inspectionChecks: InspectionCheck[];
  aiExplanation?: string;
  rejectionCode?: VerificationRejectionCode;
  errorTitle?: string;
  errorMessage?: string;
  snapshotUrl?: string;
  antiSpoofScore?: number;
  livenessVerified?: boolean;
}

export interface CameraVerificationRequest {
  imageBase64: string;
  title: string;
  category: string;
  description: string;
  condition?: string;
  price?: string | number;
  testScenario?: 'screen_spoof' | 'mismatch_item' | 'legit_match' | 'live_webcam';
  simulatedObject?: string;
}

export interface CameraVerificationResponse {
  success: boolean;
  verified: boolean;
  confidenceScore?: number;
  auditId?: string;
  detectedObject?: string;
  timestamp?: string;
  inspectionChecks?: InspectionCheck[];
  aiExplanation?: string;
  rejectionCode?: VerificationRejectionCode;
  errorTitle?: string;
  errorMessage?: string;
  snapshotUrl?: string;
  error?: string;
}

// ═══════════════════════════════════════════
//  Chat / Messaging
// ═══════════════════════════════════════════

export type MessageType = 'text' | 'image' | 'offer' | 'system';
export type ConversationStatus = 'active' | 'archived' | 'blocked';

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  type: MessageType;
  content: string;
  metadata?: {
    imageUrl?: string;
    offerAmount?: number;
  };
  isRead: boolean;
  createdAt: string;
}

export interface Conversation {
  id: string;
  listingId: string;
  listing: Listing;
  buyerId: string;
  buyer: User;
  sellerId: string;
  seller: User;
  lastMessage?: Message;
  unreadCount: number;
  status: ConversationStatus;
  createdAt: string;
  updatedAt: string;
}

// ═══════════════════════════════════════════
//  Notifications
// ═══════════════════════════════════════════

export type NotificationType =
  | 'new_message'
  | 'offer_received'
  | 'listing_sold'
  | 'listing_expired'
  | 'listing_approved'
  | 'listing_rejected'
  | 'price_drop'
  | 'favorite_update';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, string>;
  isRead: boolean;
  createdAt: string;
}

// ═══════════════════════════════════════════
//  Favorites
// ═══════════════════════════════════════════

export interface Favorite {
  id: string;
  userId: string;
  listingId: string;
  listing: Listing;
  createdAt: string;
}

// ═══════════════════════════════════════════
//  Report / Moderation
// ═══════════════════════════════════════════

export type ReportReason =
  | 'spam'
  | 'offensive'
  | 'prohibited_item'
  | 'fraud'
  | 'duplicate'
  | 'wrong_category'
  | 'other';

export interface Report {
  id: string;
  reporterId: string;
  listingId?: string;
  userId?: string;
  reason: ReportReason;
  description?: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  createdAt: string;
}

// ═══════════════════════════════════════════
//  API Response Wrappers
// ═══════════════════════════════════════════

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
}
