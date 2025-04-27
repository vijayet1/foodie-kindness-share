import { User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

interface UserAvatarProps {
  imageUrl?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  useAuthUser?: boolean;
}

const UserAvatar = ({ 
  imageUrl, 
  className, 
  size = "md",
  useAuthUser = false
}: UserAvatarProps) => {
  const { user } = useAuth();
  
  // Get avatar URL from auth user if specified
  const avatarUrl = useAuthUser 
    ? user?.user_metadata?.avatar_url || imageUrl
    : imageUrl;
  
  const sizeClassMap = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-16 h-16"
  };
  
  const sizeClass = sizeClassMap[size];
  
  return (
    <div className={cn(
      "rounded-full bg-gray-200 flex items-center justify-center overflow-hidden",
      sizeClass,
      className
    )}>
      {avatarUrl ? (
        <img 
          src={avatarUrl} 
          alt="User avatar" 
          className="w-full h-full object-cover"
        />
      ) : (
        <User className="text-gray-500" size={size === "lg" ? 32 : 20} />
      )}
    </div>
  );
};

export default UserAvatar;
