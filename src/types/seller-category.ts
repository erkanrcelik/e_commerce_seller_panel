/**
 * Category structure (based on actual API response)
 */
export interface Category {
  _id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v?: number;
  // Optional fields that may not be in list response
  imageUrl?: string;
  parentCategory?: string | null;
  subcategories?: Subcategory[];
  productCount?: number;
}

/**
 * Subcategory structure
 */
export interface Subcategory {
  _id: string;
  name: string;
  imageUrl: string;
}

/**
 * Category list response structure
 */
export interface CategoryListResponse {
  data: Category[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Category list query parameters
 */
export interface CategoryListParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  parentCategory?: string;
  sortBy?: 'name' | 'createdAt' | 'productCount';
  sortOrder?: 'asc' | 'desc';
} 