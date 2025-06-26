import express, { type Request, Response, NextFunction } from "express";
import cors from "cors";
import { registerRoutes } from "./routes";
import { log } from "./vite"; // Keep this import for the conditional 'log' calls

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS setup for all origins (be cautious in production)
app.use(cors({
  origin: '*',  // You might want to restrict origins in production
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true
}));

// Middleware to log requests and responses
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }
      log(logLine);
    }
  });
  next();
});

// Register API routes
registerRoutes(app);

// Global error handling middleware
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  console.error("API Error:", err);
  res.status(status).json({ message });
});

// --- Local Development Server Setup (ONLY for running locally) ---
if (process.env.NODE_ENV === "development") {
  (async () => {
    try {
      const { createServer } = await import("http");
      const { setupVite, serveStatic } = await import("./vite");

      const localServer = createServer(app);

      await setupVite(app, localServer);

      const port = Number(process.env.PORT) || 5000;
      localServer.listen({ port, host: "0.0.0.0", reusePort: true }, () => {
        log(`Serving on port ${port}`);
      });
    } catch (e) {
      console.error("Error starting local development server:", e);
    }
  })();
} else {
  // Production environment setup: Make server publicly accessible
  const port = process.env.PORT || 5000;
  const host = "0.0.0.0";  // Listen on all available interfaces
  app.listen(port, host, () => {
    console.log(`App is running on port ${port}`);
  });
}

export default app; // Export app for Vercel or other cloud platforms
