'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CategoryService, ProductService, type Product } from '@/services';
import { productFormSchema, type ProductFormData } from '@/utils/product-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ArrowLeft,
  Image as ImageIcon,
  Package,
  Plus,
  Save,
  Upload,
  X
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

/**
 * Product form component props
 */
interface ProductFormProps {
  /** Product to edit (undefined for new product) */
  product?: Product;
  /** Form mode */
  mode: 'add' | 'edit';
  /** Called when product is saved successfully */
  onSuccess?: (product: Product) => void;
}

/**
 * Product form component
 * Reusable form for both adding and editing products
 */
export function ProductForm({ product, mode, onSuccess }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(mode === 'edit');
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Array<{ _id: string; name: string }>>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [newSpecKey, setNewSpecKey] = useState('');
  const [newSpecValue, setNewSpecValue] = useState('');
  const [newVariant, setNewVariant] = useState({
    name: '',
    sku: '',
    price: '',
    stock: '',
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: '',
      description: '',
      price: '',
      stock: '',
      category: '',
      specifications: {},
      tags: [],
      variants: [],
    },
  });

  /**
   * Fetch categories
   */
  const fetchCategories = useCallback(async () => {
    try {
      const categoriesData = await CategoryService.getActiveCategories();
      setCategories(categoriesData);
    } catch (error) {
      toast.error('Failed to load categories');
      console.error('Error fetching categories:', error);
    } finally {
      // setLoadingCategories(false); // This line was removed
    }
  }, []);

  /**
   * Initialize form data
   */
  useEffect(() => {
    if (product && mode === 'edit') {
      const filteredSpecs: Record<string, string> = {};
      if (product.specifications) {
        Object.entries(product.specifications).forEach(([key, value]) => {
          if (value !== undefined) {
            filteredSpecs[key] = value;
          }
        });
      }

      reset({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        stock: product.stock?.toString() || '',
        category: product.category?._id || '',
        specifications: filteredSpecs,
        tags: product.tags || [],
        variants: product.variants?.map(variant => ({
          name: variant.name,
          sku: variant.sku,
          price: variant.price.toString(),
          stock: variant.stock.toString(),
        })) || [],
      });
      setExistingImages(product.imageUrls || []);
      setLoading(false);
    }
    void fetchCategories();
  }, [product, mode, fetchCategories, reset]);

  /**
   * Handle adding tags
   */
  const handleAddTag = () => {
    if (newTag.trim() && !watch('tags').includes(newTag.trim())) {
      const currentTags = watch('tags');
      setValue('tags', [...currentTags, newTag.trim()]);
      setNewTag('');
    }
  };

  /**
   * Handle removing tags
   */
  const handleRemoveTag = (tagToRemove: string) => {
    const currentTags = watch('tags');
    setValue('tags', currentTags.filter(tag => tag !== tagToRemove));
  };

  /**
   * Handle adding specifications
   */
  const handleAddSpecification = () => {
    if (newSpecKey.trim() && newSpecValue.trim()) {
      const currentSpecs = watch('specifications');
      setValue('specifications', {
        ...currentSpecs,
        [newSpecKey.trim()]: newSpecValue.trim(),
      });
      setNewSpecKey('');
      setNewSpecValue('');
    }
  };

  /**
   * Handle removing specifications
   */
  const handleRemoveSpecification = (key: string) => {
    const currentSpecs = watch('specifications');
    const remainingSpecs = { ...currentSpecs };
    delete remainingSpecs[key];
    setValue('specifications', remainingSpecs);
  };

  /**
   * Handle adding variants
   */
  const handleAddVariant = () => {
    if (newVariant.name.trim() && newVariant.sku.trim() && newVariant.price.trim() && newVariant.stock.trim()) {
      const currentVariants = watch('variants');
      setValue('variants', [...currentVariants, { ...newVariant }]);
      setNewVariant({ name: '', sku: '', price: '', stock: '' });
    }
  };

  /**
   * Handle removing variants
   */
  const handleRemoveVariant = (index: number) => {
    const currentVariants = watch('variants');
    setValue('variants', currentVariants.filter((_, i) => i !== index));
  };

  /**
   * Handle image selection
   */
  const handleImageSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validate files
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not a valid image file`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Maximum size is 5MB`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setImageFiles(prev => [...prev, ...validFiles]);

    // Create preview URLs
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const target = event.target;
        if (target && target.result) {
          setImagePreviewUrls(prev => [...prev, target.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    e.target.value = '';
  }, []);

  /**
   * Remove image preview
   */
  const removeImagePreview = useCallback((index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
  }, []);

  /**
   * Remove existing image
   */
  const removeExistingImage = useCallback(async (imageUrl: string, index: number) => {
    if (!product) return;

    try {
      await ProductService.deleteProductImage(product._id, imageUrl);
      setExistingImages(prev => prev.filter((_, i) => i !== index));
      toast.success('Image removed successfully');
    } catch (error) {
      toast.error('Failed to remove image');
      console.error('Error removing image:', error);
    }
  }, [product]);

  /**
   * Upload images for product
   */
  const uploadImages = async (productId: string): Promise<void> => {
    if (imageFiles.length === 0) return;

    setUploadingImages(true);
    try {
      for (const file of imageFiles) {
        await ProductService.uploadProductImage(productId, file);
      }
      toast.success('Images uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload images');
      console.error('Error uploading images:', error);
    } finally {
      setUploadingImages(false);
    }
  };

  /**
   * Handle form submission
   */
  const onFormSubmit = async (data: ProductFormData) => {
    try {
      setSaving(true);
      
      const productData = {
        name: data.name.trim(),
        description: data.description.trim(),
        price: parseFloat(data.price),
        stock: data.stock ? parseInt(data.stock) : undefined,
        category: data.category === 'no-category' ? '' : data.category,
        specifications: data.specifications,
        tags: data.tags,
        variants: data.variants.map(variant => ({
          name: variant.name,
          sku: variant.sku,
          price: parseFloat(variant.price),
          stock: parseInt(variant.stock),
        })),
      };

      let savedProduct: Product;

      if (mode === 'add') {
        savedProduct = await ProductService.createProduct(productData);
        toast.success('Product created successfully');
      } else {
        savedProduct = await ProductService.updateProduct(product!._id, productData);
        toast.success('Product updated successfully');
      }

      // Upload images if any
      if (imageFiles.length > 0) {
        await uploadImages(savedProduct._id);
      }

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess(savedProduct);
      } else {
        router.push(`/products/${savedProduct._id}`);
      }
    } catch (error) {
      toast.error(mode === 'add' ? 'Failed to create product' : 'Failed to update product');
      console.error('Error saving product:', error);
    } finally {
      setSaving(false);
    }
  };

  /**
   * Get page title and description
   */
  const getPageInfo = () => {
    if (mode === 'add') {
      return {
        title: 'Add New Product',
        description: 'Create a new product for your store',
        backUrl: '/products',
        backText: 'Back to Products',
        submitText: 'Create Product',
        loadingText: 'Creating...',
      };
    } else {
      return {
        title: 'Edit Product',
        description: 'Update product information',
        backUrl: `/products/${product?._id}`,
        backText: 'Back to Product',
        submitText: 'Update Product',
        loadingText: 'Updating...',
      };
    }
  };

  const pageInfo = getPageInfo();

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href={pageInfo.backUrl}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              {pageInfo.backText}
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{pageInfo.title}</h1>
            <p className="text-muted-foreground">
              {pageInfo.description}
            </p>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={(e) => void handleSubmit(onFormSubmit)(e)} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="w-5 h-5 mr-2" />
                  Basic Information
                </CardTitle>
                <CardDescription>
                  Essential product details and pricing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    {...register('name')}
                    placeholder="Enter product name"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    {...register('description')}
                    placeholder="Describe your product"
                    rows={4}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500">{errors.description.message}</p>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price *</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        $
                      </span>
                      <Input
                        id="price"
                        {...register('price')}
                        type="text"
                        placeholder="0.00"
                        className="pl-8"
                      />
                    </div>
                    {errors.price && (
                      <p className="text-sm text-red-500">{errors.price.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock</Label>
                    <Input
                      id="stock"
                      {...register('stock')}
                      type="number"
                      placeholder="0"
                      min="0"
                    />
                    {errors.stock && (
                      <p className="text-sm text-red-500">{errors.stock.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select onValueChange={(value) => setValue('category', value)} value={watch('category')}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="no-category">No Category</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category._id} value={category._id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category && (
                      <p className="text-sm text-red-500">{errors.category.message}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
                <CardDescription>
                  Add tags to help customers find your product
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a tag"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  />
                  <Button type="button" onClick={handleAddTag} disabled={!newTag.trim()}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {watch('tags').map((tag, index) => (
                    <div key={index} className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-md">
                      <span className="text-sm">{tag}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveTag(tag)}
                        className="h-auto p-0 ml-1"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Specifications */}
            <Card>
              <CardHeader>
                <CardTitle>Specifications</CardTitle>
                <CardDescription>
                  Add product specifications and features
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2 md:grid-cols-2">
                  <Input
                    placeholder="Specification name"
                    value={newSpecKey}
                    onChange={(e) => setNewSpecKey(e.target.value)}
                  />
                  <Input
                    placeholder="Specification value"
                    value={newSpecValue}
                    onChange={(e) => setNewSpecValue(e.target.value)}
                  />
                </div>
                <Button
                  type="button"
                  onClick={handleAddSpecification}
                  disabled={!newSpecKey.trim() || !newSpecValue.trim()}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Specification
                </Button>
                <div className="space-y-2">
                  {Object.entries(watch('specifications')).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between bg-secondary p-2 rounded-md">
                      <div>
                        <span className="font-medium">{key}:</span>
                        <span className="ml-2 text-muted-foreground">{value}</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveSpecification(key)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Variants */}
            <Card>
              <CardHeader>
                <CardTitle>Product Variants</CardTitle>
                <CardDescription>
                  Add different versions of your product
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2 md:grid-cols-4">
                  <Input
                    placeholder="Variant name"
                    value={newVariant.name}
                    onChange={(e) => setNewVariant(prev => ({ ...prev, name: e.target.value }))}
                  />
                  <Input
                    placeholder="SKU"
                    value={newVariant.sku}
                    onChange={(e) => setNewVariant(prev => ({ ...prev, sku: e.target.value }))}
                  />
                  <Input
                    placeholder="Price"
                    value={newVariant.price}
                    onChange={(e) => setNewVariant(prev => ({ ...prev, price: e.target.value }))}
                  />
                  <Input
                    placeholder="Stock"
                    value={newVariant.stock}
                    onChange={(e) => setNewVariant(prev => ({ ...prev, stock: e.target.value }))}
                  />
                </div>
                <Button
                  type="button"
                  onClick={handleAddVariant}
                  disabled={!newVariant.name.trim() || !newVariant.sku.trim() || !newVariant.price.trim() || !newVariant.stock.trim()}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Variant
                </Button>
                <div className="space-y-2">
                  {watch('variants').map((variant, index) => (
                    <div key={index} className="flex items-center justify-between bg-secondary p-3 rounded-md">
                      <div className="grid grid-cols-4 gap-4 flex-1">
                        <span className="font-medium">{variant.name}</span>
                        <span className="text-muted-foreground">{variant.sku}</span>
                        <span>${variant.price}</span>
                        <span>{variant.stock} in stock</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveVariant(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Image Upload */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ImageIcon className="w-5 h-5 mr-2" />
                  Product Images
                </CardTitle>
                <CardDescription>
                  Upload images for your product
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Existing Images */}
                {existingImages.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Existing Images</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {existingImages.map((imageUrl, index) => (
                        <div key={index} className="relative">
                          <Image
                            src={imageUrl}
                            alt={`Product ${index + 1}`}
                            width={100}
                            height={100}
                            className="rounded-md object-cover w-full h-24"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-1 right-1 h-6 w-6 p-0"
                            onClick={() => void removeExistingImage(imageUrl, index)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* New Images */}
                {imagePreviewUrls.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">New Images</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {imagePreviewUrls.map((url, index) => (
                        <div key={index} className="relative">
                          <Image
                            src={url}
                            alt={`Preview ${index + 1}`}
                            width={100}
                            height={100}
                            className="rounded-md object-cover w-full h-24"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-1 right-1 h-6 w-6 p-0"
                            onClick={() => void removeImagePreview(index)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Upload Button */}
                <div>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                    id="product-images"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      const element = document.getElementById('product-images');
                      if (element) element.click();
                    }}
                    disabled={uploadingImages}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {uploadingImages ? 'Uploading...' : 'Choose Images'}
                  </Button>
                  <p className="text-xs text-muted-foreground mt-1">
                    Max 5MB per image. Supported formats: JPG, PNG, WebP
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Form Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={saving || uploadingImages}
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      {pageInfo.loadingText}
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {pageInfo.submitText}
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push(mode === 'add' ? '/products' : `/products/${product?._id}`)}
                >
                  Cancel
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
} 