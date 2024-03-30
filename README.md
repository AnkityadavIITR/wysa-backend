# Wysa Backend

This is the backend server for the Wysa project, built using Express.js. Wysa is a chatbot application that provides mental health support and resources to users.

## Prerequisites

Before running the Wysa backend server locally, make sure you have the following installed:

- Node.js
- MongoDB

## Getting Started

Follow these steps to run the Wysa backend server locally:

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/yourusername/wysa-backend.git
   ```

2. Navigate to the project directory:

   ```bash
   cd wysa-backend
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create a `.env` file in the root directory of the project and add the following environment variables:

   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=3000
   NODE_ENV=development
   FRONTEND_URI=http://localhost:3000
   ```

   Replace `your_mongodb_connection_string` and `your_jwt_secret` with your MongoDB connection string and JWT secret, respectively.

5. Start the server:

   ```bash
   npm start
   ```

6. The server should now be running locally on port 3000.

## Environment Variables

- `MONGO_URI`: MongoDB connection string.
- `JWT_SECRET`: Secret key for JWT token generation.
- `PORT`: Port on which the server will run.
- `NODE_ENV`: Environment mode (`development` or `production`).
- `FRONTEND_URI`: URL of the frontend application.
