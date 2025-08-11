'use client';

import { useEffect, useActionState } from 'react';
import Image from 'next/image';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import type { Category } from '@/types';
import { submitVote, type FormState } from './actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
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
  return z.object(schemaObject);
};

const SubmitButton = ({ pending }: { pending: boolean }) => (
  <Button type="submit" size="lg" className="w-full mt-6" disabled={pending}>
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
    <FormProvider {...form}>
      <form action={formAction} className="space-y-12 max-w-4xl mx-auto">
        <div className="space-y-8">
          {categories.filter(c => !c.tbd && c.nominees.length > 0).map((category, index) => (
            <Card key={category.id} className="overflow-hidden">
              <CardHeader className="bg-muted/50">
                <CardTitle className="font-bold tracking-tight text-xl">{category.title}</CardTitle>
                 {errors[category.id] && (
                  <p className="text-sm text-destructive pt-1">{errors[category.id]?.message?.toString()}</p>
                )}
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <RadioGroup
                  name={category.id}
                  onValueChange={(value) => form.setValue(category.id, value, { shouldValidate: true })}
                  className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
                >
                  {category.nominees.map((nominee) => (
                    <Label
                      key={nominee.id}
                      htmlFor={nominee.id}
                      className="group relative block cursor-pointer rounded-lg border bg-card text-card-foreground shadow-sm transition-all focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:ring-2 has-[[data-state=checked]]:ring-primary"
                    >
                      <div className="h-full transform transition-transform duration-200 ease-in-out hover:scale-[1.02]">
                        <RadioGroupItem value={nominee.id} id={nominee.id} className="absolute right-3 top-3 h-5 w-5" />
                        <div className="relative flex flex-col items-center p-4 text-center">
                          <Image
                            src={nominee.photo}
                            alt={`Photo of ${nominee.name}`}
                            width={128}
                            height={128}
                            className="mb-4 h-32 w-32 rounded-full object-cover ring-1 ring-border"
                            data-ai-hint={nominee.aiHint}
                          />
                          <p className="font-semibold text-lg">{nominee.name}</p>
                          <p className="text-sm text-muted-foreground">{nominee.organization}</p>
                        </div>
                      </div>
                    </Label>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="p-6 border rounded-lg bg-card">
          <div className="max-w-md mx-auto text-center">
              <h3 className="text-xl font-bold tracking-tight">Finalize Your Vote</h3>
              <p className="text-muted-foreground mt-1">
                Click the button below to cast your votes.
              </p>
            <SubmitButton pending={isSubmitting} />
          </div>
        </div>
      </form>
    </FormProvider>
  );
}