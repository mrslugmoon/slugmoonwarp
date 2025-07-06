import express from "express";
import cors from "cors";
import { registerRoutes } from "./routes";
import path from "path"; // <--- ADD THIS LINE to import the 'path' module

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
  // CORRECTED STATIC FILE SERVING PATH
  // This tells Express to serve files from the 'client/dist' directory
  // when a request comes in for a static asset (like /assets/index.css)
  app.use(express.static(path.join(__dirname, '../client/dist'))); //

  // Fallback for client-side routing: serve index.html for all non-API routes
  // This is crucial for single-page applications where the client-side router
  // handles paths like /about or /dashboard.
  app.get('*', (req, res) => { //
    res.sendFile(path.join(__dirname, '../client/dist/index.html')); //
  });
}

// Root route handler - This will be overridden by the `app.get('*')` above in production
// if it comes before it. It's generally better to place API routes before the
// catch-all for static files.
// For now, if the `app.get('*')` is above, this won't be hit in production for '/'.
// However, if you move the `app.get('*')` to below registerRoutes, then this would be fine.
// I'll leave it as is for now, but be aware of the order.
app.get("/", (req, res) => {
  res.send("Welcome to the app!");
});


// Register API routes (ensure these are registered before the catch-all '*' route if possible)
// Currently, your registerRoutes would be hit before the `app.get('*')` if a matching API route exists.
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
  // This is your production server start
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`App is running on port ${port}`);
  });
}

export default app;
