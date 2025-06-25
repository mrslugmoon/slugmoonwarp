// server/routes.ts
import type { Express } from "express"; // Only Express types needed

// This function should ONLY register routes to the Express app
// It should NOT create or return an http.Server instance.
export function registerRoutes(app: Express) {
  // Your existing API route logic for /api/game-info/:placeId
  app.get("/api/game-info/:placeId", async (req, res) => {
    try {
      const { placeId } = req.params;

      if (!placeId || isNaN(Number(placeId))) {
        return res.status(400).json({ error: "Invalid place ID" });
      }

      const universeResponse = await fetch(`https://apis.roblox.com/universes/v1/places/${placeId}/universe`);
      if (!universeResponse.ok) {
        console.error(`Roblox Universe API error for placeId ${placeId}: ${universeResponse.status} ${universeResponse.statusText}`);
        return res.status(404).json({ error: "Game not found or API issue (Universe API)" });
      }
      const universeData = await universeResponse.json();
      const universeId = universeData.universeId;

      const gameResponse = await fetch(`https://games.roblox.com/v1/games?universeIds=${universeId}`);
      if (!gameResponse.ok) {
        console.error(`Roblox Games API error for universeId ${universeId}: ${gameResponse.status} ${gameResponse.statusText}`);
        return res.status(404).json({ error: "Game details not found or API issue (Games API)" });
      }
      const gameData = await gameResponse.json();

      if (gameData.data && gameData.data.length > 0) {
        const game = gameData.data[0];
        let iconUrl = null;
        try {
          const iconResponse = await fetch(`https://thumbnails.roblox.com/v1/games/icons?universeIds=${universeId}&size=512x512&format=Png&isCircular=false`);
          if (iconResponse.ok) {
            const iconData = await iconResponse.json();
            if (iconData.data && iconData.data.length > 0) {
              iconUrl = iconData.data[0].imageUrl;
            }
          } else {
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
      console.error("Error fetching game info:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // IMPORTANT: Remove any lines here that create or return an HTTP server, such as:
  // const httpServer = createServer(app);
  // return httpServer;
}
