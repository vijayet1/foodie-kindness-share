
import { useState, useEffect } from "react";
import { MapPin, Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const Map = () => {
  const [distance, setDistance] = useState(1);
  const [city, setCity] = useState("");
  const { isLoading } = useAuth();
  
  useEffect(() => {
    // Get user's current location if available
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Got location:", position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, []);

  const handleApply = () => {
    toast.success(`Searching for food within ${distance}km ${city ? `in ${city}` : ''}`);
    // In a real implementation, this would update the map with food listings
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-sage-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-foodie-green"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sage-50 pb-24">
      {/* Header */}
      <div className="p-4 bg-white">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">Choose Location</h1>
          <img 
            src="/lovable-uploads/679b37d8-2141-421a-aa60-c93599b3bfba.png" 
            alt="EcoEats Logo" 
            className="h-8"
          />
        </div>
        <p className="text-gray-600 text-sm">Choose location to see available food</p>
      </div>

      {/* Map Placeholder */}
      <div className="h-[40vh] bg-gray-100 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <MapPin className="h-8 w-8 text-eco-green" />
        </div>
      </div>

      {/* Features */}
      <div className="p-4 space-y-4">
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="flex items-center mb-2">
            <MapPin className="h-6 w-6 text-eco-green mr-2" />
            <h3 className="font-semibold">Locate Nearby Food</h3>
          </div>
          <p className="text-sm text-gray-600">
            Find free food available in your neighborhood with our interactive map
          </p>
        </div>

        {/* Distance Slider */}
        <div className="bg-white p-4 rounded-xl">
          <label className="block text-sm font-medium mb-2">
            Select Distance: <span className="font-bold">{distance} km</span>
          </label>
          <input 
            type="range" 
            min="0.1" 
            max="5" 
            step="0.1"
            value={distance}
            onChange={(e) => setDistance(parseFloat(e.target.value))}
            className="w-full accent-eco-green"
          />
          <div className="flex justify-between text-sm text-gray-500 mt-1">
            <span>0.1 km</span>
            <span>5 km</span>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search for city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200"
          />
        </div>

        <button 
          className="w-full bg-eco-green text-white p-3 rounded-xl font-medium"
          onClick={handleApply}
        >
          Apply
        </button>
      </div>
      
      {/* Navigation */}
      <Navbar />
    </div>
  );
};

export default Map;
