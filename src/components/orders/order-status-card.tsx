'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
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
import { type Order, type OrderStatus } from '@/services';
import { Edit, Truck } from 'lucide-react';
import { useState } from 'react';

/**
 * Order status card component props
 */
interface OrderStatusCardProps {
  /** Order data */
  order: Order;
  /** Loading state */
  updating: boolean;
  /** Update status handler */
  onUpdateStatus: (statusData: {
    status: OrderStatus;
    trackingNumber?: string;
    notes?: string;
  }) => Promise<void>;
}

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
 * Get status badge variant
 */
const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case 'pending':
      return 'destructive';
    case 'processing':
      return 'secondary';
    case 'shipped':
      return 'default';
    case 'delivered':
      return 'default';
    case 'cancelled':
      return 'outline';
    default:
      return 'secondary';
  }
};

/**
 * Order status card component
 * Displays and manages order status
 */
export function OrderStatusCard({
  order,
  updating,
  onUpdateStatus,
}: OrderStatusCardProps) {
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [statusForm, setStatusForm] = useState({
    status: order.status,
    trackingNumber: order.trackingNumber || '',
    notes: order.sellerNotes || '',
  });

  /**
   * Handle status update
   */
  const handleUpdateStatus = async () => {
    try {
      await onUpdateStatus({
        status: statusForm.status,
        trackingNumber: statusForm.trackingNumber || undefined,
        notes: statusForm.notes || undefined,
      });
      setShowStatusDialog(false);
    } catch {
      // Error handling is done in parent component
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Order Status</CardTitle>
          <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
            <Button variant="outline" size="sm" onClick={() => setShowStatusDialog(true)}>
              <Edit className="w-4 h-4 mr-2" />
              Update Status
            </Button>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update Order Status</DialogTitle>
                <DialogDescription>
                  Update the order status and tracking information
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={statusForm.status}
                    onValueChange={(value) => setStatusForm(prev => ({ ...prev, status: value as OrderStatus }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="tracking">Tracking Number</Label>
                  <Input
                    id="tracking"
                    placeholder="Enter tracking number"
                    value={statusForm.trackingNumber}
                    onChange={(e) => setStatusForm(prev => ({ ...prev, trackingNumber: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Add notes about this status update"
                    value={statusForm.notes}
                    onChange={(e) => setStatusForm(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowStatusDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => void handleUpdateStatus()}
                  disabled={updating || !statusForm.status}
                >
                  {updating ? 'Updating...' : 'Update Status'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Badge variant={getStatusBadgeVariant(order.status)} className="capitalize">
            {order.status}
          </Badge>
          <span className="text-sm text-muted-foreground">
            Last updated: {formatDate(order.updatedAt)}
          </span>
        </div>
        
        {order.trackingNumber && (
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm">
              Tracking: <span className="font-medium">{order.trackingNumber}</span>
            </span>
          </div>
        )}
        
        {order.sellerNotes && (
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm font-medium mb-1">Seller Notes:</p>
            <p className="text-sm text-muted-foreground">{order.sellerNotes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 