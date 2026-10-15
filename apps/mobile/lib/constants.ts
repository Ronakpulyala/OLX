export const COLORS = {
  primary: '#0d9488', // teal-600
  primaryLight: '#14b8a6', // teal-500
  primaryDark: '#0f766e', // teal-700
  secondary: '#f59e0b', // amber-500
  background: '#f8fafc', // slate-50
  surface: '#ffffff',
  text: '#0f172a', // slate-900
  textLight: '#64748b', // slate-500
  border: '#e2e8f0', // slate-200
  error: '#ef4444', // red-500
  success: '#10b981', // emerald-500
  verified: '#059669', // emerald-600
  verifiedBg: '#ecfdf5', // emerald-50
  verifiedBorder: '#a7f3d0', // emerald-200
};

export const CATEGORIES = [
  { id: '1', name: 'Cars', icon: 'directions-car' },
  { id: '2', name: 'Mobiles', icon: 'smartphone' },
  { id: '3', name: 'Electronics', icon: 'tv' },
  { id: '4', name: 'Furniture', icon: 'chair' },
  { id: '5', name: 'Fashion', icon: 'checkroom' },
  { id: '6', name: 'Books', icon: 'menu-book' },
  { id: '7', name: 'Sports', icon: 'sports-soccer' },
  { id: '8', name: 'Bikes', icon: 'two-wheeler' },
];

export const MOCK_LISTINGS = [
  {
    id: '1',
    title: 'iPhone 13 Pro Max - 256GB - Excellent Condition',
    price: 65000,
    location: 'Indiranagar, Bangalore',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=500&auto=format&fit=crop',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    isFavorite: false,
    categoryId: '2',
    condition: 'Used',
    isAIVerified: true,
    aiConfidence: 0.98,
    verificationAuditId: 'CERT-AI-IPH994',
    description: 'Selling my iPhone 13 Pro Max. Single owner, perfectly maintained with screen guard and case. Battery health at 88%. No scratches.',
    seller: {
      id: 's1',
      name: 'Rahul Kumar',
      avatar: 'https://i.pravatar.cc/150?u=s1',
      rating: 4.8,
      memberSince: '2021',
    }
  },
  {
    id: '2',
    title: 'Sony PS5 Console with 2 Controllers',
    price: 42000,
    location: 'Andheri West, Mumbai',
    image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=500&auto=format&fit=crop',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    isFavorite: true,
    categoryId: '3',
    condition: 'Like New',
    isAIVerified: true,
    aiConfidence: 0.95,
    verificationAuditId: 'CERT-AI-PS5810',
    description: 'Rarely used PS5 with 2 dualsense controllers. Original box and all cables included. Horizon Forbidden West game included.',
    seller: {
      id: 's2',
      name: 'Amit Shah',
      avatar: 'https://i.pravatar.cc/150?u=s2',
      rating: 4.5,
      memberSince: '2022',
    }
  },
  {
    id: '3',
    title: 'Honda City ZX 2019 Petrol Manual',
    price: 850000,
    location: 'Vasant Kunj, Delhi',
    image: 'https://images.unsplash.com/photo-1542362567-b07e54358753?q=80&w=500&auto=format&fit=crop',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    isFavorite: false,
    categoryId: '1',
    condition: 'Used',
    isAIVerified: false,
    description: 'First owner, non-accidental, fully insured till next year. Dealer maintained, service records available. 45000 KMs driven.',
    seller: {
      id: 's3',
      name: 'Priya Singh',
      avatar: 'https://i.pravatar.cc/150?u=s3',
      rating: 5.0,
      memberSince: '2019',
    }
  }
];

export const MOCK_CHATS = [
  {
    id: 'c1',
    otherUser: {
      id: 's2',
      name: 'Amit Shah',
      avatar: 'https://i.pravatar.cc/150?u=s2',
    },
    listing: {
      id: '2',
      title: 'Sony PS5 Console with 2 Controllers',
      image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?q=80&w=500&auto=format&fit=crop',
    },
    lastMessage: 'Is the price negotiable?',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    unreadCount: 2,
  },
  {
    id: 'c2',
    otherUser: {
      id: 's1',
      name: 'Rahul Kumar',
      avatar: 'https://i.pravatar.cc/150?u=s1',
    },
    listing: {
      id: '1',
      title: 'iPhone 13 Pro Max - 256GB - Excellent Condition',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=500&auto=format&fit=crop',
    },
    lastMessage: 'Yes, it comes with the box and original cable.',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    unreadCount: 0,
  }
];
