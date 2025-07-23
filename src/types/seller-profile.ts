/**
 * Address structure
 */
export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

/**
 * Business hours for a single day
 */
export interface DayHours {
  open?: string; // HH:mm format
  close?: string; // HH:mm format
  closed?: boolean;
}

/**
 * Business hours structure
 */
export interface BusinessHours {
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
  sunday: DayHours;
}

/**
 * Social media links
 */
export interface SocialMedia {
  instagram?: string;
  twitter?: string;
  facebook?: string;
}

/**
 * Seller profile structure
 */
export interface SellerProfile {
  _id: string;
  sellerId: string;
  storeName: string;
  description: string;
  logoUrl?: string;
  phoneNumber: string;
  website?: string;
  address: Address;
  businessHours: BusinessHours;
  socialMedia: SocialMedia;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Update profile data
 */
export interface UpdateProfileData {
  storeName?: string;
  description?: string;
  phoneNumber?: string;
  website?: string;
  address?: Address;
  businessHours?: BusinessHours;
  socialMedia?: SocialMedia;
  isActive?: boolean;
}

/**
 * Logo upload response
 */
export interface LogoUploadResponse {
  logoUrl: string;
  logoKey: string;
  message: string;
} 