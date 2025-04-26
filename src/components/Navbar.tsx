
import { Home, PlusSquare, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  
  const getActiveClass = (path: string) => {
    return location.pathname === path 
      ? "text-foodie-green" 
      : "text-gray-500";
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-white py-2 px-6 z-10">
      <div className="flex justify-around items-center max-w-md mx-auto">
        <Link 
          to="/" 
          className={`flex flex-col items-center ${getActiveClass('/')}`}
        >
          <Home size={24} />
          <span className="text-xs mt-1">Home</span>
        </Link>
        
        <Link 
          to="/add-food" 
          className={`flex flex-col items-center ${getActiveClass('/add-food')}`}
        >
          <PlusSquare size={24} />
          <span className="text-xs mt-1">Share</span>
        </Link>
        
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
