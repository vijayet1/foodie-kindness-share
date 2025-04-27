
import { Clock, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface FoodItemProps {
  id: string;
  title: string;
  description: string;
  location: string;
  distance: string;
  timePosted: string;
  imageUrl: string;
  className?: string;
}

const FoodItem = ({
  id,
  title,
  description,
  location,
  distance,
  timePosted,
  imageUrl,
  className
}: FoodItemProps) => {
  return (
    <div className={cn(
      "bg-white rounded-xl overflow-hidden mb-4 food-card-shadow animate-fade-in",
      className
    )}>
      <div className="h-48 overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-4">
        <h3 className="font-bold text-lg">{title}</h3>
        <p className="text-gray-600 text-sm mt-1 line-clamp-2">{description}</p>

        <div className="flex items-center mt-3 text-gray-500">
          <MapPin size={16} />
          <span className="text-xs ml-1">{location} · {distance}</span>
        </div>

        <div className="flex items-center mt-2 text-gray-500">
          <Clock size={16} />
          <span className="text-xs ml-1">{timePosted}</span>
        </div>

        <button className="w-full mt-3 bg-foodie-green text-white py-2 rounded-lg font-medium">
          Request
        </button>
      </div>
    </div>
  );
};

export default FoodItem;
