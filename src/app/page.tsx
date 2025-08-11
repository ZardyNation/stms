import { VOTE_CATEGORIES } from '@/app/data';
import VotingForm from './voting-form';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { AuthButton } from './auth/AuthButton';

async function Header() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  return (
    <header className="bg-card border-b py-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex flex-col items-start gap-1">
          <h1 className="text-2xl font-bold tracking-tighter sm:text-3xl">
            Impact Awards Voting
          </h1>
          <p className="text-sm text-muted-foreground">
            Welcome, {user.email}
          </p>
        </div>
        <AuthButton />
      </div>
    </header>
  );
}

export default async function Home() {
  const categories = VOTE_CATEGORIES;
  
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }
  
  return (
    <div className="bg-background min-h-screen">
      <Header />
      <main className="container mx-auto py-8 sm:py-12">
        <VotingForm categories={categories} />
      </main>
      <footer className="container mx-auto py-6 text-center text-muted-foreground text-sm">
        <p>Please note: One vote per category per user. All duplicate entries will be invalidated.</p>
      </footer>
    </div>
  );
}