
'use server';

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

const nominationSchema = z.object({
  nominee_name: z.string().min(1, "Nominee's name is required."),
  nominee_org: z.string().optional(),
  category_id: z.string().min(1, "Please select a category."),
  reason: z.string().min(20, "Please provide a reason of at least 20 characters."),
  nominator_name: z.string().min(1, "Your name is required."),
  nominator_email: z.string().email("Please enter a valid email address."),
});

export type FormState = {
  message: string;
  status: 'idle' | 'error' | 'success';
};

export async function submitNomination(prevState: FormState, formData: FormData): Promise<FormState> {
  const supabase = createClient();
  if(!supabase) {
    return {
      message: 'Database connection failed.',
      status: 'error',
    }
  }

  const parsed = nominationSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) {
    const errorMessages = Object.values(parsed.error.flatten().fieldErrors).flat().join(' ');
    return {
      message: `There was an error with your submission. ${errorMessages}`,
      status: 'error',
    };
  }

  const { error } = await supabase.from('nominations').insert([
    parsed.data,
  ]);

  if (error) {
    console.error('Error inserting nomination:', error);
    return {
      message: 'A database error occurred. Please try again.',
      status: 'error',
    };
  }
  
  revalidatePath('/nominate');

  return {
    message: "Thank you! Your nomination has been successfully submitted.",
    status: 'success',
  };
}
