export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: number;
  type: 'text' | 'emoji' | 'gift';
  giftId?: number;
}

export interface ChatSession {
  id: string;
  participantId: string;
  lastMessage: string;
  lastTimestamp: number;
  unreadCount: number;
}

export interface IMOrder {
  id: string;
  epalId: string;
  serviceName: string;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  price: number;
  timestamp: number;
  unit?: string;
  unitPrice?: number;
  quantity?: number;
  endTime?: number;
  reviewed?: boolean;
}

export type Category = 'GAMES' | 'CHILLING' | 'FAVOURITE';

export interface Game {
  id: string;
  name: string;
  onlineCount: string;
  imageUrl: string;
  category: Category;
  hasRank?: boolean;
  hasMain?: boolean;
  hasServer?: boolean;
  hasPlatform?: boolean;
}

export interface EPalServiceVariant {
  name: string;
  price: number;
  unit: string;
}

export interface EPalService {
  id: string;
  name: string;
  icon: string;
  posterUrl: string;
  description: string;
  rating: number;
  orderCount: string;
  screenshots: string[];
  variants: EPalServiceVariant[];
  details?: {
    rank?: string;
    server?: string;
    main?: string;
    style?: string;
    platform?: string;
  };
}

export interface EPalReview {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
  timestamp: number;
  tags?: string[];
}

export interface Coupon {
  id: string;
  name: string;
  discount: number;
  type: 'FIXED' | 'PERCENTAGE';
  minSpend?: number;
}

export interface Playlink {
  id: string;
  gameName: string;
  posterUrl: string;
  rank?: string;
  server?: string;
  role?: string;
  nickname?: string;
  platform?: 'PC' | 'PS' | 'Mobile';
  style?: string;
}

export interface PostComment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  likes: number;
  timestamp: number;
  replies?: PostComment[];
}

export interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  images?: string[];
  gameId?: string;
  gameName?: string;
  likes: number;
  comments: number;
  commentsList?: PostComment[];
  timestamp: number;
  isLiked?: boolean;
}

export interface EPal {
  id: string;
  name: string;
  avatarUrl: string;
  rating: number;
  orderCount: string;
  price: number;
  game: string;
  tags: string[];
  gender?: 'Male' | 'Female' | 'Other';
  onlineStatus?: 'Online' | 'Offline' | 'Busy';
  region?: string;
  followersCount?: string;
  followingCount?: string;
  isLegend?: boolean;
  services?: EPalService[];
  reviews?: EPalReview[];
  reviewTags?: { name: string; count: number }[];
  playlinks?: Playlink[];
}

export interface RechargePackage {
  id: string;
  amount: number; // USD
  coins: number;
  bonus?: number;
}

export type RechargeStatus = 'PENDING' | 'PAID' | 'SUCCESS' | 'FAILED' | 'REFUNDED';

export interface RechargeOrder {
  id: string;
  userId: string;
  packageId: string;
  amount: number;
  coins: number;
  paymentMethod: 'GOOGLE_PAY' | 'APPLE_PAY';
  status: RechargeStatus;
  transactionId?: string;
  timestamp: number;
  riskFlag?: boolean;
  riskReason?: string;
}

export interface WalletTransaction {
  id: string;
  userId: string;
  type: 'RECHARGE' | 'ORDER_PAY' | 'REFUND' | 'ADMIN_ADJUST';
  amount: number; // Coins
  balanceAfter: number;
  referenceId: string; // Order ID or Recharge ID
  timestamp: number;
  description: string;
}

export interface Wallet {
  userId: string;
  balance: number;
  lastUpdated: number;
}
