import api from '@/lib/axios';
import type {
    Category,
    CategoryListParams,
    CategoryListResponse
} from '@/types/seller-category';

/**
 * Category management API service
 * Handles all category-related API calls
 */
export class CategoryService {
  /**
   * Fetch list of categories
   * @param params - Query parameters for filtering and pagination
   * @returns Promise resolving to category list response
   */
  static async getCategories(params?: CategoryListParams): Promise<CategoryListResponse> {
    try {
      // Fix the isActive parameter
      const processedParams = params ? {
        ...params,
        isActive: params.isActive !== undefined ? params.isActive : undefined
      } : undefined;

      const response = await api.get<CategoryListResponse>('/categories', {
        params: processedParams,
      });
      return response.data;
    } catch (error) {
      console.error('Get categories API error:', error);
      throw error;
    }
  }

  /**
   * Fetch detailed information for a specific category
   * @param id - Category ID
   * @returns Promise resolving to category details
   */
  static async getCategoryById(id: string): Promise<Category> {
    try {
      const response = await api.get<Category>(`/api/categories/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get category by ID API error:', error);
      throw error;
    }
  }

  /**
   * Fetch all active categories for dropdown/select usage
   * @returns Promise resolving to simplified category list
   */
  static async getActiveCategories(): Promise<{ _id: string; name: string }[]> {
    try {
      const response = await this.getCategories({
        isActive: true,
        limit: 100, // Get all active categories
        page: 1,
      });
      return response.data.map(category => ({
        _id: category._id,
        name: category.name,
      }));
    } catch (error) {
      console.error('Get active categories API error:', error);
      // Return fallback categories if API fails
      console.warn('Falling back to default categories');
      return [
        { _id: 'electronics', name: 'Electronics' },
        { _id: 'gaming', name: 'Gaming' },
        { _id: 'clothing', name: 'Clothing' },
        { _id: 'books', name: 'Books' },
        { _id: 'home', name: 'Home & Garden' },
      ];
    }
  }
} 