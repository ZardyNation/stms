import { VOTE_CATEGORIES } from '@/app/data';
import VotingForm from './voting-form';
import { Award } from 'lucide-react';

function Header() {
  return (
    <header className="bg-card border-b py-6">
      <div className="container mx-auto flex items-center justify-center text-center">
        <div className="flex flex-col items-center gap-2">
           <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Award className="h-8 w-8" />
            </div>
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">
            The IA Awards
          </h1>
          <p className="text-lg text-muted-foreground">(Impact Awards)</p>
          <p className="max-w-xl text-muted-foreground mt-2">
            Welcome to the official voting page, presented by STOP The Madness and powered by My Event Advisor. Your voice matters—select the nominees you believe have made the greatest impact.
          </p>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const categories = VOTE_CATEGORIES;
  return (
    <div className="bg-background">
      <Header />
      <main className="container mx-auto py-8 sm:py-12">
        <VotingForm categories={categories} />
      </main>
      <footer className="container mx-auto py-6 text-center text-muted-foreground text-sm">
        <p>Please note: One vote per category per email address. All duplicate entries will be invalidated.</p>
      </footer>
    </div>
  );
}
