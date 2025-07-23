import api from '@/lib/axios';
import type {
    LogoUploadResponse,
    SellerProfile,
    UpdateProfileData
} from '@/types/seller-profile';

/**
 * Profile management API service
 * Handles all profile-related API calls for sellers
 */
export class ProfileService {
  /**
   * Fetch seller profile information
   * @returns Promise resolving to seller profile
   */
  static async getProfile(): Promise<SellerProfile> {
    try {
      const response = await api.get<SellerProfile>('/seller/profile');
      return response.data;
    } catch (error) {
      console.error('Get profile API error:', error);
      throw error;
    }
  }

  /**
   * Update seller profile
   * @param profileData - Profile update data
   * @returns Promise resolving to updated profile
   */
  static async updateProfile(profileData: UpdateProfileData): Promise<SellerProfile> {
    try {
      const response = await api.put<SellerProfile>('/seller/profile', profileData);
      return response.data;
    } catch (error) {
      console.error('Update profile API error:', error);
      throw error;
    }
  }

  /**
   * Upload logo for seller profile
   * @param logoFile - Logo file to upload
   * @returns Promise resolving to upload response with logo URL
   */
  static async uploadLogo(logoFile: File): Promise<LogoUploadResponse> {
    try {
      const formData = new FormData();
      formData.append('logo', logoFile);

      const response = await api.post<LogoUploadResponse>(
        '/seller/profile/logo',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Upload logo API error:', error);
      throw error;
    }
  }

  /**
   * Delete logo from seller profile
   * @returns Promise resolving to success message
   */
  static async deleteLogo(): Promise<{ message: string }> {
    try {
      const response = await api.delete<{ message: string }>('/seller/profile/logo');
      return response.data;
    } catch (error) {
      console.error('Delete logo API error:', error);
      throw error;
    }
  }

  /**
   * Toggle profile active status
   * @returns Promise resolving to updated profile
   */
  static async toggleActiveStatus(): Promise<SellerProfile> {
    try {
      const response = await api.put<SellerProfile>('/seller/profile/toggle-active');
      return response.data;
    } catch (error) {
      console.error('Toggle profile active status API error:', error);
      throw error;
    }
  }

  /**
   * Get public profile (for customers)
   * @param sellerId - Seller ID
   * @returns Promise resolving to public profile
   */
  static async getPublicProfile(sellerId: string): Promise<SellerProfile> {
    try {
      const response = await api.get<SellerProfile>(`/seller/profile/public/${sellerId}`);
      return response.data;
    } catch (error) {
      console.error('Get public profile API error:', error);
      throw error;
    }
  }
} 