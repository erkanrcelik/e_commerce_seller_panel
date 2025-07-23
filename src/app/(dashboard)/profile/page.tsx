'use client';

import { ProfileForm } from '@/components/profile/profile-form';
import { ProfileInfoCard } from '@/components/profile/profile-info-card';
import { ProfileLogoCard } from '@/components/profile/profile-logo-card';
import { ProfileStatusCard } from '@/components/profile/profile-status-card';
import { ProfileService, type SellerProfile, type UpdateProfileData } from '@/services';
import { Calendar, Clock, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

/**
 * Profile management page component
 * Handles seller profile viewing and editing
 */
export default function ProfilePage() {
  const [profile, setProfile] = useState<SellerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  /**
   * Fetch profile data
   */
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const profileData = await ProfileService.getProfile();
      setProfile(profileData);
    } catch (error) {
      toast.error('Failed to load profile');
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (data: UpdateProfileData) => {
    try {
      setSaving(true);
      const updatedProfile = await ProfileService.updateProfile(data);
      setProfile(updatedProfile);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
      console.error('Failed to update profile:', error);
    } finally {
      setSaving(false);
    }
  };

  /**
   * Handle logo upload
   */
  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploadingLogo(true);
      const uploadResponse = await ProfileService.uploadLogo(file);
      
      // Update profile with new logo
      if (profile) {
        setProfile({
          ...profile,
          logoUrl: uploadResponse.logoUrl,
        });
      }

      toast.success('Logo uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload logo');
      console.error('Failed to upload logo:', error);
    } finally {
      setUploadingLogo(false);
    }
  };

  /**
   * Handle logo deletion
   */
  const handleLogoDelete = async () => {
    const confirmed = confirm('Are you sure you want to delete your logo?');
    if (!confirmed) return;

    try {
      await ProfileService.deleteLogo();
      
      // Update profile to remove logo
      if (profile) {
        setProfile({
          ...profile,
          logoUrl: undefined,
        });
      }

      toast.success('Logo deleted successfully');
    } catch (error) {
      toast.error('Failed to delete logo');
      console.error('Failed to delete logo:', error);
    }
  };

  /**
   * Handle status toggle
   */
  const handleStatusToggle = async () => {
    try {
      const updatedProfile = await ProfileService.toggleActiveStatus();
      setProfile(updatedProfile);
      toast.success(`Store ${updatedProfile.isActive ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      toast.error('Failed to update store status');
      console.error('Failed to toggle status:', error);
    }
  };

  /**
   * Format date
   */
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Fetch profile on component mount
  useEffect(() => {
    void fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4" />
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <div className="h-64 bg-gray-200 rounded" />
              <div className="h-32 bg-gray-200 rounded" />
            </div>
            <div className="space-y-4">
              <div className="h-32 bg-gray-200 rounded" />
              <div className="h-32 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <User className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Profile not found</h3>
        <p className="text-muted-foreground">
          Unable to load your profile information.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground">
            Manage your store profile and business information
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>
      </div>

      {/* Store Status */}
      <ProfileStatusCard profile={profile} onStatusToggle={handleStatusToggle} />

      {/* Profile Form */}
      {isEditing ? (
        <ProfileForm 
          profile={profile} 
          saving={saving} 
          onSubmit={handleSubmit} 
        />
      ) : (
        <div className="space-y-6">
          {/* Store Logo */}
          <ProfileLogoCard
            profile={profile}
            uploadingLogo={uploadingLogo}
            onLogoUpload={handleLogoUpload}
            onLogoDelete={handleLogoDelete}
          />

          {/* Profile Information */}
          <ProfileInfoCard profile={profile} />

          {/* Account Information */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <div>
                <div className="font-medium">Member Since</div>
                <div className="text-sm text-muted-foreground">
                  {formatDate(profile.createdAt)}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-muted-foreground" />
              <div>
                <div className="font-medium">Last Updated</div>
                <div className="text-sm text-muted-foreground">
                  {formatDate(profile.updatedAt)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 