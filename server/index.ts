// server/index.ts
import express, { type Request, Response, NextFunction } from "express";
import cors from "cors"; // Add CORS middleware
import { registerRoutes } from "./routes";
// You might not need setupVite and serveStatic imports in the production build for Vercel
// However, keep them if your local 'dev' script relies on this single file.
// If you uncomment the local dev server block, you'll need them.
import { setupVite, serveStatic, log } from "./vite"; // Keep for local development server

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Add CORS middleware to your Express app
// For production, replace '*' with your actual Vercel deployment URL
// E.g., origin: ['https://your-app.vercel.app', 'http://localhost:5000']
app.use(cors({
  origin: '*', // Allow all origins for now. Refine for production security.
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true // If your app uses cookies/sessions
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

      log(logLine); // Ensure 'log' is available or replace with console.log
    }
  });

  next();
});

// Register your API routes (this should happen regardless of environment)
// It's better to register routes synchronously if possible, or ensure
// registerRoutes is not dependent on 'server.listen' for its setup.
// If registerRoutes returns a server instance that then listens,
// you need to adapt it.
// Assuming registerRoutes just configures 'app' and doesn't implicitly start a server:
registerRoutes(app); // Call registerRoutes directly on 'app'

// Global error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  console.error("API Error:", err); // Log the error for Vercel runtime logs
  res.status(status).json({ message });
  // Do NOT throw err here, as it can crash the serverless function.
  // Just send the response.
});

// IMPORTANT: Export the Express app instance for Vercel to use as a serverless function
export default app;

// --- Local Development Server Setup (ONLY for running locally, NOT for Vercel) ---
// This entire block should ideally be wrapped in an `if (process.env.NODE_ENV !== 'production')`
// or moved to a separate 'dev-server.ts' file if your project gets more complex.
if (process.env.NODE_ENV === "development") {
  // We explicitly import createServer from 'http' for the local dev server
  import { createServer } from "http";

  (async () => {
    // The 'server' from registerRoutes might be an http.Server instance.
    // If registerRoutes also handles starting the server, adjust accordingly.
    // For local dev, let's just make sure 'app' is the handler for createServer.
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
  })();
}

// Ensure 'registerRoutes' is designed to configure 'app' and not start its own server listener.
// If 'registerRoutes' returns an HTTP server that starts listening, you need to change its behavior
// to only return the configured 'app' instance, or just ensure it adds routes to 'app'.
