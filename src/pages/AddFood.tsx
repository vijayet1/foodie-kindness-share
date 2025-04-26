
import { Camera, MapPin, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";

const AddFood = () => {
  return (
    <div className="pb-20 max-w-md mx-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background pt-6 pb-4 px-4 flex items-center">
        <Link to="/" className="mr-4">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-xl font-bold">Share Food</h1>
      </div>
      
      {/* Form */}
      <div className="px-4">
        {/* Image Upload */}
        <div className="h-52 bg-gray-100 rounded-xl flex flex-col items-center justify-center mb-6">
          <Camera size={32} className="text-gray-400" />
          <p className="text-gray-500 mt-2 text-sm">Add Photos</p>
          <p className="text-gray-400 text-xs mt-1">Up to 4 photos</p>
        </div>
        
        {/* Form Fields */}
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="text-sm font-medium text-gray-700 block mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              placeholder="What are you sharing?"
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-foodie-green focus:border-transparent"
            />
          </div>
          
          <div>
            <label htmlFor="description" className="text-sm font-medium text-gray-700 block mb-1">
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              placeholder="Add details about the food you're sharing..."
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-foodie-green focus:border-transparent resize-none"
            />
          </div>
          
          <div>
            <label htmlFor="location" className="text-sm font-medium text-gray-700 block mb-1">
              Pickup Location
            </label>
            <div className="relative">
              <input
                type="text"
                id="location"
                placeholder="Where can people pick up the food?"
                className="w-full p-3 pl-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-foodie-green focus:border-transparent"
              />
              <MapPin size={18} className="absolute left-3 top-3.5 text-gray-400" />
            </div>
          </div>
          
          <div>
            <label htmlFor="category" className="text-sm font-medium text-gray-700 block mb-1">
              Category
            </label>
            <select
              id="category"
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-foodie-green focus:border-transparent bg-white"
            >
              <option value="" disabled selected>Select a category</option>
              <option value="fruits">Fruits</option>
              <option value="vegetables">Vegetables</option>
              <option value="prepared">Prepared Food</option>
              <option value="baked">Baked Goods</option>
              <option value="pantry">Pantry Items</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <button className="w-full bg-foodie-green text-white py-3 rounded-lg font-medium mt-6">
            Share Food
          </button>
        </div>
      </div>
      
      <Navbar />
    </div>
  );
};

export default AddFood;
