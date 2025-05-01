
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import FoodListingsGrid from "@/components/FoodListingsGrid";

const Index = () => {
  const { session, isLoading } = useAuth();

  // Show loading state while authentication is being checked
  if (isLoading) {
    return (
      <div className="min-h-screen bg-sage-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-foodie-green"></div>
      </div>
    );
  }

  // If no session, show the landing page for non-authenticated users
  if (!session) {
    return (
      <div className="min-h-screen bg-sage-50 px-4 py-8">
        {/* Logo and Hero Section */}
        <div className="mb-12 text-center">
          <img 
            src="/lovable-uploads/679b37d8-2141-421a-aa60-c93599b3bfba.png" 
            alt="EcoEats Logo" 
            className="h-16 sm:h-20 mx-auto mb-6 sm:mb-8"
          />
          <h1 className="text-2xl sm:text-3xl font-bold mb-4">
            <span className="text-eco-green">Share</span> More,
            <br />
            <span className="text-eco-light-green">Waste</span> Less
          </h1>
          <p className="text-gray-600 max-w-xs sm:max-w-sm mx-auto">
            Connect with your community to share surplus food, reduce waste, 
            and help those in need. Let's make it easy to find and share 
            food in your neighborhood.
          </p>
        </div>

        {/* Auth Buttons */}
        <div className="max-w-xs sm:max-w-sm mx-auto space-y-3 sm:space-y-4">
          <Link 
            to="/auth" 
            className="block w-full bg-white text-gray-800 text-center py-3 rounded-xl border border-gray-200"
          >
            Login
          </Link>
          <Link 
            to="/auth" 
            state={{ isSignUp: true }}
            className="block w-full bg-eco-green text-white text-center py-3 rounded-xl"
          >
            Sign Up
          </Link>
        </div>
      </div>
    );
  }

  // Render the main content for authenticated users
  return (
    <div className="min-h-screen bg-sage-50 px-4 py-6 pb-24">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">Food Listings</h1>
        <p className="text-sm sm:text-base text-gray-600">Discover and share food in your community</p>
      </div>
      
      <FoodListingsGrid />
      
      <Navbar />
    </div>
  );
};

export default Index;
