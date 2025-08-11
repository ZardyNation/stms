import type { Category } from '@/types';

export const VOTE_CATEGORIES: Category[] = [
  {
    id: 'business-award',
    title: 'Business Award',
    nominees: [
      { id: 'biz1', name: 'Alex Thompson', organization: 'Innovate Corp', photo: 'https://placehold.co/400x400.png', aiHint: 'business person' },
      { id: 'biz2', name: 'Samantha Reed', organization: 'Solutions Inc.', photo: 'https://placehold.co/400x400.png', aiHint: 'professional portrait' },
      { id: 'biz3', name: 'Ben Carter', organization: 'Future Enterprises', photo: 'https://placehold.co/400x400.png', aiHint: 'corporate headshot' },
    ],
  },
  {
    id: 'entrepreneurship-award',
    title: 'Entrepreneurship Award',
    nominees: [
      { id: 'ent1', name: 'Chloe Kim', organization: 'StartUp Wizards', photo: 'https://placehold.co/400x400.png', aiHint: 'young entrepreneur' },
      { id: 'ent2', name: 'Marcus Chen', organization: 'Visionary Ventures', photo: 'https://placehold.co/400x400.png', aiHint: 'tech founder' },
      { id: 'ent3', name: 'Priya Patel', organization: 'Bold Ideas Co.', photo: 'https://placehold.co/400x400.png', aiHint: 'creative director' },
    ],
  },
  {
    id: 'community-empowerment-award',
    title: 'Community Empowerment Award',
    nominees: [
      { id: 'com1', name: 'Maria Rodriguez', organization: 'Unity Hub', photo: 'https://placehold.co/400x400.png', aiHint: 'community organizer' },
      { id: 'com2', name: 'David Lee', organization: 'Hope Foundation', photo: 'https://placehold.co/400x400.png', aiHint: 'volunteer smiling' },
      { id: 'com3', name: 'Fatima Al-Jamil', organization: 'Together We Rise', photo: 'https://placehold.co/400x400.png', aiHint: 'activist portrait' },
    ],
  },
  {
    id: 'ministry-award',
    title: 'Ministry Award',
    nominees: [
      { id: 'min1', name: 'Pastor John Davis', organization: 'Grace Fellowship', photo: 'https://placehold.co/400x400.png', aiHint: 'church pastor' },
      { id: 'min2', name: 'Rev. Dr. Helen Cho', organization: 'Citylight Chapel', photo: 'https://placehold.co/400x400.png', aiHint: 'smiling minister' },
      { id: 'min3', name: 'Imam Omar Said', organization: 'The Compassion Center', photo: 'https://placehold.co/400x400.png', aiHint: 'religious leader' },
    ],
  },
  {
    id: 'influencer-award',
    title: 'Influencer Award',
    nominees: [
      { id: 'inf1', name: 'Leo "Digital" King', organization: 'TechTok', photo: 'https://placehold.co/400x400.png', aiHint: 'social media influencer' },
      { id: 'inf2', name: 'Maya "Style" Singh', organization: 'Fashion Forward', photo: 'https://placehold.co/400x400.png', aiHint: 'fashion blogger' },
      { id: 'inf3', name: 'Josh "Gamer" Williams', organization: 'Pixel Perfect', photo: 'https://placehold.co/400x400.png', aiHint: 'esports gamer' },
    ],
  },
  {
    id: 'event-host-of-the-year-award',
    title: 'Event Host of the Year Award',
    nominees: [
      { id: 'host1', name: 'Aisha Campbell', organization: 'Gala Masters', photo: 'https://placehold.co/400x400.png', aiHint: 'event host microphone' },
      { id: 'host2', name: 'Kenji Tanaka', organization: 'Summit Central', photo: 'https://placehold.co/400x400.png', aiHint: 'conference speaker' },
      { id: 'host3', name: 'Sofia Garcia', organization: 'Festival Vibes', photo: 'https://placehold.co/400x400.png', aiHint: 'woman smiling' },
    ],
  },
  {
    id: 'mea-nation-artist-of-the-year-award',
    title: 'MEA Nation Artist of the Year Award',
    nominees: [
      { id: 'art1', name: 'Luna Blue', organization: 'Melody Makers', photo: 'https://placehold.co/400x400.png', aiHint: 'singer performing' },
      { id: 'art2', name: 'Jaxson Grey', organization: 'Canvas Kings', photo: 'https://placehold.co/400x400.png', aiHint: 'painter artist' },
      { id: 'art3', name: 'Nova', organization: 'Rhythm Nation', photo: 'https://placehold.co/400x400.png', aiHint: 'musician portrait' },
    ],
  },
  {
    id: 'tbd-1',
    title: 'Category To Be Announced',
    nominees: [],
    tbd: true,
  },
  {
    id: 'tbd-2',
    title: 'Category To Be Announced',
    nominees: [],
    tbd: true,
  },
  {
    id: 'tbd-3',
    title: 'Category To Be Announced',
    nominees: [],
    tbd: true,
  },
];
