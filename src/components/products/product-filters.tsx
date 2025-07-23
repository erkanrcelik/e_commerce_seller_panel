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
 * Product filters component props
 */
interface ProductFiltersProps {
  /** Search query */
  searchQuery: string;
  /** Search query setter */
  onSearchChange: (value: string) => void;
  /** Status filter */
  statusFilter: string;
  /** Status filter setter */
  onStatusFilterChange: (value: string) => void;
  /** Featured filter */
  featuredFilter: string;
  /** Featured filter setter */
  onFeaturedFilterChange: (value: string) => void;
  /** Sort by field */
  sortBy: 'name' | 'createdAt' | 'price';
  /** Sort by setter */
  onSortByChange?: (value: 'name' | 'createdAt' | 'price') => void;
  /** Sort order */
  sortOrder: 'asc' | 'desc';
  /** Sort order setter */
  onSortOrderChange?: (value: 'asc' | 'desc') => void;
  /** Price range */
  priceRange: { min: string; max: string };
  /** Price range setter */
  onPriceRangeChange: (range: { min: string; max: string }) => void;
  /** Search form submit handler */
  onSearchSubmit: (e: React.FormEvent) => void;
}

/**
 * Product filters component
 * Handles search and filtering functionality
 */
export function ProductFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  featuredFilter,
  onFeaturedFilterChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  priceRange,
  onPriceRangeChange,
  onSearchSubmit,
}: ProductFiltersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
        <CardDescription>Search and filter your products</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Search */}
          <form onSubmit={onSearchSubmit}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </form>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={onStatusFilterChange}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          {/* Featured Filter */}
          <Select value={featuredFilter} onValueChange={onFeaturedFilterChange}>
            <SelectTrigger>
              <SelectValue placeholder="Featured" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Products</SelectItem>
              <SelectItem value="featured">Featured Only</SelectItem>
              <SelectItem value="not-featured">Not Featured</SelectItem>
            </SelectContent>
          </Select>

          {/* Sort By */}
          <Select value={sortBy} onValueChange={(value) => onSortByChange?.(value as 'name' | 'createdAt' | 'price')}>
            <SelectTrigger>
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt">Date Created</SelectItem>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="price">Price</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <div className="grid gap-4 md:grid-cols-3 mt-4">
          <Input
            type="number"
            placeholder="Min Price"
            value={priceRange.min}
            onChange={(e) => onPriceRangeChange({ ...priceRange, min: e.target.value })}
          />
          <Input
            type="number"
            placeholder="Max Price"
            value={priceRange.max}
            onChange={(e) => onPriceRangeChange({ ...priceRange, max: e.target.value })}
          />
          <Select value={sortOrder} onValueChange={(value: 'asc' | 'desc') => onSortOrderChange?.(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Sort Order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Descending</SelectItem>
              <SelectItem value="asc">Ascending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
} 