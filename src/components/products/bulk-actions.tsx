'use client';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    ToggleLeft,
    ToggleRight,
    Trash2,
} from 'lucide-react';

/**
 * Bulk actions component props
 */
interface BulkActionsProps {
  /** Number of selected products */
  selectedCount: number;
  /** Handle bulk status update */
  onBulkStatusUpdate: (isActive: boolean) => void;
  /** Handle bulk delete */
  onBulkDelete: () => void;
}

/**
 * Bulk actions component
 * Displays bulk action buttons for selected products
 */
export function BulkActions({
  selectedCount,
  onBulkStatusUpdate,
  onBulkDelete,
}: BulkActionsProps) {
  if (selectedCount === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bulk Actions ({selectedCount} selected)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="outline"
            onClick={() => onBulkStatusUpdate(true)}
          >
            <ToggleRight className="w-4 h-4 mr-2" />
            Activate Selected
          </Button>
          <Button
            variant="outline"
            onClick={() => onBulkStatusUpdate(false)}
          >
            <ToggleLeft className="w-4 h-4 mr-2" />
            Deactivate Selected
          </Button>
          <Button
            variant="destructive"
            onClick={onBulkDelete}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Selected
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 