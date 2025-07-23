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
import { DashboardService, type DashboardActivity, type DashboardStats } from '@/services';
import {
  Activity,
  AlertCircle,
  ArrowUpRight,
  BarChart3,
  Calendar,
  Clock,
  DollarSign,
  Megaphone,
  Package,
  RefreshCw,
  ShoppingCart,
  Star,
  TrendingUp,
  Users
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

/**
 * Dashboard overview page component
 * Displays key metrics, recent activity, and quick actions for sellers
 */
export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<DashboardActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  /**
   * Fetch dashboard data from API
   */
  const fetchDashboardData = async (showRefreshingToast = false) => {
    try {
      if (showRefreshingToast) {
        setRefreshing(true);
      }

      const [statsResponse, activitiesResponse] = await Promise.all([
        DashboardService.getStats(),
        DashboardService.getActivities({ limit: 10 }),
      ]);

      setStats(statsResponse);
      setActivities(activitiesResponse);

      if (showRefreshingToast) {
        toast.success('Dashboard updated successfully');
      }
    } catch (error) {
      toast.error('Failed to load dashboard data', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    void fetchDashboardData();
  }, []);

  /**
   * Handle refresh button click
   */
  const handleRefresh = () => {
    void fetchDashboardData(true);
  };

  /**
   * Format currency values
   */
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  /**
   * Format date strings
   */
  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(dateString));
  };

  /**
   * Get activity icon based on type
   */
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <ShoppingCart className="w-4 h-4" />;
      case 'review':
        return <Star className="w-4 h-4" />;
      case 'product':
        return <Package className="w-4 h-4" />;
      case 'campaign':
        return <Megaphone className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  /**
   * Get activity color based on type
   */
  const getActivityColor = (type: string) => {
    switch (type) {
      case 'order':
        return 'text-blue-600';
      case 'review':
        return 'text-yellow-600';
      case 'product':
        return 'text-green-600';
      case 'campaign':
        return 'text-purple-600';
      default:
        return 'text-gray-600';
    }
  };

  if (loading) {
  return (
      <div className="space-y-8">
        {/* Loading State */}
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2" />
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8" />
        </div>

        {/* Loading Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardHeader className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-6 bg-gray-200 rounded w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-gray-200 rounded w-1/3" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Loading Content */}
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2 animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="h-10 w-10 bg-gray-200 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
            </CardHeader>
            <CardContent className="space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-10 bg-gray-200 rounded" />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="p-8 text-center">
          <AlertCircle className="w-12 h-12 mx-auto text-orange-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Failed to Load Data</h3>
          <p className="text-muted-foreground mb-4">
            An error occurred while loading dashboard data.
          </p>
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </Card>
      </div>
    );
  }

  return (
      <div className="space-y-8">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back! Here's what's happening with your store today.
            </p>
          </div>
        <div className="flex gap-2">
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            disabled={refreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Revenue */}
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.revenue.total)}</div>
              <p className="text-xs text-green-600 flex items-center">
                <ArrowUpRight className="w-3 h-3 mr-1" />
              This month: {formatCurrency(stats.revenue.thisMonth)}
              </p>
            </CardContent>
          </Card>

        {/* Total Products */}
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
            <div className="text-2xl font-bold">{stats.products.total}</div>
              <p className="text-xs text-blue-600 flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              Active: {stats.products.active}
              </p>
            </CardContent>
          </Card>

        {/* Total Orders */}
          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
            <div className="text-2xl font-bold">{stats.orders.total}</div>
              <p className="text-xs text-orange-600 flex items-center">
                <Clock className="w-3 h-3 mr-1" />
              Pending: {stats.orders.pending}
              </p>
            </CardContent>
          </Card>

        {/* Average Rating */}
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              <Star className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
            <div className="text-2xl font-bold">{stats.reviews.avgRating.toFixed(1)}</div>
              <p className="text-xs text-green-600 flex items-center">
              <Star className="w-3 h-3 mr-1" />
              {stats.reviews.total} total reviews
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Activities */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                <CardTitle>Recent Activities</CardTitle>
                <CardDescription>Latest updates from your store</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/orders">
                    View All
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
              {activities.length > 0 ? (
                activities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className={`p-2 rounded-full bg-gray-100 ${getActivityColor(activity.type)}`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{activity.title}</p>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(activity.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                      {activity.amount && (
                        <p className="text-sm font-medium text-green-600">
                          {formatCurrency(activity.amount)}
                        </p>
                      )}
                      {activity.rating && (
                        <div className="flex items-center space-x-1">
                          {Array.from({ length: activity.rating }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Activity className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                  <p className="text-muted-foreground">No activities yet</p>
                </div>
              )}
              </div>
            </CardContent>
          </Card>

        {/* Sidebar Content */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Most used operations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link href="/orders">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    View Orders
                  </Link>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link href="/campaigns/add">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Create Campaign
                  </Link>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link href="/profile">
                    <Users className="mr-2 h-4 w-4" />
                    Update Profile
                  </Link>
                </Button>
              </CardContent>
            </Card>

          {/* Alerts */}
          {stats.alerts.totalAlerts > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertCircle className="mr-2 h-4 w-4 text-orange-500" />
                  Alerts
                </CardTitle>
                <CardDescription>Items that need your attention</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {stats.alerts.lowStockProducts > 0 && (
                  <Button asChild variant="ghost" className="w-full justify-start p-3 bg-orange-50 hover:bg-orange-100 rounded-lg">
                    <Link href="/products">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center space-x-2">
                          <Package className="w-4 h-4 text-orange-600" />
                          <span className="text-sm">Low stock products</span>
                        </div>
                        <Badge variant="destructive">{stats.alerts.lowStockProducts}</Badge>
                      </div>
                    </Link>
                  </Button>
                )}
                {stats.alerts.pendingOrders > 0 && (
                  <Button asChild variant="ghost" className="w-full justify-start p-3 bg-blue-50 hover:bg-blue-100 rounded-lg">
                    <Link href="/orders">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center space-x-2">
                          <ShoppingCart className="w-4 h-4 text-blue-600" />
                          <span className="text-sm">Pending orders</span>
                        </div>
                        <Badge variant="secondary">{stats.alerts.pendingOrders}</Badge>
                      </div>
                    </Link>
                  </Button>
                )}
                {stats.alerts.expiringSoonCampaigns > 0 && (
                  <Button asChild variant="ghost" className="w-full justify-start p-3 bg-purple-50 hover:bg-purple-100 rounded-lg">
                    <Link href="/campaigns">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-purple-600" />
                          <span className="text-sm">Expiring campaigns</span>
                        </div>
                        <Badge variant="outline">{stats.alerts.expiringSoonCampaigns}</Badge>
                      </div>
                    </Link>
                  </Button>
                )}
                {stats.alerts.negativeReviews > 0 && (
                  <Button asChild variant="ghost" className="w-full justify-start p-3 bg-red-50 hover:bg-red-100 rounded-lg">
                    <Link href="/products">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center space-x-2">
                          <Star className="w-4 h-4 text-red-600" />
                          <span className="text-sm">Negative reviews</span>
                        </div>
                        <Badge variant="destructive">{stats.alerts.negativeReviews}</Badge>
                      </div>
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {/* Best Selling Product */}
          {stats.revenue.bestSellingProduct && 
           typeof stats.revenue.bestSellingProduct === 'object' && 
           'name' in stats.revenue.bestSellingProduct && (
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>Best Selling Product</CardTitle>
                <CardDescription>Top performing product this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{stats.revenue.bestSellingProduct.name}</span>
                    <Badge variant="secondary">{stats.revenue.bestSellingProduct.quantity} sold</Badge>
                  </div>
                  <div className="text-lg font-bold text-purple-600">
                    {formatCurrency(stats.revenue.bestSellingProduct.revenue)}
                  </div>
                  <p className="text-xs text-muted-foreground">Revenue generated</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Campaign Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Campaign Performance</CardTitle>
              <CardDescription>Active campaigns overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Active Campaigns</span>
                  <span className="text-lg font-bold text-purple-600">{stats.campaigns.active}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Total Discount Given</span>
                  <span className="text-lg font-bold text-green-600">
                    {formatCurrency(stats.campaigns.totalDiscountGiven)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Avg. Discount</span>
                  <span className="text-lg font-bold text-blue-600">
                    {stats.campaigns.avgDiscountPercentage.toFixed(1)}%
                  </span>
          </div>
        </div>
            </CardContent>
          </Card>

          {/* Monthly Revenue Target */}
          {stats.revenue.avgMonthlyRevenue && (
        <Card>
          <CardHeader>
                <CardTitle>Monthly Revenue Target</CardTitle>
                <CardDescription>Performance against target</CardDescription>
          </CardHeader>
          <CardContent>
                <div className="space-y-4">
              <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {formatCurrency(stats.revenue.thisMonth)}
                    </div>
                    <p className="text-sm text-muted-foreground">This Month Revenue</p>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"
                        style={{
                          width: `${Math.min((stats.revenue.thisMonth / stats.revenue.avgMonthlyRevenue) * 100, 100)}%`,
                        }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Target: {formatCurrency(stats.revenue.avgMonthlyRevenue)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Stats Cards */}
          {stats && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                  <Package className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.products.total}</div>
                  <p className="text-xs text-muted-foreground">All products</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Products</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.products.active}</div>
                  <p className="text-xs text-muted-foreground">{((stats.products.active / stats.products.total) * 100).toFixed(1)}% of total</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg. Price</CardTitle>
                  <BarChart3 className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(stats.products.avgRating)}</div>
                  <p className="text-xs text-muted-foreground">Average product rating</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Featured</CardTitle>
                  <Star className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.products.featured}</div>
                  <p className="text-xs text-muted-foreground">{((stats.products.featured / stats.products.total) * 100).toFixed(1)}% of total</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Product Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Product Statistics</CardTitle>
              <CardDescription>Product performance overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Featured Products</span>
                  <span className="text-lg font-bold text-yellow-600">{stats.products.featured}</span>
              </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Low Stock</span>
                  <span className="text-lg font-bold text-orange-600">{stats.products.lowStock}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Out of Stock</span>
                  <span className="text-lg font-bold text-red-600">{stats.products.outOfStock}</span>
              </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Total Views</span>
                  <span className="text-lg font-bold text-blue-600">{stats.products.totalViews}</span>
              </div>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
      </div>
  );
}
