
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface RequestButtonProps {
  listingId: string;
}

const RequestButton = ({ listingId }: RequestButtonProps) => {
  const [isRequesting, setIsRequesting] = useState(false);
  const { user } = useAuth();
  
  const handleRequest = async () => {
    if (!user) {
      toast.error("Please log in to request food");
      return;
    }
    
    try {
      setIsRequesting(true);
      
      // Check if user has already requested this listing
      const { data: existingClaims, error: checkError } = await supabase
        .from('food_claims')
        .select('id')
        .eq('listing_id', listingId)
        .eq('claimer_id', user.id)
        .single();
      
      if (existingClaims) {
        toast.info("You have already requested this item");
        return;
      }
      
      // Create new claim
      const { error } = await supabase
        .from('food_claims')
        .insert({
          listing_id: listingId,
          claimer_id: user.id,
          quantity_claimed: 1,
          status: 'pending'
        });
        
      if (error) {
        throw error;
      }
      
      toast.success("Request sent successfully!");
    } catch (error: any) {
      console.error("Error requesting food:", error);
      toast.error(error.message || "Failed to send request");
    } finally {
      setIsRequesting(false);
    }
  };
  
  return (
    <Button 
      onClick={handleRequest}
      disabled={isRequesting}
      className="w-full bg-foodie-green hover:bg-foodie-green/90"
    >
      {isRequesting ? "Sending..." : "Request"}
    </Button>
  );
};

export default RequestButton;
