
import { User } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  imageUrl?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const UserAvatar = ({ 
  imageUrl, 
  className, 
  size = "md" 
}: UserAvatarProps) => {
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
      {imageUrl ? (
        <img 
          src={imageUrl} 
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
