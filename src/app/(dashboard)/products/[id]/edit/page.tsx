'use client';

import { ProductForm } from '@/components/products/product-form';
import { ProductService, type Product } from '@/services';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

/**
 * Edit product page component
 */
export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * Fetch product data
   */
  const fetchProductData = async () => {
    if (!productId) return;

    try {
      setLoading(true);
      const productData = await ProductService.getProductById(productId);
      setProduct(productData);
    } catch (error) {
      toast.error('Failed to load product data');
      console.error('Error fetching product data:', error);
      router.push('/products');
    } finally {
      setLoading(false);
    }
  };

  // Fetch product data on component mount
  useEffect(() => {
    void fetchProductData();
  }, [productId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4" />
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-64 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/2" />
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Product Not Found</h3>
          <p className="text-muted-foreground mb-4">
            The product you're trying to edit doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  return <ProductForm mode="edit" product={product} />;
} 