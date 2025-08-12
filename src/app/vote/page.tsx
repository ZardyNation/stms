
'use client';

import { useEffect, useActionState, useState, useTransition } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import type { Category } from '@/types';
import { submitVote, type FormState, loginAsGuest } from '../actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Check, Loader2, Home } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { createClient } from '@/lib/supabase/client';


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


function VotingForm({ categories }: VotingFormProps) {
  const { toast } = useToast();
  const [state, formAction] = useActionState<FormState, FormData>(submitVote, initialState);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [isGuestTransitioning, startGuestTransition] = useTransition();
  const [isPending, startTransition] = useTransition();
  const [guestEmail, setGuestEmail] = useState('');
  
  const form = useForm();
  
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
    
    startTransition(() => {
      formAction(formData);
    });
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
        const formData = new FormData(document.querySelector('form')!);
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

  useEffect(() => {
    const hasSeenWelcome = sessionStorage.getItem('hasSeenWelcome');
    if (!hasSeenWelcome) {
        setAuthModalOpen(true);
        sessionStorage.setItem('hasSeenWelcome', 'true');
    }
  }, []);
  
  const isSubmitting = isPending || isGuestTransitioning;

  return (
    <>
      <form onSubmit={handleFormSubmit} className="space-y-12 max-w-7xl mx-auto">
        <div className="space-y-8">
          {categories.filter(c => !c.tbd && c.nominees.length > 0).map((category) => (
            <Card key={category.id} className="overflow-hidden bg-transparent border-0 shadow-none">
              <CardHeader>
                <CardTitle className="font-bold tracking-tight text-xl">{category.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                 <RadioGroup name={category.id} className="flex gap-4 w-full overflow-x-auto pb-4">
                  {category.nominees.map((nominee) => (
                    <div key={nominee.id} className="group/nominee relative w-52 flex-shrink-0">
                      <RadioGroupItem value={nominee.id} id={`${category.id}-${nominee.id}`} className="peer sr-only" />
                      <Label
                        htmlFor={`${category.id}-${nominee.id}`}
                        className="block h-full cursor-pointer rounded-lg border-2 border-transparent bg-transparent text-card-foreground shadow-sm transition-all peer-data-[state=checked]:border-primary peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-primary"
                      >
                         <div className="absolute top-2 right-2 z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 border-muted bg-background/80 text-transparent transition-colors peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground">
                            <Check className="h-4 w-4" />
                          </div>
                        <div className="h-full transform transition-transform duration-300 ease-in-out hover:scale-[1.03]">
                          <Link href={`/nominees/${nominee.id}`}>
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
                          </Link>
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="p-6">
          <div className="max-w-md mx-auto text-center">
              <h3 className="text-xl font-bold tracking-tight">Finalize Your Vote</h3>
              <p className="text-muted-foreground mt-1">
                Click the button below to cast your votes. You may be asked for your email.
              </p>
            <SubmitButton pending={isSubmitting} />
          </div>
        </div>
      </form>

       <Dialog open={isAuthModalOpen} onOpenChange={setAuthModalOpen}>
        <DialogContent className="bg-accent text-accent-foreground">
          <DialogHeader>
            <DialogTitle>Welcome to the IA Awards!</DialogTitle>
            <DialogDescription>
             Powered By My Event Advisor. Please provide your email to vote. We need your email to ensure every vote is unique.
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
                className="bg-accent-foreground/10 text-accent-foreground placeholder:text-accent-foreground/50"
              />
            </div>
            <Button onClick={handleGuestLogin} disabled={isGuestTransitioning || !guestEmail} className="w-full bg-accent-foreground text-accent hover:bg-accent-foreground/90">
              {isGuestTransitioning ? <Loader2 className="animate-spin" /> : "Continue"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}


export default function VotePage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCategories() {
            const supabase = createClient();
            if (!supabase) return;

            const { data, error } = await supabase.from('categories').select(`
                id,
                title,
                tbd,
                nominees ( id, name, organization, photo, "aiHint" )
            `);

            if (error) {
                console.error('Error fetching categories:', error);
            } else {
                setCategories(data as Category[]);
            }
            setLoading(false);
        }

        fetchCategories();
    }, []);

    return (
        <div className="min-h-screen">
            <main className="container mx-auto py-6 sm:py-8">
                 <div className="absolute top-4 left-4 z-50">
                    <Button variant="ghost" asChild>
                        <Link href="/">
                            <Home className="mr-2 h-4 w-4" />
                            Back to Home
                        </Link>
                    </Button>
                </div>

                <div className="w-full text-center mb-8">
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tighter">
                        Cast Your Vote
                    </h1>
                    <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
                        Select your favorite nominee in each category below.
                    </p>
                </div>

                {loading ? (
                    <div className="text-center">
                        <Loader2 className="mx-auto h-12 w-12 animate-spin" />
                        <p>Loading categories...</p>
                    </div>
                ) : (
                    <VotingForm categories={categories} />
                )}
            </main>
        </div>
    );
}
