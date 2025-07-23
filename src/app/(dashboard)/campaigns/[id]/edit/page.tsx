'use client';

import { CampaignForm } from '@/components/campaigns/campaign-form';
import { CampaignService, type Campaign } from '@/services';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

/**
 * Edit campaign page component
 */
export default function EditCampaignPage() {
  const params = useParams();
  const router = useRouter();
  const campaignId = params.id as string;
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * Fetch campaign data
   */
  const fetchCampaignData = async () => {
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

  useEffect(() => {
    void fetchCampaignData();
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
        <h3 className="text-lg font-semibold mb-2">Campaign not found</h3>
        <p className="text-muted-foreground mb-4">
          The campaign you're looking for doesn't exist.
        </p>
      </div>
    );
  }

  return <CampaignForm mode="edit" campaign={campaign} />;
} 