'use client';

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { type Order } from '@/services';
import { MapPin } from 'lucide-react';

/**
 * Shipping address card component props
 */
interface ShippingAddressCardProps {
  /** Order data */
  order: Order;
}

/**
 * Shipping address card component
 * Displays shipping address information
 */
export function ShippingAddressCard({ order }: ShippingAddressCardProps) {
  if (!order.shippingAddress) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shipping Address</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
          <div className="text-sm">
            <p className="font-medium">
              {order.shippingAddress.firstName} {order.shippingAddress.lastName}
            </p>
            <p>{order.shippingAddress.street}</p>
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
            </p>
            <p>{order.shippingAddress.country}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 