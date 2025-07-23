/**
 * Campaign discount type
 */
export type DiscountType = 'percentage' | 'amount';

/**
 * Campaign status
 */
export type CampaignStatus = 'active' | 'inactive' | 'expired' | 'upcoming';

/**
 * Campaign structure
 */
export interface Campaign {
  _id: string;
  name: string;
  description: string;
  discountType: DiscountType;
  discountValue: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  productIds: string[];
  imageUrl?: string;
  maxUsage?: number;
  minOrderAmount?: number;
  sellerId?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Campaign list query parameters
 */
export interface CampaignListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: CampaignStatus;
  discountType?: DiscountType;
  sortBy?: 'name' | 'startDate' | 'endDate' | 'createdAt' | 'discountValue';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Campaign list response structure
 */
export interface CampaignListResponse {
  data: Campaign[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Create campaign data
 */
export interface CreateCampaignData {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  discountType: DiscountType;
  discountValue: number;
  productIds: string[];
  isActive?: boolean;
  maxUsage?: number;
  minOrderAmount?: number;
}

/**
 * Update campaign data
 */
export interface UpdateCampaignData extends Partial<CreateCampaignData> {
  isActive?: boolean;
}

/**
 * Campaign image upload response
 */
export interface CampaignImageUploadResponse {
  imageUrl: string;
  imageKey: string;
  message: string;
}

/**
 * Campaign statistics
 */
export interface CampaignStats {
  totalCampaigns: number;
  activeCampaigns: number;
  inactiveCampaigns: number;
  expiredCampaigns: number;
  upcomingCampaigns: number;
} 