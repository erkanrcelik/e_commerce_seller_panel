
import api from '@/lib/axios';
import type {
    AttentionRequiredOrder,
    Order,
    OrderListParams,
    OrderListResponse,
    OrderStats,
    RevenueAnalyticsResponse,
    UpdateOrderNotesData,
    UpdateOrderStatusData
} from '@/types/seller-order';

/**
 * Order management API service
 * Handles all order-related API calls for sellers
 */
export class OrderService {
  /**
   * Fetch paginated list of orders
   * @param params - Query parameters for filtering and pagination
   * @returns Promise resolving to order list response
   */
  static async getOrders(params?: OrderListParams): Promise<OrderListResponse> {
    try {
      const response = await api.get<OrderListResponse>('/seller/orders', {
        params,
      });
      return response.data;
    } catch (error) {
      console.error('Get orders API error:', error);
      throw error;
    }
  }

  /**
   * Fetch detailed information for a specific order
   * @param id - Order ID
   * @returns Promise resolving to order details
   */
  static async getOrderById(id: string): Promise<Order> {
    try {
      const response = await api.get<Order>(`/seller/orders/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get order by ID API error:', error);
      throw error;
    }
  }

  /**
   * Update order status
   * @param id - Order ID
   * @param statusData - Status update data
   * @returns Promise resolving to updated order
   */
  static async updateOrderStatus(id: string, statusData: UpdateOrderStatusData): Promise<Order> {
    try {
      const response = await api.put<Order>(`/seller/orders/${id}/status`, statusData);
      return response.data;
    } catch (error) {
      console.error('Update order status API error:', error);
      throw error;
    }
  }

  /**
   * Update order notes
   * @param id - Order ID
   * @param notesData - Notes update data
   * @returns Promise resolving to updated order
   */
  static async updateOrderNotes(id: string, notesData: UpdateOrderNotesData): Promise<Order> {
    try {
      const response = await api.put<Order>(`/seller/orders/${id}/notes`, notesData);
      return response.data;
    } catch (error) {
      console.error('Update order notes API error:', error);
      throw error;
    }
  }

  /**
   * Get orders that require attention
   * @param limit - Maximum number of orders to return
   * @returns Promise resolving to list of orders requiring attention
   */
  static async getAttentionRequiredOrders(limit = 10): Promise<AttentionRequiredOrder[]> {
    try {
      const response = await api.get<AttentionRequiredOrder[]>('/seller/orders/attention/required', {
        params: { limit },
      });
      return response.data;
    } catch (error) {
      console.error('Get attention required orders API error:', error);
      throw error;
    }
  }

  /**
   * Get revenue analytics
   * @param startDate - Start date (YYYY-MM-DD)
   * @param endDate - End date (YYYY-MM-DD)
   * @returns Promise resolving to revenue analytics
   */
  static async getRevenueAnalytics(startDate: string, endDate: string): Promise<RevenueAnalyticsResponse> {
    try {
      const response = await api.get<RevenueAnalyticsResponse>('/seller/orders/analytics/revenue', {
        params: { startDate, endDate },
      });
      return response.data;
    } catch (error) {
      console.error('Get revenue analytics API error:', error);
      throw error;
    }
  }

  /**
   * Get order statistics overview
   * @returns Promise resolving to order stats
   */
  static async getOrderStats(): Promise<OrderStats> {
    try {
      const response = await api.get<OrderStats>('/seller/orders/stats/overview');
      return response.data;
    } catch (error) {
      console.error('Get order stats API error:', error);
      throw error;
    }
  }
} 