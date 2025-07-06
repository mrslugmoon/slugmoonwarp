import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Gamepad2, Hash, AlertCircle, Play, X, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from 'next/navigation'; // Import useSearchParams

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
  const searchParams = useSearchParams(); // Initialize useSearchParams hook

  const [placeId, setPlaceId] = useState(""); // Change initial state to empty string
  const [gameInstanceId, setGameInstanceId] = useState(""); // Change initial state to empty string
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingUrl, setPendingUrl] = useState("");
  const { toast } = useToast();

  // useEffect to read query parameters on component mount
  useEffect(() => {
    const urlPlaceId = searchParams.get('placeId');
    const urlServerId = searchParams.get('serverid'); // Note the lowercase 'serverid'

    if (urlPlaceId && /^\d+$/.test(urlPlaceId)) {
      setPlaceId(urlPlaceId);
    }
    if (urlServerId) {
      setGameInstanceId(urlServerId);
    }
  }, [searchParams]); // Re-run effect if searchParams change (e.g., navigation)


  // Fetch game info when place ID changes
  const {
    data: gameInfo,
    isLoading: loadingGameName,
    error: gameInfoError
  } = useQuery<GameInfo>({
    queryKey: [`/api/game-info/${placeId}`],
    // Only enable if placeId is valid and not empty after potential URL param setting
    enabled: !!placeId && placeId.trim() !== "" && /^\d+$/.test(placeId.trim()),
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
  });

  const handlePlaceIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPlaceId(value);
    setError("");
  };

  const handleGameInstanceIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGameInstanceId(e.target.value);
    setError("");
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
      let robloxUrl: string;

      const baseLaunchData = {
        method: "Joined via SWarp"
      };
      const jsonStringForUrl = JSON.stringify(baseLaunchData);
      const encodedLaunchData = encodeURIComponent(jsonStringForUrl);

      if (trimmedGameInstanceId === '' || trimmedGameInstanceId.toUpperCase() === 'N/A') {
        robloxUrl = `roblox://experiences/start?placeId=${placeId.trim()}&launchData=${encodedLaunchData}`;
      } else {
        robloxUrl = `roblox://experiences/start?placeId=${placeId.trim()}&gameInstanceId=${trimmedGameInstanceId}&launchData=${encodedLaunchData}`;
      }

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
      setIsLoading(false);
    }
  };

  const confirmJoinGame = () => {
    setShowConfirmDialog(false);

    if (pendingUrl) {
      window.location.href = pendingUrl;

      toast({
        title: "Launching Roblox",
        description: `Joining ${gameInfo?.name || "game"}...`,
      });
      setPendingUrl("");
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
                          error || gameInfoError ? 'border-roblox-error' : 'border-gray-600'
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
                    ) : gameInfoError ? (
                      <div className="text-xs text-red-400 mt-1 flex items-center">
                        <AlertCircle className="mr-1" size={14} /> Failed to load game info for this ID.
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
                    disabled={isLoading || !placeId.trim() || loadingGameName || !!gameInfoError}
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

                {/* Loading Overlay - only for form submission, not for game info fetch */}
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

          {/* Info Container for Roblox Installation */}
          <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-4 mt-6 text-white text-sm flex items-start space-x-3">
            <Info className="text-blue-400 flex-shrink-0 mt-0.5" size={18} />
            <div>
              <p className="font-semibold mb-1">Roblox Installation Required</p>
              <p className="text-blue-300">
                To use Slugmoon Warp, you must have the **Roblox client installed** on your computer. This tool works by sending a direct launch command to Roblox.
              </p>
            </div>
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
          </DialogHeader> {/* Removed the extra closing DialogDescription tag here */}

          <div className="flex flex-col items-center space-y-4 py-4">
            {/* Game Icon */}
            {gameInfo?.iconUrl ? (
              <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-gray-600">
                <img
                  src={gameInfo.iconUrl}
                  alt={`${gameInfo.name || 'Game'} icon`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback if image fails to load
                    e.currentTarget.style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                        parent.classList.add('bg-gray-700', 'flex', 'items-center', 'justify-center');
                        parent.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-gamepad2 text-gray-400"><path d="M6 12H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2m0 6v2a2 2 0 0 0 2 2h2m0-6H8a2 2 0 0 0-2 2v2m6 0h2a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-2m0 6v-2a2 2 0 0 1-2-2H8m6 4h-2a2 2 0 0 1-2-2v-2m6 0v2a2 2 0 0 1-2 2h-2m2-6h2a2 2 0 0 1 2 2v2m-6-4h-2a2 2 0 0 0-2 2v2m0-6h-2a2 2 0 0 0-2 2v2m6 0v-2a2 2 0 0 0-2-2h-2m6 0v2a2 2 0 0 0 2 2h-2"/><path d="M16 2a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2H8A2 2 0 0 1 6 5V4a2 2 0 0 1 2-2h8z"/></svg>';
                    }
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
            {/* Display error in dialog if game info failed to load for confirmation */}
            {gameInfoError && (
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3 w-full text-center">
                <div className="flex items-center justify-center space-x-2">
                  <AlertCircle className="text-red-400 flex-shrink-0" size={16} />
                  <p className="text-red-400 text-sm">Could not load full game details.</p>
                </div>
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
