
'use client';

import { useEffect, useActionState, useState, useTransition } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import type { Category } from '@/types';
import { submitVote, type FormState, loginAsGuest } from '../actions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Check, Loader2, Home, Ticket, User, Info, Trophy, Calendar } from 'lucide-react';
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
      'Cast Your Votes'
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
        <section id="categories">
            <h2 className="text-3xl font-bold tracking-tight text-center mb-12">The Categories</h2>
            <div className="space-y-8">
            {categories.filter(c => !c.tbd && c.nominees.length > 0).map((category) => (
                <Card key={category.id} className="overflow-hidden bg-transparent border-0 shadow-none">
                <CardHeader className="text-center">
                    <Trophy className="h-8 w-8 mx-auto text-primary" />
                    <CardTitle className="font-bold tracking-tight text-2xl">{category.title}</CardTitle>
                    <CardDescription>
                        {
                            {
                                "Community Leadership Award": "Honoring grassroots leaders who’ve made a lasting local impact.",
                                "Innovator Award": "Recognizing groundbreaking ideas that drive real change.",
                                "Arts & Culture Impact Award": "Celebrating creators who inspire through their craft.",
                                "Youth Visionary Award": "Spotlighting young leaders making a difference before age 25.",
                                "Legacy Award": "Honoring lifelong contributions to progress and empowerment."
                            }[category.title] || "Vote for your favorite nominee."
                        }
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                    <RadioGroup name={category.id} className="flex gap-4 w-full overflow-x-auto pb-4 justify-center">
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
        </section>

        <section id="finalize-vote" className="p-6">
          <div className="max-w-md mx-auto text-center">
              <h3 className="text-xl font-bold tracking-tight">🗳 Your Vote is Your Voice — Use It Now!</h3>
              <p className="text-muted-foreground mt-1">
                Click the button below to cast your votes. One vote per person, per category. You may be asked for your email to ensure fairness.
              </p>
            <SubmitButton pending={isSubmitting} />
            <Button asChild variant="outline" className="w-full mt-2">
                <Link href="#">
                    <Ticket className="mr-2" />
                    Buy Tickets to the Awards
                </Link>
            </Button>
          </div>
        </section>
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

                <header className="w-full text-center mb-12">
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tighter">
                        🗳 Vote for the 2025 Impact Awards Winners!
                    </h1>
                    <p className="text-muted-foreground mt-3 max-w-3xl mx-auto">
                        These are the change-makers, visionaries, and community leaders who inspire us all. Now it’s your turn to help decide who takes home the gold on Saturday, October 12, 2025.
                    </p>
                    <p className="text-primary font-bold mt-2">
                        Voting closes September 20, 2025. at 11:59 PM EST — every vote counts!
                    </p>
                </header>

                <section id="how-to-vote" className="my-16 bg-card p-8 rounded-lg">
                    <h2 className="text-2xl font-bold tracking-tight text-center mb-8">How to Vote</h2>
                    <div className="grid md:grid-cols-3 gap-8 text-center">
                        <div className="flex flex-col items-center">
                            <User className="h-10 w-10 mb-4 text-primary" />
                            <h3 className="font-bold text-lg">1. Review the Nominees</h3>
                            <p className="text-sm text-muted-foreground">Learn about each finalist and their incredible work.</p>
                        </div>
                         <div className="flex flex-col items-center">
                            <Check className="h-10 w-10 mb-4 text-primary" />
                            <h3 className="font-bold text-lg">2. Make Your Choice</h3>
                            <p className="text-sm text-muted-foreground">Click the “Vote” button under your selection in each category.</p>
                        </div>
                         <div className="flex flex-col items-center">
                            <Calendar className="h-10 w-10 mb-4 text-primary" />
                            <h3 className="font-bold text-lg">3. Join Us Live</h3>
                            <p className="text-sm text-muted-foreground">Winners will be revealed only at the Impact Awards during the Grand Finale.</p>
                        </div>
                    </div>
                </section>

                {loading ? (
                    <div className="text-center py-16">
                        <Loader2 className="mx-auto h-12 w-12 animate-spin" />
                        <p className="mt-4">Loading categories...</p>
                    </div>
                ) : (
                    <VotingForm categories={categories} />
                )}

                 <section id="why-vote" className="my-16 text-center">
                     <h2 className="text-3xl font-bold tracking-tight">Your Voice Decides the Winners — and Their Moment of a Lifetime.</h2>
                    <p className="mt-4 text-lg text-muted-foreground max-w-4xl mx-auto">
                       For every nominee, this recognition is more than an award — it’s proof that their work matters, that people are watching, and that they’re making a difference. Your vote isn’t just a click. It’s a standing ovation before they even step on stage.
                    </p>
                </section>

                <section id="see-it-live" className="my-16 bg-card p-8 rounded-lg text-center">
                    <h2 className="text-3xl font-bold tracking-tight">🎟 Be in the Room When the Winners Are Revealed</h2>
                    <p className="mt-4 text-lg text-muted-foreground max-w-4xl mx-auto">
                        The Impact Awards aren’t just announced online — they’re brought to life in an unforgettable gold carpet experience, runway fashion show, live performances, and our high-energy awards ceremony. Don’t just vote... be there to cheer, clap, and celebrate when your favorite takes the stage.
                    </p>
                    <Button asChild size="lg" className="mt-8">
                        <Link href="#">Get Tickets & Tables Now</Link>
                    </Button>
                </section>

                <footer className="text-center text-sm text-muted-foreground border-t pt-8 mt-16">
                    <h3 className="font-bold text-lg mb-2">Voting Rules</h3>
                    <ul className="space-y-1">
                        <li>● One vote per person per category.</li>
                        <li>● Voting closes September 20th at 11:59 PM EST.</li>
                        <li>● Winners will be announced exclusively at the Impact Awards on October 12, 2025.</li>
                    </ul>
                </footer>
            </main>
        </div>
    );
}
