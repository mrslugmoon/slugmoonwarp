import express from "express";
import cors from "cors";
import { registerRoutes } from "./routes";
import path from "path"; // Make sure path is imported

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS setup
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true
}));

// --- BEGIN PRODUCTION-SPECIFIC ROUTES AND STATIC FILE SERVING ---
if (process.env.NODE_ENV === "production") {
  // IMPORTANT: Register your API routes FIRST.
  // This ensures API calls are handled by your backend.
  registerRoutes(app);

  // Serve the "Welcome to the app!" message only if a specific API route
  // hasn't been hit, and if it's not a static file request.
  // This route should generally be removed or specific for a backend-only homepage.
  // However, if you want it, keep it here but understand it will
  // prevent '/' from serving your index.html directly.



  // Serve static files from the client/dist directory.
  // This handles requests for /assets/index-XXXX.js, /assets/index-YYYY.css, etc.
  // path.join(__dirname, '../client/dist') is crucial for correct pathing after build.
  app.use(express.static(path.join(__dirname, '../client/dist')));

  // CATCH-ALL route for client-side routing: serve index.html for all other requests.
  // This must be the LAST route for your SPA. It ensures React Router takes over.
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });

} else {
  // --- DEVELOPMENT-SPECIFIC SETUP ---
  // In development, Vite dev server handles client assets.
  // This 'Welcome' message is just for accessing the server's root in dev.
  app.get("/", (req, res) => {
    res.send("Welcome to the app!");
  });

  // Register API routes for development
  registerRoutes(app);

  (async () => {
    try {
      const { createServer } = await import("http");
      const { setupVite } = await import("./vite");

      const localServer = createServer(app);
      await setupVite(app, localServer);

      const port = Number(process.env.PORT) || 5000;
      localServer.listen({ port, host: "0.0.0.0", reusePort: true }, () => {
        console.log(`Serving on port ${port} (Development)`);
      });
    } catch (e) {
      console.error("Error starting local development server:", e);
    }
  })();
}
// --- END PRODUCTION/DEVELOPMENT SPLIT ---


// Handle errors globally - this should be near the end of your middleware chain
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  console.error("API Error:", err);
  res.status(status).json({ message });
});

// Production server start outside the if/else for clarity (can be inside too)
// This applies to the production block after the routes are defined.
if (process.env.NODE_ENV === "production") {
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`App is running on port ${port} (Production)`);
    });
}


export default app;
