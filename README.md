# Praktis Auth Service

Authentication service for the Praktis application.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3001
   MONGODB_URI=mongodb://localhost:27017/praktis
   JWT_SECRET=your_jwt_secret
   SALT_ROUNDS=10
   NODE_ENV=development
   ```

## Scripts

- **Build the application**:
  ```
  npm run build
  ```
  This compiles TypeScript files to JavaScript in the `/dist` directory.

- **Start the production server**:
  ```
  npm start
  ```
  Runs the compiled JavaScript from the `/dist` directory.

- **Start development server with hot-reload**:
  ```
  npm run dev
  ```
  Runs the application with nodemon and ts-node for development.

- **Run tests**:
  ```
  npm test
  ```
  Executes Jest tests for the application.

## API Endpoints

### Authentication

- **POST /api/auth/signup** - Register a new user
- **POST /api/auth/login** - Authenticate a user 