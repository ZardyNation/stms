

import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Shield, Award, Mic, Ticket, Flower, Pin, Users, Calendar, Trophy, Star, Check } from 'lucide-react';
import { Logo } from '@/components/logo';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import FeaturedNominees from './FeaturedNominees';
import Image from 'next/image';


export default async function Home() {

  return (
    <div className="min-h-screen">
      <main className="container mx-auto py-6 sm:py-8">
        
        <section className="w-full text-center pt-12 pb-16 flex flex-col items-center">
            <Logo />
            <div className="mt-8 text-foreground">
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tighter my-2">
                   🌟 The Impact Awards 2025 — A Night to Honor, Inspire, and Celebrate
                </h1>
                <p className="text-lg text-foreground mt-4 max-w-3xl mx-auto">
                    Join us on Saturday, October 12, 2025, for the Grand Finale of Stop the Madness Week — an unforgettable evening featuring The Impact Awards Ceremony, a runway-stopping fashion show, live performances, and a dazzling Gold Carpet experience.
                </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
                <Button asChild size="lg"><Link href="#">Nominate Someone</Link></Button>
                <Button asChild size="lg" variant="secondary"><Link href="/vote">Vote for a Nominee</Link></Button>
                <Button asChild size="lg"><Link href="https://www.myeventadvisor.com/event/c3741d06-3920-42e8-abf4-ee2328c8cf97" target="_blank">Get Tickets & Tables</Link></Button>
            </div>
        </section>
        
         <section className="my-16" id="host">
            <Card className="bg-card text-left overflow-hidden">
                <div className="md:grid md:grid-cols-2 items-center">
                    <div className="md:col-span-1">
                        <Image 
                            src="/hostess.jpg" 
                            alt="Host Photo"
                            width={600}
                            height={600}
                            className="w-full h-full object-cover"
                            data-ai-hint="professional woman"
                        />
                    </div>
                    <div className="md:col-span-1 p-8 sm:p-12">
                         <h3 className="text-2xl font-bold tracking-tight text-foreground">IA Awards Hosted by</h3>
                         <p className="text-4xl sm:text-5xl font-extrabold text-primary tracking-tighter my-2">Tamika "GeorgiaMe" Harpe</p>
                         <p className="text-foreground">Join our incredible host for an evening of celebration and inspiration as we honor the change-makers who are shaping our world.</p>
                    </div>
                </div>
            </Card>
        </section>

        <section className="my-16" id="performances">
            <Card className="bg-card text-center">
                <CardContent className="p-8 sm:p-12">
                    <h3 className="text-2xl font-bold tracking-tight text-foreground">Live Performances, Fashion Show and More</h3>
                    <p className="text-lg font-semibold text-foreground my-2">Fashion Presented by Face2Face Talent & Modeling Agency - Terri Steven’s</p>
                    <p className="text-foreground max-w-3xl mx-auto">Prepare to be amazed by a showcase of incredible talent, featuring a high-energy fashion show and unforgettable live performances throughout the night.</p>
                </CardContent>
            </Card>
        </section>

        <section className="my-16 text-center" id="about">
            <Flower className="h-12 w-12 mx-auto text-primary" />
            <h2 className="text-3xl font-bold tracking-tight mt-4">✨ Because Change-Makers Deserve Their Flowers While They’re Here</h2>
            <div className="mt-4 text-lg text-foreground max-w-4xl mx-auto space-y-4">
                <p>
                    The Impact Awards were created to celebrate the people, organizations, and visionaries who are making a real difference in our communities. This isn’t just an award show — it’s a movement of recognition, validation, and visibility.
                </p>
                <p>
                    Some honorees are nominated by the public, others are hand-selected by our team — but every name called is someone who has touched lives, broken barriers, or inspired transformation. Whether it’s a neighbor organizing change, a leader driving innovation, or an artist bringing light to the world, we see you. And now, so will everyone else.
                </p>
            </div>
            <Button asChild size="lg" className="mt-8"><Link href="#">Nominate a Change-Maker Today</Link></Button>
        </section>

        <section className="my-16 bg-card p-8 rounded-lg" id="how-it-works">
             <div className="text-center mb-12">
                <Pin className="h-12 w-12 mx-auto text-primary" />
                <h2 className="text-3xl font-bold tracking-tight mt-4">📌 Here’s How to Be Part of the Celebration</h2>
             </div>
             <div className="grid md:grid-cols-3 gap-8 text-center">
                 <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary text-primary-foreground font-bold text-2xl mb-4">1</div>
                    <h3 className="text-xl font-semibold">Nominate</h3>
                    <p className="text-foreground mt-2">Anyone can submit a nomination in one of our categories. Tell us why your nominee deserves recognition.</p>
                 </div>
                 <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary text-primary-foreground font-bold text-2xl mb-4">2</div>
                    <h3 className="text-xl font-semibold">Vote</h3>
                    <p className="text-foreground mt-2">When the the finalist will be announced, on September 1, 2025 you can vote for your favorites to help decide the winners.</p>
                 </div>
                 <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary text-primary-foreground font-bold text-2xl mb-4">3</div>
                    <h3 className="text-xl font-semibold">Celebrate</h3>
                    <p className="text-foreground mt-2">Join us in person on October 12th oak room venue, Marietta, Georgia to see your nominees walk the Gold Carpet, take the stage, and be celebrated in front of the entire community.</p>
                 </div>
             </div>
        </section>
        
        <section className="my-16" id="categories">
            <div className="text-center mb-12">
                <Trophy className="h-12 w-12 mx-auto text-primary" />
                <h2 className="text-3xl font-bold tracking-tight mt-4">🏆 Award Categories & Qualifications</h2>
                <p className="text-lg text-foreground mt-2">We’re honoring excellence in 8 categories this year.</p>
            </div>
            <Card className="bg-card">
                 <CardContent className="p-6 grid md:grid-cols-2 gap-8">
                     <div>
                        <h3 className="text-xl font-semibold mb-4">Award Categories</h3>
                        <ul className="space-y-3 text-foreground">
                            <li className="flex items-start"><Users className="h-5 w-5 mr-3 mt-1 text-primary shrink-0" /><span>Community Leadership Award</span></li>
                            <li className="flex items-start"><Star className="h-5 w-5 mr-3 mt-1 text-primary shrink-0" /><span>Innovator Award</span></li>
                            <li className="flex items-start"><Award className="h-5 w-5 mr-3 mt-1 text-primary shrink-0" /><span>Arts & Culture Impact Award</span></li>
                            <li className="flex items-start"><Users className="h-5 w-5 mr-3 mt-1 text-primary shrink-0" /><span>Youth Visionary Award</span></li>
                            <li className="flex items-start"><Award className="h-5 w-5 mr-3 mt-1 text-primary shrink-0" /><span>Legacy Award</span></li>
                            <li className="flex items-start"><Trophy className="h-5 w-5 mr-3 mt-1 text-primary shrink-0" /><span>Youth Empowerment Award</span></li>
                            <li className="flex items-start"><Users className="h-5 w-5 mr-3 mt-1 text-primary shrink-0" /><span>Father Figure Award</span></li>
                            <li className="flex items-start"><Users className="h-5 w-5 mr-3 mt-1 text-primary shrink-0" /><span>Mother Figure Award</span></li>
                        </ul>
                     </div>
                     <div>
                        <h3 className="text-xl font-semibold mb-4">Nominee Qualifications</h3>
                        <ul className="space-y-3 text-foreground">
                            <li className="flex items-start"><Check className="h-5 w-5 mr-3 mt-1 text-primary shrink-0" /><span>Demonstrated measurable or visible impact in their field or community.</span></li>
                            <li className="flex items-start"><Check className="h-5 w-5 mr-3 mt-1 text-primary shrink-0" /><span>Proven dedication, consistency, and integrity in their work.</span></li>
                            <li className="flex items-start"><Check className="h-5 w-5 mr-3 mt-1 text-primary shrink-0" /><span>Nominees can be located anywhere in the US.</span></li>
                            <li className="flex items-start"><Check className="h-5 w-5 mr-3 mt-1 text-primary shrink-0" /><span>Can be an individual, group, or organization.</span></li>
                        </ul>
                     </div>
                 </CardContent>
            </Card>
        </section>

        <section className="my-16 text-center" id="experience">
            <Mic className="h-12 w-12 mx-auto text-primary" />
            <h2 className="text-3xl font-bold tracking-tight mt-4">🎤 More Than an Awards Show — This is the Show of the Year</h2>
             <p className="mt-4 text-lg text-foreground max-w-4xl mx-auto">
                When you walk into The Impact Awards, you’re stepping into a celebration of excellence and artistry like no other. Your night will include:
            </p>
            <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
                <Card className="bg-card"><CardContent className="p-6"><h3 className="font-semibold text-lg">The Gold Carpet Experience</h3><p className="text-sm text-foreground mt-2">Step into the spotlight with photographers, media interviews, and unforgettable photo moments.</p></CardContent></Card>
                <Card className="bg-card"><CardContent className="p-6"><h3 className="font-semibold text-lg">High-Energy Fashion Show</h3><p className="text-sm text-foreground mt-2">Featuring top designers and models who are redefining style and presence.</p></CardContent></Card>
                <Card className="bg-card"><CardContent className="p-6"><h3 className="font-semibold text-lg">Live Performances</h3><p className="text-sm text-foreground mt-2">Music, spoken word, and artistry that will leave you inspired.</p></CardContent></Card>
                <Card className="bg-card"><CardContent className="p-6"><h3 className="font-semibold text-lg">The Awards Ceremony</h3><p className="text-sm text-foreground mt-2">Where change-makers take center stage and receive the recognition they deserve.</p></CardContent></Card>
            </div>
        </section>

        <section className="my-16" id="tickets">
             <div className="text-center mb-12">
                <Ticket className="h-12 w-12 mx-auto text-primary" />
                <h2 className="text-3xl font-bold tracking-tight mt-4">🎟 Secure Your Seat at the Table — Literally</h2>
             </div>
             <div className="grid md:grid-cols-3 gap-8">
                 <Card className="bg-card flex flex-col"><CardHeader><CardTitle>General Admission</CardTitle></CardHeader><CardContent className="flex-grow"><p className="text-foreground">Includes access to the full event + gold carpet + light hors d'oeuvres. Meal available as add-on.</p></CardContent></Card>
                 <Card className="bg-card border-primary ring-2 ring-primary flex flex-col"><CardHeader><CardTitle>VIP Ticket</CardTitle></CardHeader><CardContent className="flex-grow"><p className="text-foreground">Includes premium seating, full plated meal, and priority gold carpet access.</p></CardContent></Card>
                 <Card className="bg-card flex flex-col"><CardHeader><CardTitle>VIP Tables</CardTitle></CardHeader><CardContent className="flex-grow"><p className="text-foreground">Reserved seating for 8–10 guests, full VIP perks, and host recognition from the stage.</p></CardContent></Card>
             </div>
             <div className="text-center mt-8">
                <Button asChild size="lg"><Link href="https://www.myeventadvisor.com/event/c3741d06-3920-42e8-abf4-ee2328c8cf97" target="_blank">Get Tickets & Tables</Link></Button>
             </div>
        </section>

        <section className="my-16">
            <FeaturedNominees />
        </section>

        <section className="w-full text-center my-16 p-8 bg-card rounded-lg">
             <h2 className="text-3xl font-bold tracking-tight">💫 Your Moment to Make a Difference</h2>
             <p className="text-foreground mt-2 mb-6 max-w-2xl mx-auto">
                Whether you’re nominating a hero, voting for a finalist, or joining us in person to witness the celebration, your presence matters. This is more than an event — it’s a statement that impact deserves to be seen.
             </p>
             <div className="flex flex-wrap justify-center gap-4 mt-8">
                <Button asChild size="lg"><Link href="#">Nominate Now</Link></Button>
                <Button asChild size="lg" variant="secondary"><Link href="/vote">Vote Now</Link></Button>
                <Button asChild size="lg"><Link href="https://www.myeventadvisor.com/event/c3741d06-3920-42e8-abf4-ee2328c8cf97" target="_blank">Buy Tickets</Link></Button>
            </div>
        </section>
        
      </main>
      <footer className="container mx-auto py-4 text-center text-sm text-foreground">
        <p>Please note: One vote per category per user. All duplicate entries will be invalidated.</p>
        <p>&copy; 2024 Impact Awards. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
