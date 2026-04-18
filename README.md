# DryClean Pro - Order Management System

A lightweight, real-time order management system built for dry cleaning stores.

## 🔹 Features Implemented
- **Order Creation**: Capture customer details and multiple garments with custom quantities and prices.
- **Real-time Tracking**: Orders update instantly across all connected clients using Firestore.
- **Status Management**: Track orders through `RECEIVED`, `PROCESSING`, `READY`, and `DELIVERED`.
- **Dashboard Analytics**: View total orders, revenue, and status distribution at a glance.
- **Filtering & Search**: Quickly find orders by customer name, phone, or status.
- **Responsive Design**: Fully functional on mobile and desktop.
- **Authentication**: Secure access via Google Login.

## 🔹 Tech Stack
- **Frontend**: React 19, Vite, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui, Lucide Icons
- **Animation**: Motion
- **Backend/DB**: Firebase (Firestore, Auth)

## 🔹 Setup Instructions
1. **Clone the repository** (if applicable).
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Run the development server**:
   ```bash
   npm run dev
   ```
4. **Build for production**:
   ```bash
   npm run build
   ```

## 🔹 API Collection / Demo
### Available Options:
- **Postman Collection**: Import the API endpoints from [Postman workspace](#) to test REST APIs directly.
- **Simple UI**: The built-in web interface at `http://localhost:5173` provides a complete management dashboard for creating, tracking, and updating orders.


### Key API Endpoints:
- `GET /api/health` - Health check
- `GET /api/orders` - Retrieve all orders
- `GET /api/orders/:id` - Retrieve specific order
- `POST /api/orders` - Create new order (handled via Firestore in client)
- `PUT /api/orders/:id` - Update order status (handled via Firestore in client)

## 🔹 AI Usage Report
## Tools Used
- **shadcn/ui**: For high-quality, accessible UI components.
- **Tailwind CSS**: For rapid styling.
- **Firebase/Firestore**: For real-time data persistence.

## Where AI Helped
- Rapidly generating the boilerplate for React components.
- Setting up the Firestore security rules and data models.
- Speeding up overall development significantlySpeeding up overall development significantly

## Where I (the Agent) had to Fix/Improve
- Ensuring strict type safety across the application.
- Handling real-time updates correctly with `onSnapshot`.
- Implementing complex filtering logic for the order list.
- Designing the "Garment Selection" UI to be intuitive and user-friendly.
- Type safety was inconsistent


## 🔹 Tradeoffs & Future Improvements
- **Tradeoff**: Used Firestore for speed of development and real-time features over a traditional SQL database.
- **Improvement**: Add SMS notifications for customers when orders are `READY`.
- **Improvement**: Implement a more robust inventory management system for cleaning supplies.
- **Improvement**: Add printable receipts/invoices.
