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
      // First, ensure the food_listings table exists by directly running SQL
      try {
        // Check if table exists with RPC
        const { error: sqlError } = await supabase.rpc('check_table_exists', { table_name: 'food_listings' });
        
        if (sqlError) {
          console.log("Creating food_listings table...");
          // Create table via SQL if RPC fails (table likely doesn't exist)
          const { error: createTableError } = await supabase.rpc('create_food_listings_table');
          
          if (createTableError) {
            console.error("Failed to create table:", createTableError);
            toast.error("Could not create database table. Please contact support.");
            setLoading(false);
            return;
          }
        }
      } catch (tableError) {
        console.error("Error checking/creating table:", tableError);
      }

      let photoUrl = "";

      // Upload photo if available - with enhanced error handling
      if (photo) {
        try {
          const fileName = `${user.id}-${Date.now()}-${photo.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
          
          console.log("Checking storage buckets...");
          // First, check if the bucket exists
          const { data: buckets, error: bucketListError } = await supabase.storage.listBuckets();
          
          if (bucketListError) {
            console.error("Error listing buckets:", bucketListError);
            throw new Error(`Error listing buckets: ${bucketListError.message}`);
          }
          
          const bucketExists = buckets?.some(bucket => bucket.name === 'food-images');
          console.log("Bucket exists:", bucketExists);
          
          // If bucket doesn't exist, create it
          if (!bucketExists) {
            console.log("Creating bucket 'food-images'...");
            const { data: newBucket, error: createBucketError } = await supabase.storage.createBucket('food-images', {
              public: true, // Make the bucket public so images can be accessed
              fileSizeLimit: 1024 * 1024 * 2 // 2MB limit
            });
            
            if (createBucketError) {
              console.error("Error creating bucket:", createBucketError);
              throw new Error(`Couldn't create storage bucket: ${createBucketError.message}`);
            }
            
            console.log("Bucket created:", newBucket);
          }

          // Create a public CORS policy for the bucket
          try {
            console.log("Setting bucket policy...");
            await supabase.storage.updateBucket('food-images', {
              public: true
            });
            console.log("Bucket policy set to public");
          } catch (policyError) {
            console.error("Error setting bucket policy:", policyError);
            // Continue anyway
          }

          // Now upload the file
          console.log("Uploading image...");
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('food-images')
            .upload(fileName, photo, {
              cacheControl: '3600',
              upsert: false
            });

          if (uploadError) {
            console.error("Upload error details:", uploadError);
            throw new Error(`Image upload failed: ${uploadError.message}`);
          }
          
          console.log("Image uploaded successfully:", uploadData);

          // Get the public URL
          const { data: urlData } = supabase.storage
            .from('food-images')
            .getPublicUrl(fileName);
            
          photoUrl = urlData.publicUrl;
          console.log("Public image URL:", photoUrl);
        } catch (uploadErr: any) {
          console.error("Image upload error:", uploadErr);
          toast.error(`Image upload failed: ${uploadErr.message}`);
          // Continue without image if upload fails
        }
      }

      // Make sure user profile exists first
      console.log("Checking/creating user profile...");
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email,
          created_at: new Date().toISOString()
        });
        
      if (profileError) {
        console.error("Error creating/updating profile:", profileError);
      }

      // Save food listing with detailed debug information
      const foodListing = {
        user_id: user.id,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        location: formData.location,
        image_url: photoUrl || null,
        status: 'available'
      };
      
      console.log("Attempting to insert food listing:", foodListing);
      
      const { data: insertData, error: insertError } = await supabase
        .from('food_listings')
        .insert(foodListing)
        .select();

      if (insertError) {
        console.error("Supabase insert error details:", insertError);
        
        // Try to provide more specific error messages based on the error code
        if (insertError.code === '42P01') {
          toast.error("Database table doesn't exist. Please contact support.");
        } else if (insertError.code === '23505') {
          toast.error("A similar food listing already exists.");
        } else if (insertError.code === '23503') {
          toast.error("User account reference error. Please try logging out and in again.");
        } else if (insertError.code === '42501') {
          toast.error("Permission denied. You may not have access to create listings.");
        } else {
          toast.error(`Database error: ${insertError.message}`);
        }
        throw insertError;
      }

      console.log("Food listing created successfully:", insertData);
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
