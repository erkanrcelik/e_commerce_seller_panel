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
      console.error('Error fetching seller profile:', error);
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
      console.error('Error updating seller profile:', error);
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
      console.error('Error uploading logo:', error);
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
      console.error('Error deleting logo:', error);
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
      console.error('Error toggling profile active status:', error);
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
      console.error(`Error fetching public profile for seller ${sellerId}:`, error);
      throw error;
    }
  }
} 