'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { CampaignService, type Campaign } from '@/services';
import {
    ArrowLeft,
    Edit,
    Image as ImageIcon,
    Percent,
    RefreshCw,
    Star
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

/**
 * Campaign detail page component
 * Displays detailed information about a specific campaign
 */
export default function CampaignDetailPage() {
  const params = useParams();
  const router = useRouter();
  const campaignId = params.id as string;
  
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * Fetch campaign details
   */
  const fetchCampaignDetails = async () => {
    try {
      setLoading(true);
      const campaignData = await CampaignService.getCampaignById(campaignId);
      setCampaign(campaignData);
    } catch (error) {
      toast.error('Failed to load campaign details');
      console.error('Error fetching campaign:', error);
      router.push('/campaigns');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Format date values
   */
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
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

  useEffect(() => {
    void fetchCampaignDetails();
  }, [campaignId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4" />
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-64 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/2" />
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="text-center py-12">
        <Star className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Campaign not found</h3>
        <p className="text-muted-foreground mb-4">
          The campaign you're looking for doesn't exist.
        </p>
        <Button asChild>
          <Link href="/campaigns">Back to Campaigns</Link>
        </Button>
      </div>
    );
  }

  const status = getCampaignStatus(campaign);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/campaigns">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Campaigns
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {campaign.name}
            </h1>
            <p className="text-muted-foreground">
              Campaign details and management
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => void fetchCampaignDetails()}
            variant="outline"
            size="sm"
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button asChild>
            <Link href={`/campaigns/${campaign._id}/edit`}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Campaign
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Campaign Image */}
          <Card>
            <CardHeader>
              <CardTitle>Campaign Image</CardTitle>
            </CardHeader>
            <CardContent>
              {campaign.imageUrl ? (
                <div className="relative h-64 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg overflow-hidden">
                  <Image
                    src={campaign.imageUrl}
                    alt={campaign.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="h-64 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg flex items-center justify-center">
                  <ImageIcon className="w-16 h-16 text-gray-400" />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Campaign Information */}
          <Card>
            <CardHeader>
              <CardTitle>Campaign Information</CardTitle>
              <CardDescription>
                Campaign details and settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">{campaign.name}</h3>
                <p className="text-muted-foreground">{campaign.description}</p>
              </div>

              <div className="flex items-center gap-4">
                <Badge variant={getStatusBadgeVariant(status)} className="capitalize">
                  {status}
                </Badge>
                <div className="flex items-center gap-2">
                  <Percent className="w-4 h-4 text-purple-600" />
                  <span className="font-medium">
                    {campaign.discountType === 'percentage' 
                      ? `${campaign.discountValue}% OFF`
                      : `$${campaign.discountValue} OFF`
                    }
                  </span>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-sm font-medium">Start Date</Label>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(campaign.startDate)}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">End Date</Label>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(campaign.endDate)}
                  </p>
                </div>
              </div>

              {campaign.maxUsage && (
                <div>
                  <Label className="text-sm font-medium">Maximum Usage</Label>
                  <p className="text-sm text-muted-foreground">
                    {campaign.maxUsage} times
                  </p>
                </div>
              )}

              {campaign.minOrderAmount && (
                <div>
                  <Label className="text-sm font-medium">Minimum Order Amount</Label>
                  <p className="text-sm text-muted-foreground">
                    ${campaign.minOrderAmount}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Campaign Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Campaign Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge variant={getStatusBadgeVariant(status)} className="capitalize">
                  {status}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Products</span>
                <span className="font-medium">{campaign.productIds.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Created</span>
                <span className="font-medium">{formatDate(campaign.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Last Updated</span>
                <span className="font-medium">{formatDate(campaign.updatedAt)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Campaign Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild className="w-full">
                <Link href={`/campaigns/${campaign._id}/edit`}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Campaign
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link href="/campaigns">
                  Back to Campaigns
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 