'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
} from '@/components/ui/card';
import { type SellerProfile } from '@/services';
import {
    ToggleLeft,
    ToggleRight,
} from 'lucide-react';

/**
 * Profile status card component props
 */
interface ProfileStatusCardProps {
  /** Profile data */
  profile: SellerProfile;
  /** Handle status toggle */
  onStatusToggle: () => Promise<void>;
}

/**
 * Profile status card component
 * Displays store status and toggle functionality
 */
export function ProfileStatusCard({ profile, onStatusToggle }: ProfileStatusCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${profile.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
              <span className="font-medium">
                Store Status: {profile.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <Badge variant={profile.isActive ? "default" : "secondary"}>
              {profile.isActive ? 'Live' : 'Offline'}
            </Badge>
          </div>
          <Button
            variant="outline"
            onClick={() => void onStatusToggle()}
            className="flex items-center gap-2"
          >
            {profile.isActive ? (
              <ToggleRight className="w-4 h-4 text-green-600" />
            ) : (
              <ToggleLeft className="w-4 h-4 text-gray-400" />
            )}
            {profile.isActive ? 'Deactivate Store' : 'Activate Store'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 