
import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";

interface WasteStats {
  consumed: number;
  wasted: number;
  total: number;
}

const WasteTracking = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<WasteStats>({ consumed: 0, wasted: 0, total: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWasteStats = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        console.log("Fetching waste stats for user:", user.id);
        
        // First get all claims for the user
        const { data: claimsData, error: claimsError } = await supabase
          .from('food_claims')
          .select('*')
          .eq('claimer_id', user.id);
        
        if (claimsError) {
          console.error("Error fetching waste stats:", claimsError);
          toast.error("Failed to load waste statistics");
          throw claimsError;
        }
        
        console.log("Fetched waste stats data:", claimsData);
        
        if (claimsData && claimsData.length > 0) {
          const totalConsumed = claimsData.reduce((sum, item) => sum + (item.quantity_consumed || 0), 0);
          const totalWasted = claimsData.reduce((sum, item) => sum + (item.quantity_wasted || 0), 0);
          const totalClaimed = claimsData.reduce((sum, item) => sum + (item.quantity_claimed || 0), 0);
          
          setStats({
            consumed: totalConsumed,
            wasted: totalWasted,
            total: totalClaimed
          });
        } else {
          // Reset stats if no claims
          setStats({ consumed: 0, wasted: 0, total: 0 });
        }
      } catch (error) {
        console.error("Error in fetchWasteStats:", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) {
      fetchWasteStats();
    }
  }, [user]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  // If still loading auth state, show loading spinner
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-foodie-green"></div>
      </div>
    );
  }

  // If user is null but not loading, navigation will handle redirect
  if (!user) return null;

  const chartData = [
    { name: 'Consumed', value: stats.consumed },
    { name: 'Wasted', value: stats.wasted },
    { name: 'Unclaimed', value: Math.max(0, stats.total - (stats.consumed + stats.wasted)) }
  ].filter(item => item.value > 0);

  const COLORS = ['#4CAF50', '#FF9800', '#9E9E9E'];

  const calculatePercentage = (value: number) => {
    return stats.total ? Math.round((value / stats.total) * 100) : 0;
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  return (
    <div className="pb-20 max-w-md mx-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background pt-6 pb-4 px-4 flex items-center">
        <Link to="/profile" className="mr-4">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-xl font-bold">Waste Tracking</h1>
      </div>
      
      {/* Content */}
      <div className="px-4">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-foodie-green"></div>
          </div>
        ) : chartData.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No consumption data available yet.</p>
            <p className="text-gray-400 text-sm mt-2">Start claiming food to track your impact.</p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
              <h2 className="font-semibold mb-4">Your Food Waste Impact</h2>
              
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip formatter={(value) => formatNumber(value as number)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-sm text-center">
                <div className="text-xl font-bold text-foodie-green">{formatNumber(stats.consumed)}</div>
                <div className="text-xs text-gray-500">Consumed</div>
                <div className="text-sm mt-1 font-medium">{calculatePercentage(stats.consumed)}%</div>
              </div>
              
              <div className="bg-white rounded-lg p-4 shadow-sm text-center">
                <div className="text-xl font-bold text-foodie-orange">{formatNumber(stats.wasted)}</div>
                <div className="text-xs text-gray-500">Wasted</div>
                <div className="text-sm mt-1 font-medium">{calculatePercentage(stats.wasted)}%</div>
              </div>
              
              <div className="bg-white rounded-lg p-4 shadow-sm text-center">
                <div className="text-xl font-bold">{formatNumber(stats.total)}</div>
                <div className="text-xs text-gray-500">Total Claimed</div>
                <div className="text-sm mt-1 font-medium">100%</div>
              </div>
            </div>
            
            <div className="mt-6 bg-white rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold mb-3">Tips to Reduce Waste</h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li className="flex items-start">
                  <span className="text-foodie-green mr-2">•</span>
                  Only claim food you know you can use before it spoils
                </li>
                <li className="flex items-start">
                  <span className="text-foodie-green mr-2">•</span>
                  Store food properly to extend shelf life
                </li>
                <li className="flex items-start">
                  <span className="text-foodie-green mr-2">•</span>
                  Freeze excess food that you can't eat right away
                </li>
                <li className="flex items-start">
                  <span className="text-foodie-green mr-2">•</span>
                  Share with neighbors if you have too much
                </li>
              </ul>
            </div>
          </>
        )}
      </div>
      
      <Navbar />
    </div>
  );
};

export default WasteTracking;
