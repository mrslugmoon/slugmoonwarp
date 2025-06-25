// server/index.ts
import express, { type Request, Response, NextFunction } from "express";
import cors from "cors";
import { registerRoutes } from "./routes";
// Keep log here as it's used conditionally in the dev block, or move it.
import { log } from "./vite"; // Keep this import for the conditional 'log' calls

// Do NOT import setupVite and serveStatic at the top level if they are only used conditionally
// import { setupVite, serveStatic } from "./vite"; // <-- REMOVE or comment out these top-level imports if they're not used elsewhere
                                                  // They will be dynamically imported below.

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true
}));

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

registerRoutes(app);

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  console.error("API Error:", err);
  res.status(status).json({ message });
});

// IMPORTANT: Export the Express app instance for Vercel
export default app;

// --- Local Development Server Setup (ONLY for running locally) ---
if (process.env.NODE_ENV === "development") {
  // Use dynamic imports here
  (async () => {
    try {
      // Dynamically import 'http' and 'vite' related functions
      const { createServer } = await import("http");
      const { setupVite, serveStatic } = await import("./vite"); // Assuming vite.ts exports these

      const localServer = createServer(app);

      // Importantly, setupVite should also be conditional
      await setupVite(app, localServer);

      // This block is for local development only
      const port = 5000;
      localServer.listen({
        port,
        host: "0.0.0.0",
        reusePort: true,
      }, () => {
        log(`serving on port ${port}`);
      });
    } catch (e) {
      console.error("Error starting local development server:", e);
    }
  })();
}

export defualt app;
