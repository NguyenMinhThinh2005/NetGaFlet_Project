export interface Review {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  stars: number;
  timestamp: string;
  text: string;
  helpful: number;
}

export const mockReviews: Record<string, Review[]> = {
  inception: [
    {
      id: 'r1',
      name: 'Marcus Chen',
      initials: 'MC',
      avatarColor: '#1a2a4a',
      stars: 5,
      timestamp: '2 days ago',
      text: "Nolan's magnum opus. The layers of reality within reality create a philosophical puzzle that rewards multiple viewings. The ending ambiguity is cinematic perfection — intentional, haunting, and exactly right.",
      helpful: 342,
    },
    {
      id: 'r2',
      name: 'Sofia Reyes',
      initials: 'SR',
      avatarColor: '#3a1a2a',
      stars: 5,
      timestamp: '1 week ago',
      text: 'I have watched this 7 times and catch something new every single viewing. The production design is extraordinary. Hans Zimmer\'s score IS the film. An absolute masterpiece that only gets better with age.',
      helpful: 218,
    },
    {
      id: 'r3',
      name: 'James O\'Brien',
      initials: 'JO',
      avatarColor: '#1a3a2a',
      stars: 4,
      timestamp: '3 weeks ago',
      text: 'Technically brilliant and visually stunning. Docked one star because the emotional core could have been stronger — but that\'s a minor quibble. The hallway fight scene alone is worth the price of admission.',
      helpful: 156,
    },
  ],
  interstellar: [
    {
      id: 'r4',
      name: 'Emma Wilson',
      initials: 'EW',
      avatarColor: '#1a1a3a',
      stars: 5,
      timestamp: '3 days ago',
      text: "I ugly-cried for the last 40 minutes. The tesseract scene broke me. Hans Zimmer's organ-driven score is the most emotionally devastating piece of film music in decades. A love letter to humanity's survival instinct.",
      helpful: 445,
    },
    {
      id: 'r5',
      name: 'David Park',
      initials: 'DP',
      avatarColor: '#2a3a1a',
      stars: 4,
      timestamp: '5 days ago',
      text: 'The science is shaky but the heart is real. Anne Hathaway\'s speech about love being a force that transcends dimensions initially seems silly then hits you like a freight train. Brilliant filmmaking.',
      helpful: 289,
    },
    {
      id: 'r6',
      name: 'Priya Nair',
      initials: 'PN',
      avatarColor: '#3a2a1a',
      stars: 5,
      timestamp: '2 weeks ago',
      text: 'The docking scene is the most tense 3 minutes in modern cinema. I held my breath. My roommate held their breath. The cat held their breath. This film does things to your nervous system that should be studied.',
      helpful: 312,
    },
  ],
  tenet: [
    {
      id: 'r7',
      name: 'Alex Thompson',
      initials: 'AT',
      avatarColor: '#2a1a1a',
      stars: 4,
      timestamp: '1 day ago',
      text: "I understood maybe 60% of it but the remaining 40% was so visually spectacular that I didn't care. The reverse-forward highway chase is one of the most insane action sequences ever filmed. Rewatched it three times.",
      helpful: 187,
    },
    {
      id: 'r8',
      name: 'Nina Petrova',
      initials: 'NP',
      avatarColor: '#1a2a1a',
      stars: 3,
      timestamp: '4 days ago',
      text: "The plot is deliberately obfuscated and I think Nolan knows it. The spectacle compensates somewhat but the lack of emotional grounding hurts. Robert Pattinson is doing fascinating work here though.",
      helpful: 134,
    },
    {
      id: 'r9',
      name: 'Carlos Diaz',
      initials: 'CD',
      avatarColor: '#1a1a2a',
      stars: 5,
      timestamp: '1 week ago',
      text: "People who say they didn't understand Tenet are lying or didn't pay attention. It's complex but completely coherent. The temporal pincer movement is ingenious. One of the most original blockbusters ever made.",
      helpful: 203,
    },
  ],
  parasite: [
    {
      id: 'r10',
      name: 'Lisa Fontaine',
      initials: 'LF',
      avatarColor: '#1a2a0a',
      stars: 5,
      timestamp: '6 hours ago',
      text: "The stairs in this film are not just architecture — they're a symbol of class hierarchy that becomes more devastating as the film progresses. Bong Joon-ho is operating at a frequency other directors can't access.",
      helpful: 521,
    },
    {
      id: 'r11',
      name: 'Ryan Chang',
      initials: 'RC',
      avatarColor: '#2a0a1a',
      stars: 5,
      timestamp: '2 days ago',
      text: 'Genre-defying and electrifying. I went in expecting a thriller and got a complete dissection of modern capitalism. The tonal shifts are jarring in the best way. No other film of the decade comes close.',
      helpful: 398,
    },
    {
      id: 'r12',
      name: 'Yuki Tanaka',
      initials: 'YT',
      avatarColor: '#0a1a2a',
      stars: 5,
      timestamp: '1 week ago',
      text: "The peach allergy sequence is a masterclass in escalation. The basement reveal completely reconfigures everything you thought you understood. This film has three acts and each is a different movie. Genius.",
      helpful: 267,
    },
  ],
  'dark-knight': [
    {
      id: 'r13',
      name: 'Michael Foster',
      initials: 'MF',
      avatarColor: '#0a0a1a',
      stars: 5,
      timestamp: '4 hours ago',
      text: "Heath Ledger's Joker is not a performance. It's a force of nature. The bank heist opening is still the best opening of any superhero film ever made. Nothing has come close in 15 years. Nothing will.",
      helpful: 892,
    },
    {
      id: 'r14',
      name: 'Sarah Kim',
      initials: 'SK',
      avatarColor: '#1a0a0a',
      stars: 5,
      timestamp: '2 days ago',
      text: "This transcends its genre. It's a crime epic about the nature of chaos and order, using Batman as a lens. The 'some men just want to watch the world burn' line still hits differently every time.",
      helpful: 634,
    },
    {
      id: 'r15',
      name: 'Omar Hassan',
      initials: 'OH',
      avatarColor: '#0a1a0a',
      stars: 4,
      timestamp: '3 days ago',
      text: 'The Joker is undeniably iconic. The film around him is very good. The third act drags slightly and Two-Face deserved more screen time, but these are small complaints for what is otherwise a landmark film.',
      helpful: 412,
    },
  ],
  'blade-runner-2049': [
    {
      id: 'r16',
      name: 'Theo Laurent',
      initials: 'TL',
      avatarColor: '#060810',
      stars: 5,
      timestamp: '5 days ago',
      text: "Roger Deakins and Denis Villeneuve created the most visually stunning film since the original Blade Runner. The Las Vegas sequence with Ryan Gosling and the hologram Joi is hauntingly beautiful and desperately sad.",
      helpful: 378,
    },
    {
      id: 'r17',
      name: 'Ana Silva',
      initials: 'AS',
      avatarColor: '#100608',
      stars: 4,
      timestamp: '1 week ago',
      text: "Meditative to the point of being hypnotic. This is a 3-hour mood piece disguised as a sci-fi sequel. If you come expecting action you'll be confused. If you come expecting art, you'll be transcended.",
      helpful: 245,
    },
    {
      id: 'r18',
      name: 'Lucas Ferreira',
      initials: 'LF',
      avatarColor: '#080c10',
      stars: 5,
      timestamp: '2 weeks ago',
      text: "The ending where K walks up the steps in the snow, completing his arc of choosing humanity over programming, is one of the most quietly devastating moments in modern science fiction. Perfect.",
      helpful: 301,
    },
  ],
};

export const getReviewsForMovie = (movieId: string): Review[] => mockReviews[movieId] || mockReviews.inception;

export const ratingDistribution: Record<string, number[]> = {
  inception:        [85, 10, 3, 1, 1],
  interstellar:     [80, 12, 5, 2, 1],
  tenet:            [55, 20, 15, 7, 3],
  parasite:         [88, 8, 2, 1, 1],
  oppenheimer:      [82, 11, 4, 2, 1],
  'dark-knight':    [92, 5, 2, 0, 1],
  arrival:          [70, 18, 8, 3, 1],
  'blade-runner-2049': [72, 15, 8, 3, 2],
};

export const getRatingDistribution = (movieId: string): number[] =>
  ratingDistribution[movieId] || [70, 15, 10, 3, 2];
