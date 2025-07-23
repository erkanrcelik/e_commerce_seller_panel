'use client';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '../ui/dialog';
// Using overflow scroll instead of ScrollArea component
import { type Product } from '@/services';

import { ProductForm } from './product-form';

/**
 * Product modal component props
 */
interface ProductModalProps {
  /** Whether the modal is open */
  open: boolean;
  /** Called when modal should close */
  onClose: () => void;
  /** Product to edit (undefined for create mode) */
  product?: Product;
  /** Called when product is saved successfully */
  onSuccess: (product: Product) => void;
}

/**
 * Modal component for creating and editing products
 */
export function ProductModal({ open, onClose, product, onSuccess }: ProductModalProps) {
  const isEditing = !!product;

  const handleSuccess = (savedProduct: Product) => {
    onSuccess(savedProduct);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="text-xl">
            {isEditing ? 'Edit Product' : 'Add New Product'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update your product information and settings'
              : 'Create a new product for your store'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="max-h-[calc(90vh-120px)] overflow-y-auto">
          <div className="px-6 py-4">
            <ProductForm
              product={product}
              mode={isEditing ? 'edit' : 'add'}
              onSuccess={handleSuccess}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 