
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import FoodListingsGrid from "@/components/FoodListingsGrid";
import AddFoodButton from "@/components/AddFoodButton";

const Index = () => {
  const { session, userType, isLoading } = useAuth();

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
            className="h-20 mx-auto mb-8"
          />
          <h1 className="text-3xl font-bold mb-4">
            <span className="text-eco-green">Share</span> More,
            <br />
            <span className="text-eco-light-green">Waste</span> Less
          </h1>
          <p className="text-gray-600 max-w-sm mx-auto">
            Connect with your community to share surplus food, reduce waste, 
            and help those in need. Let's make it easy to find and share 
            food in your neighborhood.
          </p>
        </div>

        {/* Auth Buttons */}
        <div className="max-w-sm mx-auto space-y-4">
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

  // Determine what content to show based on user type
  let pageTitle, pageDescription, showAddButton = false, excludeOwnListings = true;
  
  if (userType === 'charity_orgs') {
    pageTitle = 'Available Food';
    pageDescription = 'Find and collect available food';
    excludeOwnListings = true; // Show other users' food
  } else if (userType === 'orgs') {
    pageTitle = 'Your Shared Items';
    pageDescription = 'Manage your food sharing';
    excludeOwnListings = false; // Show their own food
    showAddButton = true;
  } else { // individual
    pageTitle = 'Food Near You';
    pageDescription = 'Discover and share food in your community';
    excludeOwnListings = true; // Show other users' food
    showAddButton = true;
  }

  // Render appropriate view based on user type
  return (
    <div className="min-h-screen bg-sage-50 px-4 py-8 pb-24">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{pageTitle}</h1>
        <p className="text-gray-600">{pageDescription}</p>
      </div>
      
      <FoodListingsGrid excludeOwnListings={excludeOwnListings} />
      
      {/* Show Add Food button for individuals and organizations */}
      {showAddButton && <AddFoodButton />}

      <Navbar />
    </div>
  );
};

export default Index;
