import { z } from 'zod';

/**
 * Campaign form schema
 */
export const campaignFormSchema = z.object({
  name: z.string().min(1, 'Campaign name is required'),
  description: z.string().min(1, 'Description is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  discountType: z.enum(['percentage', 'amount']),
  discountValue: z.string().min(1, 'Discount value is required').refine(
    (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
    'Discount value must be a positive number'
  ),
  productIds: z.array(z.string()),
  isActive: z.boolean(),
  maxUsage: z.string().optional().refine(
    (val) => !val || (!isNaN(parseInt(val)) && parseInt(val) > 0),
    'Max usage must be a positive number'
  ),
  minOrderAmount: z.string().optional().refine(
    (val) => !val || (!isNaN(parseFloat(val)) && parseFloat(val) >= 0),
    'Minimum order amount must be a non-negative number'
  ),
}).refine(
  (data) => {
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    return endDate > startDate;
  },
  {
    message: 'End date must be after start date',
    path: ['endDate'],
  }
);

/**
 * Campaign form data type
 */
export type CampaignFormData = z.infer<typeof campaignFormSchema>; 