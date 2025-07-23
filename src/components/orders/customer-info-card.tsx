'use client';

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { type Order } from '@/services';
import { Mail, Phone, User } from 'lucide-react';

/**
 * Customer info card component props
 */
interface CustomerInfoCardProps {
  /** Order data */
  order: Order;
}

/**
 * Customer info card component
 * Displays customer information
 */
export function CustomerInfoCard({ order }: CustomerInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Customer Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-muted-foreground" />
          <div>
            <p className="font-medium">
              {order.customer.firstName} {order.customer.lastName}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-muted-foreground" />
          <p className="text-sm">{order.customer.email}</p>
        </div>
        {order.customer.phone && (
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-muted-foreground" />
            <p className="text-sm">{order.customer.phone}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 