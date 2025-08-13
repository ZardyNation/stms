
'use server';

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import type { Category, Nominee } from '@/types';

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

export async function getFeaturedNominees(): Promise<Nominee[]> {
    const supabase = createClient();
    if (!supabase) return [];

    const { data, error } = await supabase
        .from('nominees')
        .select('*')
        .limit(10); // Adjust limit as needed

    if (error) {
        console.error('Error fetching featured nominees:', error);
        return [];
    }

    // Since Supabase doesn't have a built-in random(), we'll shuffle the results that we get.
    return data.sort(() => 0.5 - Math.random()).slice(0, 6);
}


const createVoteSchema = async () => {
  const categories = await getCategories();
  const schemaObject = categories.reduce((acc, category) => {
    if (!category.tbd) {
      acc[category.id] = z.string().optional();
    }
    return acc;
  }, {} as Record<string, z.ZodString | z.ZodOptional<z.ZodString>>);

  // Add email to the schema
  schemaObject.email = z.string().email("Please enter a valid email address.");

  return z.object(schemaObject);
};

export type FormState = {
  message: string;
  status: 'idle' | 'error' | 'success' | 'email_required';
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
  
  const email = formData.get('email') as string;
  
  if (!email) {
    return { message: "Email is required to vote.", status: "email_required" };
  }

  const rawFormData = Object.fromEntries(formData.entries());
  
  const filteredFormData = Object.entries(rawFormData).reduce((acc, [key, value]) => {
    if (value && key !== 'email') { // Exclude email from nominee selections
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
  
  const parsed = voteSchema.safeParse(rawFormData);
  
  if (!parsed.success) {
      const emailError = parsed.error.flatten().fieldErrors.email?.[0];
      if (emailError) {
          return { message: emailError, status: 'error' };
      }
    return {
      message: 'There was an error with your submission. Please try again.',
      status: 'error',
    };
  }

  try {
    const { data: existingVote, error: checkError } = await supabase
      .from('votes')
      .select('email')
      .eq('email', parsed.data.email)
      .maybeSingle();

    if (checkError) {
      console.error('Error checking for existing vote:', checkError);
      return { message: 'A server error occurred while checking your vote. Please try again.', status: 'error' };
    }

    if (existingVote) {
      return {
        message: 'This email address has already been used to vote.',
        status: 'error',
      };
    }

    const selections: Record<string, string> = {};
     for (const key in parsed.data) {
        if (key !== 'email' && parsed.data[key as keyof typeof parsed.data]) {
            selections[key] = parsed.data[key as keyof typeof parsed.data] as string;
        }
    }

    const voteData = {
      email: parsed.data.email,
      selections: selections
    };
    
    const { error: insertError } = await supabase.from('votes').insert(voteData);

    if (insertError) {
      console.error('Error inserting vote:', insertError);
      return { message: 'Failed to save your vote to the database. Please try again.', status: 'error' };
    }

    revalidatePath('/');
    
  } catch (error: any) {
    console.error('Unhandled error during vote submission:', error);
    return {
      message: 'An unexpected server error occurred. Please try again later.',
      status: 'error',
    };
  }

  redirect('/thanks');
}
