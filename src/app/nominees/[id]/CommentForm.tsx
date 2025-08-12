
'use client';

import { useFormState } from 'react-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect, useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { likeNominee, addComment, FormState } from './actions';
import { Loader2, ThumbsUp } from 'lucide-react';

const commentSchema = z.object({
  comment: z.string().min(1, 'Comment cannot be empty.'),
});

type CommentFormData = z.infer<typeof commentSchema>;

const initialState: FormState = {
  message: '',
  status: 'idle',
};

export default function CommentForm({ nomineeId }: { nomineeId: string }) {
  const { toast } = useToast();
  const [commentState, commentFormAction] = useFormState(addComment.bind(null, nomineeId), initialState);
  const [likeState, likeAction] = useFormState(likeNominee.bind(null, nomineeId), initialState);

  const formRef = useRef<HTMLFormElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting: isCommentSubmitting },
  } = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
  });

  useEffect(() => {
    if (commentState.status === 'success') {
      toast({ title: 'Success', description: commentState.message });
      reset();
    } else if (commentState.status === 'error') {
      toast({ title: 'Error', description: commentState.message, variant: 'destructive' });
    }
  }, [commentState, toast, reset]);
  
  useEffect(() => {
    if (likeState.status === 'success') {
      toast({ title: 'Success', description: likeState.message });
    } else if (likeState.status === 'error') {
      toast({ title: 'Error', description: likeState.message, variant: 'destructive' });
    }
  }, [likeState, toast]);


  return (
    <div className="flex gap-4">
        <form action={likeAction} className="flex-shrink-0">
            <Button type="submit" variant="outline" size="lg">
                <ThumbsUp className="mr-2" /> Like
            </Button>
        </form>
        <form
            ref={formRef}
            action={commentFormAction}
            onSubmit={handleSubmit(() => {
                commentFormAction(new FormData(formRef.current!));
            })}
            className="w-full flex gap-2"
        >
            <Textarea
            {...register('comment')}
            placeholder="Write a comment..."
            className="w-full"
            />
            {errors.comment && <p className="text-sm text-destructive">{errors.comment.message}</p>}
            <Button type="submit" disabled={isCommentSubmitting}>
                {isCommentSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit
            </Button>
        </form>
    </div>
  );
}
