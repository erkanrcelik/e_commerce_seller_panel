/**
 * Product category structure
 */
export interface Category {
  _id: string;
  name: string;
}

/**
 * Product variant structure
 */
export interface ProductVariant {
  name: string;
  price: number;
  stock: number;
  sku: string;
}

/**
 * Product specifications structure
 */
export interface ProductSpecifications {
  brand?: string;
  model?: string;
  storage?: string;
  color?: string;
  [key: string]: string | undefined;
}

/**
 * Product data structure
 */
export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock?: number;
  category: Category;
  imageUrls: string[];
  specifications?: ProductSpecifications;
  tags?: string[];
  isActive: boolean;
  isFeatured: boolean;
  variants?: ProductVariant[];
  sellerId: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Product list query parameters
 */
export interface ProductListParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  isActive?: boolean;
  isFeatured?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'name' | 'price' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Product creation form data
 */
export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  stock?: number;
  category: string;
  specifications?: ProductSpecifications;
  tags?: string[];
  isFeatured?: boolean;
  variants?: Omit<ProductVariant, 'sku'>[];
}

/**
 * Product update form data
 */
export interface UpdateProductData extends Partial<CreateProductData> {
  isActive?: boolean;
}

/**
 * Product stats overview
 */
export interface ProductStats {
  total: number;
  active: number;
  inactive: number;
  featured: number;
  avgPrice: number;
}

/**
 * Image upload response
 */
export interface ImageUploadResponse {
  imageUrl: string;
  imageKey: string;
  message: string;
}

/**
 * API list response structure
 */
export interface ProductListResponse {
  data: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
} 