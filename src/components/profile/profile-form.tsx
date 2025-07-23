'use client';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { type SellerProfile, type UpdateProfileData } from '@/services';
import { profileUpdateSchema, type ProfileUpdateFormData } from '@/utils/profile-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Globe,
    Instagram,
    Save,
    Twitter,
} from 'lucide-react';
import { useForm } from 'react-hook-form';

/**
 * Profile form component props
 */
interface ProfileFormProps {
  /** Profile data */
  profile: SellerProfile;
  /** Loading state */
  saving: boolean;
  /** Handle form submission */
  onSubmit: (data: UpdateProfileData) => Promise<void>;
}

/**
 * Profile form component
 * Handles profile form with react-hook-form and zod validation
 */
export function ProfileForm({ profile, saving, onSubmit }: ProfileFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileUpdateFormData>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      storeName: profile.storeName || '',
      description: profile.description || '',
      phoneNumber: profile.phoneNumber || '',
      website: profile.website || '',
      address: {
        street: profile.address?.street || '',
        city: profile.address?.city || '',
        state: profile.address?.state || '',
        country: profile.address?.country || '',
        postalCode: profile.address?.postalCode || '',
      },
      businessHours: {
        monday: profile.businessHours?.monday || { open: '09:00', close: '17:00' },
        tuesday: profile.businessHours?.tuesday || { open: '09:00', close: '17:00' },
        wednesday: profile.businessHours?.wednesday || { open: '09:00', close: '17:00' },
        thursday: profile.businessHours?.thursday || { open: '09:00', close: '17:00' },
        friday: profile.businessHours?.friday || { open: '09:00', close: '17:00' },
        saturday: profile.businessHours?.saturday || { open: '10:00', close: '16:00' },
        sunday: profile.businessHours?.sunday || { closed: true },
      },
      socialMedia: {
        facebook: profile.socialMedia?.facebook || '',
        instagram: profile.socialMedia?.instagram || '',
        twitter: profile.socialMedia?.twitter || '',
      },
      isActive: profile.isActive,
    },
  });

  /**
   * Handle form submission
   */
  const onFormSubmit = async (data: ProfileUpdateFormData) => {
    try {
      await onSubmit(data as UpdateProfileData);
      reset(data);
    } catch {
      // Error handling is done in parent component
    }
  };

  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  return (
    <form onSubmit={(e) => void handleSubmit(onFormSubmit)(e)} className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Your store's basic details and contact information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="storeName">Store Name</Label>
              <Input
                id="storeName"
                {...register('storeName')}
                placeholder="Enter store name"
              />
              {errors.storeName && (
                <p className="text-sm text-red-500">{errors.storeName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Describe your store"
                rows={3}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                {...register('phoneNumber')}
                placeholder="Enter phone number"
              />
              {errors.phoneNumber && (
                <p className="text-sm text-red-500">{errors.phoneNumber.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                {...register('website')}
                placeholder="https://your-website.com"
              />
              {errors.website && (
                <p className="text-sm text-red-500">{errors.website.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Address Information */}
        <Card>
          <CardHeader>
            <CardTitle>Address Information</CardTitle>
            <CardDescription>
              Your business location and contact details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="street">Street Address</Label>
              <Input
                id="street"
                {...register('address.street')}
                placeholder="Enter street address"
              />
              {errors.address?.street && (
                <p className="text-sm text-red-500">{errors.address.street.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  {...register('address.city')}
                  placeholder="Enter city"
                />
                {errors.address?.city && (
                  <p className="text-sm text-red-500">{errors.address.city.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  {...register('address.state')}
                  placeholder="Enter state"
                />
                {errors.address?.state && (
                  <p className="text-sm text-red-500">{errors.address.state.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  {...register('address.country')}
                  placeholder="Enter country"
                />
                {errors.address?.country && (
                  <p className="text-sm text-red-500">{errors.address.country.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  id="postalCode"
                  {...register('address.postalCode')}
                  placeholder="Enter postal code"
                />
                {errors.address?.postalCode && (
                  <p className="text-sm text-red-500">{errors.address.postalCode.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Business Hours */}
        <Card>
          <CardHeader>
            <CardTitle>Business Hours</CardTitle>
            <CardDescription>
              Set your store's operating hours for each day
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {daysOfWeek.map((day) => (
              <div key={day} className="flex items-center gap-4">
                <div className="w-24 capitalize font-medium">
                  {day}
                </div>
                <div className="flex items-center gap-2 flex-1">
                  <div className="flex-1">
                    <Input
                      type="time"
                      {...register(`businessHours.${day}.open` as any)}
                      className="w-32"
                    />
                  </div>
                  <span className="text-muted-foreground">to</span>
                  <div className="flex-1">
                    <Input
                      type="time"
                      {...register(`businessHours.${day}.close` as any)}
                      className="w-32"
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Social Media */}
        <Card>
          <CardHeader>
            <CardTitle>Social Media</CardTitle>
            <CardDescription>
              Connect your social media accounts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram</Label>
              <div className="relative">
                <Instagram className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="instagram"
                  {...register('socialMedia.instagram')}
                  placeholder="@your_instagram"
                  className="pl-10"
                />
              </div>
              {errors.socialMedia?.instagram && (
                <p className="text-sm text-red-500">{errors.socialMedia.instagram.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="twitter">Twitter</Label>
              <div className="relative">
                <Twitter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="twitter"
                  {...register('socialMedia.twitter')}
                  placeholder="@your_twitter"
                  className="pl-10"
                />
              </div>
              {errors.socialMedia?.twitter && (
                <p className="text-sm text-red-500">{errors.socialMedia.twitter.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="facebook">Facebook</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="facebook"
                  {...register('socialMedia.facebook')}
                  placeholder="Your Facebook Page"
                  className="pl-10"
                />
              </div>
              {errors.socialMedia?.facebook && (
                <p className="text-sm text-red-500">{errors.socialMedia.facebook.message}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={saving}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
} 