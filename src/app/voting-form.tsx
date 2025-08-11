
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
      acc[category.id] = z.string().optional();
    }
    return acc;
  }, {} as Record<string, z.ZodOptional<z.ZodString>>);
  schemaObject.email = z.string().email({ message: 'A valid email is required to vote.' });
  return z.object(schemaObject);
};

const SubmitButton = ({ pending }: { pending: boolean }) => (
  <Button type="submit" size="lg" className="w-full md:w-auto" disabled={pending}>
    {pending ? (
      <>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Submitting...
      </>
    ) : (
      'Submit Vote'
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

  return (
    <form action={formAction} className="space-y-12">
      {categories.filter(c => !c.tbd && c.nominees.length > 0).map((category) => (
        <Card key={category.id} className="overflow-hidden">
          <CardHeader className="bg-secondary">
            <CardTitle className="font-headline text-2xl">{category.title}</CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <RadioGroup
              name={category.id}
              onValueChange={(value) => form.setValue(category.id, value)}
              className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {category.nominees.map((nominee) => (
                <Label
                  key={nominee.id}
                  htmlFor={nominee.id}
                  className="group block cursor-pointer rounded-lg border-2 border-transparent bg-card shadow-sm transition-all has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:ring-2 has-[[data-state=checked]]:ring-primary"
                >
                  <Card className="h-full transform transition-transform hover:scale-105">
                    <CardContent className="relative flex flex-col items-center p-4 text-center">
                      <RadioGroupItem value={nominee.id} id={nominee.id} className="absolute right-4 top-4 h-6 w-6" />
                      <Image
                        src={nominee.photo}
                        alt={`Photo of ${nominee.name}`}
                        width={128}
                        height={128}
                        className="mb-4 h-32 w-32 rounded-full object-cover"
                        data-ai-hint={nominee.aiHint}
                      />
                      <p className="font-body text-lg font-semibold">{nominee.name}</p>
                      <p className="text-sm text-muted-foreground">{nominee.organization}</p>
                    </CardContent>
                  </Card>
                </Label>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
      ))}

      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Confirm Your Vote</CardTitle>
          <CardDescription>
            Please provide your email to finalize your submission.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="email" className="font-body text-lg font-medium">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="mt-2 text-base"
              {...form.register('email')}
            />
            {form.formState.errors.email && (
              <p className="mt-2 text-sm text-destructive">{form.formState.errors.email.message}</p>
            )}
             {state.status === 'error' && state.message.toLowerCase().includes('email') && (
              <p className="mt-2 text-sm text-destructive">{state.message}</p>
            )}
          </div>
          <div className="flex justify-end pt-4">
            <SubmitButton pending={isSubmitting} />
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
