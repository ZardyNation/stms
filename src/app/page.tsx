import VotingForm from './voting-form';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { AuthButton } from './auth/AuthButton';
import Link from 'next/link';
import { User, Shield } from 'lucide-react';
import type { Category } from '@/types';
import { Logo } from '@/components/logo';

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

export default async function Home() {
  const categories = await getCategories();
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const showAdminLink = user && await isAdmin();

  return (
    <div className="min-h-screen">
      <main className="container mx-auto py-6 sm:py-8">
        <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
           {user && (
               <>
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
               </>
            )}
        </div>
        <div className="w-full text-center mb-8 p-6 flex flex-col items-center">
            <Logo />
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tighter mt-4">
                <span className="bg-primary text-primary-foreground px-2 rounded-md font-bold">IA</span> <span className="font-bold">Awards</span>
            </h1>
            <p className="text-foreground mt-3 max-w-2xl mx-auto">
                Welcome to the Impact Awards, celebrating outstanding achievements. Cast your vote for the nominees who have made a significant impact.
            </p>
        </div>

        <div className="w-full text-center mb-12 p-6">
            <p className="text-foreground/90 max-w-3xl mx-auto text-lg">
                My Event Advisor dedicates itself to recognizing industry leaders and game changers.
            </p>
            <div className="mt-8">
                <h2 className="text-2xl font-bold tracking-tight">With live performances from...</h2>
                <p className="text-muted-foreground mt-2">Coming soon: details about our amazing performers!</p>
            </div>
        </div>
        
        <VotingForm categories={categories} />
      </main>
      <footer className="container mx-auto py-4 text-center text-sm">
        <p>Please note: One vote per category per user. All duplicate entries will be invalidated.</p>
      </footer>
    </div>
  );
}
