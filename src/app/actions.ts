
'use server';

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { Category } from '@/types';

async function getCategories(): Promise<Category[]> {
  const supabase = createClient();
  if (!supabase) return [];
  const { data, error } = await supabase.from('categories').select(`
    id,
    title,
    tbd,
    nominees ( id, name, organization, photo, "aiHint" )
  `);
  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
  return data as Category[];
}


const createVoteSchema = async () => {
  const categories = await getCategories();
  const schemaObject = categories.reduce((acc, category) => {
    if (!category.tbd) {
      acc[category.id] = z.string().optional();
    }
    return acc;
  }, {} as Record<string, z.ZodString | z.ZodOptional<z.ZodString>>);

  return z.object(schemaObject);
};

export type FormState = {
  message: string;
  status: 'idle' | 'error' | 'success';
};

export async function submitVote(prevState: FormState, formData: FormData): Promise<FormState> {
  const supabase = createClient();
  const voteSchema = await createVoteSchema();

  if(!supabase) {
    return {
      message: 'Database connection failed.',
      status: 'error',
    }
  }

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return {
      message: 'Authentication error. Please log in again.',
      status: 'error',
    };
  }

  const rawFormData = Object.fromEntries(formData.entries());
  
  const filteredFormData = Object.entries(rawFormData).reduce((acc, [key, value]) => {
    if (value) {
      acc[key] = value;
    }
    return acc;
  }, {} as Record<string, any>);

  if (Object.keys(filteredFormData).length === 0) {
    return {
      message: 'You must select at least one nominee to submit your vote.',
      status: 'error',
    };
  }

  const parsed = voteSchema.safeParse(filteredFormData);

  if (!parsed.success) {
    return {
      message: 'There was an error with your submission. Please try again.',
      status: 'error',
    };
  }

  try {
    const { data: existingVote, error: checkError } = await supabase
      .from('votes')
      .select('user_id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (checkError) {
      console.error('Error checking for existing vote:', checkError);
      return { message: 'A server error occurred while checking your vote. Please try again.', status: 'error' };
    }

    if (existingVote) {
      return {
        message: 'You have already submitted your vote.',
        status: 'error',
      };
    }

    const voteData = {
      ...parsed.data,
      user_id: user.id,
    };
    
    const { error: insertError } = await supabase.from('votes').insert(voteData);

    if (insertError) {
      console.error('Error inserting vote:', insertError);
      return { message: 'Failed to save your vote to the database. Please try again.', status: 'error' };
    }

    revalidatePath('/');
    revalidatePath('/profile');
    
  } catch (error: any) {
    console.error('Unhandled error during vote submission:', error);
    return {
      message: 'An unexpected server error occurred. Please try again later.',
      status: 'error',
    };
  }

  redirect('/thanks');
}
