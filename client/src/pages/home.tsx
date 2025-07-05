import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Gamepad2, Hash, AlertCircle, Play, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

// Removed these global constants as they are now defined dynamically within handleSubmit
// const launchData = {
//   method: "Joined via SWarp"
// }
// const jsonString = JSON.stringify(launchData);

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

      // Show confirmation dialog
      setPendingUrl(robloxUrl);
      setShowConfirmDialog(true);

    } catch (err) {
      console.error("Error preparing game launch:", err); // More descriptive error message
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
  };

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
      <div className="fixed
