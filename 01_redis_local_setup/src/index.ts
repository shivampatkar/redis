import express, { Request, Response } from "express";
import Redis from "ioredis";
import mongoose from "mongoose";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// 1. Initialize Redis Client
const redis = new Redis({
  host: "127.0.0.1",
  port: 6379,
  lazyConnect: false,
  maxRetriesPerRequest: 3,
});

redis.on("connect", () => {
  console.log("Connected to Redis server successfully.");
});

redis.on("error", (err) => {
  console.error("Redis connection error:", err.message);
});

// 2. Initialize MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/mydatabase";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB server successfully.");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
  });

// Root Route
app.get("/", (req: Request, res: Response) => {
  res.json({
    status: "ok",
    message: "Redis & MongoDB Local Setup Service",
    endpoints: {
      redisPing: "GET /redis-ping",
      mongoPing: "GET /mongo-ping",
    },
  });
});

// API 1: Redis Ping (async)
app.get("/redis-ping", async (req: Request, res: Response) => {
  try {
    const startTime = Date.now();
    const result = await redis.ping();
    const durationMs = Date.now() - startTime;

    res.json({
      success: true,
      service: "Redis",
      response: result, // Will return "PONG"
      latency: `${durationMs}ms`,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      service: "Redis",
      message: "Redis ping failed",
      error: error.message,
    });
  }
});

// API 2: MongoDB Ping (async)
app.get("/mongo-ping", async (req: Request, res: Response) => {
  try {
    if (!mongoose.connection.db) {
      throw new Error("MongoDB database is not ready yet.");
    }

    const startTime = Date.now();
    const pingResult = await mongoose.connection.db.admin().ping();
    const durationMs = Date.now() - startTime;

    res.json({
      success: true,
      service: "MongoDB",
      response: pingResult, // Will return { ok: 1 }
      latency: `${durationMs}ms`,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      service: "MongoDB",
      message: "MongoDB ping failed",
      error: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
