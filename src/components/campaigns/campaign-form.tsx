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
import { CampaignService, ProductService, type Campaign, type Product } from '@/services';
import { campaignFormSchema, type CampaignFormData } from '@/utils/campaign-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ArrowLeft,
  Calendar,
  CheckSquare,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Package,
  Percent,
  Save,
  Search,
  Square,
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
 * Campaign form component props
 */
interface CampaignFormProps {
  /** Campaign to edit (undefined for new campaign) */
  campaign?: Campaign;
  /** Form mode */
  mode: 'add' | 'edit';
}

/**
 * Campaign form component
 * Reusable form for both adding and editing campaigns
 */
export function CampaignForm({ campaign, mode }: CampaignFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(mode === 'edit');
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [productPage, setProductPage] = useState(1);
  const [productTotalPages, setProductTotalPages] = useState(1);
  const [productTotal, setProductTotal] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CampaignFormData>({
    resolver: zodResolver(campaignFormSchema),
    defaultValues: {
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      discountType: 'percentage',
      discountValue: '',
      productIds: [],
      isActive: true,
      maxUsage: '',
      minOrderAmount: '',
    },
  });

  /**
   * Fetch products for selection
   */
  const fetchProducts = useCallback(async (page = 1, search = '') => {
    try {
      setLoadingProducts(true);
      const response = await ProductService.getProducts({ 
        page, 
        limit: 10, 
        isActive: true,
        search: search || undefined
      });
      setProducts(response.data);
      setProductTotalPages(response.totalPages);
      setProductTotal(response.total);
      setProductPage(page);
    } catch (error) {
      toast.error('Failed to load products');
      console.error('Error fetching products:', error);
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  /**
   * Initialize form data
   */
  useEffect(() => {
    if (campaign && mode === 'edit') {
      reset({
        name: campaign.name,
        description: campaign.description,
        startDate: campaign.startDate.split('T')[0],
        endDate: campaign.endDate.split('T')[0],
        discountType: campaign.discountType,
        discountValue: campaign.discountValue.toString(),
        productIds: campaign.productIds,
        isActive: campaign.isActive,
        maxUsage: campaign.maxUsage?.toString() || '',
        minOrderAmount: campaign.minOrderAmount?.toString() || '',
      });
      setImagePreviewUrl(campaign.imageUrl || '');
      setLoading(false);
    }
    void fetchProducts();
  }, [campaign, mode, reset, fetchProducts]);

  /**
   * Handle product search
   */
  const handleProductSearch = () => {
    setProductPage(1);
    void fetchProducts(1, productSearchQuery);
  };

  /**
   * Handle product page change
   */
  const handleProductPageChange = (newPage: number) => {
    void fetchProducts(newPage, productSearchQuery);
  };

  /**
   * Handle select all products
   */
  const handleSelectAll = () => {
    const allProductIds = products.map(p => p._id);
    const currentSelected = watch('productIds');
    const allSelected = allProductIds.every(id => currentSelected.includes(id));
    
    if (allSelected) {
      // Deselect all current page products
      const newSelected = currentSelected.filter(id => !allProductIds.includes(id));
      setValue('productIds', newSelected);
    } else {
      // Select all current page products (add to existing)
      const newSelected = [...new Set([...currentSelected, ...allProductIds])];
      setValue('productIds', newSelected);
    }
  };

  /**
   * Handle individual product selection
   */
  const handleProductToggle = (productId: string) => {
    const currentProductIds = watch('productIds');
    const isSelected = currentProductIds.includes(productId);
    
    if (isSelected) {
      const newSelected = currentProductIds.filter(id => id !== productId);
      setValue('productIds', newSelected);
    } else {
      const newSelected = [...currentProductIds, productId];
      setValue('productIds', newSelected);
    }
  };

  /**
   * Check if all products on current page are selected
   */
  const areAllProductsSelected = () => {
    const currentProductIds = watch('productIds');
    return products.length > 0 && products.every(p => currentProductIds.includes(p._id));
  };

  /**
   * Handle image selection
   */
  const handleImageSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error('Image size must be less than 5MB');
      return;
    }

    setImageFile(file);

    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setImagePreviewUrl(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);

    // Reset input
    e.target.value = '';
  }, []);

  /**
   * Remove image preview
   */
  const removeImagePreview = useCallback(() => {
    setImageFile(null);
    setImagePreviewUrl('');
  }, []);

  /**
   * Upload image for campaign
   */
  const uploadImage = async (campaignId: string): Promise<void> => {
    if (!imageFile) return;

    setUploadingImage(true);
    try {
      await CampaignService.uploadCampaignImage(campaignId, imageFile);
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload image');
      console.error('Error uploading image:', error);
    } finally {
      setUploadingImage(false);
    }
  };

  /**
   * Handle form submission
   */
  const onFormSubmit = async (data: CampaignFormData) => {
    try {
      setSaving(true);
      
      const campaignData = {
        name: data.name.trim(),
        description: data.description.trim(),
        startDate: new Date(data.startDate).toISOString(),
        endDate: new Date(data.endDate).toISOString(),
        discountType: data.discountType,
        discountValue: parseFloat(data.discountValue),
        productIds: data.productIds.length > 0 ? data.productIds : [],
        isActive: data.isActive,
        maxUsage: data.maxUsage ? parseInt(data.maxUsage) : undefined,
        minOrderAmount: data.minOrderAmount ? parseFloat(data.minOrderAmount) : undefined,
      };

      let savedCampaign: Campaign;

      if (mode === 'add') {
        savedCampaign = await CampaignService.createCampaign(campaignData);
        toast.success('Campaign created successfully');
      } else {
        savedCampaign = await CampaignService.updateCampaign(campaign!._id, campaignData);
        toast.success('Campaign updated successfully');
      }

      // Upload image if selected
      if (imageFile) {
        await uploadImage(savedCampaign._id);
      }

      router.push(`/campaigns/${savedCampaign._id}`);
    } catch (error) {
      toast.error(mode === 'add' ? 'Failed to create campaign' : 'Failed to update campaign');
      console.error('Error saving campaign:', error);
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
        title: 'Create New Campaign',
        description: 'Set up a new promotional campaign',
        backUrl: '/campaigns',
        backText: 'Back to Campaigns',
        submitText: 'Create Campaign',
        loadingText: 'Creating...',
      };
    } else {
      return {
        title: 'Edit Campaign',
        description: 'Update campaign details and settings',
        backUrl: `/campaigns/${campaign?._id}`,
        backText: 'Back to Campaign',
        submitText: 'Update Campaign',
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
                  <Calendar className="w-5 h-5 mr-2" />
                  Campaign Information
                </CardTitle>
                <CardDescription>
                  Basic campaign details and description
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Campaign Name *</Label>
                  <Input
                    id="name"
                    {...register('name')}
                    placeholder="Enter campaign name"
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
                    placeholder="Describe your campaign"
                    rows={4}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500">{errors.description.message}</p>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      {...register('startDate')}
                    />
                    {errors.startDate && (
                      <p className="text-sm text-red-500">{errors.startDate.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date *</Label>
                    <Input
                      id="endDate"
                      type="date"
                      {...register('endDate')}
                    />
                    {errors.endDate && (
                      <p className="text-sm text-red-500">{errors.endDate.message}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Product Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="w-5 h-5 mr-2" />
                  Select Products *
                </CardTitle>
                <CardDescription>
                  Choose products to include in this campaign
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Product Search */}
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search products..."
                      value={productSearchQuery}
                      onChange={(e) => setProductSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleProductSearch())}
                      className="pl-10"
                    />
                  </div>
                  <Button type="button" onClick={handleProductSearch} variant="outline" disabled={loadingProducts}>
                    Search
                  </Button>
                </div>

                {/* Select All Button */}
                {products.length > 0 && (
                  <div className="flex items-center justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleSelectAll}
                      className="flex items-center gap-2"
                    >
                      {areAllProductsSelected() ? (
                        <CheckSquare className="w-4 h-4" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                      {areAllProductsSelected() ? 'Deselect All' : 'Select All'}
                    </Button>
                    <div className="text-sm text-muted-foreground">
                      {watch('productIds').length} of {productTotal} selected
                    </div>
                  </div>
                )}

                {loadingProducts ? (
                  <div className="space-y-2">
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
                      <div className="space-y-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div key={i} className="h-12 bg-gray-200 rounded" />
                        ))}
                      </div>
                    </div>
                  </div>
                ) : products.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      {productSearchQuery ? 'No products found matching your search' : 'No active products found'}
                    </p>
                    {!productSearchQuery && (
                      <Button variant="outline" className="mt-2" asChild>
                        <Link href="/products/add">Create a Product</Link>
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="grid gap-2 max-h-64 overflow-y-auto">
                      {products.map((product) => (
                        <div
                          key={product._id}
                          className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                            watch('productIds').includes(product._id)
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          }`}
                          onClick={() => handleProductToggle(product._id)}
                        >
                          <input
                            type="checkbox"
                            checked={watch('productIds').includes(product._id)}
                            onChange={() => handleProductToggle(product._id)}
                            className="h-4 w-4"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{product.name}</div>
                            <div className="text-sm text-muted-foreground">
                              ${product.price}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pagination */}
                    {productTotalPages > 1 && (
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="text-sm text-muted-foreground">
                          Page {productPage} of {productTotalPages}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleProductPageChange(productPage - 1)}
                            disabled={productPage === 1}
                          >
                            <ChevronLeft className="w-4 h-4" />
                            Previous
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleProductPageChange(productPage + 1)}
                            disabled={productPage === productTotalPages}
                          >
                            Next
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {errors.productIds && (
                  <p className="text-sm text-red-500">{errors.productIds.message}</p>
                )}
              </CardContent>
            </Card>

            {/* Discount Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Percent className="w-5 h-5 mr-2" />
                  Discount Settings
                </CardTitle>
                <CardDescription>
                  Configure discount type and value
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="discountType">Discount Type *</Label>
                    <Select onValueChange={(value) => setValue('discountType', value as 'percentage' | 'amount')} value={watch('discountType')}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select discount type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage (%)</SelectItem>
                        <SelectItem value="amount">Fixed Amount ($)</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.discountType && (
                      <p className="text-sm text-red-500">{errors.discountType.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="discountValue">Discount Value *</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        {watch('discountType') === 'percentage' ? '%' : '$'}
                      </span>
                      <Input
                        id="discountValue"
                        {...register('discountValue')}
                        type="text"
                        placeholder="0"
                        className="pl-8"
                      />
                    </div>
                    {errors.discountValue && (
                      <p className="text-sm text-red-500">{errors.discountValue.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="maxUsage">Maximum Usage</Label>
                    <Input
                      id="maxUsage"
                      type="number"
                      {...register('maxUsage')}
                      placeholder="Unlimited"
                    />
                    {errors.maxUsage && (
                      <p className="text-sm text-red-500">{errors.maxUsage.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="minOrderAmount">Minimum Order Amount</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        $
                      </span>
                      <Input
                        id="minOrderAmount"
                        {...register('minOrderAmount')}
                        type="text"
                        placeholder="0.00"
                        className="pl-8"
                      />
                    </div>
                    {errors.minOrderAmount && (
                      <p className="text-sm text-red-500">{errors.minOrderAmount.message}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Campaign Image */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ImageIcon className="w-5 h-5 mr-2" />
                  Campaign Image
                </CardTitle>
                <CardDescription>
                  Upload an image for your campaign
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Image Preview */}
                {imagePreviewUrl && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Preview</Label>
                    <div className="relative">
                      <Image
                        src={imagePreviewUrl}
                        alt="Campaign preview"
                        width={200}
                        height={150}
                        className="rounded-md object-cover w-full h-32"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1 h-6 w-6 p-0"
                        onClick={removeImagePreview}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Upload Button */}
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                    id="campaign-image"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => document.getElementById('campaign-image')?.click()}
                    disabled={uploadingImage}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {uploadingImage ? 'Uploading...' : 'Choose Image'}
                  </Button>
                  <p className="text-xs text-muted-foreground mt-1">
                    Max 5MB. Supported formats: JPG, PNG, WebP
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Campaign Status */}
            <Card>
              <CardHeader>
                <CardTitle>Campaign Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label className="text-base">Active Campaign</Label>
                    <div className="text-sm text-muted-foreground">
                      Enable or disable this campaign
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      {...register('isActive')}
                      className="h-4 w-4"
                    />
                  </div>
                </div>
                {errors.isActive && (
                  <p className="text-sm text-red-500 mt-2">{errors.isActive.message}</p>
                )}
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
                  disabled={saving || uploadingImage}
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
                  onClick={() => router.push(mode === 'add' ? '/campaigns' : `/campaigns/${campaign?._id}`)}
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