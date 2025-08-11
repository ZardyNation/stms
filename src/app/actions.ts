'use server';

import { z } from 'zod';
import { VOTE_CATEGORIES } from './data';
import { supabase } from '@/lib/supabase';

const createVoteSchema = () => {
  const schemaObject = VOTE_CATEGORIES.reduce((acc, category) => {
    if (!category.tbd) {
      acc[category.id] = z.string({ required_error: `Please select a nominee for ${category.title}.` });
    }
    return acc;
  }, {} as Record<string, z.ZodString>);

  schemaObject.email = z.string().email({ message: 'A valid email is required to vote.' });

  return z.object(schemaObject);
};

export type FormState = {
  message: string;
  status: 'idle' | 'success' | 'error';
};

export async function submitVote(prevState: FormState, formData: FormData): Promise<FormState> {
  const voteSchema = createVoteSchema();

  const rawFormData = Object.fromEntries(formData.entries());
  
  const parsed = voteSchema.safeParse(rawFormData);

  if (!parsed.success) {
    const firstError = Object.values(parsed.error.flatten().fieldErrors)[0]?.[0];

    return {
      message: firstError || 'There was an error with your submission.',
      status: 'error',
    };
  }
  
  const data = parsed.data;

  try {
    // Check if the email has already voted
    const { data: existingVote, error: selectError } = await supabase
      .from('votes')
      .select('email')
      .eq('email', data.email)
      .single();

    if (selectError && selectError.code !== 'PGRST116') { // PGRST116: "No rows found"
      throw selectError;
    }

    if (existingVote) {
      return {
        message: 'This email address has already been used to vote.',
        status: 'error',
      };
    }
    
    // Save the vote to the database
    const { error: insertError } = await supabase.from('votes').insert([data]);

    if (insertError) {
      throw insertError;
    }

    return {
      message: 'Thank you for voting! Your submission has been received.',
      status: 'success',
    };
  } catch (error: any) {
    console.error('Supabase Error:', error);
    return {
      message: 'A server error occurred. Please try again later.',
      status: 'error',
    };
  }
}
