'use server';

import { z } from 'zod';
import { VOTE_CATEGORIES } from './data';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const createVoteSchema = () => {
  const schemaObject = VOTE_CATEGORIES.reduce((acc, category) => {
    if (!category.tbd) {
      acc[category.id] = z.string({ required_error: `Please select a nominee for ${category.title}.` });
    }
    return acc;
  }, {} as Record<string, z.ZodString>);

  return z.object(schemaObject);
};

export type FormState = {
  message: string;
  status: 'idle' | 'success' | 'error';
};

export async function submitVote(prevState: FormState, formData: FormData): Promise<FormState> {
  const supabase = createClient();
  const voteSchema = createVoteSchema();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return {
      message: 'You must be logged in to vote.',
      status: 'error',
    };
  }

  const rawFormData = Object.fromEntries(formData.entries());
  
  const parsed = voteSchema.safeParse(rawFormData);

  if (!parsed.success) {
    const firstError = Object.values(parsed.error.flatten().fieldErrors)[0]?.[0];

    return {
      message: firstError || 'There was an error with your submission.',
      status: 'error',
    };
  }
  
  const voteData = {
    ...parsed.data,
    user_id: user.id,
  };

  try {
    // Check if the user has already voted
    const { data: existingVote, error: selectError } = await supabase
      .from('votes')
      .select('user_id')
      .eq('user_id', user.id)
      .single();

    if (selectError && selectError.code !== 'PGRST116') { // PGRST116: "No rows found"
      throw selectError;
    }

    if (existingVote) {
      return {
        message: 'You have already voted.',
        status: 'error',
      };
    }
    
    // Save the vote to the database
    const { error: insertError } = await supabase.from('votes').insert([voteData]);

    if (insertError) {
      throw insertError;
    }

    revalidatePath('/');
    revalidatePath('/results');
    revalidatePath('/profile');
    
  } catch (error: any) {
    console.error('Supabase Error:', error);
    return {
      message: 'A server error occurred. Please try again later.',
      status: 'error',
    };
  }
  
  redirect('/thanks');
}
