import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dbConnect from "./libs/dbConnect.lib";
import authRoutes from "./routes/auth.routes";
import { initConsumers } from './queues/consumer';

// Load environment variables
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

app.use(cookieParser());

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

// Routes
app.get("/", (req: Request, res: Response) => {
  res.send("Authentication Service is running");
});

app.use("/api/v1", authRoutes);

// Start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await dbConnect();
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
initConsumers();