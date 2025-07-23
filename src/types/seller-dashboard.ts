import { z } from 'zod';

/**
 * Dashboard statistics schema
 */
export const DashboardStatsSchema = z.object({
  products: z.object({
    total: z.number(),
    active: z.number(),
    inactive: z.number(),
    lowStock: z.number(),
    outOfStock: z.number(),
    featured: z.number(),
    avgRating: z.number(),
    totalViews: z.number(),
  }),
  orders: z.object({
    total: z.number(),
    today: z.number(),
    thisWeek: z.number(),
    thisMonth: z.number(),
    pending: z.number(),
    processing: z.number(),
    shipped: z.number(),
    delivered: z.number(),
    cancelled: z.number(),
    avgOrderValue: z.number(),
  }),
  campaigns: z.object({
    total: z.number(),
    active: z.number(),
    expired: z.number(),
    upcoming: z.number(),
    totalDiscountGiven: z.number(),
    avgDiscountPercentage: z.number(),
  }),
  reviews: z.object({
    total: z.number(),
    thisMonth: z.number(),
    avgRating: z.number(),
    pending: z.number(),
    ratingDistribution: z.object({
      5: z.number(),
      4: z.number(),
      3: z.number(),
      2: z.number(),
      1: z.number(),
    }),
  }),
  revenue: z.object({
    total: z.number(),
    thisMonth: z.number(),
    thisWeek: z.number(),
    today: z.number(),
    avgMonthlyRevenue: z.number().optional(),
    bestSellingProduct: z.union([
      z.object({
        name: z.string(),
        revenue: z.number(),
        quantity: z.number(),
      }),
      z.string(),
      z.null(),
      z.undefined(),
    ]).optional(),
  }),
  alerts: z.object({
    lowStockProducts: z.number(),
    pendingOrders: z.number(),
    expiringSoonCampaigns: z.number(),
    negativeReviews: z.number(),
    totalAlerts: z.number(),
  }),
});

/**
 * Dashboard activity schema
 */
export const DashboardActivitySchema = z.object({
  type: z.enum(['order', 'review', 'product', 'campaign']),
  title: z.string(),
  description: z.string(),
  amount: z.number().optional(),
  status: z.string().optional(),
  productName: z.string().optional(),
  orderId: z.string().optional(),
  rating: z.number().optional(),
  reviewer: z.string().optional(),
  reviewId: z.string().optional(),
  createdAt: z.string(),
});

/**
 * Dashboard charts schema
 */
export const DashboardChartsSchema = z.object({
  dailySales: z.array(z.object({
    date: z.string(),
    revenue: z.number(),
    orderCount: z.number(),
  })),
  productPerformance: z.array(z.object({
    name: z.string(),
    revenue: z.number(),
    quantity: z.number(),
  })),
  monthlyComparison: z.object({
    current: z.object({
      revenue: z.number(),
      orders: z.number(),
    }),
    previous: z.object({
      revenue: z.number(),
      orders: z.number(),
    }),
    growth: z.object({
      revenue: z.number(),
      orders: z.number(),
    }),
  }),
});

/**
 * Dashboard performance schema
 */
export const DashboardPerformanceSchema = z.object({
  conversionMetrics: z.object({
    productViews: z.number(),
    cartAdditions: z.number(),
    purchases: z.number(),
    conversionRate: z.number(),
    cartConversionRate: z.number(),
  }),
  customerSatisfaction: z.object({
    averageRating: z.number(),
    repeatCustomerRate: z.number(),
    customerRetentionRate: z.number(),
    responseTime: z.number(),
  }),
  growthTrends: z.object({
    revenueGrowth: z.number(),
    orderGrowth: z.number(),
    productGrowth: z.number(),
    marketShare: z.number(),
  }),
});

/**
 * Type exports
 */
export type DashboardStats = z.infer<typeof DashboardStatsSchema>;
export type DashboardActivity = z.infer<typeof DashboardActivitySchema>;
export type DashboardCharts = z.infer<typeof DashboardChartsSchema>;
export type DashboardPerformance = z.infer<typeof DashboardPerformanceSchema>;

/**
 * Query parameters schemas
 */
export const DashboardActivitiesParamsSchema = z.object({
  limit: z.number().min(1).max(50).optional().default(10),
});

export const DashboardChartsParamsSchema = z.object({
  days: z.number().min(1).max(365).optional().default(30),
});

export type DashboardActivitiesParams = z.infer<typeof DashboardActivitiesParamsSchema>;
export type DashboardChartsParams = z.infer<typeof DashboardChartsParamsSchema>; 