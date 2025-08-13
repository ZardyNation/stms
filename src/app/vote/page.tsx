

import { createClient } from '@/lib/supabase/server';
import { Loader2 } from 'lucide-react';
import type { Category } from '@/types';
import VotingForm from './VotingForm';

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
                </header>

                {categories.length === 0 ? (
                    <div className="text-center py-16">
                        <Loader2 className="mx-auto h-12 w-12 animate-spin" />
                        <p className="mt-4">Loading categories...</p>
                    </div>
                ) : (
                    <VotingForm categories={categories} />
                )}

            </main>
        </div>
    );
}
