'use client';

import { useEffect, useActionState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import type { Category } from '@/types';
import { submitVote, type FormState } from './actions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface VotingFormProps {
  categories: Category[];
}

const createVoteSchema = (categories: Category[]) => {
  const schemaObject = categories.reduce((acc, category) => {
    if (!category.tbd) {
      acc[category.id] = z.string({ required_error: "Please select a nominee." });
    }
    return acc;
  }, {} as Record<string, z.ZodString>);
  schemaObject.email = z.string().email({ message: 'A valid email is required to vote.' });
  return z.object(schemaObject);
};

const SubmitButton = ({ pending }: { pending: boolean }) => (
  <Button type="submit" size="lg" className="w-full" disabled={pending}>
    {pending ? (
      <>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Submitting...
      </>
    ) : (
      'Submit Your Votes'
    )}
  </Button>
);

export default function VotingForm({ categories }: VotingFormProps) {
  const voteSchema = createVoteSchema(categories);
  const { toast } = useToast();

  const [state, formAction, isSubmitting] = useActionState<FormState, FormData>(submitVote, {
    message: '',
    status: 'idle',
  });

  const form = useForm<z.infer<typeof voteSchema>>({
    resolver: zodResolver(voteSchema),
    defaultValues: {
      email: '',
    },
  });

  useEffect(() => {
    if (state.status === 'success') {
      toast({
        title: 'Vote Submitted!',
        description: state.message,
      });
      form.reset();
    } else if (state.status === 'error') {
      toast({
        title: 'Error',
        description: state.message,
        variant: 'destructive',
      });
    }
  }, [state, toast, form]);
  
  const { formState: { errors } } = form;

  return (
    <form action={formAction} className="space-y-12">
      <div className="space-y-8">
        {categories.filter(c => !c.tbd && c.nominees.length > 0).map((category, index) => (
          <Card key={category.id} className="border-border/60 bg-card/50">
            <CardHeader>
              <CardTitle className="font-bold tracking-tight text-xl">{category.title}</CardTitle>
               {errors[category.id] && (
                <p className="text-sm text-destructive">{errors[category.id]?.message}</p>
              )}
            </CardHeader>
            <CardContent>
              <RadioGroup
                name={category.id}
                onValueChange={(value) => form.setValue(category.id, value, { shouldValidate: true })}
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
              >
                {category.nominees.map((nominee) => (
                  <Label
                    key={nominee.id}
                    htmlFor={nominee.id}
                    className="group relative block cursor-pointer rounded-xl border-2 border-transparent bg-card shadow-sm ring-offset-background transition-all focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 has-[[data-state=checked]]:border-primary"
                  >
                    <div className="h-full transform transition-transform duration-200 ease-in-out hover:scale-[1.02]">
                      <RadioGroupItem value={nominee.id} id={nominee.id} className="absolute right-3 top-3 h-5 w-5" />
                      <div className="relative flex flex-col items-center p-4 text-center">
                        <Image
                          src={nominee.photo}
                          alt={`Photo of ${nominee.name}`}
                          width={100}
                          height={100}
                          className="mb-4 h-28 w-28 rounded-full object-cover ring-1 ring-border"
                          data-ai-hint={nominee.aiHint}
                        />
                        <p className="font-semibold text-base">{nominee.name}</p>
                        <p className="text-xs text-muted-foreground">{nominee.organization}</p>
                      </div>
                    </div>
                  </Label>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="sticky bottom-0 border-border/60 bg-background/95 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="font-bold tracking-tight">Confirm Your Vote</CardTitle>
          <CardDescription>
            Provide your email address to finalize your submission. This is required to prevent duplicate votes.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="font-medium">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="text-base"
              {...form.register('email')}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
             {state.status === 'error' && state.message.toLowerCase().includes('email') && (
              <p className="text-sm text-destructive">{state.message}</p>
            )}
          </div>
          <SubmitButton pending={isSubmitting} />
        </CardContent>
      </Card>
    </form>
  );
}
