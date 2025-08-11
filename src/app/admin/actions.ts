'use server';

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { Nominee } from '@/types';

const nomineeSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  organization: z.string().min(1, 'Organization is required'),
  photo: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  aiHint: z.string().optional(),
  category_id: z.string().min(1, 'Category is required'),
});

type NomineeFormData = z.infer<typeof nomineeSchema>;

export async function saveNominee(formData: NomineeFormData): Promise<{ success: boolean; message: string }> {
  const supabase = createClient();
  if (!supabase) return { success: false, message: 'Database connection failed.' };

  const parsed = nomineeSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, message: 'Invalid data submitted.' };
  }

  const { id, name, organization, photo, aiHint, category_id } = parsed.data;

  const nomineeData: Omit<Nominee, 'id'> & { id?: string } = {
    name,
    organization,
    photo: photo || 'https://placehold.co/128x128.png',
    aiHint: aiHint || '',
    category_id,
  };

  let error;
  if (id) {
    // Update existing nominee
    const { error: updateError } = await supabase.from('nominees').update(nomineeData).eq('id', id);
    error = updateError;
  } else {
    // Create new nominee
    const { error: insertError } = await supabase.from('nominees').insert({
        ...nomineeData,
        id: name.toLowerCase().replace(/\s+/g, '-') + '-' + Math.random().toString(36).substring(2, 7)
    });
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
