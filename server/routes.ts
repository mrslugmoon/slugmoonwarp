// server/routes.ts
import type { Express } from "express"; // Keep this import
// Remove the following imports as they are for creating an HTTP server, not just registering routes:
// import { createServer, type Server } from "http";
// import { storage } from "./storage"; // Only keep if 'storage' is used directly in this file's routes

// Change the function signature:
// It no longer needs to be async if it doesn't await anything outside the route handlers.
// It no longer returns a Promise<Server>, it just configures the Express app.
export function registerRoutes(app: Express) { // Removed 'async' and 'Promise<Server>'
  // Route to get game name from place ID
  app.get("/api/game-info/:placeId", async (req, res) => {
    try {
      const { placeId } = req.params;

      if (!placeId || isNaN(Number(placeId))) {
        return res.status(400).json({ error: "Invalid place ID" });
      }

      // First try to get universe ID from place ID
      const universeResponse = await fetch(`https://apis.roblox.com/universes/v1/places/${placeId}/universe`);

      if (!universeResponse.ok) {
        // IMPORTANT: Log the actual error for debugging!
        console.error(`Roblox Universe API error for placeId ${placeId}: ${universeResponse.status} ${universeResponse.statusText}`);
        return res.status(404).json({ error: "Game not found or API issue (Universe API)" });
      }

      const universeData = await universeResponse.json();
      const universeId = universeData.universeId;

      // Then get game details from universe ID
      const gameResponse = await fetch(`https://games.roblox.com/v1/games?universeIds=${universeId}`);

      if (!gameResponse.ok) {
        // IMPORTANT: Log the actual error for debugging!
        console.error(`Roblox Games API error for universeId ${universeId}: ${gameResponse.status} ${gameResponse.statusText}`);
        return res.status(404).json({ error: "Game details not found or API issue (Games API)" });
      }

      const gameData = await gameResponse.json();

      if (gameData.data && gameData.data.length > 0) {
        const game = gameData.data[0];

        // Get game icon
        let iconUrl = null;
        try {
          const iconResponse = await fetch(`https://thumbnails.roblox.com/v1/games/icons?universeIds=${universeId}&size=512x512&format=Png&isCircular=false`);
          if (iconResponse.ok) {
            const iconData = await iconResponse.json();
            if (iconData.data && iconData.data.length > 0) {
              iconUrl = iconData.data[0].imageUrl;
            }
          } else {
            // IMPORTANT: Log the status and text for debugging!
            console.log("Could not fetch game icon:", iconResponse.status, iconResponse.statusText);
          }
        } catch (error) {
          console.log("Could not fetch game icon (network error):", error);
        }

        res.json({
          name: game.name,
          description: game.description,
          creator: game.creator,
          playing: game.playing,
          visits: game.visits,
          iconUrl: iconUrl || null
        });
      } else {
        res.status(404).json({ error: "Game not found" });
      }
    } catch (error) {
      console.error("Error fetching game info:", error); // Make sure this error is detailed
      res.status(500).json({ error: "Internal server error" });
    }
  });
  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  // REMOVE THE FOLLOWING TWO LINES:
  // const httpServer = createServer(app);
  // return httpServer;
}
