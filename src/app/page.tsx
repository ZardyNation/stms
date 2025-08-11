import { VOTE_CATEGORIES, Category as CategoryType } from '@/app/data';
import VotingForm from './voting-form';
import { Award } from 'lucide-react';

function InfoPanel() {
  return (
    <div className="relative hidden flex-col items-start gap-8 lg:flex">
      <div className="group flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Award className="h-6 w-6" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-xl font-bold tracking-tighter sm:text-2xl md:text-3xl">
            The IA Awards
          </h1>
          <p className="text-sm text-muted-foreground">(Impact Awards)</p>
        </div>
      </div>
       <div className="sticky top-20 grid gap-4">
        <h2 className="text-3xl font-bold tracking-tighter">Cast Your Vote</h2>
        <p className="text-muted-foreground">
          Welcome to the official voting page for the The IA Awards, presented by STOP The Madness and powered by My Event Advisor. Your voice matters—select the nominees you believe have made the greatest impact.
        </p>
         <p className="text-xs text-muted-foreground/80">
          Please note: One vote per category per email address. All duplicate entries will be invalidated.
        </p>
      </div>
    </div>
  )
}

export default function Home() {
  const categories = VOTE_CATEGORIES;
  return (
    <div className="container mx-auto min-h-screen py-8">
      <div className="grid items-start gap-12 lg:grid-cols-[280px_1fr]">
        <InfoPanel />
        <main className="w-full">
          <VotingForm categories={categories} />
        </main>
      </div>
    </div>
  );
}
