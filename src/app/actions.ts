'use server';

import { z } from 'zod';
import { VOTE_CATEGORIES } from './data';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const createVoteSchema = () => {
  const schemaObject = VOTE_CATEGORIES.reduce((acc, category) => {
    if (!category.tbd) {
      acc[category.id] = z.string({ required_error: `Please make a selection for ${category.title}.` });
    }
    return acc;
  }, {} as Record<string, z.ZodString>);

  return z.object(schemaObject);
};

export type FormState = {
  message: string;
  status: 'idle' | 'error';
};

export async function submitVote(prevState: FormState, formData: FormData): Promise<FormState> {
  const supabase = createClient();
  const voteSchema = createVoteSchema();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return {
      message: 'Authentication error. Please log in again.',
      status: 'error',
    };
  }

  const rawFormData = Object.fromEntries(formData.entries());
  const parsed = voteSchema.safeParse(rawFormData);

  if (!parsed.success) {
    const firstError = Object.values(parsed.error.flatten().fieldErrors)[0]?.[0];
    return {
      message: firstError || 'Please ensure you have voted in all categories.',
      status: 'error',
    };
  }

  try {
    // First, check if a vote already exists for this user.
    const { data: existingVote, error: checkError } = await supabase
      .from('votes')
      .select('user_id')
      .eq('user_id', user.id)
      .maybeSingle();

    // If there's an error during the check (and it's not a "no rows" error which is fine)
    if (checkError) {
      console.error('Error checking for existing vote:', checkError);
      return { message: 'A server error occurred while checking your vote. Please try again.', status: 'error' };
    }

    // If a vote already exists, we redirect to the thanks page to prevent confusion.
    if (existingVote) {
      return redirect('/thanks');
    }

    // If no vote exists, proceed to insert the new one.
    const voteData = {
      ...parsed.data,
      user_id: user.id,
    };
    
    const { error: insertError } = await supabase.from('votes').insert(voteData);

    if (insertError) {
      console.error('Error inserting vote:', insertError);
      return { message: 'Failed to save your vote to the database. Please try again.', status: 'error' };
    }

    // On successful insertion, revalidate paths and redirect.
    revalidatePath('/');
    revalidatePath('/profile');
    
  } catch (error: any) {
    console.error('Unhandled error during vote submission:', error);
    return {
      message: 'An unexpected server error occurred. Please try again later.',
      status: 'error',
    };
  }

  // Redirect to the thank you page after a successful vote.
  redirect('/thanks');
}
