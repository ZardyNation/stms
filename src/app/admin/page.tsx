import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AuthButton } from '../auth/AuthButton';
import { Home, User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { VOTE_CATEGORIES } from '../data';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Category, Nominee } from '@/types';

async function getVoteCounts() {
  const supabase = createClient();
  if (!supabase) return null;

  const { data: votes, error } = await supabase.from('votes').select('*');

  if (error) {
    console.error('Error fetching votes:', error);
    return null;
  }

  // Initialize vote counts for each nominee
  const voteCounts: Record<string, Record<string, number>> = {};
  VOTE_CATEGORIES.forEach(category => {
    if (category.tbd) return;
    voteCounts[category.id] = {};
    category.nominees.forEach(nominee => {
      voteCounts[category.id][nominee.id] = 0;
    });
  });

  // Tally the votes
  votes.forEach(vote => {
    Object.keys(vote).forEach(categoryId => {
      if (categoryId in voteCounts) {
        const nomineeId = vote[categoryId];
        if (nomineeId && nomineeId in voteCounts[categoryId]) {
          voteCounts[categoryId][nomineeId]++;
        }
      }
    });
  });

  return voteCounts;
}


// In a real application, you'd have a more robust way of checking for admin roles.
// This could be a separate table in your database or custom claims in Supabase.
// For now, we'll keep it simple and check against an environment variable.
async function isAdmin() {
  const supabase = createClient();
   if (!supabase) {
    return false;
  }
  const { data: { user } } = await supabase.auth.getUser();
  
  // This is a simplified check. A real app should use database roles or claims.
  // You would need to set this environment variable for your admin user's email.
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

    const voteCounts = await getVoteCounts();

  return (
    <div className="flex min-h-screen flex-col">
       <header className="bg-card border-b py-4">
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
        <main className="flex-1 bg-muted/20 py-8 sm:py-12">
            <div className="container mx-auto grid gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Live Vote Counts</CardTitle>
                        <CardDescription>
                           This is the current tally for each nominee.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {!voteCounts && <p>Could not retrieve vote counts.</p>}
                        {voteCounts && VOTE_CATEGORIES.filter(c => !c.tbd).map((category: Category) => (
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
                                                        {voteCounts[category.id]?.[nominee.id] ?? 0}
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
                 <Card>
                    <CardHeader>
                        <CardTitle>Manage Nominees</CardTitle>
                        <CardDescription>
                           Functionality to add, edit, and delete nominees is coming soon.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                       <p>The next step is to build forms here to manage the award nominees.</p>
                    </CardContent>
                </Card>
            </div>
        </main>
    </div>
  );
}
