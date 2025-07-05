import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Gamepad2, Hash, AlertCircle, Play, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

// Game info interface
interface GameInfo {
  name: string;
  description: string;
  creator: {
    id: number;
    name: string;
    type: string;
    isRNVAccount: boolean;
    hasVerifiedBadge: boolean;
  };
  playing: number;
  visits: number;
  iconUrl?: string;
}

export default function Home() {
  const [placeId, setPlaceId] = useState("130452706173960");
  const [gameInstanceId, setGameInstanceId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingUrl, setPendingUrl] = useState("");
  const { toast } = useToast();

  // Fetch game info when place ID changes
  const { data: gameInfo, isLoading: loadingGameName } = useQuery<GameInfo>({
    queryKey: [`/api/game-info/${placeId}`],
    enabled: !!placeId && placeId.trim() !== "" && /^\d+$/.test(placeId.trim()),
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const handlePlaceIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPlaceId(value);
    setError(""); // Clear error when input changes
  };

  const handleGameInstanceIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGameInstanceId(e.target.value);
    setError(""); // Clear error when input changes
  };

  const validateInputs = () => {
    if (!placeId.trim()) {
      setError("Please enter a Place ID");
      return false;
    }
    if (!/^\d+$/.test(placeId.trim())) {
      setError("Place ID must be a valid number");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateInputs()) {
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const trimmedGameInstanceId = gameInstanceId.trim();
      let robloxUrl: string; // Declare with 'let' so it can be reassigned

      // Define the base launchData, which always includes the method
      const baseLaunchData = {
        method: "Joined via SWarp"
      };
      // Stringify and encode the base launchData once
      const jsonStringForUrl = JSON.stringify(baseLaunchData);
      const encodedLaunchData = encodeURIComponent(jsonStringForUrl);

      // Conditional construction of robloxUrl
      if (trimmedGameInstanceId === '' || trimmedGameInstanceId.toUpperCase() === 'N/A') {
        // If gameInstanceId is blank or "N/A", omit the gameInstanceId parameter
        robloxUrl = `roblox://experiences/start?placeId=${placeId.trim()}&launchData=${encodedLaunchData}`;
      } else {
        // If gameInstanceId is provided and valid, include it
        robloxUrl = `roblox://experiences/start?placeId=${placeId.trim()}&gameInstanceId=${trimmedGameInstanceId}&launchData=${encodedLaunchData}`;
      }

      // Set pending URL and show confirmation dialog
      setPendingUrl(robloxUrl);
      setShowConfirmDialog(true);

    } catch (err) {
      console.error("Error preparing game launch:", err);
      setError("Failed to prepare game launch. Please try again.");
      toast({
        title: "Error",
        description: "Failed to prepare game launch. Please try again.",
        variant: "destructive",
      });
    } finally {
      // This finally block ensures isLoading is set to false after try or catch
      setIsLoading(false);
    }
  }; // <--- THIS CLOSING BRACE IS CRUCIAL AND WAS MISPLACED/MISSING IN PREVIOUS VERSIONS

  const confirmJoinGame = () => {
    setShowConfirmDialog(false);

    if (pendingUrl) {
      // Attempt to open Roblox URL
      window.location.href = pendingUrl;

      toast({
        title: "Launching Roblox",
        description: `Joining ${gameInfo?.name || "game"}...`,
      });
      setPendingUrl(""); // Clear pendingUrl after use
    }
  };

  return (
    <div className="min-h-screen bg-roblox-dark relative overflow-hidden">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, var(--roblox-blue) 0%, transparent 50%), radial-gradient(circle at 75% 75%, var(--roblox-orange) 0%, transparent 50%)`
          }}
        />
      </div>

      {/* Main Container */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 gradient-roblox rounded-2xl mb-4">
              <Gamepad2 className="text-white text-2xl" size={32} />
            </div>
            <h1 className="text-3xl font-bold mb-2">
              <span className="gradient-text-animated">
                Slugmoon Warp
              </span>
            </h1>
            <p className="text-gray-400 text-sm gradient-text-animated">Get to the right server fast with Slugmoon Warp.</p>
          </div>

          {/* Main Card */}
          <div className="gradient-container">
            <Card className="bg-roblox-card border-transparent shadow-2xl relative overflow-hidden z-10">
              <CardContent className="p-6 sm:p-8">
                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Place ID Field */}
                  <div className="space-y-2">
                    <Label htmlFor="placeId" className="text-sm font-medium text-gray-300">
                      Place ID
                    </Label>
                    <div className="relative">
                      <Input
                        id="placeId"
                        type="text"
                        value={placeId}
                        onChange={handlePlaceIdChange}
                        placeholder="Enter place ID..."
                        className={`w-full px-4 py-3 bg-gray-800 border text-white placeholder:text-gray-500 focus:ring-2 focus:ring-roblox-blue focus:border-transparent transition-all duration-200 ${
                          error ? 'border-roblox-error' : 'border-gray-600'
                        }`}
                        required
                        disabled={isLoading}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <Gamepad2 className="text-gray-500" size={16} />
                      </div>
                    </div>
                    {loadingGameName ? (
                      <div className="text-xs text-gray-400 mt-1 flex items-center">
                        <div className="animate-spin rounded-full h-3 w-3 border-b border-gray-400 mr-2"></div>
                        Loading game info...
                      </div>
                    ) : gameInfo?.name ? (
                      <div className="text-xs text-gray-400 mt-1">
                        Game: {gameInfo.name}
                      </div>
                    ) : null}
                  </div>

                  {/* Game Instance ID Field */}
                  <div className="space-y-2">
                    <Label htmlFor="gameInstanceId" className="text-sm font-medium text-gray-300">
                      Game Instance ID
                    </Label>
                    <div className="relative">
                      <Input
                        id="gameInstanceId"
                        type="text"
                        value={gameInstanceId}
                        onChange={handleGameInstanceIdChange}
                        placeholder='Enter game instance ID (e.g., "N/A" for any server)...'
                        className={`w-full px-4 py-3 bg-gray-800 border text-white placeholder:text-gray-500 focus:ring-2 focus:ring-roblox-blue focus:border-transparent transition-all duration-200 ${
                          error ? 'border-roblox-error' : 'border-gray-600'
                        }`}
                        disabled={isLoading}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <Hash className="text-gray-500" size={16} />
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Putting "N/A" or leaving this field blank will teleport you to any server.
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="text-red-400 flex-shrink-0" size={16} />
                        <p className="text-red-400 text-sm">{error}</p>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isLoading || !placeId.trim()} // Removed !gameInstanceId.trim() from here, as it's now optional
                    className="w-full py-3 px-6 gradient-roblox-button hover:gradient-roblox-button text-white font-semibold text-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                        <span>Joining...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <Play size={18} />
                        <span>Join Game</span>
                      </div>
                    )}
                  </Button>
                </form>

                {/* Loading Overlay */}
                {isLoading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="text-center">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-roblox-blue mb-4" />
                      <p className="text-white font-medium">Joining game...</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Footer */}
          <div className="text-center mt-6">
            <p className="text-gray-500 text-xs">
              Slugmoon Warp ©. Slugmoon Warp is apart of Slugmoon Suite. All rights reserved.
            </p>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="bg-roblox-card border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-center">
              Confirm Game Join
            </DialogTitle>
            <DialogDescription className="text-gray-300 text-center">
              Are you sure you want to join this game?
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center space-y-4 py-4">
            {/* Game Icon */}
            {gameInfo?.iconUrl ? (
              <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-gray-600">
                <img
                  src={gameInfo.iconUrl}
                  alt={`${gameInfo.name || 'Game'} icon`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            ) : (
              <div className="w-20 h-20 rounded-lg bg-gray-700 flex items-center justify-center border-2 border-gray-600">
                <Gamepad2 className="text-gray-400" size={32} />
              </div>
            )}

            {/* Game Name */}
            <div className="text-center">
              <h3 className="font-semibold text-lg text-white mb-1">
                {gameInfo?.name || "Unknown Game"}
              </h3>
              {gameInfo?.creator && (
                <p className="text-sm text-gray-400">
                  by {gameInfo.creator.name}
                </p>
              )}
            </div>

            {/* Game Stats */}
            {gameInfo && (
              <div className="flex space-x-6 text-sm text-gray-400">
                {gameInfo.playing !== undefined && (
                  <div className="text-center">
                    <div className="font-semibold text-white">{gameInfo.playing.toLocaleString()}</div>
                    <div>Playing</div>
                  </div>
                )}
                {gameInfo.visits !== undefined && (
                  <div className="text-center">
                    <div className="font-semibold text-white">{gameInfo.visits.toLocaleString()}</div>
                    <div>Visits</div>
                  </div>
                  )}
              </div>
            )}
          </div>

          <DialogFooter className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              className="flex-1 gradient-red-button text-white font-semibold hover:gradient-red-button"
            >
              <X className="mr-2" size={16} />
              Cancel
            </Button>
            <Button
              onClick={confirmJoinGame}
              className="flex-1 gradient-roblox-button hover:gradient-roblox-button text-white font-semibold"
            >
              <Play className="mr-2" size={16} />
              Join Game
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
