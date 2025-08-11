import VotingForm from './voting-form';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { AuthButton } from './auth/AuthButton';
import Link from 'next/link';
import { User, Shield } from 'lucide-react';
import type { Category } from '@/types';

async function getCategories(): Promise<Category[]> {
  const supabase = createClient();
  if (!supabase) return [];
  const { data, error } = await supabase.from('categories').select(`
    id,
    title,
    tbd,
    nominees ( id, name, organization, photo, "aiHint" )
  `);
  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
  return data as Category[];
}


async function isAdmin() {
  const supabase = createClient();
  if (!supabase) {
    return false;
  }
  const { data: { user } } = await supabase.auth.getUser();
  return user?.email === process.env.ADMIN_EMAIL;
}

async function Header() {
  const supabase = createClient();
  if (!supabase) {
    return redirect('/login?message=Supabase is not configured. Please check your environment variables.');
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  const showAdminLink = await isAdmin();

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
        <div className="flex items-center gap-2">
           <Button variant="ghost" asChild>
              <Link href="/profile">
                <User className="mr-2 h-4 w-4" />
                Profile
              </Link>
            </Button>
            {showAdminLink && (
              <Button variant="ghost" asChild>
                <Link href="/admin">
                  <Shield className="mr-2 h-4 w-4" />
                  Admin
                </Link>
              </Button>
            )}
          <AuthButton />
        </div>
      </div>
    </header>
  );
}

export default async function Home() {
  const supabase = createClient();

  if (!supabase) {
    redirect('/login?message=Supabase is not configured. Please check your environment variables.');
    return;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
    return;
  }
  
  const categories = await getCategories();

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
