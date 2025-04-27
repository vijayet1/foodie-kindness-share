-- Function to check if a table exists
CREATE OR REPLACE FUNCTION public.check_table_exists(table_name text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  exists_val boolean;
BEGIN
  SELECT EXISTS (
    SELECT FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name = $1
  ) INTO exists_val;

  RETURN exists_val;
END;
$$;

-- Grant access to the check_table_exists function
GRANT EXECUTE ON FUNCTION public.check_table_exists TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_table_exists TO service_role;

-- Function to create the food_listings table if it doesn't exist
CREATE OR REPLACE FUNCTION public.create_food_listings_table()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if the table already exists
  IF NOT public.check_table_exists('food_listings') THEN
    -- Create the food_listings table
    CREATE TABLE public.food_listings (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID NOT NULL REFERENCES auth.users(id),
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      location TEXT NOT NULL,
      image_url TEXT,
      status TEXT NOT NULL DEFAULT 'available',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Add comments
    COMMENT ON TABLE public.food_listings IS 'Table for food listings that users can share';

    -- Create RLS policies
    ALTER TABLE public.food_listings ENABLE ROW LEVEL SECURITY;

    -- Policy for reading food listings (anyone can read)
    CREATE POLICY "Anyone can read food listings"
      ON public.food_listings
      FOR SELECT
      USING (true);

    -- Policy for inserting food listings (authenticated users only)
    CREATE POLICY "Authenticated users can insert food listings"
      ON public.food_listings
      FOR INSERT
      WITH CHECK (auth.uid() = user_id);

    -- Policy for updating food listings (owner only)
    CREATE POLICY "Users can update their own food listings"
      ON public.food_listings
      FOR UPDATE
      USING (auth.uid() = user_id);

    -- Policy for deleting food listings (owner only)
    CREATE POLICY "Users can delete their own food listings"
      ON public.food_listings
      FOR DELETE
      USING (auth.uid() = user_id);

    RETURN true;
  ELSE
    RETURN false;
  END IF;
END;
$$;

-- Grant access to the create_food_listings_table function
GRANT EXECUTE ON FUNCTION public.create_food_listings_table TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_food_listings_table TO service_role;

-- Create profiles table if it doesn't exist
CREATE OR REPLACE FUNCTION public.create_profiles_table()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if the table already exists
  IF NOT public.check_table_exists('profiles') THEN
    -- Create the profiles table
    CREATE TABLE public.profiles (
      id UUID PRIMARY KEY REFERENCES auth.users(id),
      email TEXT,
      name TEXT,
      avatar_url TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Add comments
    COMMENT ON TABLE public.profiles IS 'Profile information for users';

    -- Create RLS policies
    ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

    -- Policy for reading profiles (anyone can read)
    CREATE POLICY "Anyone can read profiles"
      ON public.profiles
      FOR SELECT
      USING (true);

    -- Policy for creating profiles (must be the profile owner)
    CREATE POLICY "Users can insert their own profile"
      ON public.profiles
      FOR INSERT
      WITH CHECK (auth.uid() = id);

    -- Policy for updating profiles (must be the profile owner)
    CREATE POLICY "Users can update their own profile"
      ON public.profiles
      FOR UPDATE
      USING (auth.uid() = id);

    RETURN true;
  ELSE
    RETURN false;
  END IF;
END;
$$;

-- Grant access to the create_profiles_table function
GRANT EXECUTE ON FUNCTION public.create_profiles_table TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_profiles_table TO service_role;

-- Create both tables on migration run
SELECT public.create_profiles_table();
SELECT public.create_food_listings_table();