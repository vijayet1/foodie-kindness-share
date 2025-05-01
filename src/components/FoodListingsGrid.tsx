
import { useState } from "react";
import { useFoodListings } from "@/hooks/useFoodListings";
import FoodItem from "@/components/FoodItem";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";

interface FoodListingsGridProps {
  excludeOwnListings?: boolean;
}

const FoodListingsGrid = ({ excludeOwnListings = true }: FoodListingsGridProps) => {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<"others" | "mine">("others");
  const [filter, setFilter] = useState<string>("all");
  const isMobile = useIsMobile();
  
  // Always fetch all listings and filter them on the client side
  const { data: allFoodListings, isLoading, isError } = useFoodListings(false);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-foodie-green"></div>
      </div>
    );
  }
  
  if (isError) {
    return (
      <div className="text-center py-6">
        <p className="text-red-500">Failed to load food listings</p>
      </div>
    );
  }
  
  if (!allFoodListings || allFoodListings.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-gray-500">No food listings available</p>
      </div>
    );
  }
  
  // Filter listings based on viewMode (mine vs others)
  const modeFilteredListings = viewMode === "mine" 
    ? allFoodListings.filter(item => item.user_id === user?.id)
    : allFoodListings.filter(item => item.user_id !== user?.id);
  
  // Then filter by selected category
  const filteredListings = filter === "all" 
    ? modeFilteredListings 
    : modeFilteredListings.filter(item => item.category === filter);
  
  return (
    <div>
      {/* View mode tabs (Mine vs Others) - More compact on mobile */}
      <Tabs 
        defaultValue="others" 
        className="mb-3 sm:mb-4"
        onValueChange={(value) => setViewMode(value as "others" | "mine")}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="others" className="text-sm sm:text-base">Others Food</TabsTrigger>
          <TabsTrigger value="mine" className="text-sm sm:text-base">My Food</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {/* Category filters - Scrollable and more compact on mobile */}
      <div className="flex overflow-x-auto scrollbar-none gap-2 mb-3 sm:mb-4 pb-2 px-2 -mx-2">
        <button 
          onClick={() => setFilter("all")}
          className={`whitespace-nowrap px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm ${
            filter === "all" ? "bg-foodie-green text-white" : "bg-gray-100"
          }`}
        >
          All
        </button>
        {["fruits", "vegetables", "prepared", "baked", "pantry", "other"].map((category) => (
          <button
            key={category}
            onClick={() => setFilter(category)}
            className={`whitespace-nowrap px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm ${
              filter === category ? "bg-foodie-green text-white" : "bg-gray-100"
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>
      
      {/* Food listings grid - Single column on mobile, can be 2 columns on larger screens */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {filteredListings.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
            <FoodItem
              id={item.id}
              title={item.title}
              description={item.description}
              location={item.location}
              distance="2 km away" // Would need geolocation to calculate actual distance
              timePosted={formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
              imageUrl={item.image_url || "/placeholder.svg"}
              category={item.category}
              listingId={item.id} 
              userId={item.user_id}
              expiryDate={item.expiry_date}
              status={item.status}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FoodListingsGrid;
