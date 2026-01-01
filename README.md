# Headphones E-Commerce Platform

A full-stack e-commerce application built with Next.js 16, TypeScript, MongoDB, and Razorpay payments.

## Features

- **Modern UI**: Clean, responsive design cloned from the reference headphones website
- **Authentication**: Secure JWT-based authentication with bcrypt password hashing
- **Product Catalog**: Dynamic product listing fetched from MongoDB
- **Shopping Cart**: Client-side cart with localStorage persistence
- **Checkout Flow**: Complete checkout process with shipping information
- **Payment Integration**: Razorpay payment gateway with signature verification
- **Order Management**: User dashboard to view order history
- **Protected Routes**: Middleware-based route protection
- **Responsive Design**: Mobile-first design with Tailwind CSS

## Tech Stack

### Frontend
- **Next.js 16** (App Router)
- **React 19.2**
- **TypeScript**
- **Tailwind CSS v4**
- **shadcn/ui** components
- **Zustand** for state management
- **React Hook Form** + **Zod** for form validation

### Backend
- **Next.js API Routes**
- **MongoDB Atlas** with Mongoose ODM
- **JWT** for authentication
- **bcrypt** for password hashing
- **Razorpay** for payments

## Environment Variables

Create a `.env.local` file in the root directory:

```env
# MongoDB Atlas Connection
MONGODB_URI=your_mongodb_atlas_connection_string

# JWT Secret (minimum 32 characters)
JWT_SECRET=your_secure_jwt_secret_key_here

# Razorpay Credentials
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret_key
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Setup Instructions

1. **Clone the repository**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Copy `.env.local.example` to `.env.local`
   - Fill in your MongoDB, JWT, and Razorpay credentials

4. **Seed the database**
   ```bash
   npm run seed
   ```
   This will populate your MongoDB database with sample headphone products.

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Database Schema

### User
- `name`: String
- `email`: String (unique)
- `password`: String (hashed)
- `role`: "user" | "admin"

### Product
- `title`: String
- `description`: String
- `images`: Array of image URLs
- `price`: Number
- `originalPrice`: Number (optional)
- `stock`: Number
- `category`: String
- `color`: String
- `featured`: Boolean

### Order
- `user`: Reference to User
- `items`: Array of order items
- `totalAmount`: Number
- `paymentStatus`: "pending" | "completed" | "failed"
- `orderStatus`: "processing" | "shipped" | "delivered" | "cancelled"
- `shippingAddress`: Object

### Payment
- `order`: Reference to Order
- `razorpayOrderId`: String
- `razorpayPaymentId`: String
- `razorpaySignature`: String
- `amount`: Number
- `currency`: String
- `status`: "created" | "authorized" | "captured" | "failed"

## API Routes

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/[id]` - Get single product
- `POST /api/products` - Create product (admin)

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order

### Payments
- `POST /api/payments/create-order` - Create Razorpay order
- `POST /api/payments/verify` - Verify Razorpay payment

## Security Features

- **Password Hashing**: Bcrypt with salt rounds
- **JWT Tokens**: HTTP-only cookies
- **Route Protection**: Middleware-based authentication
- **Payment Verification**: Razorpay signature validation
- **Input Validation**: Zod schemas
- **SQL Injection Prevention**: Mongoose parameterized queries

## Project Structure

```
├── app/
│   ├── api/          # API routes
│   ├── cart/         # Cart page
│   ├── checkout/     # Checkout page
│   ├── login/        # Login page
│   ├── orders/       # Orders pages
│   ├── products/     # Products page
│   ├── profile/      # Profile page
│   ├── register/     # Register page
│   └── page.tsx      # Home page
├── components/
│   ├── sections/     # Page sections
│   ├── ui/          # UI components
│   ├── header.tsx
│   └── footer.tsx
├── hooks/           # Custom React hooks
├── lib/            # Utility functions
├── models/         # MongoDB models
├── scripts/        # Database seed scripts
└── types/          # TypeScript types
```

## Deployment

This application is ready to be deployed on Vercel:

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

## License

MIT

## Support

For issues or questions, please open an issue on the GitHub repository.
