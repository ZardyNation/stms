

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Home, Pencil, LogOut, User, ThumbsUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Category, Nominee } from '@/types';
import NomineeManager from './NomineeManager';
import { logout } from './login/actions';
import { Badge } from '@/components/ui/badge';

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
                if (categoryId in voteCounts && nomineeId && voteCounts[categoryId] && nomineeId in voteCounts[categoryId]) {
                    voteCounts[categoryId][nomineeId as string]++;
                }
            });
        }
      });
  }

  return {counts: voteCounts, total: totalVotes};
}

async function getNominations() {
    const supabase = createClient();
    if (!supabase) return [];
    const { data, error } = await supabase.from('nominations').select('*').order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching nominations:', error);
        return [];
    }
    return data;
}


export default async function AdminPage() {
    const categories = await getCategories();
    const voteData = await getVoteCounts(categories);
    const voters = await getVoters();
    const nominations = await getNominations();
    
    const categoryMap = new Map(categories.map(c => [c.id, c.title]));
    const nomineeMap = new Map(categories.flatMap(c => c.nominees).map(n => [n.id, n.name]));

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
                        <CardTitle>Submitted Nominations</CardTitle>
                        <CardDescription className="text-foreground">
                           Review and manage incoming nominations.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                         <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nominee</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Reason</TableHead>
                                        <TableHead>Submitted By</TableHead>
                                        <TableHead className="text-right">Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {nominations.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center h-24">No nominations yet.</TableCell>
                                        </TableRow>
                                    )}
                                    {nominations.map((nomination) => (
                                        <TableRow key={nomination.id}>
                                            <TableCell>
                                                <div className="font-medium">{nomination.nominee_name}</div>
                                                <div className="text-sm text-muted-foreground">{nomination.nominee_org}</div>
                                            </TableCell>
                                            <TableCell>
                                                {categoryMap.get(nomination.category_id) || 'Unknown Category'}
                                            </TableCell>
                                             <TableCell className="max-w-xs truncate">
                                                {nomination.reason}
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-medium">{nomination.nominator_name}</div>
                                                <div className="text-sm text-muted-foreground">{nomination.nominator_email}</div>
                                            </TableCell>
                                             <TableCell className="text-right">
                                                {new Date(nomination.created_at).toLocaleDateString()}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
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
                                            {category.nominees.sort((a, b) => (voteData.counts[category.id]?.[b.id] ?? 0) - (voteData.counts[category.id]?.[a.id] ?? 0)).map((nominee: Nominee) => (
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
                                                {voter.selections && typeof voter.selections === 'object' ? (
                                                    <div className="flex flex-col gap-1">
                                                    {Object.entries(voter.selections).map(([catId, nomId]) => (
                                                        <div key={catId} className="text-xs">
                                                            <span className="font-semibold">{categoryMap.get(catId) || 'Unknown Category'}:</span>
                                                            <span className="ml-2 text-foreground">{nomineeMap.get(nomId as string) || 'Unknown Nominee'}</span>
                                                        </div>
                                                    ))}
                                                    </div>
                                                ) : 'No selections made.'}
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
