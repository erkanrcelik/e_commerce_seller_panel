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
 * Order filters component props
 */
interface OrderFiltersProps {
  /** Search query */
  searchQuery: string;
  /** Search query setter */
  onSearchChange: (value: string) => void;
  /** Status filter */
  statusFilter: string;
  /** Status filter setter */
  onStatusFilterChange: (value: string) => void;
  /** Date range */
  dateRange: { startDate: string; endDate: string };
  /** Date range setter */
  onDateRangeChange: (range: { startDate: string; endDate: string }) => void;
  /** Search form submit handler */
  onSearchSubmit: (e: React.FormEvent) => void;
}

/**
 * Order filters component
 * Handles search and filtering functionality
 */
export function OrderFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  dateRange,
  onDateRangeChange,
  onSearchSubmit,
}: OrderFiltersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Management</CardTitle>
        <CardDescription>Search and filter your orders</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <form onSubmit={onSearchSubmit} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders by number, customer name..."
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
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          {/* Date Range */}
          <div className="flex gap-2">
            <Input
              type="date"
              placeholder="Start Date"
              value={dateRange.startDate}
              onChange={(e) => onDateRangeChange({ ...dateRange, startDate: e.target.value })}
              className="w-full lg:w-[150px]"
            />
            <Input
              type="date"
              placeholder="End Date"
              value={dateRange.endDate}
              onChange={(e) => onDateRangeChange({ ...dateRange, endDate: e.target.value })}
              className="w-full lg:w-[150px]"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 