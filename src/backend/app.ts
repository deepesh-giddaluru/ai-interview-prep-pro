import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import { apiRouter } from "./routes/api";
import authRoutes from "./routes/auth";
import interviewRoutes from "./routes/interviews";
import dataRoutes from "./routes/data";
import adminRoutes from "./routes/admin";
import profileRoutes from "./routes/profile";
import connectDB from "./config/database";
import { seedAdminAccount } from "./utils/seedAdmin";

export function createApp() {
  const app = express();
  const httpServer = createServer(app);

  // Socket.IO setup
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:3000",
      credentials: true,
    },
  });

  // Connect to MongoDB and seed admin account
  connectDB().then(() => {
    // Create default admin account on startup
    seedAdminAccount();
  }).catch((error) => {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  });

  // CORS configuration
  const corsOptions = {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
    optionsSuccessStatus: 200,
  };

  app.use(cors(corsOptions));

  // Body parser
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // Cookie parser
  app.use(cookieParser());

  // Socket.IO connection handling
  const onlineUsers = new Map<string, any>();

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("user-online", (userData) => {
      onlineUsers.set(socket.id, userData);
      io.emit("online-users-count", onlineUsers.size);
      io.emit("online-users", Array.from(onlineUsers.values()));
    });

    socket.on("disconnect", () => {
      onlineUsers.delete(socket.id);
      io.emit("online-users-count", onlineUsers.size);
      io.emit("online-users", Array.from(onlineUsers.values()));
      console.log("User disconnected:", socket.id);
    });

    socket.on("interview-started", (data) => {
      io.emit("live-interview-activity", data);
    });
  });

  // Make io accessible to routes
  app.set("io", io);

  // Serve static files from uploads directory
  app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

  // API Routes
  app.use("/api", apiRouter); // Existing AI routes
  app.use("/api/auth", authRoutes); // Authentication routes
  app.use("/api/interviews", interviewRoutes); // Interview routes
  app.use("/api", dataRoutes); // Data routes (roadmaps, resume, progress, dashboard)
  app.use("/api/admin", adminRoutes); // Admin routes
  app.use("/api/profile", profileRoutes); // Profile routes

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({
      success: true,
      message: "Server is running",
      database: "MongoDB connected",
      onlineUsers: onlineUsers.size,
    });
  });

  // Error handler
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
      success: false,
      error: err.message || "Server Error",
    });
  });

  // Return both the HTTP server and Express app
  return { httpServer, app };
}

// Made with Bob
