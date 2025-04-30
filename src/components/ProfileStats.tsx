
import { useUserStats } from "@/hooks/useUserStats";

const ProfileStats = () => {
  const { data: stats, isLoading } = useUserStats();
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-4 bg-white rounded-lg p-4 shadow-sm">
        <div className="text-center">
          <div className="h-6 w-6 bg-gray-200 animate-pulse rounded-full mx-auto"></div>
          <p className="text-xs text-gray-500 mt-1">Shared</p>
        </div>
        <div className="text-center border-x border-gray-100">
          <div className="h-6 w-6 bg-gray-200 animate-pulse rounded-full mx-auto"></div>
          <p className="text-xs text-gray-500 mt-1">Received</p>
        </div>
        <div className="text-center">
          <div className="h-6 w-6 bg-gray-200 animate-pulse rounded-full mx-auto"></div>
          <p className="text-xs text-gray-500 mt-1">Points</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-4 bg-white rounded-lg p-4 shadow-sm">
      <div className="text-center">
        <p className="text-2xl font-bold text-foodie-green">{stats?.shared || 0}</p>
        <p className="text-xs text-gray-500">Shared</p>
      </div>
      <div className="text-center border-x border-gray-100">
        <p className="text-2xl font-bold text-foodie-orange">{stats?.received || 0}</p>
        <p className="text-xs text-gray-500">Received</p>
      </div>
      <div className="text-center">
        <p className="text-2xl font-bold text-foodie-brown">{stats?.points || 0}</p>
        <p className="text-xs text-gray-500">Points</p>
      </div>
    </div>
  );
};

export default ProfileStats;
