import { VOTE_CATEGORIES, Category as CategoryType } from '@/app/data';
import VotingForm from './voting-form';
import { Separator } from '@/components/ui/separator';
import { Mail, Phone, Twitter, Facebook, Instagram, Linkedin } from 'lucide-react';

function HeroSection() {
  return (
    <section className="w-full bg-primary text-primary-foreground">
      <div className="container mx-auto flex flex-col items-center justify-center space-y-4 px-4 py-16 text-center md:py-24">
        <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
          The IA Awards
        </h1>
        <p className="font-headline text-xl font-medium sm:text-2xl md:text-3xl">(Impact Awards)</p>
        <p className="max-w-[700px] text-lg text-primary-foreground/90">
          Presented by STOP The Madness, Powered by My Event Advisor
        </p>
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
        <VotingFormSection categories={categories} />
      </main>
      <Footer />
    </div>
  );
}
