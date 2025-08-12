
'use client';

import { useEffect, useActionState, useState, useTransition } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import type { Category } from '@/types';
import { submitVote, type FormState } from '../actions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Check, Loader2, Ticket, Trophy } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
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
      'Cast Your Votes'
    )}
  </Button>
);

const initialState: FormState = {
  message: '',
  status: 'idle',
};


export default function VotingForm({ categories }: VotingFormProps) {
  const { toast } = useToast();
  const [state, formAction] = useActionState<FormState, FormData>(submitVote, initialState);
  const [isEmailModalOpen, setEmailModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [guestEmail, setGuestEmail] = useState('');
  const [formData, setFormData] = useState<FormData | null>(null);
  
  const form = useForm();
  
  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const currentFormData = new FormData(event.currentTarget);
    const hasSelections = categories.some(category => currentFormData.get(category.id));

    if (!hasSelections) {
       toast({
        title: 'No Selection Made',
        description: 'You must select at least one nominee to submit your vote.',
        variant: 'destructive',
      });
      return;
    }
    
    setFormData(currentFormData);
    setEmailModalOpen(true);
  };
  
  const handleEmailSubmit = () => {
    if (formData) {
      formData.set('email', guestEmail);
      startTransition(() => {
        formAction(formData);
      });
      setEmailModalOpen(false);
    }
  };

  useEffect(() => {
    if (state?.status === 'error' && state.message) {
      toast({
          title: 'Error Submitting Vote',
          description: state.message,
          variant: 'destructive',
      });
    } else if (state?.status === 'email_required') {
        setEmailModalOpen(true);
    }
  }, [state, toast]);
  
  const isSubmitting = isPending;

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
                    <CardDescription className="text-foreground">
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
                                <p className="text-sm text-foreground">{nominee.organization}</p>
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
              <p className="text-foreground mt-1">
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

       <Dialog open={isEmailModalOpen} onOpenChange={setEmailModalOpen}>
        <DialogContent className="bg-accent text-accent-foreground">
          <DialogHeader>
            <DialogTitle>One Last Step</DialogTitle>
            <DialogDescription>
             Please provide your email to submit your vote. We use your email to ensure every vote is unique.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="guest-email" className="text-accent-foreground/80">Email Address</Label>
              <Input
                id="guest-email"
                type="email"
                placeholder="you@example.com"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                className="bg-accent-foreground/10 text-accent-foreground placeholder:text-accent-foreground/50"
              />
            </div>
             <DialogFooter>
                <Button onClick={() => setEmailModalOpen(false)} variant="ghost">Cancel</Button>
                <Button onClick={handleEmailSubmit} disabled={isPending || !guestEmail} className="bg-accent-foreground text-accent hover:bg-accent-foreground/90">
                {isPending ? <Loader2 className="animate-spin" /> : "Submit Vote"}
                </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
