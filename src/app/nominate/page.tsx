import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import NominationForm from './NominationForm';
import { Hand, Heart } from 'lucide-react';
import type { Category } from '@/types';

async function getCategories(): Promise<Omit<Category, 'nominees'>[]> {
  const supabase = createClient();
  if (!supabase) return [];
  const { data, error } = await supabase.from('categories').select('id, title');
  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
  return data;
}

export default async function NominatePage() {
  const categories = await getCategories();

  return (
    <div className="min-h-screen">
      <main className="container mx-auto py-6 sm:py-8">
        <header className="w-full text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tighter">
            <Hand className="inline-block h-12 w-12 text-primary -rotate-12 mr-4" />
            Nominate a Change-Maker
          </h1>
          <p className="text-lg text-foreground mt-4 max-w-2xl mx-auto">
            Someone you know is making a difference. This is your chance to honor them. Fill out the form below to submit your nomination for the Impact Awards.
          </p>
        </header>

        <Card className="max-w-3xl mx-auto bg-card">
          <CardHeader>
            <CardTitle>Nomination Form</CardTitle>
            <CardDescription className="text-foreground">
              Please provide details about the person or organization you are nominating.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <NominationForm categories={categories} />
          </CardContent>
        </Card>
         <section className="my-16 text-center" id="qualifications">
            <Heart className="h-12 w-12 mx-auto text-primary" />
            <h2 className="text-3xl font-bold tracking-tight mt-4">Nomination Guidelines</h2>
            <div className="mt-4 text-lg text-foreground max-w-4xl mx-auto space-y-4">
                <p>
                    Before you submit, please ensure your nominee meets the qualifications. We are looking for individuals and organizations who have shown a true commitment to creating positive change. Self-nominations are welcome.
                </p>
            </div>
        </section>
      </main>
    </div>
  );
}
