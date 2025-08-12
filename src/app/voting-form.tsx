
'use client';

import { useEffect, useActionState, useState, useTransition } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import type { Category } from '@/types';
import { submitVote, type FormState, loginAsGuest } from './actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface VotingFormProps {
  categories: Category[];
}

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

const initialState: FormState = {
  message: '',
  status: 'idle',
};

export default function VotingForm({ categories }: VotingFormProps) {
  const { toast } = useToast();
  const [state, formAction, isSubmitting] = useActionState<FormState, FormData>(submitVote, initialState);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [isGuestTransitioning, startGuestTransition] = useTransition();
  const [isPending, startTransition] = useTransition();
  const [guestEmail, setGuestEmail] = useState('');
  
  const form = useForm();
  const { getValues } = form;

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const hasSelections = categories.some(category => formData.get(category.id));

    if (!hasSelections) {
       toast({
        title: 'No Selection Made',
        description: 'You must select at least one nominee to submit your vote.',
        variant: 'destructive',
      });
      return;
    }
    
    // Check if user is logged in, if not show modal
    // We can check this by seeing if the actions.ts file would have a user
    // A better way would be to get the user session on the client
    // For now, we will simulate this by checking for an error status that implies no user
     if(state.status === 'error' && state.message.includes('log in')) {
        setAuthModalOpen(true);
     } else {
        startTransition(() => {
          formAction(formData);
        });
     }
  };
  
  const handleGuestLogin = async () => {
    startGuestTransition(async () => {
      const result = await loginAsGuest(guestEmail);
      if (result.success) {
        setAuthModalOpen(false);
        toast({
          title: "You're in!",
          description: "You can now cast your vote.",
        });
        // Resubmit the form
        const formData = new FormData();
        const values = getValues();
        Object.keys(values).forEach(key => {
            if(values[key]) {
                 formData.append(key, values[key]);
            }
        });
        startTransition(() => {
          formAction(formData);
        });

      } else {
        toast({
          title: "Authentication Error",
          description: result.message,
          variant: "destructive",
        });
      }
    });
  };

  useEffect(() => {
    if (state?.status === 'error' && state.message) {
      if(state.message.includes("log in")) {
        // Only open modal if there's selections
         const formElement = document.querySelector('form');
         if(formElement) {
            const formData = new FormData(formElement);
            const hasSelections = categories.some(category => formData.get(category.id));
            if(hasSelections) {
                 setAuthModalOpen(true);
            } else {
                toast({
                    title: 'No Selection Made',
                    description: 'You must select at least one nominee to submit your vote.',
                    variant: 'destructive',
                });
            }
         }
      } else {
        toast({
            title: 'Error Submitting Vote',
            description: state.message,
            variant: 'destructive',
        });
      }
    }
  }, [state, toast, categories]);
  
  return (
    <>
      <form onSubmit={handleFormSubmit} className="space-y-12 max-w-7xl mx-auto">
        <div className="space-y-8">
          {categories.filter(c => !c.tbd && c.nominees.length > 0).map((category) => (
            <Card key={category.id} className="overflow-hidden bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="font-bold tracking-tight text-xl">{category.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="flex w-full overflow-x-auto pb-4">
                  <RadioGroup name={category.id} className="flex gap-4">
                    {category.nominees.map((nominee) => (
                      <div key={nominee.id} className="w-52 flex-shrink-0">
                        <RadioGroupItem value={nominee.id} id={`${category.id}-${nominee.id}`} className="sr-only" />
                        <Label
                          htmlFor={`${category.id}-${nominee.id}`}
                          className="group relative block h-full cursor-pointer rounded-lg border-2 border-transparent bg-card text-card-foreground shadow-sm transition-all focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 has-[input:checked]:border-primary has-[input:checked]:ring-2 has-[input:checked]:ring-primary"
                        >
                           <div className="absolute top-2 right-2 z-10 hidden group-has-[input:checked]:block">
                             <CheckCircle className="h-6 w-6 text-primary bg-background rounded-full" />
                           </div>
                          <div className="h-full transform transition-transform duration-300 ease-in-out hover:scale-[1.03]">
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
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="p-6 border rounded-lg bg-card/80 backdrop-blur-sm">
          <div className="max-w-md mx-auto text-center">
              <h3 className="text-xl font-bold tracking-tight">Finalize Your Vote</h3>
              <p className="text-muted-foreground mt-1">
                Click the button below to cast your votes. You may be asked for your email.
              </p>
            <SubmitButton pending={isSubmitting || isPending} />
          </div>
        </div>
      </form>

       <Dialog open={isAuthModalOpen} onOpenChange={setAuthModalOpen}>
        <DialogContent className="bg-card/80 backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle>Provide your email to vote</DialogTitle>
            <DialogDescription>
              We need your email to ensure every vote is unique. We will not send you spam.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="guest-email">Email Address</Label>
              <Input
                id="guest-email"
                type="email"
                placeholder="you@example.com"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
              />
            </div>
            <Button onClick={handleGuestLogin} disabled={isGuestTransitioning || !guestEmail} className="w-full">
              {isGuestTransitioning ? <Loader2 className="animate-spin" /> : "Continue & Vote"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
