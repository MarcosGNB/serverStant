# VapoStant - Server (API)

This is the backend API for the VapoStant management system.

## Features

- **Store/Branch Management**: CRUD for inventory locations.
- **Product Management**: Global product catalog with per-branch stock mapping.
- **Sales & Restocks Tracking**: Complete history of movements with profit calculation.
- **Reporting Endpoints**: Summary and detailed analytics by date and location.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Atlas)
- **Object Modeling**: Mongoose
- **CORS**: Enabled for frontend integration.

## Getting Started

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with:
   - `MONGO_URI`: Your MongoDB connection string.
   - `PORT`: (Optional) default 5000.
4. Run the development server:
   ```bash
   npm run dev
   ```

## API Routes

- `/api/stantes`: Manage branches.
- `/api/products`: Manage products.
- `/api/sales`: Manage sales history.
- `/api/restocks`: Manage inventory replenishment.
- `/api/reports`: Advanced analytics.
