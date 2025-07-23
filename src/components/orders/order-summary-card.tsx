'use client';

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { type Order } from '@/services';

/**
 * Order summary card component props
 */
interface OrderSummaryCardProps {
  /** Order data */
  order: Order;
}

/**
 * Format currency values
 */
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format date values
 */
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Order summary card component
 * Displays order summary information
 */
export function OrderSummaryCard({ order }: OrderSummaryCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Order Total</span>
          <span className="font-medium">{formatCurrency(order.totalAmount)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Items</span>
          <span className="font-medium">{order.items.length}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Order Date</span>
          <span className="font-medium">{formatDate(order.createdAt)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Payment Method</span>
          <span className="font-medium">{order.paymentMethod || 'Not specified'}</span>
        </div>
      </CardContent>
    </Card>
  );
} 