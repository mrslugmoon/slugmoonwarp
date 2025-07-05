// server/routes.ts
import type { Express } from "express"; // Only Express types needed

// This function should ONLY register routes to the Express app
// It should NOT create or return an http.Server instance.
export function registerRoutes(app: Express) {
  // Your existing API route logic for /api/game-info/:placeId
  app.get("/api/game-info/:placeId", async (req, res) => {
    try {
      const { placeId } = req.params;

      // More robust validation for placeId (ensures it's a non-empty string of digits)
      if (!placeId || typeof placeId !== 'string' || !/^\d+$/.test(placeId)) {
        return res.status(400).json({ error: "Invalid Place ID format. Must be a number." });
      }

      // Fetch Universe ID
      const universeResponse = await fetch(`https://apis.roblox.com/universes/v1/places/${placeId}/universe`);
      if (!universeResponse.ok) {
        console.error(`Roblox Universe API error for placeId ${placeId}: ${universeResponse.status} ${universeResponse.statusText}`);
        return res.status(404).json({ error: "Game not found or Roblox Universe API issue." });
      }
      const universeData = await universeResponse.json();
      const universeId = universeData.universeId;

      if (!universeId) {
        console.error(`Universe ID not found in response for placeId: ${placeId}`);
        return res.status(404).json({ error: "Universe ID not found for this place." });
      }

      // Fetch Game Details
      const gameResponse = await fetch(`https://games.roblox.com/v1/games?universeIds=${universeId}`);
      if (!gameResponse.ok) {
        console.error(`Roblox Games API error for universeId ${universeId}: ${gameResponse.status} ${gameResponse.statusText}`);
        return res.status(404).json({ error: "Game details not found or Roblox Games API issue." });
      }
      const gameData = await gameResponse.json();

      if (gameData.data && gameData.data.length > 0) {
        const game = gameData.data[0];
        let iconUrl: string | null = null; // Explicitly type iconUrl

        // Fetch Game Icon (attempt gracefully)
        try {
          const iconResponse = await fetch(`https://thumbnails.roblox.com/v1/games/icons?universeIds=${universeId}&size=512x512&format=Png&isCircular=false`);
          if (iconResponse.ok) {
            const iconData = await iconResponse.json();
            if (iconData.data && iconData.data.length > 0 && iconData.data[0].imageUrl) {
              iconUrl = iconData.data[0].imageUrl;
            } else {
              console.log(`No icon URL found in response for universeId ${universeId}.`);
            }
          } else {
            console.log(`Could not fetch game icon for universeId ${universeId}: ${iconResponse.status} ${iconResponse.statusText}`);
          }
        } catch (iconError) {
          console.log(`Network error fetching game icon for universeId ${universeId}:`, iconError);
        }

        res.json({
          name: game.name,
          description: game.description,
          creator: game.creator, // This directly maps if creator structure is consistent
          playing: game.playing,
          visits: game.visits,
          iconUrl: iconUrl // Will be null if not found
        });
      } else {
        // If gameData.data is empty or not an array with items
        res.status(404).json({ error: "Game data not available for this universe ID." });
      }
    } catch (error: any) { // Catch any unexpected errors during the process
      console.error("Error fetching game info:", error.message || error);
      res.status(500).json({ error: "Internal server error." });
    }
  });

  // IMPORTANT: Remove any lines here that create or return an HTTP server, such as:
  // const httpServer = createServer(app);
  // return httpServer;
}
