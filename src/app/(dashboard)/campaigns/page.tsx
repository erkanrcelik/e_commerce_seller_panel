'use client';

import { CampaignFilters } from '@/components/campaigns/campaign-filters';
import { CampaignGrid } from '@/components/campaigns/campaign-grid';
import { CampaignStats as CampaignStatsComponent } from '@/components/campaigns/campaign-stats';
import { Button } from '@/components/ui/button';
import { CampaignService, type Campaign, type CampaignListParams, type CampaignStats, type CampaignStatus, type DiscountType } from '@/services';
import {
  Plus,
  RefreshCw,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

/**
 * Campaign management page component
 * Handles campaign listing, filtering, and management operations
 */
export default function CampaignsPage() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [stats, setStats] = useState<CampaignStats | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [discountTypeFilter, setDiscountTypeFilter] = useState<string>('all');
  const [sortBy] = useState<'createdAt' | 'name' | 'startDate' | 'endDate' | 'discountValue'>('createdAt');
  const [sortOrder] = useState<'asc' | 'desc'>('desc');

  /**
   * Fetch campaigns from API with filters
   */
  const fetchCampaigns = async (showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setRefreshing(true);
      } else {
      setLoading(true);
      }

      const params: CampaignListParams = {
        page: currentPage,
        limit: 12,
        search: searchQuery || undefined,
        status: statusFilter !== 'all' ? statusFilter as CampaignStatus : undefined,
        discountType: discountTypeFilter !== 'all' ? discountTypeFilter as DiscountType : undefined,
        sortBy: sortBy,
        sortOrder: sortOrder,
      };

      const [campaignsResponse, statsResponse] = await Promise.all([
        CampaignService.getCampaigns(params),
        CampaignService.getCampaignStats(),
      ]);

      setCampaigns(campaignsResponse.data);
      setTotalPages(campaignsResponse.totalPages);
      setStats(statsResponse);

      if (showRefreshing) {
        toast.success('Campaigns refreshed successfully');
      }
    } catch (error) {
      toast.error('Failed to load campaigns');
      console.error('Failed to fetch campaigns:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /**
   * Handle search form submission
   */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    void fetchCampaigns();
  };

  /**
   * Handle page change
   */
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  /**
   * Handle refresh
   */
  const handleRefresh = () => {
    void fetchCampaigns(true);
  };

  /**
   * Handle campaign status toggle
   */
  const handleStatusToggle = async (campaignId: string) => {
    try {
      const updatedCampaign = await CampaignService.toggleCampaignStatus(campaignId);
      setCampaigns(prevCampaigns =>
        prevCampaigns.map(c => c._id === campaignId ? updatedCampaign : c)
      );
      toast.success(`Campaign ${updatedCampaign.isActive ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      toast.error('Failed to update campaign status');
      console.error('Error toggling campaign status:', error);
    }
  };

  /**
   * Handle campaign deletion
   */
  const handleDelete = async (campaignId: string, campaignName: string) => {
    const confirmed = confirm(`Are you sure you want to delete campaign "${campaignName}"? This action cannot be undone.`);
    if (!confirmed) return;

    try {
      await CampaignService.deleteCampaign(campaignId);
      setCampaigns(prevCampaigns =>
        prevCampaigns.filter(c => c._id !== campaignId)
      );
      toast.success('Campaign deleted successfully');
    } catch (error) {
      toast.error('Failed to delete campaign');
      console.error('Error deleting campaign:', error);
    }
  };

  // Fetch campaigns on component mount and filter changes
  useEffect(() => {
    void fetchCampaigns();
  }, [currentPage]);

  // Handle filter changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (currentPage === 1) {
        void fetchCampaigns();
      } else {
        setCurrentPage(1);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [statusFilter, discountTypeFilter]);

  return (
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Campaigns</h1>
            <p className="text-muted-foreground">
            Create and manage promotional campaigns for your products
            </p>
          </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => void handleRefresh()}
            variant="outline"
            disabled={refreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
          <Button asChild className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
            <Link href="/campaigns/add">
              <Plus className="w-4 h-4 mr-2" />
              Create Campaign
            </Link>
          </Button>
        </div>
        </div>

        {/* Stats Cards */}
      {stats && <CampaignStatsComponent stats={stats} />}

        {/* Filters and Search */}
      <CampaignFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        discountTypeFilter={discountTypeFilter}
        onDiscountTypeFilterChange={setDiscountTypeFilter}
        onSearchSubmit={handleSearch}
      />

        {/* Campaigns Grid */}
      <CampaignGrid
        campaigns={campaigns}
        loading={loading}
        onStatusToggle={(id) => void handleStatusToggle(id)}
        onDelete={(id, name) => void handleDelete(id, name)}
      />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2">
            <Button
              variant="outline"
              onClick={() => void handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => void handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>
  );
} 