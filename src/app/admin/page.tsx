

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Home, Pencil, LogOut, User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Category, Nominee } from '@/types';
import NomineeManager from './NomineeManager';
import { logout } from './login/actions';

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

async function getVoters() {
    const supabase = createClient();
    if (!supabase) return [];
    const { data, error } = await supabase.from('votes').select('email, selections, created_at').order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching voters:', error);
        return [];
    }
    return data;
}

async function getVoteCounts(categories: Category[]) {
  const supabase = createClient();
  if (!supabase) return null;

  const { data: votes, error } = await supabase.from('votes').select('selections');

  if (error) {
    console.error('Error fetching votes:', error);
    return null;
  }

  const voteCounts: Record<string, Record<string, number>> = {};
  
  categories.forEach(category => {
    if (category.tbd) return;
    voteCounts[category.id] = {};
    category.nominees.forEach(nominee => {
      voteCounts[category.id][nominee.id] = 0;
    });
  });

  let totalVotes = 0;
  if(votes) {
      totalVotes = votes.length;
      votes.forEach(vote => {
        if(vote.selections) {
            Object.entries(vote.selections).forEach(([categoryId, nomineeId]) => {
                if (categoryId in voteCounts && nomineeId && nomineeId in voteCounts[categoryId]) {
                    voteCounts[categoryId][nomineeId as string]++;
                }
            });
        }
      });
  }

  return {counts: voteCounts, total: totalVotes};
}


export default async function AdminPage() {
    const categories = await getCategories();
    const voteData = await getVoteCounts(categories);
    const voters = await getVoters();

  return (
    <div className="flex min-h-screen flex-col">
        <main className="flex-1 py-6 sm:py-8">
            <div className="container mx-auto grid gap-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tighter sm:text-3xl">
                            Admin Dashboard
                        </h1>
                        <p className="text-foreground">Manage your awards content.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" asChild>
                            <Link href="/">
                                <Home className="mr-2 h-4 w-4" />
                                Home
                            </Link>
                        </Button>
                         <Button variant="ghost" asChild>
                            <Link href="/vote">
                                <Pencil className="mr-2 h-4 w-4" />
                                Vote
                            </Link>
                        </Button>
                        <form action={logout}>
                            <Button variant="ghost" type="submit">
                                <LogOut className="mr-2 h-4 w-4" />
                                Logout
                            </Button>
                        </form>
                    </div>
                </div>
                
                <Card className="bg-transparent border-0 shadow-none">
                    <NomineeManager categories={categories} />
                </Card>
                <Card className="bg-transparent border-0 shadow-none">
                    <CardHeader>
                        <CardTitle>Live Vote Counts</CardTitle>
                        <CardDescription className="text-foreground">
                           This is the current tally for each nominee. Total votes cast: {voteData?.total ?? 0}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {!voteData && <p>Could not retrieve vote counts.</p>}
                        {voteData && voteData.total === 0 && (
                            <div className="text-center text-foreground py-8">
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
                
                <Card className="bg-transparent border-0 shadow-none">
                    <CardHeader>
                        <CardTitle>Voter List</CardTitle>
                        <CardDescription className="text-foreground">
                           A list of everyone who has submitted a vote.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                         <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Selections</TableHead>
                                        <TableHead className="text-right">Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {voters.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={3} className="text-center h-24">No voters yet.</TableCell>
                                        </TableRow>
                                    )}
                                    {voters.map((voter, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="font-medium">{voter.email}</TableCell>
                                            <TableCell>
                                                <pre className="text-xs bg-muted p-2 rounded-md">
                                                    {JSON.stringify(voter.selections, null, 2)}
                                                </pre>
                                            </TableCell>
                                             <TableCell className="text-right">
                                                {new Date(voter.created_at).toLocaleString()}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </main>
    </div>
  );
}
