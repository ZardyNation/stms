import { createClient } from '@/lib/supabase/server';
import { VOTE_CATEGORIES } from '../data';
import { BarChart, Home, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResultsChart } from './results-chart';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AuthButton } from '../auth/AuthButton';

async function getVoteCounts() {
    const supabase = createClient();
    const { data, error } = await supabase.from('votes').select('*');

    if (error) {
        console.error('Error fetching votes:', error);
        return {};
    }

    const counts: Record<string, Record<string, number>> = {};

    for (const category of VOTE_CATEGORIES) {
        if (category.tbd) continue;
        counts[category.id] = {};
        for (const nominee of category.nominees) {
            counts[category.id][nominee.id] = 0;
        }
    }
    
    for (const vote of data) {
        for (const categoryId in counts) {
            const nomineeId = vote[categoryId];
            if (nomineeId && counts[categoryId][nomineeId] !== undefined) {
                counts[categoryId][nomineeId]++;
            }
        }
    }

    return counts;
}

export default async function ResultsPage() {
    const voteCounts = await getVoteCounts();
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    return (
      <div className="flex min-h-screen flex-col">
        <header className="bg-card border-b py-4">
            <div className="container mx-auto flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tighter sm:text-3xl">
                    Voting Results
                </h1>
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
                    {user && <AuthButton />}
                </div>
            </div>
        </header>

        <main className="flex-1 bg-muted/20 py-8 sm:py-12">
            <div className="container mx-auto space-y-8">
                {VOTE_CATEGORIES.filter(c => !c.tbd).map(category => {
                    const categoryResults = voteCounts[category.id] || {};
                    const chartData = category.nominees.map(nominee => ({
                        name: nominee.name,
                        votes: categoryResults[nominee.id] || 0,
                    }));

                    const totalVotes = chartData.reduce((sum, item) => sum + item.votes, 0);

                    return (
                        <Card key={category.id}>
                            <CardHeader>
                                <CardTitle>{category.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {totalVotes > 0 ? (
                                    <ResultsChart data={chartData} />
                                ) : (
                                    <div className="flex items-center justify-center h-48 text-muted-foreground">
                                        <p>No votes have been cast in this category yet.</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </main>
      </div>
    );
}