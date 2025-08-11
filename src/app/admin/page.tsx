import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { AuthButton } from '../auth/AuthButton';
import { Home, User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// In a real application, you'd have a more robust way of checking for admin roles.
// This could be a separate table in your database or custom claims in Supabase.
// For now, we'll keep it simple and check against an environment variable.
async function isAdmin() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // This is a simplified check. A real app should use database roles or claims.
  // You would need to set this environment variable for your admin user's email.
  return user?.email === process.env.ADMIN_EMAIL;
}


export default async function AdminPage() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return redirect('/login');
    }

    const isAdminUser = await isAdmin();

    if (!isAdminUser) {
        return redirect('/');
    }

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
            <div className="container mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle>Welcome, Admin!</CardTitle>
                        <CardDescription>
                            This is where you will manage categories and nominees. This functionality is coming soon.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p>The next step is to build forms here to create, edit, and delete award categories and the nominees within them.</p>
                    </CardContent>
                </Card>
            </div>
        </main>
    </div>
  );
}