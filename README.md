# Playable Factory Seller Panel

A modern, responsive seller management dashboard built with Next.js, TypeScript, and Tailwind CSS. This application provides sellers with comprehensive tools to manage their products, orders, campaigns, and profile information.

## 🚀 Features

### Core Features
- **Product Management**: Create, edit, delete, and manage product listings with images, variants, and specifications
- **Order Management**: View and manage customer orders with status updates and tracking information
- **Campaign Management**: Create and manage promotional campaigns with discount settings
- **Profile Management**: Complete seller profile setup with business hours and social media links
- **Dashboard Analytics**: Real-time statistics and performance metrics
- **Authentication**: Secure login/logout with email verification and password reset

### Advanced Features
- **Bulk Operations**: Select and perform bulk actions on products
- **Image Upload**: Drag-and-drop image upload with preview
- **Real-time Updates**: Live status updates and notifications
- **Responsive Design**: Mobile-first design that works on all devices
- **Dark Mode Support**: Built-in dark/light theme switching
- **Search & Filtering**: Advanced search and filtering capabilities
- **Export/Import**: Product data export and import functionality

## 🛠 Technology Stack

### Frontend
- **Next.js 15.4.2** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **React Hook Form** - Form handling with validation
- **Zod** - Schema validation
- **Redux Toolkit** - State management
- **Lucide React** - Icon library

### UI Components
- **shadcn/ui** - Modern component library
- **Radix UI** - Accessible component primitives
- **Sonner** - Toast notifications

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Yarn** - Package manager

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** 18.17 or higher
- **Yarn** package manager
- Modern web browser (Chrome, Firefox, Safari, Edge)

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd playable_factory_seller
```

### 2. Install Dependencies
```bash
yarn install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Authentication
NEXT_PUBLIC_TOKEN_COOKIE_NAME=accessToken
NEXT_PUBLIC_REFRESH_TOKEN_COOKIE_NAME=refreshToken
NEXT_PUBLIC_TOKEN_EXPIRES_IN=7
NEXT_PUBLIC_COOKIE_DOMAIN=localhost
NEXT_PUBLIC_COOKIE_SECURE=false
NEXT_PUBLIC_COOKIE_SAME_SITE=lax
```

### 4. Start Development Server
```bash
yarn dev
```

The application will be available at `http://localhost:3000`

## 👤 Demo Credentials

### Seller Account
```
Email: seller@example.com
Password: password123
```

### Test Features
- **Email Verification**: Use code `1234` for testing
- **Password Reset**: Use code `1234` for testing
- **All API endpoints**: Mock data for demonstration

## 📚 API Documentation

### Authentication Endpoints
```
POST /auth/login - Seller login
POST /auth/logout - Seller logout
POST /auth/forgot-password - Request password reset
POST /auth/reset-password - Reset password
GET /auth/verify-email - Verify email address
GET /auth/user-info - Get user profile
POST /auth/refresh - Refresh access token
```

### Product Management
```
GET /seller/products - Get product list
POST /seller/products - Create new product
GET /seller/products/:id - Get product details
PUT /seller/products/:id - Update product
DELETE /seller/products/:id - Delete product
PUT /seller/products/:id/toggle-status - Toggle product status
POST /seller/products/:id/upload-image - Upload product image
DELETE /seller/products/:id/images/:imageKey - Delete product image
POST /seller/products/import - Import products from file
GET /seller/products/export - Export products data
```

### Order Management
```
GET /seller/orders - Get order list
GET /seller/orders/:id - Get order details
PUT /seller/orders/:id/status - Update order status
PUT /seller/orders/:id/notes - Update order notes
GET /seller/orders/attention/required - Get orders requiring attention
GET /seller/orders/analytics/revenue - Get revenue analytics
```

### Campaign Management
```
GET /seller/campaigns - Get campaign list
POST /seller/campaigns - Create new campaign
GET /seller/campaigns/:id - Get campaign details
PUT /seller/campaigns/:id - Update campaign
DELETE /seller/campaigns/:id - Delete campaign
PUT /seller/campaigns/:id/toggle-status - Toggle campaign status
POST /seller/campaigns/:id/image - Upload campaign image
```

### Profile Management
```
GET /seller/profile - Get seller profile
PUT /seller/profile - Update seller profile
POST /seller/profile/logo - Upload logo
DELETE /seller/profile/logo - Delete logo
PUT /seller/profile/toggle-active - Toggle profile status
```

### Dashboard Analytics
```
GET /seller/dashboard/stats - Get dashboard statistics
GET /seller/dashboard/activities - Get recent activities
GET /seller/dashboard/charts - Get chart data
GET /seller/dashboard/performance - Get performance metrics
```

## 🏗 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages
│   └── (dashboard)/       # Dashboard pages
├── components/            # Reusable UI components
│   ├── auth/             # Authentication components
│   ├── campaigns/        # Campaign management components
│   ├── layout/           # Layout components
│   ├── orders/           # Order management components
│   ├── products/         # Product management components
│   ├── profile/          # Profile management components
│   └── ui/               # Base UI components
├── features/             # Redux slices and state management
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries and configurations
├── services/             # API service functions
├── store/                # Redux store configuration
├── types/                # TypeScript type definitions
└── utils/                # Utility functions and validations
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
1. Build the application:
   ```bash
   yarn build
   ```

2. Start production server:
   ```bash
   yarn start
   ```

### Environment Variables for Production
```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com
NEXT_PUBLIC_COOKIE_DOMAIN=your-domain.com
NEXT_PUBLIC_COOKIE_SECURE=true
```

## 🧪 Testing

### Run Linting
```bash
yarn lint
```

### Run Type Checking
```bash
yarn type-check
```

### Build for Production
```bash
yarn build
```

## 📝 Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow ESLint configuration
- Use Prettier for code formatting
- Write JSDoc comments for functions and components

### Component Structure
- Use functional components with hooks
- Implement proper error boundaries
- Follow accessibility guidelines
- Use shadcn/ui components when possible

### State Management
- Use Redux Toolkit for global state
- Use React Hook Form for form state
- Use local state for component-specific data

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation for common issues

## 🔄 Version History

- **v1.0.0** - Initial release with core seller management features
- **v1.1.0** - Added campaign management and advanced analytics
- **v1.2.0** - Enhanced UI/UX and performance improvements

---

**Note**: This is a seller-focused application. For customer-facing features, see the main Playable Factory application. 