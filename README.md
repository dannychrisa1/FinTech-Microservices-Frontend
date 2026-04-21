# 💳 SmartWallet - FinTech Mobile App

## 📱 Overview

SmartWallet is a **production-ready fintech mobile application** built with React Native (Expo) that provides secure banking services including user authentication, passcode protection, transaction management, and Paystack payment integration.

## ✨ Features

### 🔐 Authentication & Security

| Feature                    | Description                                   |
| -------------------------- | --------------------------------------------- |
| **JWT Authentication**     | Secure token-based authentication             |
| **OTP Email Verification** | 6-digit code verification for new users       |
| **Passcode Login**         | 6-digit passcode for quick mobile access      |
| **App Lock**               | Automatic locking when app goes to background |
| **Session Management**     | Passcode verification on app reopen           |
| **Secure Storage**         | JWT tokens stored in Expo SecureStore         |

### 💰 Payments & Transactions

| Feature                      | Description                             |
| ---------------------------- | --------------------------------------- |
| **Paystack Integration**     | In-app payment processing               |
| **Multiple Payment Methods** | Card, Bank Transfer, USSD, Mobile Money |
| **Deposit Funds**            | Add money to wallet instantly           |
| **Withdraw Funds**           | Withdraw to external bank accounts      |
| **Send Money**               | Instant peer-to-peer transfers          |
| **Transaction History**      | Filterable, paginated transaction list  |

### 👤 Account Management

| Feature                 | Description                         |
| ----------------------- | ----------------------------------- |
| **User Profile**        | View account details and balance    |
| **Passcode Management** | Create, update, or disable passcode |
| **Pull to Refresh**     | Manual refresh on all lists         |

## 📦 Installation

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI
- iOS Simulator (Xcode) or Android Emulator (Android Studio)

### Setup

```bash
# Clone the repository
git clone https://github.com/dannychrisa1/FinTech-Microservices-Frontend.git
cd Smart-wallet

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start the development server
npx expo start

### Environment Variables

# API Configuration
EXPO_PUBLIC_API_URL=http://localhost:3000

# Paystack Configuration
EXPO_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_xxxxxxxxxxxxx
```
