/**
 * Order status enum
 */
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

/**
 * Customer information in order
 */
export interface OrderCustomer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

/**
 * Shipping address structure
 */
export interface ShippingAddress {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

/**
 * Order item structure
 */
export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  sellerId?: string;
}

/**
 * Order structure
 */
export interface Order {
  _id: string;
  orderNumber: string;
  status: OrderStatus;
  totalAmount: number;
  customer: OrderCustomer;
  items: OrderItem[];
  shippingAddress?: ShippingAddress;
  paymentMethod?: string;
  trackingNumber?: string | null;
  sellerNotes?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Order list query parameters
 */
export interface OrderListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: OrderStatus;
  startDate?: string; // YYYY-MM-DD format
  endDate?: string; // YYYY-MM-DD format
  sortBy?: 'orderNumber' | 'totalAmount' | 'createdAt' | 'status';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Order list response structure
 */
export interface OrderListResponse {
  data: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Update order status data
 */
export interface UpdateOrderStatusData {
  status: OrderStatus;
  trackingNumber?: string;
  notes?: string;
}

/**
 * Update order notes data
 */
export interface UpdateOrderNotesData {
  notes: string;
}

/**
 * Attention required order
 */
export interface AttentionRequiredOrder {
  _id: string;
  status: OrderStatus;
  totalPrice: number;
  customerName: string;
  customerEmail: string;
  itemCount: number;
  orderDate: string;
  urgency: 'low' | 'medium' | 'high';
}

/**
 * Revenue analytics response
 */
export interface RevenueAnalyticsResponse {
  period: {
  startDate: string;
  endDate: string;
  totalDays: number;
  };
  summary: {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  dailyAverage: number;
  };
  dailyBreakdown: Array<{
  date: string;
  revenue: number;
  orderCount: number;
  averageOrderValue: number;
  }>;
}

/**
 * Order statistics
 */
export interface OrderStats {
  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
} 