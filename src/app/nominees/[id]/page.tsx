
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Home, ThumbsUp, MessageSquare } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import CommentForm from './CommentForm';

async function getNominee(id: string) {
    const supabase = createClient();
    if (!supabase) return null;

    const { data, error } = await supabase
        .from('nominees')
        .select(`
            *,
            category:categories ( title ),
            comments (
                id,
                content,
                created_at,
                user:users ( email )
            ),
            likes ( count )
        `)
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching nominee:', error.message);
        return null;
    }

    return data;
}

export default async function NomineePage({ params }: { params: { id: string } }) {
    const nominee = await getNominee(params.id);

    if (!nominee) {
        notFound();
    }

    const likeCount = nominee.likes[0]?.count || 0;
    const userComments = nominee.comments.filter(c => c.user);

    return (
        <div className="flex min-h-screen flex-col">
            <main className="flex-1 py-6 sm:py-8">
                <div className="container mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <Button variant="ghost" asChild>
                                <Link href="/">
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
                                    <p className="text-muted-foreground">{nominee.organization}</p>
                                    <Badge variant="secondary" className="mt-2">{nominee.category.title}</Badge>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="md:col-span-2">
                             <Card>
                                <CardHeader>
                                    <CardTitle>Community Feedback</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-6 mb-6">
                                        <div className="flex items-center gap-2">
                                            <ThumbsUp className="h-6 w-6 text-primary" />
                                            <span className="text-xl font-bold">{likeCount}</span>
                                            <span className="text-muted-foreground">Likes</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MessageSquare className="h-6 w-6 text-primary" />
                                            <span className="text-xl font-bold">{userComments.length}</span>
                                            <span className="text-muted-foreground">Comments</span>
                                        </div>
                                    </div>
                                    
                                    <Separator className="my-6" />

                                    <h3 className="text-lg font-semibold mb-4">Comments</h3>
                                    <CommentForm nomineeId={nominee.id} />

                                    <div className="space-y-6 mt-6">
                                        {userComments.map((comment) => (
                                            <div key={comment.id} className="flex items-start gap-4">
                                                <Avatar>
                                                    <AvatarFallback>{comment.user.email.substring(0, 2).toUpperCase()}</AvatarFallback>
                                                </Avatar>
                                                <div className="w-full">
                                                    <div className="flex items-center justify-between">
                                                        <p className="font-semibold">{comment.user.email}</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {new Date(comment.created_at).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <p className="text-muted-foreground mt-1">{comment.content}</p>
                                                </div>
                                            </div>
                                        ))}
                                        {userComments.length === 0 && (
                                            <p className="text-muted-foreground text-center py-4">Be the first to leave a comment!</p>
                                        )}
                                    </div>
                                </CardContent>
                             </Card>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
