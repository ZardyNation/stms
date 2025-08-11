import { createClient } from '@/lib/supabase/server';
import { VOTE_CATEGORIES } from '../data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AuthButton } from '../auth/AuthButton';
import { Home } from 'lucide-react';

async function getUserVotes() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from('votes')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching user votes:', error);
    return null;
  }

  return data;
}

export default async function ProfilePage() {
  const userVotes = await getUserVotes();
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

   if (!user) {
    return redirect('/login');
  }

  return (
    <div className="flex min-h-screen flex-col">
       <header className="bg-card border-b py-4">
            <div className="container mx-auto flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tighter sm:text-3xl">
                        Your Profile
                    </h1>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" asChild>
                        <Link href="/">
                            <Home className="mr-2 h-4 w-4" />
                            Vote
                        </Link>
                    </Button>
                    <AuthButton />
                </div>
            </div>
        </header>
        <main className="flex-1 bg-muted/20 py-8 sm:py-12">
            <div className="container mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>Your Submitted Votes</CardTitle>
                        <CardDescription>
                            {userVotes 
                                ? "Here's a summary of the votes you've cast."
                                : "You have not voted yet. Cast your vote on the main page."
                            }
                        </CardDescription>
                    </CardHeader>
                    {userVotes && (
                        <CardContent className="space-y-6">
                            {VOTE_CATEGORIES.filter(c => !c.tbd && userVotes[c.id]).map(category => {
                                const nomineeId = userVotes[category.id];
                                const nominee = category.nominees.find(n => n.id === nomineeId);

                                if (!nominee) return null;

                                return (
                                    <div key={category.id} className="p-4 rounded-lg border bg-background">
                                        <h3 className="font-semibold text-lg mb-3">{category.title}</h3>
                                        <div className="flex items-center gap-4">
                                            <Image
                                                src={nominee.photo}
                                                alt={`Photo of ${nominee.name}`}
                                                width={64}
                                                height={64}
                                                className="h-16 w-16 rounded-full object-cover"
                                            />
                                            <div>
                                                <p className="font-medium">{nominee.name}</p>
                                                <p className="text-sm text-muted-foreground">{nominee.organization}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </CardContent>
                    )}
                     {!userVotes && (
                        <CardContent>
                            <Button asChild>
                                <Link href="/">Go to Voting Page</Link>
                            </Button>
                        </CardContent>
                     )}
                </Card>
            </div>
        </main>
    </div>
  );
}
