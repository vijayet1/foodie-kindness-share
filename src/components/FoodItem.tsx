
import { Badge } from "@/components/ui/badge";
import RequestButton from "@/components/RequestButton";

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
  listingId
}: FoodItemProps) => {
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
    <div>
      <div className="relative">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-48 object-cover"
        />
        <Badge 
          className={`absolute top-3 right-3 ${getCategoryColor(category)}`}
        >
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </Badge>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg">{title}</h3>
        <p className="text-gray-600 text-sm line-clamp-2 mb-2">{description}</p>
        <div className="flex justify-between text-xs text-gray-500 mb-3">
          <span>📍 {location} {distance && `· ${distance}`}</span>
          <span>{timePosted}</span>
        </div>
        <RequestButton listingId={listingId} />
      </div>
    </div>
  );
};

export default FoodItem;
