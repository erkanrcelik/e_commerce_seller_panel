import { z } from 'zod';

/**
 * Business hours schema
 */
const businessHoursSchema = z.object({
  monday: z.object({
    open: z.string().optional(),
    close: z.string().optional(),
    closed: z.boolean().optional(),
  }).optional(),
  tuesday: z.object({
    open: z.string().optional(),
    close: z.string().optional(),
    closed: z.boolean().optional(),
  }).optional(),
  wednesday: z.object({
    open: z.string().optional(),
    close: z.string().optional(),
    closed: z.boolean().optional(),
  }).optional(),
  thursday: z.object({
    open: z.string().optional(),
    close: z.string().optional(),
    closed: z.boolean().optional(),
  }).optional(),
  friday: z.object({
    open: z.string().optional(),
    close: z.string().optional(),
    closed: z.boolean().optional(),
  }).optional(),
  saturday: z.object({
    open: z.string().optional(),
    close: z.string().optional(),
    closed: z.boolean().optional(),
  }).optional(),
  sunday: z.object({
    open: z.string().optional(),
    close: z.string().optional(),
    closed: z.boolean().optional(),
  }).optional(),
});

/**
 * Address schema
 */
const addressSchema = z.object({
  street: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  country: z.string().min(1, 'Country is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
});

/**
 * Social media schema
 */
const socialMediaSchema = z.object({
  facebook: z.string().url('Invalid Facebook URL').optional().or(z.literal('')),
  instagram: z.string().url('Invalid Instagram URL').optional().or(z.literal('')),
  twitter: z.string().url('Invalid Twitter URL').optional().or(z.literal('')),
});

/**
 * Profile update schema
 */
export const profileUpdateSchema = z.object({
  storeName: z.string().min(1, 'Store name is required'),
  description: z.string().min(1, 'Description is required'),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  website: z.string().url('Invalid website URL').optional().or(z.literal('')),
  address: addressSchema,
  businessHours: businessHoursSchema,
  socialMedia: socialMediaSchema,
  isActive: z.boolean(),
});

/**
 * Profile update form data type
 */
export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>; 