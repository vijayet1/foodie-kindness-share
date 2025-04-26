
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

const AddFoodButton = () => {
  return (
    <Link
      to="/add-food"
      className="fixed bottom-20 right-6 bg-foodie-orange text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg"
    >
      <Plus size={24} />
    </Link>
  );
};

export default AddFoodButton;
