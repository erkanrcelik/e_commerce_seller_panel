'use client';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';

/**
 * Campaign filters component props
 */
interface CampaignFiltersProps {
  /** Search query */
  searchQuery: string;
  /** Search query setter */
  onSearchChange: (value: string) => void;
  /** Status filter */
  statusFilter: string;
  /** Status filter setter */
  onStatusFilterChange: (value: string) => void;
  /** Discount type filter */
  discountTypeFilter: string;
  /** Discount type filter setter */
  onDiscountTypeFilterChange: (value: string) => void;
  /** Search form submit handler */
  onSearchSubmit: (e: React.FormEvent) => void;
}

/**
 * Campaign filters component
 * Handles search and filtering functionality
 */
export function CampaignFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  discountTypeFilter,
  onDiscountTypeFilterChange,
  onSearchSubmit,
}: CampaignFiltersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Campaign Management</CardTitle>
        <CardDescription>Search and filter your promotional campaigns</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <form onSubmit={onSearchSubmit} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search campaigns by name or description..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </form>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger className="w-full lg:w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          {/* Discount Type Filter */}
          <Select value={discountTypeFilter} onValueChange={onDiscountTypeFilterChange}>
            <SelectTrigger className="w-full lg:w-[180px]">
              <SelectValue placeholder="Discount Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="percentage">Percentage</SelectItem>
              <SelectItem value="amount">Fixed Amount</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
} 