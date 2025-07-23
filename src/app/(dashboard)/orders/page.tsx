'use client';

import { OrderFilters } from '@/components/orders/order-filters';
import { OrderStats as OrderStatsComponent } from '@/components/orders/order-stats';
import { OrderTable } from '@/components/orders/order-table';
import { Button } from '@/components/ui/button';
import { OrderService, type Order, type OrderListParams, type OrderStats, type OrderStatus } from '@/services';
import { RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

/**
 * Orders management page component
 * Handles order listing, filtering, and management operations
 */
export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<OrderStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: '',
  });

  /**
   * Fetch orders from API with filters
   */
  const fetchOrders = async (showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const params: OrderListParams = {
        page: currentPage,
        limit: 20,
        search: searchQuery || undefined,
        status: statusFilter !== 'all' ? statusFilter as OrderStatus : undefined,
        startDate: dateRange.startDate || undefined,
        endDate: dateRange.endDate || undefined,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      };

      const [ordersResponse, statsResponse] = await Promise.all([
        OrderService.getOrders(params),
        OrderService.getOrderStats(),
      ]);

      setOrders(ordersResponse.data);
      setTotalPages(ordersResponse.totalPages);
      setStats(statsResponse);

      if (showRefreshing) {
        toast.success('Orders refreshed successfully');
      }
    } catch (error) {
      toast.error('Failed to load orders');
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /**
   * Handle search form submission
   */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    void fetchOrders();
  };

  /**
   * Handle page change
   */
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  /**
   * Handle refresh
   */
  const handleRefresh = () => {
    void fetchOrders(true);
  };

  // Fetch orders on component mount and filter changes
  useEffect(() => {
    void fetchOrders();
  }, [currentPage]);

  // Handle filter changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentPage === 1) {
        void fetchOrders();
      } else {
        setCurrentPage(1);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [statusFilter, dateRange.startDate, dateRange.endDate]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">
            Manage customer orders and track fulfillment
          </p>
        </div>
        <Button
          onClick={handleRefresh}
          variant="outline"
          disabled={refreshing}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && <OrderStatsComponent stats={stats} />}

      {/* Filters and Search */}
      <OrderFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        onSearchSubmit={handleSearch}
      />

      {/* Orders Table */}
      <OrderTable
        orders={orders}
        loading={loading}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
} 