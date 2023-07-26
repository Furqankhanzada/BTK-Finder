export interface Location {
  coordinates: number[];
}

export enum ContactItemType {
  map = 'map',
  phone = 'phone',
  email = 'email',
  website = 'website',
  whatsapp = 'whatsapp',
}

export interface ContactItem {
  id: string;
  icon?: string;
  title: string;
  type: ContactItemType;
  information: string | undefined;
  rightText: string;
  name?: string;
  location?: number[];
}

export enum BusinessType {
  restaurant = 'restaurant',
  gym = 'gym',
}

export enum ShopStatus {
  enabled = 'enabled',
  disabled = 'disabled',
}

export interface Shop {
  shopId: string;
  status: ShopStatus;
}

export interface Gallery {
  image: string;
  cover: boolean;
}

export interface Facility {
  name: string;
  icon: string;
}

export interface OpenHours {
  day: string;
  from: string;
  to: string;
}

export enum BusinessStatus {
  VERIFIED = 'VERIFIED',
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  BLOCKED = 'BLOCKED',
}

export interface ReviewUser {
  _id: string;
  name: string;
  avatar: string;
}

export interface Review {
  _id: string;
  title: string;
  description?: string;
  rating: number;
  disable?: boolean;
  owner: ReviewUser;
  createdAt: Date;
}

export interface ReviewStats {
  averageRatings: number;
  oneStarCount: number;
  twoStarCount: number;
  threeStarCount: number;
  fourStarCount: number;
  fiveStarCount: number;
}

export interface Favorite {
  ownerId: string;
}

export enum MembershipStatus {
  ACTIVE = 'active',
  ARCHIEVE = 'archieve',
}

export interface Package {
  id: string;
  name: string;
}

export interface Membership {
  billingDate: Date;
  businessId: string;
  email: string;
  package: Package;
  status: MembershipStatus;
}

export interface Member {
  _id: string;
  name: string;
  avatar: string;
  email: string;
  memberships: Membership;
}

export interface BusinessPresentable {
  _id: string;
  ownerId: string;
  name: string;
  description?: string;
  address: string;
  telephone?: string;
  email?: string;
  website?: string;
  location?: Location;
  contactItems?: ContactItem[];
  type: BusinessType;
  shop?: Shop;
  thumbnail?: string;
  gallery?: Gallery[];
  facilities?: Facility[];
  openHours?: OpenHours[];
  status: BusinessStatus;
  category: string;
  reviews: Review[];
  averageRatings?: number;
  reviewStats: ReviewStats;
  favorites?: Favorite[];
}
