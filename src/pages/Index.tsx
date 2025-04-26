
import { Search } from "lucide-react";
import FoodItem from "@/components/FoodItem";
import Navbar from "@/components/Navbar";

// Sample food data
const foodItems = [
  {
    id: "1",
    title: "Homemade Pasta",
    description: "Fresh homemade pasta made today. Can't finish it all, happy to share!",
    location: "Downtown",
    distance: "0.5 miles",
    timePosted: "Posted 35 min ago",
    imageUrl: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80",
  },
  {
    id: "2",
    title: "Fresh Vegetables",
    description: "Organic vegetables from my garden. Too many for me to use!",
    location: "Westside",
    distance: "1.2 miles",
    timePosted: "Posted 2 hours ago",
    imageUrl: "https://images.unsplash.com/photo-1607305387299-a3d9611cd469?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
  },
  {
    id: "3",
    title: "Leftover Birthday Cake",
    description: "Half a chocolate birthday cake left over from party. Still very fresh!",
    location: "Northside",
    distance: "1.8 miles",
    timePosted: "Posted 5 hours ago",
    imageUrl: "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80",
  },
];

const Index = () => {
  return (
    <div className="pb-20 max-w-md mx-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background pt-6 pb-4 px-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">
            <span className="text-foodie-green">Foodie</span>
            <span className="text-foodie-orange">Share</span>
          </h1>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <Search size={18} className="text-gray-500" />
            </div>
          </div>
        </div>
        
        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          <div className="bg-foodie-green/10 text-foodie-green px-3 py-1 rounded-full whitespace-nowrap text-sm">
            All Items
          </div>
          <div className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full whitespace-nowrap text-sm">
            Nearby
          </div>
          <div className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full whitespace-nowrap text-sm">
            Vegetables
          </div>
          <div className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full whitespace-nowrap text-sm">
            Fruits
          </div>
          <div className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full whitespace-nowrap text-sm">
            Prepared Food
          </div>
        </div>
      </div>
      
      {/* Food Items */}
      <div className="px-4 pt-2">
        {foodItems.map((item) => (
          <FoodItem
            key={item.id}
            id={item.id}
            title={item.title}
            description={item.description}
            location={item.location}
            distance={item.distance}
            timePosted={item.timePosted}
            imageUrl={item.imageUrl}
          />
        ))}
      </div>
      
      <Navbar />
    </div>
  );
};

export default Index;
