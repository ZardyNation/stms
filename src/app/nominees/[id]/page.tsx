import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Home } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

async function getNomineeData(id: string) {
    const supabase = createClient();
    if (!supabase) return null;

    const { data: nomineeData, error: nomineeError } = await supabase
        .from('nominees')
        .select('*, category:categories (title)')
        .eq('id', id)
        .single();
    
    if (nomineeError) {
        console.error('Error fetching nominee:', nomineeError.message);
        return null;
    }

    return { nominee: nomineeData, comments: [], likes: 0, userHasLiked: false };
}


export default async function NomineePage({ params }: { params: { id: string } }) {
    const data = await getNomineeData(params.id);

    if (!data) {
        notFound();
    }
    const { nominee } = data;

    return (
        <div className="flex min-h-screen flex-col">
            <main className="flex-1 py-6 sm:py-8">
                <div className="container mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <Button variant="ghost" asChild>
                                <Link href="/vote">
                                    <Home className="mr-2 h-4 w-4" />
                                    Back to Voting
                                </Link>
                            </Button>
                        </div>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="md:col-span-1">
                            <Card>
                                <CardContent className="p-6 text-center">
                                    <Image
                                        src={nominee.photo}
                                        alt={`Photo of ${nominee.name}`}
                                        width={200}
                                        height={200}
                                        className="h-48 w-48 rounded-full object-cover mx-auto mb-4 ring-4 ring-primary/20"
                                    />
                                    <h1 className="text-2xl font-bold">{nominee.name}</h1>
                                    <p className="text-foreground">{nominee.organization}</p>
                                    <Badge variant="secondary" className="mt-2">{nominee.category.title}</Badge>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="md:col-span-2">
                             <Card>
                                <CardHeader>
                                    <CardTitle>Nominee Details</CardTitle>
                                    <CardDescription>Information about the nominee.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p>More details about the nominee can be displayed here in the future.</p>
                                </CardContent>
                             </Card>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
