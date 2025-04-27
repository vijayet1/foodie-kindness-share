import { useState } from "react";
import { Camera, MapPin, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";

const AddFood = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("You must be logged in to share food");
      navigate("/auth");
      return;
    }

    if (!formData.title || !formData.description || !formData.category || !formData.location) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      let photoUrl = "";

      // Upload photo if available
      if (photo) {
        const fileName = `${user.id}-${Date.now()}.${photo.name.split('.').pop()}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('food-images')
          .upload(fileName, photo);

        if (uploadError) throw uploadError;

        photoUrl = supabase.storage.from('food-images').getPublicUrl(fileName).data.publicUrl;
      }

      // Save food listing
      const { error } = await supabase
        .from('food_listings')
        .insert({
          user_id: user.id,
          title: formData.title,
          description: formData.description,
          category: formData.category,
          location: formData.location,
          image_url: photoUrl || null,
          status: 'available'
        });

      if (error) throw error;

      toast.success("Food listing created successfully!");
      navigate("/");

    } catch (error: any) {
      toast.error(error.message || "Failed to create food listing");
      console.error("Error sharing food:", error);
    } finally {
      setLoading(false);
    }
  };

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
        <div className="relative h-52 bg-gray-100 rounded-xl flex flex-col items-center justify-center mb-6">
          {photoPreview ? (
            <img
              src={photoPreview}
              alt="Food preview"
              className="w-full h-full object-cover rounded-xl"
            />
          ) : (
            <>
              <Camera size={32} className="text-gray-400" />
              <p className="text-gray-500 mt-2 text-sm">Add Photos</p>
              <p className="text-gray-400 text-xs mt-1">Up to 4 photos</p>
            </>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="text-sm font-medium text-gray-700 block mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="What are you sharing?"
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-foodie-green focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="text-sm font-medium text-gray-700 block mb-1">
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Add details about the food you're sharing..."
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-foodie-green focus:border-transparent resize-none"
              required
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
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Where can people pick up the food?"
                className="w-full p-3 pl-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-foodie-green focus:border-transparent"
                required
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
              value={formData.category}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-foodie-green focus:border-transparent bg-white"
              required
            >
              <option value="" disabled>Select a category</option>
              <option value="fruits">Fruits</option>
              <option value="vegetables">Vegetables</option>
              <option value="prepared">Prepared Food</option>
              <option value="baked">Baked Goods</option>
              <option value="pantry">Pantry Items</option>
              <option value="other">Other</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-foodie-green text-white py-3 rounded-lg font-medium mt-6"
            disabled={loading}
          >
            {loading ? "Uploading..." : "Share Food"}
          </button>
        </form>
      </div>

      <Navbar />
    </div>
  );
};

export default AddFood;
