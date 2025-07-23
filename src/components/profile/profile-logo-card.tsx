'use client';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { type SellerProfile } from '@/services';
import {
    Building,
    Camera,
    Trash2,
} from 'lucide-react';
import Image from 'next/image';
import { useRef } from 'react';

/**
 * Profile logo card component props
 */
interface ProfileLogoCardProps {
  /** Profile data */
  profile: SellerProfile;
  /** Loading state */
  uploadingLogo: boolean;
  /** Handle logo upload */
  onLogoUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  /** Handle logo deletion */
  onLogoDelete: () => Promise<void>;
}

/**
 * Profile logo card component
 * Manages store logo upload and deletion
 */
export function ProfileLogoCard({
  profile,
  uploadingLogo,
  onLogoUpload,
  onLogoDelete,
}: ProfileLogoCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Store Logo</CardTitle>
        <CardDescription>
          Upload or update your store logo
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <Label>Store Logo</Label>
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
              {profile.logoUrl ? (
                <Image
                  src={profile.logoUrl}
                  alt="Store Logo"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Building className="w-8 h-8 text-gray-400" />
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingLogo}
              >
                <Camera className="w-4 h-4 mr-2" />
                {uploadingLogo ? 'Uploading...' : 'Upload'}
              </Button>
              {profile.logoUrl && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => void onLogoDelete()}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove
                </Button>
              )}
            </div>
          </div>
                      <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => void onLogoUpload(e)}
              className="hidden"
            />
        </div>
      </CardContent>
    </Card>
  );
} 