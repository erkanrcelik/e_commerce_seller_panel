import api from '@/lib/axios';
import type {
  CreateProductData,
  ImageUploadResponse,
  Product,
  ProductListParams,
  ProductListResponse,
  ProductStats,
  UpdateProductData
} from '@/types/seller-product';

/**
 * Product management API service
 * Handles all product-related API calls for sellers
 */
export class ProductService {
  /**
   * Fetch paginated list of products
   * @param params - Query parameters for filtering and pagination
   * @returns Promise resolving to product list response
   */
  static async getProducts(params?: ProductListParams): Promise<ProductListResponse> {
    try {
      const response = await api.get<ProductListResponse>('/seller/products', {
        params,
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  /**
   * Fetch detailed information for a specific product
   * @param id - Product ID
   * @returns Promise resolving to product details
   */
  static async getProductById(id: string): Promise<Product> {
    try {
      const response = await api.get<Product>(`/seller/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create a new product
   * @param productData - Product creation data
   * @returns Promise resolving to created product
   */
  static async createProduct(productData: CreateProductData): Promise<Product> {
    try {
      const response = await api.post<Product>('/seller/products', productData);
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  /**
   * Update an existing product
   * @param id - Product ID
   * @param productData - Product update data
   * @returns Promise resolving to updated product
   */
  static async updateProduct(id: string, productData: UpdateProductData): Promise<Product> {
    try {
      const response = await api.put<Product>(`/seller/products/${id}`, productData);
      return response.data;
    } catch (error) {
      console.error(`Error updating product with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a product
   * @param id - Product ID
   * @returns Promise resolving to success message
   */
  static async deleteProduct(id: string): Promise<{ message: string }> {
    try {
      const response = await api.delete<{ message: string }>(`/seller/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting product with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Toggle product active status
   * @param id - Product ID
   * @returns Promise resolving to updated product with new status
   */
  static async toggleProductStatus(id: string): Promise<Product> {
    try {
      const response = await api.put<Product>(`/seller/products/${id}/toggle-status`);
      return response.data;
    } catch (error) { 
      console.error(`Error toggling status for product with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Upload image for a product
   * @param id - Product ID
   * @param imageFile - Image file to upload
   * @returns Promise resolving to upload response with image URL
   */
  static async uploadProductImage(id: string, imageFile: File): Promise<ImageUploadResponse> {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      const response = await api.post<ImageUploadResponse>(
        `/seller/products/${id}/upload-image`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(`Error uploading image for product with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a product image
   * @param id - Product ID
   * @param imageKey - Image key to delete
   * @returns Promise resolving to success message
   */
  static async deleteProductImage(id: string, imageKey: string): Promise<{ message: string }> {
    try {
      const response = await api.delete<{ message: string }>(
        `/seller/products/${id}/images/${imageKey}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error deleting image ${imageKey} for product with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get product statistics overview
   * @returns Promise resolving to product stats
   */
  static async getProductStats(): Promise<ProductStats> {
    try {
      const response = await api.get<ProductStats>('/seller/products/stats/overview');
      return response.data;
    } catch (error) {
      console.error('Error fetching product stats:', error);
      throw error;
    }
  }

  /**
   * Bulk update product status
   * @param productIds - Array of product IDs
   * @param isActive - New active status
   * @returns Promise resolving to success message
   */
  static async bulkUpdateStatus(productIds: string[], isActive: boolean): Promise<{ message: string }> {
    try {
      const response = await api.put<{ message: string }>('/seller/products/bulk-status', {
        productIds,
        isActive,
      });
      return response.data;
    } catch (error) {
      console.error('Error bulk updating product status:', error);
      throw error;
    }
  }

  /**
   * Bulk delete products
   * @param productIds - Array of product IDs to delete
   * @returns Promise resolving to success message
   */
  static async bulkDeleteProducts(productIds: string[]): Promise<{ message: string }> {
    try {
      const response = await api.delete<{ message: string }>('/seller/products/bulk-delete', {
        data: { productIds },
      });
      return response.data;
    } catch (error) {
      console.error('Error bulk deleting products:', error);
      throw error;
    }
  }

  /**
   * Export products data
   * @param params - Export parameters
   * @returns Promise resolving to export data
   */
  static async exportProducts(params?: {
    format?: 'csv' | 'excel';
    category?: string;
    isActive?: boolean;
  }): Promise<Blob> {
    try {
      const response = await api.get('/seller/products/export', {
        params,
        responseType: 'blob',
      });
      return response.data as Blob;
    } catch (error) {
      console.error('Error exporting products:', error);
      throw error;
    }
  }

  /**
   * Import products from file
   * @param file - Import file (CSV or Excel)
   * @returns Promise resolving to import result
   */
  static async importProducts(file: File): Promise<{
    message: string;
    imported: number;
    failed: number;
    errors?: string[];
  }> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post<{
        message: string;
        imported: number;
        failed: number;
        errors?: string[];
      }>('/seller/products/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error importing products:', error);
      throw error;
    }
  }
} 