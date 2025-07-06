import express from "express";
import cors from "cors";
import { registerRoutes } from "./routes";
import path from "path";
// --- NEW IMPORTS FOR __dirname EQUIVALENT IN ESM ---
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// --- END NEW IMPORTS ---

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
  registerRoutes(app);

  // Use the new __dirname variable
  app.use(express.static(path.join(__dirname, '../client/dist')));

  // CATCH-ALL route for client-side routing: serve index.html for all other requests.
  app.get('*', (req, res) => {
    // Use the new __dirname variable
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });

} else {
  // --- DEVELOPMENT-SPECIFIC SETUP ---
  app.get("/", (req, res) => {
    res.send("Welcome to the app!");
  });

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

// Error handling
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  console.error("API Error:", err);
  res.status(status).json({ message });
});

// Production server start
if (process.env.NODE_ENV === "production") {
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`App is running on port ${port} (Production)`);
    });
}

export default app;
