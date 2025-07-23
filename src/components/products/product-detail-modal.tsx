'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProductService, type Product } from '@/services';
import {
  Calendar,
  DollarSign,
  Edit,
  Package,
  Star,
  Tag,
  ToggleLeft,
  ToggleRight,
  Trash2
} from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

/**
 * Product detail modal props
 */
interface ProductDetailModalProps {
  /** Whether the modal is open */
  open: boolean;
  /** Called when modal should close */
  onClose: () => void;
  /** Product ID to show details for */
  productId?: string;
  /** Called when product is edited */
  onEdit: (product: Product) => void;
  /** Called when product is deleted */
  onDelete: (productId: string) => void;
  /** Called when product status is toggled */
  onStatusToggle: (product: Product) => void;
  /** Called when product is duplicated */
  onDuplicate?: (product: Product) => void;
  /** Called when product featured status is toggled */
  onFeaturedToggle?: (product: Product) => void;
}

/**
 * Product detail modal component
 */
export function ProductDetailModal({
  open,
  onClose,
  productId,
  onEdit,
  onDelete,
  onStatusToggle,
  onDuplicate,
  onFeaturedToggle,
}: ProductDetailModalProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [toggleLoading, setToggleLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [duplicateLoading, setDuplicateLoading] = useState(false);
  const [featuredLoading, setFeaturedLoading] = useState(false);

  /**
   * Fetch product details
   */
  const fetchProductDetails = async () => {
    if (!productId) return;

    try {
      setLoading(true);
      const productData = await ProductService.getProductById(productId);
      setProduct(productData);
    } catch (error) {
      toast.error('Failed to load product details');
      console.error('Error fetching product details:', error);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle status toggle
   */
  const handleStatusToggle = async () => {
    if (!product) return;

    try {
      setToggleLoading(true);
      const updatedProduct = await ProductService.toggleProductStatus(product._id);
      setProduct(updatedProduct);
      onStatusToggle(updatedProduct);
      toast.success(`Product ${updatedProduct.isActive ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      toast.error('Failed to update product status');
      console.error('Error toggling product status:', error);
    } finally {
      setToggleLoading(false);
    }
  };

  /**
   * Handle duplicate product
   */
  const handleDuplicate = async () => {
    if (!product) return;

    try {
      setDuplicateLoading(true);
      // Since duplicate API doesn't exist, we'll create a copy manually
      const duplicateData = {
        name: `${product.name} (Copy)`,
        description: product.description,
        price: product.price,
        category: product.category?._id || '',
        specifications: product.specifications || {},
        tags: product.tags || [],
        isFeatured: false, // Start as not featured
        variants: product.variants || [],
      };

      const duplicatedProduct = await ProductService.createProduct(duplicateData);
      toast.success('Product duplicated successfully');
      if (onDuplicate) {
        onDuplicate(duplicatedProduct);
      }
      onClose();
    } catch (error) {
      toast.error('Failed to duplicate product');
      console.error('Error duplicating product:', error);
    } finally {
      setDuplicateLoading(false);
    }
  };

  /**
   * Handle featured toggle
   */
  const handleFeaturedToggle = async () => {
    if (!product) return;

    try {
      setFeaturedLoading(true);
      // Since featured API doesn't exist, we'll update the product with the new featured status
      const updateData = {
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category?._id || '',
        specifications: product.specifications || {},
        tags: product.tags || [],
        isFeatured: !product.isFeatured,
        variants: product.variants || [],
      };

      const updatedProduct = await ProductService.updateProduct(product._id, updateData);
      setProduct(updatedProduct);
      if (onFeaturedToggle) {
        onFeaturedToggle(updatedProduct);
      }
      toast.success(`Product ${updatedProduct.isFeatured ? 'featured' : 'unfeatured'} successfully`);
    } catch (error) {
      toast.error('Failed to update featured status');
      console.error('Error toggling featured status:', error);
    } finally {
      setFeaturedLoading(false);
    }
  };

  /**
   * Handle product deletion
   */
  const handleDelete = async () => {
    if (!product) return;

    const confirmed = confirm('Are you sure you want to delete this product? This action cannot be undone.');
    if (!confirmed) return;

    try {
      setDeleteLoading(true);
      await ProductService.deleteProduct(product._id);
      onDelete(product._id);
      toast.success('Product deleted successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to delete product');
      console.error('Error deleting product:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  /**
   * Handle edit button click
   */
  const handleEdit = () => {
    if (product) {
      onEdit(product);
      onClose();
    }
  };

  /**
   * Fetch product analytics
   */
  const fetchProductAnalytics = () => {
    // Analytics functionality can be implemented here
  };

  // Fetch product details when modal opens or productId changes
  useEffect(() => {
    if (open && productId) {
      void fetchProductDetails();
      void fetchProductAnalytics();
    }
  }, [open, productId]);

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      setProduct(null);
    }
  }, [open]);

  if (!product && !loading) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="text-xl">Product Details</DialogTitle>
          <DialogDescription>
            View and manage product information
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[calc(90vh-120px)] overflow-y-auto">
          <div className="px-6 py-4">
            {loading ? (
              // Loading state
              <div className="space-y-6">
                <div className="animate-pulse">
                  <div className="h-8 bg-gray-200 rounded w-1/3 mb-4" />
                  <div className="grid gap-6 lg:grid-cols-2">
                    <div className="space-y-4">
                      <div className="h-64 bg-gray-200 rounded" />
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-4 bg-gray-200 rounded w-1/2" />
                    </div>
                    <div className="space-y-4">
                      <div className="h-6 bg-gray-200 rounded w-1/2" />
                      <div className="h-4 bg-gray-200 rounded" />
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-4 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                </div>
              </div>
            ) : product ? (
              <div className="space-y-6">
                {/* Header with title and actions */}
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">{product.name}</h2>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={product.isActive ? "default" : "secondary"}>
                        {product.isActive ? "Active" : "Inactive"}
                      </Badge>
                      {product.isFeatured && (
                        <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
                          <Star className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                      <Badge variant="outline">
                        {product.category?.name || 'No Category'}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => void handleStatusToggle()}
                      disabled={toggleLoading}
                    >
                      {product.isActive ? (
                        <ToggleRight className="w-4 h-4 mr-2 text-green-600" />
                      ) : (
                        <ToggleLeft className="w-4 h-4 mr-2 text-gray-400" />
                      )}
                      {toggleLoading ? 'Updating...' : (product.isActive ? 'Deactivate' : 'Activate')}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => void handleEdit()}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => void handleDuplicate()}
                      disabled={duplicateLoading}
                    >
                      <Package className="w-4 h-4 mr-2" />
                      Duplicate
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => void handleFeaturedToggle()}
                      disabled={featuredLoading}
                    >
                      {product.isFeatured ? (
                        <ToggleLeft className="w-4 h-4 mr-2 text-gray-400" />
                      ) : (
                        <ToggleRight className="w-4 h-4 mr-2 text-yellow-600" />
                      )}
                      {featuredLoading ? 'Updating...' : (product.isFeatured ? 'Unfeature' : 'Feature')}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => void handleDelete()}
                      disabled={deleteLoading}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      {deleteLoading ? 'Deleting...' : 'Delete'}
                    </Button>
                  </div>
                </div>

                {/* Main content */}
                <div className="grid gap-6 lg:grid-cols-2">
                  {/* Images */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Product Images</h3>
                    {product.imageUrls && product.imageUrls.length > 0 ? (
                      <div className="grid grid-cols-2 gap-4">
                        {product.imageUrls.map((imageUrl, index) => (
                          <div key={index} className="relative aspect-square">
                            <Image
                              src={imageUrl}
                              alt={`${product.name} ${index + 1}`}
                              fill
                              className="rounded-lg object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                        <Package className="w-16 h-16 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Product Information */}
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <DollarSign className="w-5 h-5 mr-2" />
                          Pricing
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-purple-600">
                          ${product.price.toFixed(2)}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Description</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700">{product.description}</p>
                      </CardContent>
                    </Card>

                    {product.specifications && Object.keys(product.specifications).length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle>Specifications</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 gap-4">
                            {Object.entries(product.specifications).map(([key, value]) => (
                              <div key={key}>
                                <dt className="text-sm font-medium text-gray-500 capitalize">
                                  {key}
                                </dt>
                                <dd className="text-sm text-gray-900">{value}</dd>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {product.tags && product.tags.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <Tag className="w-5 h-5 mr-2" />
                            Tags
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {product.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {product.variants && product.variants.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle>Variants</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            {product.variants.map((variant, index) => (
                              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                <div>
                                  <div className="font-medium">{variant.name}</div>
                                  <div className="text-sm text-gray-500">SKU: {variant.sku}</div>
                                </div>
                                <div className="text-right">
                                  <div className="font-medium">${variant.price.toFixed(2)}</div>
                                  <div className="text-sm text-gray-500">Stock: {variant.stock}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Calendar className="w-5 h-5 mr-2" />
                          Dates
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Created</dt>
                            <dd className="text-sm text-gray-900">
                              {new Date(product.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                            <dd className="text-sm text-gray-900">
                              {new Date(product.updatedAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </dd>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 