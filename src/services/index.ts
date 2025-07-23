/**
 * Service exports for easy importing
 * Provides centralized access to all API services
 */

export { AuthService } from './seller-auth.service';
export { CampaignService } from './seller-campaign.service';
export { CategoryService } from './seller-category.service';
export { DashboardService } from './seller-dashboard.service';
export { OrderService } from './seller-order.service';
export { ProductService } from './seller-product.service';
export { ProfileService } from './seller-profile.service';

/**
 * Type exports for service responses
 */

// Auth types
export type {
    AuthError,
    AuthResponse,
    AuthState,
    AuthStatus,
    EmailVerificationData,
    ForgotPasswordFormData,
    LoginFormData,
    RefreshTokenData,
    RegisterFormData,
    ResendVerificationData,
    ResetPasswordFormData,
    User,
    UserInfoResponse
} from '../types/seller-auth';

// Campaign types
export type {
    Campaign,
    CampaignImageUploadResponse,
    CampaignListParams,
    CampaignListResponse,
    CampaignStats,
    CampaignStatus,
    CreateCampaignData,
    DiscountType,
    UpdateCampaignData
} from '../types/seller-campaign';

// Category types
export type {
    Category,
    CategoryListParams,
    CategoryListResponse,
    Subcategory
} from '../types/seller-category';

// Dashboard types
export type {
    DashboardActivitiesParams,
    DashboardActivity,
    DashboardCharts,
    DashboardChartsParams,
    DashboardPerformance,
    DashboardStats
} from '../types/seller-dashboard';

// Order types
export type {
    AttentionRequiredOrder,
    Order,
    OrderCustomer,
    OrderItem,
    OrderListParams,
    OrderListResponse,
    OrderStats,
    OrderStatus,
    RevenueAnalyticsResponse,
    ShippingAddress,
    UpdateOrderNotesData,
    UpdateOrderStatusData
} from '../types/seller-order';

// Product types
export type {
    CreateProductData,
    ImageUploadResponse,
    Product,
    ProductListParams,
    ProductListResponse,
    ProductStats,
    UpdateProductData
} from '../types/seller-product';

// Profile types
export type {
    Address,
    BusinessHours,
    DayHours,
    LogoUploadResponse,
    SellerProfile,
    SocialMedia,
    UpdateProfileData
} from '../types/seller-profile';

