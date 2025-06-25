import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
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
        return res.status(404).json({ error: "Game not found" });
      }
      
      const universeData = await universeResponse.json();
      const universeId = universeData.universeId;
      
      // Then get game details from universe ID
      const gameResponse = await fetch(`https://games.roblox.com/v1/games?universeIds=${universeId}`);
      
      if (!gameResponse.ok) {
        return res.status(404).json({ error: "Game details not found" });
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
          }
        } catch (error) {
          console.log("Could not fetch game icon:", error);
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
      console.error("Error fetching game info:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  const httpServer = createServer(app);

  return httpServer;
}
