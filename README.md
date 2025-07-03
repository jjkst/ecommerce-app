# E-commerce Application

A modern Angular-based e-commerce platform with authentication, product management, shopping cart, and scheduling features.

## 🚀 Features

### Core Features
- **Product Catalog**: Browse and view product details
- **Shopping Cart**: Add/remove items and manage cart
- **User Authentication**: Google OAuth integration
- **Admin Panel**: Service management for administrators
- **Scheduling System**: Appointment booking and management
- **Responsive Design**: Mobile-first approach

### User Roles
- **Admin**: Full access to service management
- **Owner**: Business management capabilities  
- **Subscriber**: Standard user with shopping features

## 🛠️ Tech Stack

- **Frontend**: Angular 20
- **UI Framework**: Angular Material
- **Authentication**: Firebase Auth
- **Styling**: SCSS
- **Testing**: Jasmine & Karma
- **SSR**: Angular Universal

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- Angular CLI (v20)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ecommerce-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Create a Firebase project
   - Enable Google Authentication
   - Update environment configuration

4. **Start development server**
   ```bash
   npm start
   ```

5. **Open browser**
   Navigate to `http://localhost:4200`

## 📁 Project Structure

```
src/app/
├── components/
│   ├── login/           # Authentication
│   ├── product-list/    # Product catalog
│   ├── product-detail/  # Product details
│   ├── shopping-cart/   # Cart management
│   ├── schedule-manager/ # Appointment booking
│   ├── service-manager/ # Admin service management
│   └── navigation/      # Navigation bar
├── models/              # TypeScript interfaces
├── services/            # Business logic
└── routes/              # Application routing
```

## 🔐 Authentication

The app uses Firebase Authentication with:
- Google OAuth provider
- User role management
- Session persistence

## 🛍️ Shopping Features

- Product browsing and search
- Add/remove items from cart
- Cart persistence
- Checkout process

## 📅 Scheduling System

- Create appointments
- Select services and time slots
- Add notes to bookings
- Manage availability

## 🎨 Styling

- Angular Material components
- SCSS preprocessing
- Responsive design
- Azure Blue theme

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 🚀 Deployment

```bash
# Build for production
npm run build

# Build with SSR
npm run build:ssr
```

## 📱 Browser Support

- Chrome, Firefox, Safari, Edge (latest versions)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes and add tests
4. Submit a pull request

## SQL Scripts
source /path/sql-scripts/CreateAvailabilityTable.sql;
source /path/sql-scripts/CreateServiceTable.sql;
source /path/sql-scripts/CreateScheduleTable.sql;
source /path/sql-scripts/CreateUserTable.sql;
