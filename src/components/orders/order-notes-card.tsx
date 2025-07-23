'use client';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { type Order } from '@/services';
import { Edit } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

/**
 * Order notes card component props
 */
interface OrderNotesCardProps {
  /** Order data */
  order: Order;
  /** Loading state */
  updating: boolean;
  /** Update notes handler */
  onUpdateNotes: (notes: string) => Promise<void>;
}

/**
 * Order notes card component
 * Displays and manages order notes
 */
export function OrderNotesCard({
  order,
  updating,
  onUpdateNotes,
}: OrderNotesCardProps) {
  const [showNotesDialog, setShowNotesDialog] = useState(false);
  const [notesForm, setNotesForm] = useState({
    notes: order.sellerNotes || '',
  });

  /**
   * Handle notes update
   */
  const handleUpdateNotes = async () => {
    try {
      await onUpdateNotes(notesForm.notes);
      toast.success('Notes updated successfully');
      setShowNotesDialog(false);
    } catch {
      toast.error('Failed to update notes');
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Order Notes</CardTitle>
          <Dialog open={showNotesDialog} onOpenChange={setShowNotesDialog}>
            <Button variant="outline" size="sm" onClick={() => setShowNotesDialog(true)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Notes
            </Button>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Update Order Notes</DialogTitle>
                <DialogDescription>
                  Add or update notes for this order
                </DialogDescription>
              </DialogHeader>
              <div>
                <Label htmlFor="order-notes">Notes</Label>
                <Textarea
                  id="order-notes"
                  placeholder="Add notes about this order"
                  value={notesForm.notes}
                  onChange={(e) => setNotesForm({ notes: e.target.value })}
                  rows={4}
                />
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowNotesDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => void handleUpdateNotes()}
                  disabled={updating}
                >
                  {updating ? 'Updating...' : 'Update Notes'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {order.sellerNotes ? (
          <p className="text-sm text-muted-foreground">{order.sellerNotes}</p>
        ) : (
          <p className="text-sm text-muted-foreground">No notes added yet.</p>
        )}
      </CardContent>
    </Card>
  );
} 