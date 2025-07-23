'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
} from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { type Campaign } from '@/services';
import {
    Edit,
    Eye,
    Image as ImageIcon,
    MoreHorizontal,
    Percent,
    Plus,
    ToggleLeft,
    ToggleRight,
    Trash2
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

/**
 * Campaign grid component props
 */
interface CampaignGridProps {
  /** Campaigns to display */
  campaigns: Campaign[];
  /** Loading state */
  loading: boolean;
  /** Handle status toggle */
  onStatusToggle: (campaignId: string) => void;
  /** Handle delete campaign */
  onDelete: (campaignId: string, campaignName: string) => void;
}

/**
 * Format date values
 */
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Get campaign status
 */
const getCampaignStatus = (campaign: Campaign) => {
  const now = new Date();
  const startDate = new Date(campaign.startDate);
  const endDate = new Date(campaign.endDate);

  if (!campaign.isActive) return 'inactive';
  if (now < startDate) return 'upcoming';
  if (now > endDate) return 'expired';
  return 'active';
};

/**
 * Get status badge variant
 */
const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case 'active':
      return 'default';
    case 'upcoming':
      return 'secondary';
    case 'expired':
      return 'outline';
    case 'inactive':
      return 'destructive';
    default:
      return 'secondary';
  }
};

/**
 * Campaign grid component
 * Displays campaigns in a grid format with actions
 */
export function CampaignGrid({
  campaigns,
  loading,
  onStatusToggle,
  onDelete,
}: CampaignGridProps) {
  const router = useRouter();

  const handleViewCampaign = (campaignId: string) => {
    router.push(`/campaigns/${campaignId}`);
  };

  const handleEditCampaign = (campaignId: string) => {
    router.push(`/campaigns/${campaignId}/edit`);
  };

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="animate-pulse">
            <div className="h-48 bg-gray-200 rounded-t-lg" />
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (campaigns.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <ImageIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No campaigns found</h3>
          <p className="text-muted-foreground mb-4">
            Create your first promotional campaign to boost sales.
          </p>
          <Button 
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            onClick={() => router.push('/campaigns/add')}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Campaign
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {campaigns.map((campaign) => {
        const status = getCampaignStatus(campaign);
        return (
          <Card key={campaign._id} className="overflow-hidden hover:shadow-lg transition-shadow">
            {/* Campaign Image */}
            <div className="relative h-48 bg-gradient-to-br from-purple-100 to-blue-100">
              {campaign.imageUrl ? (
                <Image
                  src={campaign.imageUrl}
                  alt={campaign.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <ImageIcon className="w-16 h-16 text-gray-400" />
                </div>
              )}
              <div className="absolute top-4 left-4">
                <Badge variant={getStatusBadgeVariant(status)} className="capitalize">
                  {status}
                </Badge>
              </div>
              <div className="absolute top-4 right-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleViewCampaign(campaign._id)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEditCampaign(campaign._id)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Campaign
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onStatusToggle(campaign._id)}>
                      {campaign.isActive ? (
                        <>
                          <ToggleLeft className="mr-2 h-4 w-4" />
                          Deactivate
                        </>
                      ) : (
                        <>
                          <ToggleRight className="mr-2 h-4 w-4" />
                          Activate
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => onDelete(campaign._id, campaign.name)}
                      className="text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Campaign
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Campaign Content */}
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{campaign.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {campaign.description}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Percent className="w-4 h-4 text-purple-600" />
                    <span className="font-medium">
                      {campaign.discountType === 'percentage' 
                        ? `${campaign.discountValue}% OFF`
                        : `$${campaign.discountValue} OFF`
                      }
                    </span>
                  </div>
                  <Badge variant="outline">
                    {campaign.productIds.length} Products
                  </Badge>
                </div>

                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span>Start Date:</span>
                    <span>{formatDate(campaign.startDate)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>End Date:</span>
                    <span>{formatDate(campaign.endDate)}</span>
                  </div>
                  {campaign.maxUsage && (
                    <div className="flex items-center justify-between">
                      <span>Max Usage:</span>
                      <span>{campaign.maxUsage} times</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
} 