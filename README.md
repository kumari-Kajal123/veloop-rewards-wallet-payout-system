# VELoop Rewards Wallet & Payout System

A full-stack rewards wallet and payout management system built using React.js, Node.js, Express.js and MongoDB.

## Features

### Authentication
- User registration
- User login
- JWT authentication
- Role-based authorization
- User and Admin roles

### Wallet Management
- VEs
- SVEs
- Gems
- Tokens
- Spins
- Wallet balance
- Wallet summary
- Wallet transaction history
- Admin wallet credit
- Admin wallet debit

### Withdrawal System
- Payout methods
- Payout options
- Withdrawal requests
- Withdrawal history
- Withdrawal details
- Idempotency protection
- Insufficient balance validation
- Atomic wallet operations
- Withdrawal rejection
- Balance restoration after rejection

### Admin Dashboard
- View withdrawal requests
- Reject withdrawal requests
- Credit user wallet
- Debit user wallet
- View withdrawal status

### Security
- JWT authentication
- Protected APIs
- Admin authorization
- User data isolation
- Duplicate withdrawal protection
- MongoDB transactions for critical wallet operations

## Tech Stack

### Frontend
- React.js
- React Router
- Axios
- Tailwind CSS
- React Icons

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt

## Project Structure

veloop/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── services/
│   ├── API_DOCUMENTATION.md
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   ├── index.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── Pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
└── README.md

## Environment Variables

Create a `.env` file in the backend:

PORT=5000
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

## Installation

### Backend

cd backend
npm install
npm run dev

### Frontend

cd frontend
npm install
npm run dev

## API Base URL

http://localhost:5000/api

## Main API Modules

### Authentication

POST /api/auth/register
POST /api/auth/login
GET /api/auth/me

### Wallet

GET /api/wallet
GET /api/wallet/transactions
GET /api/wallet/summary

POST /api/wallet/credit
POST /api/wallet/debit

### Payout

GET /api/payout/methods
GET /api/payout/options/:method

### Withdrawals

POST /api/withdrawals
GET /api/withdrawals
GET /api/withdrawals/:id

### Admin

GET /api/withdrawals/admin
PATCH /api/withdrawals/:id/reject

## Testing

The following scenarios were tested:

- Successful user registration
- Successful login
- Protected API access
- Admin authorization
- Wallet credit
- Wallet debit
- Wallet transaction creation
- Successful withdrawal
- Insufficient balance
- Invalid payout option
- Duplicate withdrawal request
- User isolation
- Admin withdrawal management
- Withdrawal rejection
- Wallet balance restoration after rejection

## Security Notes

- JWT tokens are required for protected APIs.
- Wallet access is based on the authenticated user.
- Users cannot access another user's wallet through the wallet APIs.
- Admin wallet operations require Admin authorization.
- Withdrawal operations use idempotency protection.
- Critical wallet operations use MongoDB transactions.

## Author

Kajal Kumari

Full Stack Developer | MERN Stack