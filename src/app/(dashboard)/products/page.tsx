'use client';

import { BulkActions } from '@/components/products/bulk-actions';
import { ProductFilters } from '@/components/products/product-filters';
import { ProductModal } from '@/components/products/product-modal';
import { ProductStats as ProductStatsComponent } from '@/components/products/product-stats';
import { ProductTable } from '@/components/products/product-table';
import { Button } from '@/components/ui/button';
import { ProductService, type Product, type ProductStats } from '@/services';
import {
  Plus,
  RefreshCw,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

/**
 * Products page component
 */
export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<ProductStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter] = useState<string>('all');
  const [featuredFilter, setFeaturedFilter] = useState<string>('all');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy] = useState<'name' | 'createdAt' | 'price'>('createdAt');
  const [sortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);

  const router = useRouter();

  /**
   * Fetch products and stats
   */
  const fetchProducts = async (showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setRefreshing(true);
      } else {
      setLoading(true);
      }

      const params = {
        page: 1,
        limit: 100,
        search: searchQuery || undefined,
        category: categoryFilter !== 'all' ? categoryFilter : undefined,
        isActive: statusFilter !== 'all' ? statusFilter === 'active' : undefined,
        isFeatured: featuredFilter !== 'all' ? featuredFilter === 'featured' : undefined,
        minPrice: priceRange.min ? parseFloat(priceRange.min) : undefined,
        maxPrice: priceRange.max ? parseFloat(priceRange.max) : undefined,
        sortBy: sortBy,
        sortOrder,
      };

      const [productsResponse, statsResponse] = await Promise.all([
        ProductService.getProducts(params),
        ProductService.getProductStats(),
      ]);

      setProducts(productsResponse.data);
      setStats(statsResponse);

      if (showRefreshing) {
        toast.success('Products refreshed successfully');
      }
    } catch (error) {
      toast.error('Failed to load products');
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /**
   * Handle product deletion
   */
  const handleDeleteProduct = async (productId: string) => {
    const confirmed = confirm('Are you sure you want to delete this product? This action cannot be undone.');
    if (!confirmed) return;

      try {
        await ProductService.deleteProduct(productId);
      setProducts(prevProducts => prevProducts.filter(p => p._id !== productId));
      toast.success('Product deleted successfully');
    } catch (error) {
      toast.error('Failed to delete product');
      console.error('Failed to delete product:', error);
    }
  };

  /**
   * Handle bulk status update
   */
  const handleBulkStatusUpdate = async (isActive: boolean) => {
    if (selectedProducts.length === 0) {
      toast.error('Please select products first');
      return;
    }

    try {
      await ProductService.bulkUpdateStatus(selectedProducts, isActive);
      toast.success(`Products ${isActive ? 'activated' : 'deactivated'} successfully`);
      setSelectedProducts([]);
        void fetchProducts();
      } catch (error) {
      toast.error('Failed to update product status');
      console.error('Failed to bulk update status:', error);
    }
  };

  /**
   * Handle bulk delete
   */
  const handleBulkDelete = async () => {
    if (selectedProducts.length === 0) {
      toast.error('Please select products first');
      return;
    }

    const confirmed = confirm(`Are you sure you want to delete ${selectedProducts.length} products? This action cannot be undone.`);
    if (!confirmed) return;

    try {
      await ProductService.bulkDeleteProducts(selectedProducts);
      toast.success('Products deleted successfully');
      setSelectedProducts([]);
      void fetchProducts();
    } catch (error) {
      toast.error('Failed to delete products');
      console.error('Failed to bulk delete products:', error);
    }
  };

  /**
   * Handle search
   */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    void fetchProducts();
  };

  /**
   * Handle refresh
   */
  const handleRefresh = () => {
    void fetchProducts(true);
  };

  /**
   * Handle add product
   */
  const handleAddProduct = () => {
    router.push('/products/add');
  };

  /**
   * Handle product saved
   */
  const handleProductSaved = (savedProduct: Product) => {
    if (editingProduct) {
      setProducts(prevProducts =>
        prevProducts.map(p => p._id === savedProduct._id ? savedProduct : p)
      );
    } else {
      setProducts(prevProducts => [savedProduct, ...prevProducts]);
    }
    setModalOpen(false);
    setEditingProduct(undefined);
  };

  /**
   * Handle modal close
   */
  const handleModalClose = () => {
    setModalOpen(false);
    setEditingProduct(undefined);
  };

  /**
   * Handle product selection
   */
  const handleProductSelection = (productId: string, checked: boolean) => {
    if (checked) {
      setSelectedProducts(prev => [...prev, productId]);
    } else {
      setSelectedProducts(prev => prev.filter(id => id !== productId));
    }
  };

  /**
   * Handle select all
   */
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(products.map(p => p._id));
    } else {
      setSelectedProducts([]);
    }
  };

  /**
   * Handle product status update (not toggle)
   */
  const handleUpdateStatus = async (productId: string, isActive: boolean) => {
    try {
      // Since status update API doesn't exist, we'll use toggle status
      // First get current product status
      const product = products.find(p => p._id === productId);
      if (!product) {
        toast.error('Product not found');
        return;
      }

      // If current status is different from desired status, toggle it
      if (product.isActive !== isActive) {
        const updatedProduct = await ProductService.toggleProductStatus(productId);
        setProducts(prevProducts =>
          prevProducts.map(p => p._id === productId ? updatedProduct : p)
        );
        toast.success(`Product ${isActive ? 'activated' : 'deactivated'} successfully`);
      }
    } catch (error) {
      toast.error('Failed to update product status');
      console.error('Failed to update product status:', error);
    }
  };

  // Fetch products on component mount and filter changes
  useEffect(() => {
    void fetchProducts();
  }, []);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      void fetchProducts();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, categoryFilter, statusFilter, featuredFilter, sortBy, sortOrder]);

  // Debounced price range
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      void fetchProducts();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [priceRange.min, priceRange.max]);

  return (
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Products</h1>
            <p className="text-muted-foreground">
            Manage your product catalog and inventory
            </p>
          </div>
        <div className="flex gap-2">
          <Button
            onClick={() => void handleRefresh()}
            variant="outline"
            disabled={refreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
          <Button onClick={() => void handleAddProduct()}>
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>
        </div>

        {/* Stats Cards */}
      {stats && <ProductStatsComponent stats={stats} />}

      {/* Filters */}
      <ProductFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        featuredFilter={featuredFilter}
        onFeaturedFilterChange={setFeaturedFilter}
        sortBy={sortBy}
        sortOrder={sortOrder}
        priceRange={priceRange}
        onPriceRangeChange={setPriceRange}
        onSearchSubmit={handleSearch}
      />

      {/* Bulk Actions */}
      <BulkActions
        selectedCount={selectedProducts.length}
        onBulkStatusUpdate={(isActive) => void handleBulkStatusUpdate(isActive)}
        onBulkDelete={() => void handleBulkDelete()}
      />

      {/* Products Table */}
      <ProductTable
        products={products}
        loading={loading}
        selectedProducts={selectedProducts}
        onProductSelection={(id, checked) => void handleProductSelection(id, checked)}
        onSelectAll={(checked) => void handleSelectAll(checked)}
        onUpdateStatus={(id, isActive) => void handleUpdateStatus(id, isActive)}
        onDeleteProduct={(id) => void handleDeleteProduct(id)}
      />

      {/* Product Modal */}
      <ProductModal
        open={modalOpen}
        onClose={handleModalClose}
        product={editingProduct}
        onSuccess={handleProductSaved}
      />
      </div>
  );
} 