import { z } from 'zod';

/**
 * Product variant schema
 */
const productVariantSchema = z.object({
  name: z.string().min(1, 'Variant name is required'),
  sku: z.string().min(1, 'SKU is required'),
  price: z.string().min(1, 'Price is required').refine(
    (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
    'Price must be a positive number'
  ),
  stock: z.string().min(1, 'Stock is required').refine(
    (val) => !isNaN(parseInt(val)) && parseInt(val) >= 0,
    'Stock must be a non-negative number'
  ),
});

/**
 * Product form schema
 */
export const productFormSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.string().min(1, 'Price is required').refine(
    (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
    'Price must be a positive number'
  ),
  stock: z.string().optional().refine(
    (val) => !val || (!isNaN(parseInt(val)) && parseInt(val) >= 0),
    'Stock must be a non-negative number'
  ),
  category: z.string().min(1, 'Category is required'),
  specifications: z.record(z.string(), z.string()),
  tags: z.array(z.string()),
  variants: z.array(productVariantSchema),
});

/**
 * Product form data type
 */
export type ProductFormData = z.infer<typeof productFormSchema>; 