
import { MapPin, Search } from "lucide-react";

const Map = () => {
  return (
    <div className="min-h-screen bg-sage-50">
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
        <p className="text-gray-600 text-sm">Choose Location to see what's available</p>
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
          <label className="block text-sm font-medium mb-2">Select Distance</label>
          <input 
            type="range" 
            min="0" 
            max="5" 
            step="0.1"
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-500 mt-1">
            <span>0 km</span>
            <span>5 km</span>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search for city"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200"
          />
        </div>

        <button className="w-full bg-eco-green text-white p-3 rounded-xl font-medium">
          Apply
        </button>
      </div>
    </div>
  );
};

export default Map;
