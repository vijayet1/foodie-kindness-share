import { Home, PlusSquare, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const location = useLocation();
  const { userType } = useAuth();

  const getActiveClass = (path: string) => {
    return location.pathname === path
      ? "text-foodie-green"
      : "text-gray-500";
  };

  // Only show share option for individuals and organizations
  const canShare = userType === 'individual' || userType === 'orgs';

  // Only show find food option for individuals and charity organizations
  const canFind = userType === 'individual' || userType === 'charity_orgs';

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-white py-2 px-6 z-10">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {canFind && (
          <Link
            to="/"
            className={`flex flex-col items-center ${getActiveClass('/')}`}
          >
            <Home size={24} />
            <span className="text-xs mt-1">Find Food</span>
          </Link>
        )}

        {canShare && (
          <Link
            to="/add-food"
            className={`flex flex-col items-center ${getActiveClass('/add-food')}`}
          >
            <PlusSquare size={24} />
            <span className="text-xs mt-1">Share</span>
          </Link>
        )}

        <Link
          to="/profile"
          className={`flex flex-col items-center ${getActiveClass('/profile')}`}
        >
          <User size={24} />
          <span className="text-xs mt-1">Profile</span>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
