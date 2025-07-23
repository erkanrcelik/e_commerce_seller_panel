'use client';

import { CustomerInfoCard } from '@/components/orders/customer-info-card';
import { OrderItemsCard } from '@/components/orders/order-items-card';
import { OrderNotesCard } from '@/components/orders/order-notes-card';
import { OrderStatusCard } from '@/components/orders/order-status-card';
import { OrderSummaryCard } from '@/components/orders/order-summary-card';
import { ShippingAddressCard } from '@/components/orders/shipping-address-card';
import { Button } from '@/components/ui/button';
import { OrderService, type Order, type OrderStatus } from '@/services';
import {
    ArrowLeft,
    Package,
    RefreshCw,
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

/**
 * Order detail page component
 * Displays detailed information about a specific order
 */
export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  /**
   * Fetch order details
   */
  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const orderData = await OrderService.getOrderById(orderId);
      setOrder(orderData);
    } catch (error) {
      toast.error('Failed to load order details');
      console.error('Error fetching order:', error);
      router.push('/orders');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update order status
   */
  const handleUpdateStatus = async (statusData: {
    status: OrderStatus;
    trackingNumber?: string;
    notes?: string;
  }) => {
    try {
      setUpdating(true);
      const updatedOrder = await OrderService.updateOrderStatus(orderId, statusData);
      setOrder(updatedOrder);
      toast.success('Order status updated successfully');
    } catch (error) {
      toast.error('Failed to update order status');
      console.error('Error updating order status:', error);
      throw error;
    } finally {
      setUpdating(false);
    }
  };

  /**
   * Update order notes
   */
  const handleUpdateNotes = async (notes: string) => {
    try {
      setUpdating(true);
      const updatedOrder = await OrderService.updateOrderNotes(orderId, { notes });
      setOrder(updatedOrder);
      toast.success('Order notes updated successfully');
    } catch (error) {
      toast.error('Failed to update order notes');
      console.error('Error updating order notes:', error);
      throw error;
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    void fetchOrderDetails();
  }, [orderId]);

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

  if (!order) {
    return (
      <div className="text-center py-12">
        <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Order not found</h3>
        <p className="text-muted-foreground mb-4">
          The order you're looking for doesn't exist.
        </p>
        <Button asChild>
          <Link href="/orders">Back to Orders</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/orders">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Orders
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Order #{order.orderNumber}
            </h1>
            <p className="text-muted-foreground">
              Order details and management
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => void fetchOrderDetails()}
            variant="outline"
            size="sm"
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Status */}
          <OrderStatusCard
            order={order}
            updating={updating}
            onUpdateStatus={handleUpdateStatus}
          />

          {/* Order Items */}
          <OrderItemsCard order={order} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <OrderSummaryCard order={order} />

          {/* Customer Information */}
          <CustomerInfoCard order={order} />

          {/* Shipping Address */}
          <ShippingAddressCard order={order} />

          {/* Order Notes */}
          <OrderNotesCard
            order={order}
            updating={updating}
            onUpdateNotes={handleUpdateNotes}
          />
        </div>
      </div>
    </div>
  );
} 