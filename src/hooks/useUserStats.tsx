
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface UserStats {
  shared: number;
  received: number;
  points: number;
}

export function useUserStats() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["userStats", user?.id],
    queryFn: async (): Promise<UserStats> => {
      try {
        if (!user) {
          return { shared: 0, received: 0, points: 0 };
        }
        
        // Count user's shared food listings
        const { data: sharedListings, error: sharedError } = await supabase
          .from("food_listings")
          .select("id", { count: 'exact' })
          .eq("user_id", user.id);
        
        if (sharedError) {
          console.error("Error fetching shared listings count:", sharedError);
          throw sharedError;
        }
        
        // Count user's claimed food
        const { data: claimedFood, error: claimedError } = await supabase
          .from("food_claims")
          .select("id", { count: 'exact' })
          .eq("claimer_id", user.id);
        
        if (claimedError) {
          console.error("Error fetching claimed food count:", claimedError);
          throw claimedError;
        }
        
        // Calculate points (1 point for each shared item, 0.5 points for each received item)
        const sharedCount = sharedListings?.length || 0;
        const receivedCount = claimedFood?.length || 0;
        const points = sharedCount + (receivedCount * 0.5);
        
        return {
          shared: sharedCount,
          received: receivedCount,
          points: Math.round(points)
        };
      } catch (error: any) {
        console.error("Error fetching user stats:", error);
        toast.error("Failed to load user statistics");
        return { shared: 0, received: 0, points: 0 };
      }
    },
    enabled: !!user, // Only fetch if user is logged in
  });
}
