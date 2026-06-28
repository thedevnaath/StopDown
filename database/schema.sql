-- Create a table for user profiles
CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users NOT NULL PRIMARY KEY,
  updated_at timestamp with time zone DEFAULT now(),
  username text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  website text,

  CONSTRAINT username_length CHECK (char_length(username) >= 3)
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone."
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile."
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile."
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create a trigger for the 'updated_at' column
-- This trigger automatically updates the 'updated_at' column on row updates.
-- The 'moddatetime' function is typically available in Supabase projects.
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION moddatetime('updated_at');

-- Function to handle new user sign-ups
-- This function automatically creates a profile entry for new users
-- when they sign up via Supabase Auth.
CREATE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (new.id, new.email); -- Initializes username with email, which can be updated later

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Link the function to the auth.users table
-- This trigger fires after a new user is inserted into auth.users.
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();