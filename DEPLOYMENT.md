# E-commerce Backend API

## Environment Setup

Copy the environment variables from `.env.production.local` to your Vercel project settings:

### Required Environment Variables

```
NODE_ENV=production
DB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=1d
JWT_REFRESH_EXPIRES_IN=7d
EMAIL_PASSWORD=your_email_password
EMAIL_ACCOUNT=your_email_account
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLOUDINARY_NAME=your_cloudinary_name
VNP_TMN_CODE=your_vnpay_tmn_code
VNP_HASH_SECRET=your_vnpay_hash_secret
VNP_URL=your_vnpay_url
VNP_RETURN_URL=your_vnpay_return_url
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
WEAVIATE_API_KEY=your_weaviate_api_key
WEAVIATE_URL=your_weaviate_url
REDIS_URL=your_redis_url
OPENAI_API_KEY=your_openai_api_key
```

## Deployment Instructions

1. Install Vercel CLI: `npm i -g vercel`
2. Login to Vercel: `vercel login`
3. Deploy: `vercel --prod`

## API Endpoints

- `/api/v1/auth` - Authentication
- `/api/v1/users` - User management
- `/api/v1/category` - Categories
- `/api/v1/brand` - Brands
- `/api/v1/product` - Products
- `/api/v1/cart` - Shopping cart
- `/api/v1/order` - Orders
- `/api/v1/checkout` - Checkout
- `/api/v1/address` - Addresses
- `/api/v1/coupon` - Coupons
- `/api/v1/admin` - Admin functions
- `/api/v1/wishlist` - Wishlist
