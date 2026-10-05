const express = require("express");
const cors = require("cors");
const dbConnection = require("./client/dbConnection");

const app = express();
const PORT = process.env.PORT || 5000;

// Behind nginx: trust the X-Forwarded-* headers (real client IP, protocol)
app.set("trust proxy", 1);

app.use(express.json());

// CORS only matters when the browser calls the API directly (Vite dev server).
// Behind nginx everything is same-origin, so this is not used in Docker.
app.use(
  cors({
    origin: (process.env.CORS_ORIGIN || "http://localhost:5173,http://127.0.0.1:5173").split(","),
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Health check (used by the Docker healthcheck, not exposed through nginx)
app.get("/health", (req, res) => res.status(200).json({ status: "ok" }));

// Routes
app.use("/api/v1/auth", require("./routes/user"));

// 404 for unknown routes
app.use((req, res) => res.status(404).json({ message: "Not found" }));

// Central error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

// Connect to the DB first, then start listening
const start = async () => {
  try {
    await dbConnection();

    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    // Graceful shutdown: Docker sends SIGTERM on `docker compose down`
    const shutdown = (signal) => {
      console.log(`${signal} received, shutting down`);
      server.close(() => process.exit(0));
    };
    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1); // let Docker restart the container
  }
};

start();