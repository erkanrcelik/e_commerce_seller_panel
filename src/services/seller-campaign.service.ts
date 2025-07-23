import api from '@/lib/axios';
import type {
    Campaign,
    CampaignImageUploadResponse,
    CampaignListParams,
    CampaignListResponse,
    CampaignStats,
    CreateCampaignData,
    UpdateCampaignData,
} from '@/types/seller-campaign';

/**
 * Campaign management API service
 * Handles all campaign-related API calls for sellers
 */
export class CampaignService {
  /**
   * Fetch paginated list of campaigns
   * @param params - Query parameters for filtering and pagination
   * @returns Promise resolving to campaign list response
   */
  static async getCampaigns(params?: CampaignListParams): Promise<CampaignListResponse> {
    try {
      const response = await api.get<CampaignListResponse>('/seller/campaigns', {
        params,
      });
      return response.data;
    } catch (error) {
      console.error('Get campaigns API error:', error);
      throw error;
    }
  }

  /**
   * Fetch detailed information for a specific campaign
   * @param id - Campaign ID
   * @returns Promise resolving to campaign details
   */
  static async getCampaignById(id: string): Promise<Campaign> {
    try {
      const response = await api.get<Campaign>(`/seller/campaigns/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get campaign by ID API error:', error);
      throw error;
    }
  }

  /**
   * Create a new campaign
   * @param campaignData - Campaign creation data
   * @returns Promise resolving to created campaign
   */
  static async createCampaign(campaignData: CreateCampaignData): Promise<Campaign> {
    try {
      const response = await api.post<Campaign>('/seller/campaigns', campaignData);
      return response.data;
    } catch (error) {
      console.error('Create campaign API error:', error);
      throw error;
    }
  }

  /**
   * Update an existing campaign
   * @param id - Campaign ID
   * @param campaignData - Campaign update data
   * @returns Promise resolving to updated campaign
   */
  static async updateCampaign(id: string, campaignData: UpdateCampaignData): Promise<Campaign> {
    try {
      const response = await api.put<Campaign>(`/seller/campaigns/${id}`, campaignData);
      return response.data;
    } catch (error) {
      console.error('Update campaign API error:', error);
      throw error;
    }
  }

  /**
   * Delete a campaign
   * @param id - Campaign ID
   * @returns Promise resolving to success message
   */
  static async deleteCampaign(id: string): Promise<{ message: string }> {
    try {
      const response = await api.delete<{ message: string }>(`/seller/campaigns/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete campaign API error:', error);
      throw error;
    }
  }

  /**
   * Toggle campaign active status
   * @param id - Campaign ID
   * @returns Promise resolving to updated campaign
   */
  static async toggleCampaignStatus(id: string): Promise<Campaign> {
    try {
      const response = await api.put<Campaign>(`/seller/campaigns/${id}/toggle-status`);
      return response.data;
    } catch (error) {
      console.error('Toggle campaign status API error:', error);
      throw error;
    }
  }

  /**
   * Upload image for a campaign
   * @param id - Campaign ID
   * @param imageFile - Image file to upload
   * @returns Promise resolving to upload response with image URL
   */
  static async uploadCampaignImage(id: string, imageFile: File): Promise<CampaignImageUploadResponse> {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      const response = await api.post<CampaignImageUploadResponse>(
        `/seller/campaigns/${id}/image`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Upload campaign image API error:', error);
      throw error;
    }
  }

  /**
   * Get campaign statistics overview
   * @returns Promise resolving to campaign stats
   */
  static async getCampaignStats(): Promise<CampaignStats> {
    try {
      const response = await api.get<CampaignStats>('/seller/campaigns/stats/overview');
      return response.data;
    } catch (error) {
      console.error('Get campaign stats API error:', error);
      throw error;
    }
  }
} 