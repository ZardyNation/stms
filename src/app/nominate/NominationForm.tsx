
'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { submitNomination, type FormState } from './actions';
import type { Category } from '@/types';
import { useEffect } from 'react';

interface NominationFormProps {
  categories: Omit<Category, 'nominees'>[];
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full mt-4" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Submitting Nomination...
        </>
      ) : (
        'Submit Nomination'
      )}
    </Button>
  );
}

const initialState: FormState = {
  message: '',
  status: 'idle',
};

export default function NominationForm({ categories }: NominationFormProps) {
  const { toast } = useToast();
  const [state, formAction] = useActionState<FormState, FormData>(submitNomination, initialState);

  useEffect(() => {
    if (state.status === 'error' && state.message) {
      toast({
        title: 'Error',
        description: state.message,
        variant: 'destructive',
      });
    } else if (state.status === 'success' && state.message) {
      toast({
        title: 'Success!',
        description: state.message,
      });
      // Consider resetting the form here if needed
    }
  }, [state, toast]);

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="nominee_name">Nominee's Full Name</Label>
          <Input id="nominee_name" name="nominee_name" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="nominee_org">Nominee's Organization (if applicable)</Label>
          <Input id="nominee_org" name="nominee_org" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category_id">Award Category</Label>
        <Select name="category_id" required>
          <SelectTrigger>
            <SelectValue placeholder="Select an award category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="reason">Reason for Nomination</Label>
        <Textarea
          id="reason"
          name="reason"
          placeholder="Tell us why this person or group deserves to be recognized. What impact have they made?"
          required
          rows={5}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="nominator_name">Your Name</Label>
          <Input id="nominator_name" name="nominator_name" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="nominator_email">Your Email Address</Label>
          <Input id="nominator_email" name="nominator_email" type="email" required />
        </div>
      </div>
      
      <SubmitButton />

    </form>
  );
}
