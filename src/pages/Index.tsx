
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { session, userType, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-sage-50 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

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
            className="block w-full bg-eco-green text-white text-center py-3 rounded-xl"
          >
            Sign Up
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sage-50 px-4 py-8 pb-24">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          {userType === 'charity_orgs' ? 'Available Food' : 
           userType === 'orgs' ? 'Your Shared Items' : 
           'Food Near You'}
        </h1>
        <p className="text-gray-600">
          {userType === 'charity_orgs' ? 'Find and collect available food' : 
           userType === 'orgs' ? 'Manage your food sharing' : 
           'Discover and share food in your community'}
        </p>
      </div>
      
      {/* Add your food listing components here */}
      <div className="text-center text-gray-500 mt-8">
        No items available yet
      </div>

      <Navbar />
    </div>
  );
};

export default Index;
