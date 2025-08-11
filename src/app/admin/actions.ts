'use server';

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { Nominee } from '@/types';
import { randomUUID } from 'crypto';


const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const nomineeSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  organization: z.string().min(1, 'Organization is required'),
  photo: z
    .any()
    .refine((file) => !file || (file instanceof File && file.size <= MAX_FILE_SIZE), `Max image size is 5MB.`)
    .refine(
      (file) => !file || (file instanceof File && ACCEPTED_IMAGE_TYPES.includes(file.type)),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ).optional(),
  aiHint: z.string().optional(),
  category_id: z.string().min(1, 'Category is required'),
  existing_photo_url: z.string().url().optional(),
});


export async function saveNominee(formData: FormData): Promise<{ success: boolean; message: string }> {
  const supabase = createClient();
  if (!supabase) return { success: false, message: 'Database connection failed.' };

  const rawFormData = Object.fromEntries(formData.entries());

  const parsed = nomineeSchema.safeParse({
    ...rawFormData,
    photo: rawFormData.photo instanceof File && (rawFormData.photo as File).size > 0 ? rawFormData.photo : undefined,
  });

  if (!parsed.success) {
    console.error('Validation errors:', parsed.error.flatten().fieldErrors);
    return { success: false, message: 'Invalid data submitted. ' + (parsed.error.flatten().fieldErrors.photo?.[0] ?? '') };
  }

  const { id, name, organization, photo, aiHint, category_id, existing_photo_url } = parsed.data;

  let photoUrl = existing_photo_url || 'https://placehold.co/128x128.png';

  if (photo instanceof File) {
    const fileExtension = photo.name.split('.').pop();
    const fileName = `${randomUUID()}.${fileExtension}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('nominee-photos')
      .upload(fileName, photo, {
          cacheControl: '3600',
          upsert: true,
      });

    if (uploadError) {
      console.error('Error uploading photo:', uploadError);
      return { success: false, message: 'Failed to upload photo.' };
    }
    
    const { data: { publicUrl } } = supabase.storage.from('nominee-photos').getPublicUrl(uploadData.path);
    photoUrl = publicUrl;
  }
  
  const nomineeData = {
    id: id || randomUUID(),
    name,
    organization,
    photo: photoUrl,
    aiHint: aiHint || '',
    category_id,
  };

  let error;
  if (id) {
    const { error: updateError } = await supabase.from('nominees').update(nomineeData).eq('id', id);
    error = updateError;
  } else {
    const { error: insertError } = await supabase.from('nominees').insert(nomineeData);
    error = insertError;
  }

  if (error) {
    console.error('Error saving nominee:', error);
    return { success: false, message: 'Failed to save nominee to the database.' };
  }

  revalidatePath('/admin');
  revalidatePath('/');
  return { success: true, message: 'Nominee saved successfully.' };
}

export async function deleteNominee(nomineeId: string): Promise<{ success: boolean, message: string }> {
    const supabase = createClient();
    if (!supabase) return { success: false, message: 'Database connection failed.' };

    const { error } = await supabase.from('nominees').delete().eq('id', nomineeId);

    if (error) {
        console.error('Error deleting nominee:', error);
        return { success: false, message: 'Failed to delete nominee.' };
    }

    revalidatePath('/admin');
    revalidatePath('/');
    return { success: true, message: 'Nominee deleted.' };
}
