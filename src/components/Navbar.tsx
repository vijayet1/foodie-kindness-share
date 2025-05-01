
import { Home, PlusSquare, User, Map as MapIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";

const Navbar = () => {
  const location = useLocation();
  const { userType } = useAuth();
  const isMobile = useIsMobile();

  const getActiveClass = (path: string) => {
    return location.pathname === path
      ? "text-foodie-green"
      : "text-gray-500";
  };

  // Only show share option for individuals and organizations
  const canShare = userType === 'individual' || userType === 'orgs';

  // Only show find food option for individuals and charity organizations
  const canFind = userType === 'individual' || userType === 'charity_orgs';

  // Determine icon size based on screen
  const iconSize = isMobile ? 20 : 24;
  const textClass = isMobile ? "text-[10px]" : "text-xs";

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-white py-1 sm:py-2 px-2 sm:px-6 z-10">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {canFind && (
          <Link
            to="/"
            className={`flex flex-col items-center ${getActiveClass('/')}`}
          >
            <Home size={iconSize} />
            <span className={`${textClass} mt-0.5 sm:mt-1`}>Find Food</span>
          </Link>
        )}

        {canFind && (
          <Link
            to="/map"
            className={`flex flex-col items-center ${getActiveClass('/map')}`}
          >
            <MapIcon size={iconSize} />
            <span className={`${textClass} mt-0.5 sm:mt-1`}>Map</span>
          </Link>
        )}

        {canShare && (
          <Link
            to="/add-food"
            className={`flex flex-col items-center ${getActiveClass('/add-food')}`}
          >
            <PlusSquare size={iconSize} />
            <span className={`${textClass} mt-0.5 sm:mt-1`}>Share Food</span>
          </Link>
        )}

        <Link
          to="/profile"
          className={`flex flex-col items-center ${getActiveClass('/profile')}`}
        >
          <User size={iconSize} />
          <span className={`${textClass} mt-0.5 sm:mt-1`}>Profile</span>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
