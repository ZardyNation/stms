import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AuthButton } from '../auth/AuthButton';
import { Home, User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Category, Nominee } from '@/types';
import NomineeManager from './NomineeManager';

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

async function getVoteCounts(categories: Category[]) {
  const supabase = createClient();
  if (!supabase) return null;

  const { data: votes, error } = await supabase.from('votes').select('*');

  if (error) {
    console.error('Error fetching votes:', error);
    return null;
  }

  const voteCounts: Record<string, Record<string, number>> = {};
  let totalVotes = 0;
  categories.forEach(category => {
    if (category.tbd) return;
    voteCounts[category.id] = {};
    category.nominees.forEach(nominee => {
      voteCounts[category.id][nominee.id] = 0;
    });
  });

  if(votes) {
      votes.forEach(vote => {
        Object.keys(vote).forEach(categoryId => {
          if (categoryId in voteCounts) {
            const nomineeId = vote[categoryId];
            if (nomineeId && nomineeId in voteCounts[categoryId]) {
              voteCounts[categoryId][nomineeId]++;
              totalVotes++;
            }
          }
        });
      });
  }


  return {counts: voteCounts, total: totalVotes};
}

async function isAdmin() {
  const supabase = createClient();
   if (!supabase) {
    return false;
  }
  const { data: { user } } = await supabase.auth.getUser();
  return user?.email === process.env.ADMIN_EMAIL;
}

export default async function AdminPage() {
    const supabase = createClient();
    if (!supabase) {
        return redirect('/login?message=Supabase is not configured. Please check your environment variables.');
    }
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return redirect('/login');
    }

    const isAdminUser = await isAdmin();

    if (!isAdminUser) {
        return redirect('/');
    }

    const categories = await getCategories();
    const voteData = await getVoteCounts(categories);

  return (
    <div className="flex min-h-screen flex-col">
       <header className="bg-card/80 backdrop-blur-sm border-b py-2 sticky top-0 z-50">
            <div className="container mx-auto flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tighter sm:text-3xl">
                        Admin Dashboard
                    </h1>
                    <p className="text-sm text-muted-foreground">Manage your awards content.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" asChild>
                        <Link href="/">
                            <Home className="mr-2 h-4 w-4" />
                            Vote
                        </Link>
                    </Button>
                     <Button variant="ghost" asChild>
                        <Link href="/profile">
                            <User className="mr-2 h-4 w-4" />
                            Profile
                        </Link>
                    </Button>
                    <AuthButton />
                </div>
            </div>
        </header>
        <main className="flex-1 bg-black/20 py-6 sm:py-8">
            <div className="container mx-auto grid gap-8">
                <NomineeManager categories={categories} />
                <Card>
                    <CardHeader>
                        <CardTitle>Live Vote Counts</CardTitle>
                        <CardDescription>
                           This is the current tally for each nominee.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {!voteData && <p>Could not retrieve vote counts.</p>}
                        {voteData && voteData.total === 0 && (
                            <div className="text-center text-muted-foreground py-8">
                                No votes have been cast yet.
                            </div>
                        )}
                        {voteData && voteData.total > 0 && categories.filter(c => !c.tbd).map((category: Category) => (
                           <div key={category.id}>
                                <h3 className="text-lg font-semibold mb-2">{category.title}</h3>
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Nominee</TableHead>
                                                <TableHead>Organization</TableHead>
                                                <TableHead className="text-right">Votes</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {category.nominees.map((nominee: Nominee) => (
                                                <TableRow key={nominee.id}>
                                                    <TableCell className="font-medium">{nominee.name}</TableCell>
                                                    <TableCell>{nominee.organization}</TableCell>
                                                    <TableCell className="text-right text-lg font-bold">
                                                        {voteData.counts[category.id]?.[nominee.id] ?? 0}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                           </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </main>
    </div>
  );
}
