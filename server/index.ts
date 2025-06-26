import express from "express";
import cors from "cors";
import { registerRoutes } from "./routes";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS setup for all origins (be cautious in production)
app.use(cors({
  origin: '*',  // You might want to restrict origins in production
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true
}));

// Serve static files in production (if needed)
if (process.env.NODE_ENV === "production") {
  app.use(express.static("dist/public"));
}

// Root route handler
app.get("/", (req, res) => {
  res.send("Welcome to the app!");
});

// Register API routes
registerRoutes(app);

// Handle errors globally
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
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
      const { setupVite } = await import("./vite");

      const localServer = createServer(app);

      await setupVite(app, localServer);

      const port = Number(process.env.PORT) || 5000;
      localServer.listen({ port, host: "0.0.0.0", reusePort: true }, () => {
        console.log(`Serving on port ${port}`);
      });
    } catch (e) {
      console.error("Error starting local development server:", e);
    }
  })();
} else {
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`App is running on port ${port}`);
  });
}

export default app;
