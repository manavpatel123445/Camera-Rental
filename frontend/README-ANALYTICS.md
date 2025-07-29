# Camera Rental Analytics Dashboard

## Overview

The Camera Rental Analytics Dashboard provides comprehensive insights into user behavior, order patterns, product performance, and cart analytics. The dashboard is designed to help administrators track and analyze all aspects of the rental business.

## Features

### 1. Overview Dashboard
- **Key Metrics Cards**: Display total users, orders, products, and revenue
- **Product Statistics**: Breakdown by category (cameras, lenses, accessories)
- **Recent Activity Feed**: Latest orders and system updates
- **New Products Table**: Recently added products with stock status

### 2. Analytics Tab
- **Monthly Trends**: Order and revenue trends over time
- **User Registration Trends**: New user signups over time
- **Distribution Charts**: 
  - User status distribution (active/disabled)
  - Order status distribution (pending/completed/cancelled)
  - Product category distribution
- **Popular Products**: Most ordered products with revenue data
- **Key Performance Indicators**: Real-time metrics and trends

### 3. Orders Analytics
- **Order Trends**: Daily order patterns and revenue
- **Status Distribution**: Pie chart showing order status breakdown
- **Top Products by Revenue**: Bar chart of highest-earning products
- **Period Filtering**: 7, 30, or 90-day analysis periods
- **Detailed Product Table**: Complete breakdown of product performance

### 4. User Analytics
- **Registration Trends**: Daily user signup patterns
- **User Status Distribution**: Active vs disabled users
- **Top Users**: Most active customers by order count
- **User Performance Table**: Detailed user statistics
- **Revenue from Top Users**: Total spending by best customers

### 5. Cart Analytics
- **Cart Conversion Rate**: Percentage of carts converted to orders
- **Cart Trends**: Additions, removals, and conversions over time
- **Most Saved Products**: Products most frequently added to cart
- **Abandonment Analysis**: Cart abandonment rates and patterns
- **Average Cart Value**: Revenue per cart metrics

## Backend API Endpoints

### Dashboard Analytics
```
GET /api/admin/analytics/dashboard
```
Returns comprehensive dashboard data including:
- User statistics (total, active, disabled)
- Order statistics (total, pending, completed, cancelled)
- Product statistics (total, by category)
- Monthly trends (orders and registrations)
- Popular products
- Most saved products

### Order Analytics
```
GET /api/admin/analytics/orders?period=30
```
Returns order-specific analytics:
- Daily order trends
- Order status distribution
- Top products by revenue
- Period filtering (7, 30, 90 days)

### User Analytics
```
GET /api/admin/analytics/users?period=30
```
Returns user-specific analytics:
- Daily registration trends
- User status distribution
- Top users by order count
- Period filtering (7, 30, 90 days)

## Chart Components

### 1. RentalTrendsChart
- **Purpose**: Overall business trends and key metrics
- **Features**: 
  - Monthly order and revenue trends
  - User registration patterns
  - Distribution charts for users, orders, and products
  - Popular products analysis

### 2. OrdersChart
- **Purpose**: Detailed order analysis
- **Features**:
  - Daily order trends with revenue
  - Order status distribution
  - Top products by revenue
  - Period filtering capabilities

### 3. UserAnalyticsChart
- **Purpose**: User behavior and performance analysis
- **Features**:
  - Registration trends
  - User status distribution
  - Top users by orders
  - User performance metrics

### 4. CartAnalyticsChart
- **Purpose**: Cart behavior and conversion analysis
- **Features**:
  - Cart conversion rates
  - Cart trends (additions, removals, conversions)
  - Most saved products
  - Abandonment analysis

## Data Structure

### Dashboard Analytics Response
```typescript
{
  users: {
    total: number;
    active: number;
    disabled: number;
  };
  orders: {
    total: number;
    pending: number;
    completed: number;
    cancelled: number;
  };
  products: {
    total: number;
    cameras: number;
    lenses: number;
    accessories: number;
  };
  trends: {
    monthlyOrders: Array<{
      _id: { year: number; month: number };
      count: number;
      totalRevenue: number;
    }>;
    monthlyRegistrations: Array<{
      _id: { year: number; month: number };
      count: number;
    }>;
  };
  popularProducts: Array<{
    name: string;
    category: string;
    orderCount: number;
    totalRevenue: number;
    image?: string;
  }>;
  mostSavedProducts: Array<{
    name: string;
    category: string;
    pricePerDay: number;
    saveCount: number;
    image?: string;
  }>;
}
```

## Usage Instructions

### For Administrators

1. **Access Dashboard**: Navigate to the admin dashboard
2. **Select Tab**: Choose between Overview, Analytics, Orders, Users, or Cart
3. **Filter Data**: Use period selectors to analyze different time ranges
4. **View Charts**: Interactive charts provide detailed insights
5. **Export Data**: Tables can be used for further analysis

### Key Metrics to Monitor

1. **Conversion Rate**: Cart to order conversion percentage
2. **User Growth**: Daily registration trends
3. **Product Performance**: Most popular and profitable items
4. **Order Status**: Pending vs completed order ratios
5. **Revenue Trends**: Monthly revenue patterns

## Technical Implementation

### Frontend Dependencies
- **Recharts**: Chart library for data visualization
- **React**: Component framework
- **TypeScript**: Type safety and development experience

### Backend Dependencies
- **MongoDB**: Database with aggregation pipelines
- **Express.js**: API framework
- **JWT**: Authentication for admin access

### Chart Types Used
- **Area Charts**: For trends over time
- **Bar Charts**: For comparisons and rankings
- **Pie Charts**: For distribution analysis
- **Line Charts**: For continuous data trends
- **Composed Charts**: For multiple metrics on same chart

## Future Enhancements

1. **Real-time Updates**: WebSocket integration for live data
2. **Export Functionality**: PDF/Excel export of charts and data
3. **Advanced Filtering**: Date range pickers and custom filters
4. **Predictive Analytics**: Machine learning for trend prediction
5. **Mobile Responsiveness**: Optimized charts for mobile devices
6. **Custom Dashboards**: User-configurable dashboard layouts

## Troubleshooting

### Common Issues

1. **Charts Not Loading**: Check API endpoint availability and authentication
2. **Data Not Updating**: Verify backend data aggregation is working
3. **Performance Issues**: Consider pagination for large datasets
4. **Authentication Errors**: Ensure admin token is valid and not expired

### Development Notes

- All charts are responsive and adapt to container size
- Data is cached to improve performance
- Error boundaries handle API failures gracefully
- Loading states provide user feedback during data fetching

## Security Considerations

- All analytics endpoints require admin authentication
- Data is filtered by user permissions
- Sensitive user data is anonymized in analytics
- API rate limiting prevents abuse

This analytics dashboard provides comprehensive insights into the camera rental business, helping administrators make data-driven decisions to improve performance and user experience. 