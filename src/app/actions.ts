'use server';

import { z } from 'zod';
import { VOTE_CATEGORIES } from './data';

const createVoteSchema = () => {
  const schemaObject = VOTE_CATEGORIES.reduce((acc, category) => {
    if (!category.tbd) {
      acc[category.id] = z.string().optional();
    }
    return acc;
  }, {} as Record<string, z.ZodOptional<z.ZodString>>);

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
    console.error('Validation Error:', parsed.error.flatten().fieldErrors);
    return {
      message: parsed.error.flatten().fieldErrors.email?.[0] || 'There was an error with your submission.',
      status: 'error',
    };
  }
  
  const data = parsed.data;

  // In a real application, you would save the vote to a database here.
  // We'll simulate that process.
  console.log('Vote Submitted:', data);

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    message: 'Thank you for voting! Your submission has been received.',
    status: 'success',
  };
}
