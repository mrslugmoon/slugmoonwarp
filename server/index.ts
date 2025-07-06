// server/index.ts
import express from "express";
import cors from "cors";
import { registerRoutes } from "./routes";
import path from "path"; // Ensure this is imported

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS setup
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true
}));

// 1. Register API routes FIRST
// These should handle specific API endpoints (e.g., /api/users, /api/auth)
registerRoutes(app);

// 2. Serve static files and handle client-side routing ONLY in production
if (process.env.NODE_ENV === "production") {
  // CRITICAL: Serve compiled client-side assets from client/dist
  app.use(express.static(path.join(__dirname, '../client/dist')));

  // Fallback for client-side routing (e.g., React Router paths like /dashboard)
  // This must come AFTER API routes and static asset serving.
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
} else {
  // In development, the Vite dev server handles client assets.
  // This 'Welcome' message is just for accessing the server's root in dev.
  app.get("/", (req, res) => {
    res.send("Welcome to the app!");
  });
}


// Handle errors globally - this should be near the end of your middleware chain
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  console.error("API Error:", err);
  res.status(status).json({ message });
});

// --- Server Start Logic ---
// This part remains largely the same, but emphasizes that
// in production, it's just app.listen().
if (process.env.NODE_ENV === "development") {
  (async () => {
    try {
      const { createServer } = await import("http");
      const { setupVite } = await import("./vite");

      const localServer = createServer(app);

      await setupVite(app, localServer); // Connects Vite's dev server

      const port = Number(process.env.PORT) || 5000;
      localServer.listen({ port, host: "0.0.0.0", reusePort: true }, () => {
        console.log(`Serving on port ${port} (Development)`);
      });
    } catch (e) {
      console.error("Error starting local development server:", e);
    }
  })();
} else {
  // Production server start
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`App is running on port ${port} (Production)`);
  });
}

export default app;
