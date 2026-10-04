# VELoop Rewards Backend API Documentation

## 1. Base URL

http://localhost:5000

All protected APIs require:

Authorization: Bearer <JWT_TOKEN>

For requests with JSON body:

Content-Type: application/json

# 2. Authentication APIs

### 2.1 Register User

**POST**

/api/auth/register

**Authentication:** Not required

**Request Body:**

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "Test@12345"
}

**Purpose:** Creates a new user and initializes an empty wallet.

### 2.2 Login

**POST**

/api/auth/login

**Authentication:** Not required

**Request Body:**

{
  "email": "test@example.com",
  "password": "Test@12345"
}

**Successful Response:**

{
  "message": "Login successful",
  "token": "<JWT_TOKEN>",
  "user": {
    "id": "<USER_ID>",
    "name": "Test User",
    "email": "test@example.com",
    "role": "USER"
  }
}

The returned JWT token must be used for protected APIs.

## 2.3 Get Current User

**GET**

/api/auth/me

**Authentication:** Required

**Header:**

Authorization: Bearer <JWT_TOKEN>

**Purpose:** Returns the currently authenticated user's information.


# 3. Wallet APIs

## 3.1 Get Wallet

**GET**

/api/wallet

**Authentication:** Required

**Header:**

Authorization: Bearer <JWT_TOKEN>

**Purpose:** Returns the authenticated user's wallet balances.

**Example Response:**

{
  "wallet": {
    "userId": "<USER_ID>",
    "VEs": 17500,
    "SVEs": 0,
    "Gems": 0,
    "Tokens": 0,
    "Spins": 0
  }
}


## 3.2 Get Wallet Transactions

**GET**

/api/wallet/transactions

**Authentication:** Required

Optional query parameters:

?page=1&limit=10

Example:

/api/wallet/transactions?page=1&limit=10


**Purpose:** Returns the authenticated user's wallet transaction history.


## 3.3 Get Wallet Summary

**GET**

/api/wallet/summary

**Authentication:** Required

**Purpose:** Returns the current balances of all supported wallet currencies.

Supported currencies:

VEs
SVEs
Gems
Tokens
Spins


## 3.4 Credit Wallet

**POST**

/api/wallet/credit

**Authentication:** Required

**Authorization:** ADMIN only

**Request Body:**


{
  "userId": "<USER_ID>",
  "currency": "VEs",
  "amount": 100,
  "type": "ADMIN_CREDIT",
  "source": "TEST",
  "description": "Testing wallet credit"
}

**Supported currencies:**

VEs
SVEs
Gems
Tokens
Spins

**Purpose:** Adds currency to a user's wallet.

Every successful wallet credit creates a corresponding ledger transaction.


## 3.5 Debit Wallet

**POST**

/api/wallet/debit

**Authentication:** Required

**Authorization:** ADMIN only

**Request Body:**

{
  "userId": "<USER_ID>",
  "currency": "VEs",
  "amount": 100,
  "type": "ADMIN_DEBIT",
  "source": "TEST",
  "description": "Testing wallet debit"
}

**Purpose:** Deducts currency from a user's wallet.

The API rejects the request when the wallet does not have sufficient balance.


# 4. Payout APIs

## 4.1 Get Payout Methods

**GET**

/api/payout/methods

**Authentication:** Required

**Purpose:** Returns available payout methods.

Example methods may include:

UPI
PAYPAL
AMAZON
GOOGLE_PLAY

Only active payout methods are returned.


## 4.2 Get Payout Options

**GET**

/api/payout/options/:method

Example:

/api/payout/options/UPI

**Authentication:** Required

**Purpose:** Returns active payout options for the selected method.

### UPI Options

| Option   | Payout Value | Required VEs |
| -------- | -----------: | -----------: |
| UPI_10   |          ₹10 |        2,400 |
| UPI_25   |          ₹25 |        5,800 |
| UPI_50   |          ₹50 |       10,000 |
| UPI_100  |         ₹100 |       19,500 |
| UPI_150  |         ₹150 |       28,500 |
| UPI_300  |         ₹300 |       52,500 |
| UPI_500  |         ₹500 |       80,500 |
| UPI_1000 |       ₹1,000 |      150,000 |


# 5. Withdrawal APIs

## 5.1 Create Withdrawal

**POST**

/api/withdrawals

**Authentication:** Required

**Headers:**

Authorization: Bearer <USER_TOKEN>
Content-Type: application/json
Idempotency-Key: <UNIQUE_KEY>

**Request Body:**

{
  "method": "UPI",
  "optionId": "UPI_10",
  "payoutDetails": {
    "upiId": "test@upi"
  }
}

**Example Response:**

{
  "message": "Withdrawal request created successfully",
  "withdrawal": {
    "withdrawalId": "<WITHDRAWAL_ID>",
    "method": "UPI",
    "optionId": "UPI_10",
    "currency": "VEs",
    "currencyAmount": 2400,
    "payoutAmount": 10,
    "status": "PENDING"
  }
}

The required wallet balance is deducted atomically with the withdrawal transaction and ledger entry.


## 5.2 Get My Withdrawals

**GET**

/api/withdrawals

**Authentication:** Required

**Purpose:** Returns withdrawals belonging to the authenticated user.

Optional query parameters:

?page=1&limit=10


## 5.3 Get Withdrawal by ID

**GET**

/api/withdrawals/:id

