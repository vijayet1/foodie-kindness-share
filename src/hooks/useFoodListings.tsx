
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export function useFoodListings() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["foodListings"],
    queryFn: async () => {
      try {
        console.log("Fetching food listings");
        // First fetch the food listings
        const { data: listings, error: listingsError } = await supabase
          .from("food_listings")
          .select("*")
          .eq("status", "available") // Only fetch available listings
          .order("created_at", { ascending: false });

        if (listingsError) {
          console.error("Error fetching listings:", listingsError);
          throw listingsError;
        }
        
        console.log("Fetched listings:", listings);
        
        // Get user IDs from the listings to fetch their profiles
        const userIds = [...new Set(listings?.map(listing => listing.user_id) || [])];
        
        // If there are listings, fetch the associated profiles
        if (userIds.length > 0) {
          const { data: profiles, error: profilesError } = await supabase
            .from("profiles")
            .select("*")
            .in("id", userIds);
            
          if (profilesError) {
            console.error("Error fetching profiles:", profilesError);
            throw profilesError;
          }
          
          console.log("Fetched profiles:", profiles);
          
          // Combine the listings with profile data
          const listingsWithProfiles = listings?.map(listing => {
            const profile = profiles?.find(p => p.id === listing.user_id);
            return {
              ...listing,
              profile: profile || null
            };
          });
          
          return listingsWithProfiles || [];
        }
        
        return listings || [];
      } catch (error: any) {
        console.error("Error in useFoodListings:", error);
        toast.error("Failed to load food listings");
        return [];
      }
    },
    enabled: true, // Always fetch listings regardless of auth status
  });
}
