# InRand – Smart Groundwater Drilling Service Platform

## Overview
InRand is a full-stack platform that connects customers who need borewell and groundwater drilling services with verified borewell drilling owners/contractors. It provides a simple flow: customers can request a service, and verified contractors can accept and update the status of those requests.

The platform is divided into four distinct parts:
1. **Landing Page**: A static vanilla HTML/CSS/JS entry point for all users.
2. **Customer App**: A React application for customers to book and track services.
3. **Owner App**: An Angular application for contractors to view and manage their jobs.
4. **Backend**: A Node.js/Express REST API serving both frontend applications.

## Tech Stack
- **Frontend (Landing)**: HTML5, CSS3, Vanilla JS
- **Frontend (Customer)**: React, React Router, Context API
- **Frontend (Owner)**: Angular, Angular Router, RxJS
- **Backend**: Node.js, Express.js, MongoDB (Mongoose)
- **Auth**: JWT, bcrypt, server-side OTP generation via Nodemailer (mocked in console)

## Styling & Design
- **Primary Color**: `#0B72B9` (Deep Blue)
- **Accent Color**: `#14B8A6` (Teal)
- All frontends share this consistent color palette and typography for a unified brand experience.

## Folder Structure
```text
InRand/
  README.md
  backend/           (Node.js + Express API)
  landing/           (Vanilla HTML/CSS/JS Landing Page)
  customer-app/      (React Customer Portal)
  owner-app/         (Angular Owner Portal)
```

## Setup & Run Instructions

### 1. Backend (API)
The backend runs on port `5000` by default.
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```
   *Make sure MongoDB is running and update `MONGO_URI` if necessary.*
4. Start the server:
   ```bash
   npm start
   ```

### 2. Landing Page
The landing page does not require a build step or development server, but can be served with any static server.
1. Navigate to the landing directory:
   ```bash
   cd landing
   ```
2. Open `index.html` in your browser directly, or serve it:
   ```bash
   npx serve .
   ```

### 3. Customer App (React)
The customer app runs on port `3000` by default.
1. Navigate to the customer app directory:
   ```bash
   cd customer-app
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

### 4. Owner App (Angular)
The owner app runs on port `4200` by default.
1. Navigate to the owner app directory:
   ```bash
   cd owner-app
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run start
   ```

---

## Authentication Flow
1. Users register by selecting their role (Customer/Owner).
2. The backend generates a 6-digit OTP, which is logged to the server console (and optionally emailed via SMTP).
3. The user enters the OTP in the respective app to verify their account.
4. After successful verification and login, a JWT is issued and stored in the browser.
