'use client';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { type SellerProfile } from '@/services';
import {
    Building,
    Globe,
    Instagram,
    MapPin,
    Phone,
    Twitter,
} from 'lucide-react';
import Link from 'next/link';

/**
 * Profile info card component props
 */
interface ProfileInfoCardProps {
  /** Profile data */
  profile: SellerProfile;
}

/**
 * Profile info card component
 * Displays store information in a readable format
 */
export function ProfileInfoCard({ profile }: ProfileInfoCardProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building className="w-5 h-5 mr-2" />
            Store Information
          </CardTitle>
          <CardDescription>
            Your store's basic details and contact information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="font-medium">Store Name</div>
            <div className="text-sm text-muted-foreground">
              {profile.storeName}
            </div>
          </div>

          <div className="space-y-2">
            <div className="font-medium">Description</div>
            <div className="text-sm text-muted-foreground">
              {profile.description}
            </div>
          </div>

          <div className="space-y-2">
            <div className="font-medium">Phone Number</div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="w-4 h-4" />
              {profile.phoneNumber}
            </div>
          </div>

          {profile.website && (
            <div className="space-y-2">
              <div className="font-medium">Website</div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Globe className="w-4 h-4" />
                <Link 
                  href={profile.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {profile.website}
                </Link>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Address Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            Address Information
          </CardTitle>
          <CardDescription>
            Your business location and contact details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {profile.address && (
            <>
              <div className="space-y-2">
                <div className="font-medium">Street Address</div>
                <div className="text-sm text-muted-foreground">
                  {profile.address.street}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="font-medium">City</div>
                  <div className="text-sm text-muted-foreground">
                    {profile.address.city}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="font-medium">State</div>
                  <div className="text-sm text-muted-foreground">
                    {profile.address.state}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="font-medium">Country</div>
                  <div className="text-sm text-muted-foreground">
                    {profile.address.country}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="font-medium">Postal Code</div>
                  <div className="text-sm text-muted-foreground">
                    {profile.address.postalCode}
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Business Hours */}
      <Card>
        <CardHeader>
          <CardTitle>Business Hours</CardTitle>
          <CardDescription>
            Your store's operating hours for each day
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {profile.businessHours && (
            <div className="space-y-3">
              {Object.entries(profile.businessHours).map(([day, hours]) => {
                const h = hours as { closed?: boolean; open?: string; close?: string };
                return (
                  <div key={day} className="flex items-center justify-between">
                    <div className="w-24 capitalize font-medium">{day}</div>
                    <div className="text-sm text-muted-foreground">
                      {h.closed ? (
                        <span className="text-red-500">Closed</span>
                      ) : (
                        <span>{h.open} - {h.close}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Social Media */}
      <Card>
        <CardHeader>
          <CardTitle>Social Media</CardTitle>
          <CardDescription>
            Your social media accounts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {profile.socialMedia && (
            <>
              {profile.socialMedia.instagram && (
                <div className="space-y-2">
                  <div className="font-medium">Instagram</div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Instagram className="w-4 h-4" />
                    <Link 
                      href={profile.socialMedia.instagram} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {profile.socialMedia.instagram}
                    </Link>
                  </div>
                </div>
              )}

              {profile.socialMedia.twitter && (
                <div className="space-y-2">
                  <div className="font-medium">Twitter</div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Twitter className="w-4 h-4" />
                    <Link 
                      href={profile.socialMedia.twitter} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {profile.socialMedia.twitter}
                    </Link>
                  </div>
                </div>
              )}

              {profile.socialMedia.facebook && (
                <div className="space-y-2">
                  <div className="font-medium">Facebook</div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Globe className="w-4 h-4" />
                    <Link 
                      href={profile.socialMedia.facebook} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {profile.socialMedia.facebook}
                    </Link>
                  </div>
                </div>
              )}

              {!profile.socialMedia.instagram && !profile.socialMedia.twitter && !profile.socialMedia.facebook && (
                <div className="text-sm text-muted-foreground">
                  No social media accounts connected
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 