import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/server';
import { AuthButton } from './auth/AuthButton';
import Link from 'next/link';
import { User, Shield, Pencil } from 'lucide-react';
import { Logo } from '@/components/logo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import FeaturedNominees from './FeaturedNominees';

async function isAdmin() {
  const supabase = createClient();
  if (!supabase) {
    return false;
  }
  const { data: { user } } = await supabase.auth.getUser();
  return user?.email === process.env.ADMIN_EMAIL;
}

export default async function Home() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const showAdminLink = user && await isAdmin();

  return (
    <div className="min-h-screen">
      <main className="container mx-auto py-6 sm:py-8">
        <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
           {user && (
               <>
                <Button variant="ghost" asChild>
                    <Link href="/profile">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                    </Link>
                </Button>
                {showAdminLink && (
                  <Button variant="ghost" asChild>
                    <Link href="/admin">
                      <Shield className="mr-2 h-4 w-4" />
                      Admin
                    </Link>
                  </Button>
                )}
                <AuthButton />
               </>
            )}
        </div>
        
        <section className="w-full text-center pt-12 pb-16 flex flex-col items-center">
            <Logo />
            <div className="mt-4 text-foreground">
                <p className="text-xl sm:text-2xl font-light tracking-tight">Stop The Maddness Presents</p>
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tighter my-2">
                    <span className="bg-primary text-primary-foreground px-2 rounded-md font-bold">IA</span> <span className="font-bold">Awards</span>
                </h1>
                <p className="text-xl sm:text-2xl font-light tracking-tight">Hosted by</p>
                <p className="text-2xl sm:text-3xl font-semibold mt-1">Tamika "GeorgiaMe" Harper</p>
            </div>
        </section>

        <section className="my-16">
            <FeaturedNominees />
        </section>

        <section className="grid md:grid-cols-2 gap-8 my-16 text-center">
             <Card className="bg-card">
                <CardHeader>
                    <CardTitle>About The Awards</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-foreground/90 max-w-xl mx-auto text-lg">
                        My Event Advisor dedicates itself to recognizing industry leaders and game changers. The Impact Awards celebrate outstanding achievements and those who have made a significant impact.
                    </p>
                </CardContent>
            </Card>
             <Card className="bg-card">
                <CardHeader>
                    <CardTitle>Live Performances</CardTitle>
                </CardHeader>
                <CardContent>
                     <p className="text-muted-foreground mt-2">Coming soon: details about our amazing performers!</p>
                </CardContent>
            </Card>
        </section>
        
        <section className="w-full text-center my-16 p-8 bg-card rounded-lg">
             <h2 className="text-3xl font-bold tracking-tight">Ready to Make Your Voice Heard?</h2>
             <p className="text-muted-foreground mt-2 mb-6">Your vote matters. Help us celebrate the best of the best.</p>
             <Button asChild size="lg">
                 <Link href="/vote">
                     <Pencil className="mr-2" />
                     Cast Your Vote Now
                 </Link>
             </Button>
        </section>
        
      </main>
      <footer className="container mx-auto py-4 text-center text-sm text-foreground/70">
        <p>Please note: One vote per category per user. All duplicate entries will be invalidated.</p>
      </footer>
    </div>
  );
}
