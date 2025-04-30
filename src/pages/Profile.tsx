
import { Settings } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import UserAvatar from "@/components/UserAvatar";
import Navbar from "@/components/Navbar";
import ProfileStats from "@/components/ProfileStats";

// User type labels for display
const userTypeLabels = {
  individual: "Individual",
  orgs: "Organization",
  charity_orgs: "Charity Organization"
};

const Profile = () => {
  const { user, userType, isLoading, signOut } = useAuth();
  const navigate = useNavigate();
  
  const formatMemberSince = () => {
    if (!user?.created_at) return "New member";
    
    const date = new Date(user.created_at);
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long' };
    return `Member since ${date.toLocaleDateString('en-US', options)}`;
  };
  
  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
      navigate("/");
    } catch (error) {
      toast.error("Error signing out");
      console.error("Sign out error:", error);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-foodie-green"></div>
      </div>
    );
  }
  
  if (!user) {
    navigate("/auth");
    return null;
  }

  return (
    <div className="pb-20 max-w-md mx-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background pt-6 pb-4 px-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Profile</h1>
        <Settings size={20} className="text-gray-500" />
      </div>
      
      {/* Profile Content */}
      <div className="px-4">
        {/* User Info */}
        <div className="flex flex-col items-center mb-6">
          <UserAvatar size="lg" useAuthUser={true} />
          <h2 className="font-bold text-lg mt-2">
            {user.user_metadata?.name || user.email?.split('@')[0] || "User"}
          </h2>
          <p className="text-gray-500 text-sm">{formatMemberSince()}</p>
          <div className="mt-1 px-3 py-1 bg-eco-light-green/20 rounded-full">
            <p className="text-xs text-eco-green font-medium">
              {userTypeLabels[userType as keyof typeof userTypeLabels] || "User"}
            </p>
          </div>
        </div>
        
        {/* Stats */}
        <ProfileStats />
        
        {/* Waste Tracking */}
        <div className="mt-6">
          <Link to="/waste-tracking">
            <div className="bg-white rounded-lg p-4 shadow-sm flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-eco-light-green/20 rounded-full p-3 mr-3">
                  <span role="img" aria-label="recycle" className="text-xl">♻️</span>
                </div>
                <div>
                  <p className="font-medium">Waste Tracking</p>
                  <p className="text-sm text-gray-500">Track food consumption and waste</p>
                </div>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                <path d="m9 18 6-6-6-6"></path>
              </svg>
            </div>
          </Link>
        </div>
        
        {/* Map View */}
        <div className="mt-6">
          <Link to="/map">
            <div className="bg-white rounded-lg p-4 shadow-sm flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-blue-100 rounded-full p-3 mr-3">
                  <span role="img" aria-label="map" className="text-xl">🗺️</span>
                </div>
                <div>
                  <p className="font-medium">Map View</p>
                  <p className="text-sm text-gray-500">Find food near you</p>
                </div>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                <path d="m9 18 6-6-6-6"></path>
              </svg>
            </div>
          </Link>
        </div>
        
        {/* Achievements */}
        <div className="mt-6">
          <h3 className="font-semibold mb-2">My Achievements</h3>
          <div className="bg-white rounded-lg p-4 shadow-sm flex items-center">
            <div className="bg-gray-100 rounded-full p-3 mr-3">
              <span role="img" aria-label="trophy" className="text-xl">🏆</span>
            </div>
            <div>
              <p className="font-medium">New Member</p>
              <p className="text-sm text-gray-500">Joined the community</p>
            </div>
          </div>
        </div>
        
        {/* Activity */}
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Recent Activity</h3>
          <div className="bg-white rounded-lg p-4 shadow-sm text-center py-6">
            <p className="text-gray-500">No recent activity</p>
            <p className="text-sm text-gray-400 mt-1">Start sharing or claiming food</p>
          </div>
        </div>
        
        <button 
          onClick={handleSignOut}
          className="w-full border border-gray-300 text-gray-600 py-3 rounded-lg font-medium mt-8 mb-4 hover:bg-gray-50 transition-colors"
        >
          Sign Out
        </button>
      </div>
      
      <Navbar />
    </div>
  );
};

export default Profile;
