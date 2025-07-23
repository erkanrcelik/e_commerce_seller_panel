'use client';

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { type CampaignStats } from '@/services';
import {
    Calendar,
    Star,
    Tag,
    TrendingUp,
} from 'lucide-react';

/**
 * Campaign stats component props
 */
interface CampaignStatsProps {
  /** Campaign statistics data */
  stats: CampaignStats;
}

/**
 * Campaign stats component
 * Displays compact statistics cards for campaigns
 */
export function CampaignStats({ stats }: CampaignStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
            <Star className="h-4 w-4 text-blue-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalCampaigns}</div>
          <p className="text-xs text-muted-foreground">All campaigns</p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-green-500">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.activeCampaigns}</div>
          <p className="text-xs text-muted-foreground">Currently running</p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-orange-500">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">Upcoming Campaigns</CardTitle>
            <Calendar className="h-4 w-4 text-orange-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.upcomingCampaigns}</div>
          <p className="text-xs text-muted-foreground">Scheduled to start</p>
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-purple-500">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">Expired Campaigns</CardTitle>
            <Tag className="h-4 w-4 text-purple-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.expiredCampaigns}</div>
          <p className="text-xs text-muted-foreground">Ended campaigns</p>
        </CardContent>
      </Card>
    </div>
  );
} 