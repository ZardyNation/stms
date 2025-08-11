import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { VOTE_CATEGORIES, Category as CategoryType } from '@/app/data';
import { 
  Briefcase, 
  Lightbulb, 
  HeartHandshake, 
  BookOpen, 
  Megaphone, 
  Mic, 
  Palette, 
  HelpCircle,
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  Phone
} from 'lucide-react';
import VotingForm from './voting-form';

const iconMap: { [key: string]: React.ElementType } = {
  'business-award': Briefcase,
  'entrepreneurship-award': Lightbulb,
  'community-empowerment-award': HeartHandshake,
  'ministry-award': BookOpen,
  'influencer-award': Megaphone,
  'event-host-of-the-year-award': Mic,
  'mea-nation-artist-of-the-year-award': Palette,
  'tbd': HelpCircle,
};

function HeroSection() {
  return (
    <section className="w-full bg-primary text-primary-foreground">
      <div className="container mx-auto flex flex-col items-center justify-center space-y-6 px-4 py-20 text-center md:py-32">
        <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
          STOP The Madness Presents: The IA Awards
        </h1>
        <p className="font-headline text-2xl font-medium sm:text-3xl md:text-4xl">(Impact Awards)</p>
        <p className="max-w-[700px] text-lg text-primary-foreground/90 md:text-xl">
          Powered by My Event Advisor – Events Made Easy!
        </p>
        <a href="#vote-form">
          <Button
            size="lg"
            className="bg-foreground text-background transition-transform hover:scale-105 hover:bg-foreground/90 focus-visible:ring-background"
          >
            Vote Now
          </Button>
        </a>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  return (
    <section className="w-full py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight md:text-4xl">How Voting Works</h2>
          <p className="mt-4 text-lg text-muted-foreground">Follow these simple steps to make your voice heard.</p>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <span className="font-headline text-2xl font-bold">1</span>
              </div>
              <CardTitle className="mt-4 font-headline">Choose Nominees</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Browse through the categories and select one nominee that you believe has made the biggest impact.</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <span className="font-headline text-2xl font-bold">2</span>
              </div>
              <CardTitle className="mt-4 font-headline">Enter Your Email</CardTitle>
            </CardHeader>
            <CardContent>
              <p>You must enter a valid email address to confirm your vote. We respect your privacy.</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <span className="font-headline text-2xl font-bold">3</span>
              </div>
              <CardTitle className="mt-4 font-headline">Submit Your Vote</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Once you're happy with your selections, hit the submit button. Each person gets one vote per category.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

function CategoriesSection({ categories }: { categories: CategoryType[] }) {
  return (
    <section className="w-full bg-secondary py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight md:text-4xl">Award Categories</h2>
          <p className="mt-4 text-lg text-muted-foreground">Celebrating excellence and impact across our community.</p>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-8">
          {categories.map((category) => {
            const Icon = iconMap[category.tbd ? 'tbd' : category.id] || HelpCircle;
            return (
              <Card key={category.id} className="flex items-center p-4">
                <Icon className="mr-4 h-8 w-8 text-primary" />
                <h3 className="font-body text-base font-medium">{category.title}</h3>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function VotingFormSection({ categories }: { categories: CategoryType[] }) {
  return (
    <section id="vote-form" className="w-full py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight md:text-4xl">Cast Your Vote</h2>
          <p className="mt-4 text-lg text-muted-foreground">Select one nominee per category. Your voice matters!</p>
        </div>
        <div className="mt-12">
          <VotingForm categories={categories} />
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="w-full bg-foreground text-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="font-headline text-lg font-bold">The IA Awards</h3>
            <p className="mt-2 text-sm text-background/80">Presented by STOP The Madness</p>
            <p className="text-sm text-background/80">Powered by My Event Advisor</p>
          </div>
          <div>
            <h3 className="font-headline text-lg font-bold">Contact Us</h3>
            <div className="mt-2 space-y-2 text-sm">
              <a href="mailto:info@example.com" className="flex items-center gap-2 hover:text-primary">
                <Mail className="h-4 w-4" />
                info@example.com
              </a>
              <a href="tel:+1234567890" className="flex items-center gap-2 hover:text-primary">
                <Phone className="h-4 w-4" />
                +1 (234) 567-890
              </a>
            </div>
          </div>
          <div>
            <h3 className="font-headline text-lg font-bold">Follow Us</h3>
            <div className="mt-2 flex space-x-4">
              <a href="#" aria-label="Twitter" className="text-background/80 hover:text-primary"><Twitter /></a>
              <a href="#" aria-label="Facebook" className="text-background/80 hover:text-primary"><Facebook /></a>
              <a href="#" aria-label="Instagram" className="text-background/80 hover:text-primary"><Instagram /></a>
              <a href="#" aria-label="LinkedIn" className="text-background/80 hover:text-primary"><Linkedin /></a>
            </div>
          </div>
        </div>
        <Separator className="my-8 bg-background/20" />
        <div className="text-center text-sm text-background/70">
          <p>&copy; {new Date().getFullYear()} The IA Awards. All Rights Reserved.</p>
          <p className="mt-2 font-semibold">Legal Note: One vote per category per email. Duplicate entries will be removed.</p>
        </div>
      </div>
    </footer>
  )
}

export default function Home() {
  const categories = VOTE_CATEGORIES;
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <HeroSection />
        <HowItWorksSection />
        <CategoriesSection categories={categories} />
        <VotingFormSection categories={categories} />
      </main>
      <Footer />
    </div>
  );
}
