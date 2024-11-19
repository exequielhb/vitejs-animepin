import { createClient } from '@supabase/supabase-js';
import toast from 'react-hot-toast';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    fetch: (...args) => {
      return fetch(...args).catch(err => {
        toast.error('Network error. Please check your connection.');
        throw err;
      });
    }
  }
});

export const categories = [
  'Anime', 'Concept', 'Fantasy', 'Kaemono', 'Furry', 
  'Sci-Fi', 'Vtubers', 'Other'
];

export async function uploadImage(file: File, title: string, category: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User must be logged in to upload images');
    }

    if (!file.type.startsWith('image/')) {
      throw new Error('Invalid file type. Only images are allowed.');
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File size too large. Maximum size is 5MB.');
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `public/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      throw new Error('Failed to upload image to storage');
    }

    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);

    const { error: dbError } = await supabase
      .from('anime_images')
      .insert([{
        title,
        url: publicUrl,
        storage_path: filePath,
        category,
        user_id: user.id,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (dbError) {
      console.error('Database insert error:', dbError);
      await supabase.storage.from('images').remove([filePath]);
      throw new Error('Failed to save image information');
    }

    return { url: publicUrl, title, category };
  } catch (error) {
    console.error('Upload process error:', error);
    throw error;
  }
}

export async function deleteImage(imageId: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Please sign in to delete images');
    }

    // Get image data first to get the storage path
    const { data: image, error: fetchError } = await supabase
      .from('anime_images')
      .select('storage_path, user_id')
      .eq('id', imageId)
      .single();

    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        throw new Error('Image not found');
      }
      throw new Error('Failed to fetch image data');
    }

    if (!image) {
      throw new Error('Image not found');
    }

    if (image.user_id !== user.id) {
      throw new Error('You can only delete your own images');
    }

    // Delete from database first
    const { error: dbError } = await supabase
      .from('anime_images')
      .delete()
      .eq('id', imageId);

    if (dbError) {
      throw new Error(`Failed to delete image: ${dbError.message}`);
    }

    // Then delete from storage
    const { error: storageError } = await supabase.storage
      .from('images')
      .remove([image.storage_path]);

    if (storageError) {
      console.error('Storage deletion error:', storageError);
      // Don't throw here as the database record is already deleted
      // Just log the error and continue
    }

    return true;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('An unexpected error occurred while deleting the image');
  }
}

export async function getImages(searchQuery?: string, category?: string) {
  try {
    let query = supabase
      .from('anime_images')
      .select('*')
      .order('created_at', { ascending: false });

    if (searchQuery) {
      query = query.ilike('title', `%${searchQuery}%`);
    }

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Query error:', error);
      throw new Error('Failed to fetch images');
    }

    if (!data) {
      return [];
    }

    return data.map(img => ({
      id: img.id,
      title: img.title,
      url: img.url,
      category: img.category,
      userId: img.user_id
    }));
  } catch (error) {
    console.error('Get images error:', error);
    if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error('Failed to fetch images. Please try again later.');
    }
    return [];
  }
}