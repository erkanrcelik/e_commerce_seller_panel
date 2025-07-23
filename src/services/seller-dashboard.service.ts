import { AxiosResponse } from 'axios';

import { handleApiError } from '@/lib/api-error';
import api from '@/lib/axios';
import type {
  DashboardActivitiesParams,
  DashboardActivity,
  DashboardCharts,
  DashboardChartsParams,
  DashboardPerformance,
  DashboardStats
} from '@/types/seller-dashboard';
import {
  DashboardActivitiesParamsSchema,
  DashboardActivitySchema,
  DashboardChartsParamsSchema,
  DashboardChartsSchema,
  DashboardPerformanceSchema,
  DashboardStatsSchema,
} from '@/types/seller-dashboard';

/**
 * Dashboard Service
 * Handles all dashboard-related API operations with Zod validation
 */
export class DashboardService {
  private static readonly BASE_URL = '/seller/dashboard';

  /**
   * Get dashboard statistics
   * @returns Promise containing dashboard statistics
   * @throws Error on request failure
   */
  static async getStats(): Promise<DashboardStats> {
    try {
      const response: AxiosResponse<unknown> = await api.get(
        `${this.BASE_URL}/stats`
      );

      // Validate response data with Zod
      const validatedData = DashboardStatsSchema.parse(response.data);
      return validatedData;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      const apiError = handleApiError(error);
      throw new Error(apiError.message);
    }
  }

  /**
   * Get recent activities
   * @param params - Query parameters for activities
   * @returns Promise containing list of activities
   * @throws Error on request failure
   */
  static async getActivities(
    params: Partial<DashboardActivitiesParams> = {}
  ): Promise<DashboardActivity[]> {
    try {
      // Set default values and validate input parameters
      const defaultParams = { limit: 10 };
      const validatedParams = DashboardActivitiesParamsSchema.parse({
        ...defaultParams,
        ...params,
      });

      const response: AxiosResponse<unknown> = await api.get(
        `${this.BASE_URL}/activities`,
        { params: validatedParams }
      );

      // Validate response data
      const activitiesArray = Array.isArray(response.data) ? response.data : [];
      const validatedData = activitiesArray.map((activity) =>
        DashboardActivitySchema.parse(activity)
      );

      return validatedData;
    } catch (error) {
      console.error('Error fetching dashboard activities:', error);
      const apiError = handleApiError(error);
      throw new Error(apiError.message);
    }
  }

  /**
   * Get chart data for dashboard
   * @param params - Query parameters for charts
   * @returns Promise containing chart data
   * @throws Error on request failure
   */
  static async getCharts(
    params: Partial<DashboardChartsParams> = {}
  ): Promise<DashboardCharts> {
    try {
      // Set default values and validate input parameters
      const defaultParams = { days: 30 };
      const validatedParams = DashboardChartsParamsSchema.parse({
        ...defaultParams,
        ...params,
      });

      const response: AxiosResponse<unknown> = await api.get(
        `${this.BASE_URL}/charts`,
        { params: validatedParams }
      );

      // Validate response data with Zod
      const validatedData = DashboardChartsSchema.parse(response.data);
      return validatedData;
    } catch (error) {
      console.error('Error fetching dashboard charts:', error);
      const apiError = handleApiError(error);
      throw new Error(apiError.message);
    }
  }

  /**
   * Get performance metrics
   * @returns Promise containing performance metrics
   * @throws Error on request failure
   */
  static async getPerformance(): Promise<DashboardPerformance> {
    try {
      const response: AxiosResponse<unknown> = await api.get(
        `${this.BASE_URL}/performance`
      );

      // Validate response data with Zod
      const validatedData = DashboardPerformanceSchema.parse(response.data);
      return validatedData;
    } catch (error) {
      console.error('Error fetching dashboard performance:', error);
      const apiError = handleApiError(error);
      throw new Error(apiError.message);
    }
  }
} 