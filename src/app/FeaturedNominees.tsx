
'use client';

import * as React from "react";
import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import type { Nominee } from "@/types";

interface FeaturedNomineesProps {
  nominees: Nominee[];
}

export default function FeaturedNominees({ nominees }: FeaturedNomineesProps) {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );

  if (!nominees || nominees.length === 0) {
    return null; // Don't render anything if there are no nominees
  }

  return (
    <div className="w-full">
        <h2 className="text-3xl font-bold tracking-tight text-center mb-8">Featured Nominees</h2>
        <Carousel
            plugins={[plugin.current]}
            className="w-full"
            opts={{
                align: "start",
                loop: true,
            }}
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
        >
            <CarouselContent>
            {nominees.map((nominee, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/4">
                    <div className="p-1">
                        <Card className="overflow-hidden bg-transparent border-0 shadow-none">
                            <CardContent className="flex flex-col items-center justify-center p-0">
                                <Image
                                    src={nominee.photo || "https://placehold.co/400x400.png"}
                                    alt={`Photo of ${nominee.name}`}
                                    width={400}
                                    height={400}
                                    className="aspect-square w-full h-auto object-cover rounded-lg transition-transform duration-300 ease-in-out group-hover:scale-105"
                                    data-ai-hint={nominee.aiHint || 'person'}
                                />
                                <div className="mt-4 text-center">
                                    <p className="font-semibold text-lg">{nominee.name}</p>
                                    <p className="text-sm text-foreground">{nominee.organization}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </CarouselItem>
            ))}
            </CarouselContent>
        </Carousel>
    </div>
  );
}
