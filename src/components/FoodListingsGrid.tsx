
import { useState } from "react";
import { useFoodListings } from "@/hooks/useFoodListings";
import FoodItem from "@/components/FoodItem";
import { formatDistanceToNow } from "date-fns";

const FoodListingsGrid = () => {
  const { data: foodListings, isLoading, isError } = useFoodListings();
  const [filter, setFilter] = useState<string>("all");
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-foodie-green"></div>
      </div>
    );
  }
  
  if (isError) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Failed to load food listings</p>
      </div>
    );
  }
  
  if (!foodListings || foodListings.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No food listings available</p>
      </div>
    );
  }
  
  // Filter listings based on selected category
  const filteredListings = filter === "all" 
    ? foodListings 
    : foodListings.filter(item => item.category === filter);
  
  return (
    <div>
      {/* Category filters */}
      <div className="flex overflow-x-auto gap-2 mb-4 pb-2 px-4 -mx-4">
        <button 
          onClick={() => setFilter("all")}
          className={`whitespace-nowrap px-3 py-1 rounded-full text-sm ${
            filter === "all" ? "bg-foodie-green text-white" : "bg-gray-100"
          }`}
        >
          All
        </button>
        {["fruits", "vegetables", "prepared", "baked", "pantry", "other"].map((category) => (
          <button
            key={category}
            onClick={() => setFilter(category)}
            className={`whitespace-nowrap px-3 py-1 rounded-full text-sm ${
              filter === category ? "bg-foodie-green text-white" : "bg-gray-100"
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>
      
      {/* Food listings grid */}
      <div className="grid grid-cols-1 gap-4">
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
              listingId={item.id} // Pass the listingId to FoodItem for the RequestButton
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FoodListingsGrid;
