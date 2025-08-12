
'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

export type FormState = {
  message: string;
  status: 'idle' | 'error' | 'success';
};

export async function addComment(nomineeId: string, prevState: FormState, formData: FormData): Promise<FormState> {
  const supabase = createClient();
  if (!supabase) return { status: 'error', message: 'Database connection failed.' };

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { status: 'error', message: 'You must be logged in to comment.' };
  
  const commentSchema = z.object({
    comment: z.string().min(1, 'Comment cannot be empty.'),
  });

  const rawFormData = { comment: formData.get('comment') };
  const parsed = commentSchema.safeParse(rawFormData);
  
  if (!parsed.success) {
    return { status: 'error', message: parsed.error.flatten().fieldErrors.comment?.[0] || "Invalid comment." };
  }

  const { error } = await supabase.from('comments').insert({
    nominee_id: nomineeId,
    user_id: user.id,
    content: parsed.data.comment,
  });

  if (error) {
    console.error('Error adding comment:', error);
    return { status: 'error', message: 'Failed to add comment.' };
  }

  revalidatePath(`/nominees/${nomineeId}`);
  return { status: 'success', message: 'Your comment has been added.' };
}


export async function likeNominee(nomineeId: string, prevState: FormState, formData: FormData): Promise<FormState> {
    const supabase = createClient();
    if (!supabase) return { status: 'error', message: 'Database connection failed.' };
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { status: 'error', message: 'You must be logged in to like a nominee.' };

    const { error } = await supabase.rpc('increment_like', { nominee_id_arg: nomineeId, user_id_arg: user.id });

    if (error) {
        if (error.code === '23505') { // unique_violation
            return { status: 'error', message: 'You have already liked this nominee.' };
        }
        console.error('Error liking nominee:', error);
        return { status: 'error', message: 'Failed to record like.' };
    }
    
    revalidatePath(`/nominees/${nomineeId}`);
    return { status: 'success', message: 'You liked this nominee!' };
}