Example:

/api/withdrawals/<WITHDRAWAL_ID>

**Authentication:** Required

**Purpose:** Returns details of a specific withdrawal.


## 5.4 Admin Get All Withdrawals

**GET**

/api/withdrawals/admin

**Authentication:** Required

**Authorization:** ADMIN only

Optional query parameters:

?page=1&limit=10

Status filtering:

/api/withdrawals/admin?status=PENDING

Supported statuses:

PENDING
PROCESSING
APPROVED
REJECTED
CANCELLED

**Purpose:** Allows administrators to review withdrawal requests.


## 5.5 Admin Reject Withdrawal

**PATCH**

/api/withdrawals/:id/reject

**Authentication:** Required

**Authorization:** ADMIN only

**Request Body:**


{
  "rejectionReason": "Test rejection",
  "reviewNote": "Testing wallet balance restoration"
}

**Purpose:** Rejects a pending withdrawal.

When a withdrawal is rejected:

1. Withdrawal status changes to `REJECTED`.
2. Previously deducted wallet currency is restored.
3. A reversal ledger transaction is created.
4. An audit log is created.

A withdrawal that is already `REJECTED` cannot be rejected again.

---

# 6. Withdrawal Statuses

| Status     | Description                                           |
| ---------- | ----------------------------------------------------- |
| PENDING    | Withdrawal request created and waiting for processing |
| PROCESSING | Withdrawal is being processed                         |
| APPROVED   | Withdrawal has been approved                          |
| REJECTED   | Withdrawal was rejected                               |
| CANCELLED  | Withdrawal was cancelled                              |

---

# 7. Wallet Transaction Types

The wallet ledger supports transaction types including:

REWARD
BONUS
REFERRAL
DAILY_REWARD
AD_REWARD
GAME_REWARD
ADMIN_CREDIT
EXCHANGE_CREDIT
WITHDRAWAL
EXCHANGE_DEBIT
ADMIN_DEBIT
CORRECTION

Each ledger transaction stores:

 transactionId
 userId
 currency
 type
 amount
 balanceBefore
 balanceAfter
 source
 referenceId
 status
 description
 metadata
 timestamps


# 8. Security and Authorization

### Authentication

Protected APIs require a valid JWT:

Authorization: Bearer <JWT_TOKEN>

Invalid or missing authentication returns:

401 Unauthorized

Example:

{
  "message": "Authentication required"
}

### Admin Authorization

Admin-only APIs require a user with:

role: ADMIN

A normal user attempting an admin operation should receive:

403 Forbidden

Example:

{
  "message": "Admin access required"
}

### User Isolation

Wallet and withdrawal APIs use the authenticated user's identity from the JWT.

A user cannot request another user's wallet data by supplying an arbitrary user ID to the wallet read APIs.

# 9. Idempotency

Withdrawal creation requires an idempotency key:

Idempotency-Key: <UNIQUE_KEY>

If the same request is submitted again using the same idempotency key, the existing withdrawal is returned instead of creating another withdrawal.

Example response:

{
  "message": "Duplicate request. Existing withdrawal returned.",
  "withdrawal": {
    "withdrawalId": "<EXISTING_WITHDRAWAL_ID>"
  }
}

This protects against duplicate requests and double-click submissions.

# 10. Atomic Wallet Operations

Wallet credit, wallet debit, and withdrawal operations use MongoDB transactions.

For a wallet mutation:

Wallet Balance Update
        +
Ledger Transaction
        +
Related Database Operations

are handled atomically.

If an operation fails before the transaction is committed, the database changes are rolled back.


# 11. Error Examples

### Invalid Currency

{
  "message": "Invalid currency"
}

### Invalid Payout Option

{
  "message": "Invalid or inactive payout option"
}

### Insufficient Balance

{
  "message": "Insufficient wallet balance"
}

### Missing Authentication

{
  "message": "Authentication required"
}

### Invalid/Expired Token

{
  "message": "Invalid or expired token"
}

### Withdrawal Not Found

{
  "message": "Withdrawal not found"
}


# 12. Testing Completed

The following backend scenarios were tested:

 User registration
 User login
 JWT authentication
 Wallet creation
 Wallet balance retrieval
 Wallet credit
 Wallet debit
 Wallet ledger transaction creation
 Payout methods
 Payout options
 Successful withdrawal
 Wallet balance deduction during withdrawal
 Insufficient wallet balance
 Invalid payout option
 Duplicate withdrawal/idempotency
 Withdrawal rejection
 Wallet balance restoration after rejection
 Admin withdrawal listing
 Admin authorization
 User wallet isolation
 Atomic wallet credit/debit operations


# 13. Example Test Flow

A typical withdrawal flow:

1. User Login
      ↓
2. Get Wallet
      ↓
3. Get Payout Methods
      ↓
4. Get Payout Options
      ↓
5. Create Withdrawal
      ↓
6. Wallet Balance Deducted
      ↓
7. Ledger Transaction Created
      ↓
8. Withdrawal Status = PENDING
      ↓
9. Admin Reviews Withdrawal
      ↓
10. APPROVED / REJECTED
      ↓
11. If REJECTED → Balance Restored

# 14. Base API Structure

/api/auth
/api/wallet
/api/payout
/api/withdrawals

All protected endpoints require JWT authentication.

Admin-only endpoints additionally require the `ADMIN` role.

