
import { Badge } from "@/components/ui/badge";
import RequestButton from "@/components/RequestButton";
import { useAuth } from "@/contexts/AuthContext";
import { format, isPast } from "date-fns";

interface FoodItemProps {
  id: string;
  title: string;
  description: string;
  location: string;
  distance?: string;
  timePosted: string;
  imageUrl: string;
  category: string;
  listingId: string;
  userId: string;
  expiryDate?: string | null;
  status?: string;
}

const FoodItem = ({
  id,
  title,
  description,
  location,
  distance,
  timePosted,
  imageUrl,
  category,
  listingId,
  userId,
  expiryDate,
  status
}: FoodItemProps) => {
  const { user } = useAuth();
  const isOwnListing = userId === user?.id;
  
  // Check if the food is expired
  const isExpired = expiryDate && isPast(new Date(expiryDate));
  
  // Check if the food has been claimed
  const isClaimed = status === 'claimed';
  
  const getCategoryColor = (cat: string) => {
    const categories: Record<string, string> = {
      fruits: "bg-green-100 text-green-800",
      vegetables: "bg-emerald-100 text-emerald-800",
      prepared: "bg-blue-100 text-blue-800",
      baked: "bg-yellow-100 text-yellow-800", 
      pantry: "bg-orange-100 text-orange-800",
      other: "bg-gray-100 text-gray-800",
    };
    return categories[cat] || categories.other;
  };

  return (
    <div className={`relative ${isExpired ? 'opacity-70' : ''}`}>
      <div className="relative">
        <img 
          src={imageUrl} 
          alt={title} 
          className={`w-full h-48 object-cover ${isExpired ? 'grayscale' : ''}`}
        />
        <Badge 
          className={`absolute top-3 right-3 ${getCategoryColor(category)}`}
        >
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </Badge>
        
        {/* Status Watermarks */}
        {isExpired && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-red-500 bg-opacity-70 text-white font-bold py-2 px-4 rotate-[-30deg] transform text-xl">
              EXPIRED
            </div>
          </div>
        )}
        
        {!isExpired && isClaimed && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-green-500 bg-opacity-70 text-white font-bold py-2 px-4 rotate-[-30deg] transform text-xl">
              CLAIMED
            </div>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg">{title}</h3>
        <p className="text-gray-600 text-sm line-clamp-2 mb-2">{description}</p>
        <div className="flex justify-between text-xs text-gray-500 mb-3">
          <span>📍 {location} {distance && `· ${distance}`}</span>
          <span>{timePosted}</span>
        </div>
        {expiryDate && (
          <div className="text-xs text-gray-500 mb-3">
            Expires: {format(new Date(expiryDate), 'MMM d, yyyy')}
          </div>
        )}
        {!isOwnListing && !isExpired && (
          <RequestButton listingId={listingId} />
        )}
        {isOwnListing && (
          <div className="text-sm text-foodie-green font-medium py-2 px-4 border border-foodie-green rounded-md text-center">
            Your Listing
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodItem;
