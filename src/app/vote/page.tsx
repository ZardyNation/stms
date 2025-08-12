
import { createClient } from '@/lib/supabase/server';
import { Loader2, User, Check, Calendar, Ticket } from 'lucide-react';
import type { Category } from '@/types';
import VotingForm from './VotingForm';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

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


export default async function VotePage() {
    const categories = await getCategories();

    return (
        <div className="min-h-screen">
            <main className="container mx-auto py-6 sm:py-8">
                <header className="w-full text-center mb-12">
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tighter">
                        🗳 Vote for the 2025 Impact Awards Winners!
                    </h1>
                    <p className="text-foreground mt-3 max-w-3xl mx-auto">
                        These are the change-makers, visionaries, and community leaders who inspire us all. Now it’s your turn to help decide who takes home the gold on Saturday, October 12, 2025.
                    </p>
                    <p className="text-primary font-bold mt-2">
                        Voting closes September 20, 2025. at 11:59 PM EST — every vote counts!
                    </p>
                </header>

                <section id="how-to-vote" className="my-16 bg-card p-8 rounded-lg">
                    <h2 className="text-2xl font-bold tracking-tight text-center mb-8">How to Vote</h2>
                    <div className="grid md:grid-cols-3 gap-8 text-center">
                        <div className="flex flex-col items-center">
                            <User className="h-10 w-10 mb-4 text-primary" />
                            <h3 className="font-bold text-lg">1. Review the Nominees</h3>
                            <p className="text-sm text-foreground">Learn about each finalist and their incredible work.</p>
                        </div>
                         <div className="flex flex-col items-center">
                            <Check className="h-10 w-10 mb-4 text-primary" />
                            <h3 className="font-bold text-lg">2. Make Your Choice</h3>
                            <p className="text-sm text-foreground">Click the “Vote” button under your selection in each category.</p>
                        </div>
                         <div className="flex flex-col items-center">
                            <Calendar className="h-10 w-10 mb-4 text-primary" />
                            <h3 className="font-bold text-lg">3. Join Us Live</h3>
                            <p className="text-sm text-foreground">Winners will be revealed only at the Impact Awards during Stop the Madness Week’s Grand Finale.</p>
                        </div>
                    </div>
                </section>

                {categories.length === 0 ? (
                    <div className="text-center py-16">
                        <Loader2 className="mx-auto h-12 w-12 animate-spin" />
                        <p className="mt-4">Loading categories...</p>
                    </div>
                ) : (
                    <VotingForm categories={categories} />
                )}

                 <section id="why-vote" className="my-16 text-center">
                     <h2 className="text-3xl font-bold tracking-tight">Your Voice Decides the Winners — and Their Moment of a Lifetime.</h2>
                    <p className="mt-4 text-lg text-foreground max-w-4xl mx-auto">
                       For every nominee, this recognition is more than an award — it’s proof that their work matters, that people are watching, and that they’re making a difference. Your vote isn’t just a click. It’s a standing ovation before they even step on stage.
                    </p>
                </section>

                <section id="see-it-live" className="my-16 bg-card p-8 rounded-lg text-center">
                    <h2 className="text-3xl font-bold tracking-tight">🎟 Be in the Room When the Winners Are Revealed</h2>
                    <p className="mt-4 text-lg text-foreground max-w-4xl mx-auto">
                        The Impact Awards aren’t just announced online — they’re brought to life in an unforgettable gold carpet experience, runway fashion show, live performances, and our high-energy awards ceremony. Don’t just vote... be there to cheer, clap, and celebrate when your favorite takes the stage.
                    </p>
                    <Button asChild size="lg" className="mt-8">
                        <Link href="#">Get Tickets & Tables Now</Link>
                    </Button>
                </section>

                <footer className="text-center text-sm text-foreground border-t pt-8 mt-16">
                    <h3 className="font-bold text-lg mb-2">Voting Rules</h3>
                    <ul className="space-y-1">
                        <li>● One vote per person per category.</li>
                        <li>● Voting closes September 20th at 11:59 PM EST.</li>
                        <li>● Winners will be announced exclusively at the Impact Awards on October 12, 2025.</li>
                    </ul>
                </footer>
            </main>
        </div>
    );
}
