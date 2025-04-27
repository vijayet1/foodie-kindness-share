import { Settings, Gift, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import UserAvatar from "@/components/UserAvatar";

const ProfileStats = () => {
  const [stats, setStats] = useState({
    shared: 0,
    received: 0,
    rating: 0
  });

  useEffect(() => {
    setStats({
      shared: 0,
      received: 0,
      rating: 0
    });
  }, []);

  return (
    <div className="flex justify-around py-4 bg-white rounded-xl food-card-shadow">
      <div className="text-center">
        <p className="text-lg font-bold text-foodie-green">{stats.shared}</p>
        <p className="text-xs text-gray-500">Shared</p>
      </div>
      <div className="text-center border-x border-gray-100 px-8">
        <p className="text-lg font-bold text-foodie-orange">{stats.received}</p>
        <p className="text-xs text-gray-500">Received</p>
      </div>
      <div className="text-center">
        <p className="text-lg font-bold text-foodie-green">{stats.rating || "-"}</p>
        <p className="text-xs text-gray-500">Rating</p>
      </div>
    </div>
  );
};

const AchievementItem = ({ icon, title, description }: { 
  icon: React.ReactNode, 
  title: string, 
  description: string 
}) => {
  return (
    <div className="flex items-center space-x-3 p-3 bg-white rounded-lg food-card-shadow">
      <div className="bg-foodie-cream p-2 rounded-full">
        {icon}
      </div>
      <div>
        <h4 className="font-medium text-sm">{title}</h4>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
    </div>
  );
};

const Profile = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  
  const formatMemberSince = () => {
    if (!user?.created_at) return "New member";
    
    const date = new Date(user.created_at);
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long' };
    return `Member since ${date.toLocaleDateString('en-US', options)}`;
  };
  
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Signed out successfully");
      navigate("/auth");
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
        </div>
        
        {/* Stats */}
        <ProfileStats />
        
        {/* Achievements */}
        <div className="mt-6">
          <h3 className="font-semibold mb-3">Achievements</h3>
          <div className="space-y-3">
            <AchievementItem 
              icon={<Gift className="text-foodie-orange" size={20} />}
              title="New Member"
              description="Welcome to Foodie Kindness Share!"
            />
          </div>
        </div>
        
        {/* Menu Items */}
        <div className="mt-6 space-y-3">
          <div className="p-4 bg-white rounded-xl food-card-shadow">
            <h3 className="font-semibold mb-2">Your Shared Items</h3>
            <p className="text-sm text-gray-500">View and manage your shared food items</p>
          </div>
          
          <div className="p-4 bg-white rounded-xl food-card-shadow">
            <h3 className="font-semibold mb-2">Your Received Items</h3>
            <p className="text-sm text-gray-500">See the food items you've received</p>
          </div>
          
          <div className="p-4 bg-white rounded-xl food-card-shadow">
            <h3 className="font-semibold mb-2">Feedback & Reviews</h3>
            <p className="text-sm text-gray-500">Your community reputation</p>
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
