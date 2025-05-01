
import { useState, useEffect, useRef } from "react";
import { MapPin, Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from "@/integrations/supabase/client";

// You would need to set this in your Supabase environment variables
// For now, we'll use a placeholder that users will need to replace
const MAPBOX_TOKEN = "pk.eyJ1Ijoia2llcmRvYnppZWwiLCJhIjoiY2tqbXQzdGhuMnB0djJybXFiY3RtNTZ0ciJ9.JNmeUpCzT2PMCYzjlSA3Lg";

interface Coordinates {
  latitude: number;
  longitude: number;
}

const Map = () => {
  const [distance, setDistance] = useState(1);
  const [city, setCity] = useState("");
  const [mapboxToken, setMapboxToken] = useState<string>(MAPBOX_TOKEN);
  const [userCoordinates, setUserCoordinates] = useState<Coordinates | null>(null);
  const { isLoading } = useAuth();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [foodListings, setFoodListings] = useState<any[]>([]);

  // Function to fetch food listings
  const fetchFoodListings = async () => {
    try {
      const { data, error } = await supabase
        .from('food_listings')
        .select('*')
        .eq('status', 'available');
      
      if (error) {
        throw error;
      }
      
      setFoodListings(data || []);
      return data;
    } catch (error: any) {
      console.error("Error fetching food listings:", error);
      toast.error("Failed to load food listings");
      return [];
    }
  };

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;
    
    // Try to get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserCoordinates({ latitude, longitude });
          
          // Initialize map with user's location
          initializeMap(latitude, longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
          // Initialize map with default location
          initializeMap(37.7749, -122.4194); // Default to San Francisco
          toast.error("Couldn't get your location. Using default location.");
        }
      );
    } else {
      // Initialize map with default location
      initializeMap(37.7749, -122.4194); // Default to San Francisco
      toast.error("Geolocation is not supported by this browser.");
    }

    // Cleanup function
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [mapboxToken]);

  // Initialize the map
  const initializeMap = (latitude: number, longitude: number) => {
    if (!mapContainer.current) return;
    
    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [longitude, latitude],
      zoom: 12
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl());

    // Add user marker
    const userMarker = new mapboxgl.Marker({ color: '#4CAF50' })
      .setLngLat([longitude, latitude])
      .setPopup(new mapboxgl.Popup().setText('You are here'))
      .addTo(map.current);

    // Fetch food listings once map is loaded
    map.current.on('load', async () => {
      const listings = await fetchFoodListings();
      
      // Add markers for food listings (mock location for now)
      listings.forEach((listing, index) => {
        // In a real implementation, you'd use actual coordinates from the listing
        // For demo, spread listings around user's location
        const offset = (index % 8) * 0.003;
        const lngOffset = Math.random() > 0.5 ? offset : -offset;
        const latOffset = Math.random() > 0.5 ? offset : -offset;
        
        new mapboxgl.Marker({ color: '#FF9800' })
          .setLngLat([longitude + lngOffset, latitude + latOffset])
          .setPopup(
            new mapboxgl.Popup().setHTML(
              `<strong>${listing.title}</strong><p>${listing.description}</p>`
            )
          )
          .addTo(map.current!);
      });
    });
  };

  // Handle search by city
  const handleApply = () => {
    if (!map.current) return;
    
    toast.success(`Searching for food within ${distance}km ${city ? `in ${city}` : ''}`);
    
    // If a city is provided, geocode it to get coordinates
    if (city) {
      fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(city)}.json?access_token=${mapboxToken}`)
        .then(response => response.json())
        .then(data => {
          if (data.features && data.features.length > 0) {
            const [longitude, latitude] = data.features[0].center;
            
            map.current!.flyTo({
              center: [longitude, latitude],
              zoom: 12,
              essential: true
            });
            
            // Update food markers based on new location (in a real app)
            // For demo, we'll just show a notification
            toast.success(`Showing food listings in ${city}`);
          } else {
            toast.error(`Could not find location: ${city}`);
          }
        })
        .catch(error => {
          console.error("Geocoding error:", error);
          toast.error("Error searching for location");
        });
    }
    
    // Update the search radius on the map (would need geometry functions in a real app)
    // For demo we just show a notification with the distance
    toast.info(`Search radius set to ${distance}km`);
  };

  // Handle missing Mapbox token
  const handleTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMapboxToken(e.target.value);
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
          <h1 className="text-xl font-bold">Food Map</h1>
          <img 
            src="/lovable-uploads/679b37d8-2141-421a-aa60-c93599b3bfba.png" 
            alt="EcoEats Logo" 
            className="h-8"
          />
        </div>
        <p className="text-gray-600 text-sm">Find available food near you</p>
      </div>

      {/* Map Container */}
      <div className="h-[40vh] relative">
        {mapboxToken === "YOUR_MAPBOX_TOKEN_HERE" ? (
          <div className="absolute inset-0 bg-gray-100 flex flex-col items-center justify-center p-4">
            <MapPin className="h-8 w-8 text-eco-green mb-2" />
            <p className="text-center text-gray-600 mb-2">Please enter a valid Mapbox token</p>
            <input
              type="text"
              placeholder="Enter your Mapbox token"
              className="w-full p-2 border rounded"
              value={mapboxToken}
              onChange={handleTokenChange}
            />
          </div>
        ) : (
          <div ref={mapContainer} className="absolute inset-0" />
        )}
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
