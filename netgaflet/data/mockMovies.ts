export interface CastMember {
  name: string;
  role: string;
  initials: string;
  color: string;
}

export interface Episode {
  id: string;
  title: string;
  duration: string;
  progress: number;
  thumbnail: string;
}

export interface SeasonEpisodes {
  season: number;
  episodes: Episode[];
}

export interface Movie {
  id: string;
  title: string;
  year: number;
  duration: string;
  durationMin: number;
  rating: number;
  genres: string[];
  format: string;
  description: string;
  aiSummary: string;
  cast: CastMember[];
  progress: number | null;
  posterGradient: string;
  heroGradient: string;
  inWatchlist: boolean;
  type: 'movie' | 'series';
  episodes: SeasonEpisodes[] | null;
}

export const mockMovies: Movie[] = [
  {
    id: 'inception',
    title: 'Inception',
    year: 2010,
    duration: '2h 28m',
    durationMin: 148,
    rating: 8.8,
    genres: ['Action', 'Sci-Fi'],
    format: '4K HDR',
    description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    aiSummary: 'A visually stunning labyrinth where reality bends like a fever dream. Nolan weaponizes Hans Zimmer\'s score to make you feel the weight of every second. If your brain hasn\'t melted by the spinning top — congratulations, you\'re lying.',
    cast: [
      { name: 'Leonardo DiCaprio', role: 'Cobb', initials: 'LD', color: '#1a3a5c' },
      { name: 'Joseph Gordon-Levitt', role: 'Arthur', initials: 'JG', color: '#2d1a5c' },
      { name: 'Elliot Page', role: 'Ariadne', initials: 'EP', color: '#5c1a2d' },
      { name: 'Tom Hardy', role: 'Eames', initials: 'TH', color: '#1a5c2d' },
      { name: 'Ken Watanabe', role: 'Saito', initials: 'KW', color: '#5c3d1a' },
    ],
    progress: 0.62,
    posterGradient: 'linear-gradient(135deg, #0d0d1a 0%, #1a1a3e 40%, #0f2060 80%, #0a0a14 100%)',
    heroGradient: 'linear-gradient(135deg, #0a0a14 0%, #1a1a3e 50%, #0f3060 100%)',
    inWatchlist: false,
    episodes: null,
    type: 'movie',
  },
  {
    id: 'interstellar',
    title: 'Interstellar',
    year: 2014,
    duration: '2h 49m',
    durationMin: 169,
    rating: 8.6,
    genres: ['Sci-Fi', 'Drama'],
    format: '4K HDR',
    description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
    aiSummary: 'Space opera meets existential crisis. Matthew McConaughey cries in space so you don\'t have to — except you will. The docking scene alone justifies the runtime. Prepare to question the nature of time, love, and why you watched this at 1am.',
    cast: [
      { name: 'Matthew McConaughey', role: 'Cooper', initials: 'MM', color: '#3a2a0a' },
      { name: 'Anne Hathaway', role: 'Brand', initials: 'AH', color: '#1a2a3a' },
      { name: 'Jessica Chastain', role: 'Murph', initials: 'JC', color: '#2a1a3a' },
      { name: 'Michael Caine', role: 'Prof. Brand', initials: 'MC', color: '#0a2a1a' },
      { name: 'Matt Damon', role: 'Mann', initials: 'MD', color: '#3a0a1a' },
    ],
    progress: 0.35,
    posterGradient: 'linear-gradient(135deg, #0a0d14 0%, #0d1a2e 40%, #0a0f20 80%, #060810 100%)',
    heroGradient: 'linear-gradient(135deg, #050810 0%, #0a1428 50%, #0d1a3a 100%)',
    inWatchlist: true,
    episodes: null,
    type: 'movie',
  },
  {
    id: 'tenet',
    title: 'Tenet',
    year: 2020,
    duration: '2h 30m',
    durationMin: 150,
    rating: 7.4,
    genres: ['Sci-Fi', 'Action'],
    format: '4K HDR',
    description: 'Armed with only one word, Tenet, and fighting for the survival of the entire world, a Protagonist journeys through a twilight world of international espionage on a mission that will unfold in something beyond real time.',
    aiSummary: 'Nolan saw inception and said "what if we made it even more confusing but with worse character names?" The Protagonist (yes, that\'s his name) inverts time to punch a guy, which is honestly worth it. Watch it twice, understand it never.',
    cast: [
      { name: 'John David Washington', role: 'Protagonist', initials: 'JW', color: '#1a1a1a' },
      { name: 'Robert Pattinson', role: 'Neil', initials: 'RP', color: '#2a1a0a' },
      { name: 'Elizabeth Debicki', role: 'Kat', initials: 'ED', color: '#0a1a2a' },
      { name: 'Kenneth Branagh', role: 'Sator', initials: 'KB', color: '#1a0a0a' },
      { name: 'Dimple Kapadia', role: 'Priya', initials: 'DK', color: '#2a0a1a' },
    ],
    progress: null,
    posterGradient: 'linear-gradient(135deg, #1a0a0a 0%, #2a1010 40%, #0a0a1a 80%, #141414 100%)',
    heroGradient: 'linear-gradient(135deg, #0f0505 0%, #1a0a0a 50%, #0a0a14 100%)',
    inWatchlist: false,
    episodes: null,
    type: 'movie',
  },
  {
    id: 'parasite',
    title: 'Parasite',
    year: 2019,
    duration: '2h 12m',
    durationMin: 132,
    rating: 8.5,
    genres: ['Thriller', 'Drama'],
    format: '4K HDR',
    description: 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.',
    aiSummary: 'Bong Joon-ho builds a masterclass in class warfare, then gleefully burns it down. The peach incident will haunt you. The stairs mean everything. You\'ll never look at basements or rich people the same way again. Deeply uncomfortable. Absolutely essential.',
    cast: [
      { name: 'Song Kang-ho', role: 'Ki-taek', initials: 'SK', color: '#1a2a0a' },
      { name: 'Lee Sun-kyun', role: 'Park Dong-ik', initials: 'LS', color: '#0a1a2a' },
      { name: 'Cho Yeo-jeong', role: 'Yeon-gyo', initials: 'CY', color: '#2a0a1a' },
      { name: 'Choi Woo-shik', role: 'Ki-woo', initials: 'CW', color: '#1a0a2a' },
      { name: 'Park So-dam', role: 'Ki-jung', initials: 'PS', color: '#0a2a1a' },
    ],
    progress: null,
    posterGradient: 'linear-gradient(135deg, #0a0e06 0%, #141e08 40%, #0a0a0a 80%, #060608 100%)',
    heroGradient: 'linear-gradient(135deg, #080a05 0%, #101808 50%, #0a0a0a 100%)',
    inWatchlist: false,
    episodes: null,
    type: 'movie',
  },
  {
    id: 'oppenheimer',
    title: 'Oppenheimer',
    year: 2023,
    duration: '3h 0m',
    durationMin: 180,
    rating: 8.6,
    genres: ['Drama', 'History'],
    format: '4K HDR IMAX',
    description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.',
    aiSummary: 'Three hours of Cillian Murphy\'s eyes carrying the weight of atomic guilt. Nolan turns history into pure dread — the Trinity test is cinema at its most terrifying without a single monster. You leave feeling personally responsible. Highest compliment.',
    cast: [
      { name: 'Cillian Murphy', role: 'Oppenheimer', initials: 'CM', color: '#1a0a0a' },
      { name: 'Emily Blunt', role: 'Katherine', initials: 'EB', color: '#2a1a0a' },
      { name: 'Matt Damon', role: 'Groves', initials: 'MD', color: '#0a1a0a' },
      { name: 'Robert Downey Jr.', role: 'Strauss', initials: 'RD', color: '#1a1a0a' },
      { name: 'Florence Pugh', role: 'Jean', initials: 'FP', color: '#0a0a1a' },
    ],
    progress: 0.18,
    posterGradient: 'linear-gradient(135deg, #1a0a0a 0%, #2a1010 40%, #140a0a 80%, #0a0606 100%)',
    heroGradient: 'linear-gradient(135deg, #100505 0%, #1a0808 50%, #0a0404 100%)',
    inWatchlist: true,
    episodes: null,
    type: 'movie',
  },
  {
    id: 'dune-part-two',
    title: 'Dune: Part Two',
    year: 2024,
    duration: '2h 46m',
    durationMin: 166,
    rating: 8.5,
    genres: ['Sci-Fi', 'Adventure'],
    format: '4K HDR IMAX',
    description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.',
    aiSummary: 'Villeneuve doesn\'t make movies — he builds cathedrals of sand and sound. Zendaya finally gets screentime. The Sardaukar fight is everything. The sand worm scene makes you feel small in the best possible way. The spice must flow. You will comply.',
    cast: [
      { name: 'Timothée Chalamet', role: 'Paul', initials: 'TC', color: '#1a1206' },
      { name: 'Zendaya', role: 'Chani', initials: 'ZE', color: '#0a0e14' },
      { name: 'Rebecca Ferguson', role: 'Lady Jessica', initials: 'RF', color: '#14080a' },
      { name: 'Austin Butler', role: 'Feyd-Rautha', initials: 'AB', color: '#060614' },
      { name: 'Florence Pugh', role: 'Princess Irulan', initials: 'FP', color: '#0a060e' },
    ],
    progress: null,
    posterGradient: 'linear-gradient(135deg, #1a1206 0%, #2a1e08 40%, #1a0a04 80%, #100c06 100%)',
    heroGradient: 'linear-gradient(135deg, #120e05 0%, #1a1408 50%, #0e0a04 100%)',
    inWatchlist: true,
    episodes: null,
    type: 'movie',
  },
  {
    id: 'dark-knight',
    title: 'The Dark Knight',
    year: 2008,
    duration: '2h 32m',
    durationMin: 152,
    rating: 9.0,
    genres: ['Action', 'Crime'],
    format: '4K HDR',
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    aiSummary: 'Heath Ledger arrived, redefined villainy, and exited reality — leaving us with the greatest performance in blockbuster history. The bank heist alone is worth the price of admission. Batman is barely in his own movie and somehow that\'s correct.',
    cast: [
      { name: 'Christian Bale', role: 'Batman', initials: 'CB', color: '#0a0a14' },
      { name: 'Heath Ledger', role: 'Joker', initials: 'HL', color: '#14140a' },
      { name: 'Aaron Eckhart', role: 'Harvey Dent', initials: 'AE', color: '#0a140a' },
      { name: 'Maggie Gyllenhaal', role: 'Rachel', initials: 'MG', color: '#14060a' },
      { name: 'Gary Oldman', role: 'Gordon', initials: 'GO', color: '#060a14' },
    ],
    progress: 0.89,
    posterGradient: 'linear-gradient(135deg, #060608 0%, #0a0a10 40%, #060614 80%, #04040a 100%)',
    heroGradient: 'linear-gradient(135deg, #040406 0%, #060608 50%, #0a0a12 100%)',
    inWatchlist: false,
    episodes: null,
    type: 'movie',
  },
  {
    id: 'arrival',
    title: 'Arrival',
    year: 2016,
    duration: '1h 56m',
    durationMin: 116,
    rating: 7.9,
    genres: ['Sci-Fi', 'Drama'],
    format: '4K HDR',
    description: 'A linguist works with the military to communicate with alien lifeforms after twelve mysterious spacecraft appear around the world.',
    aiSummary: 'What if learning a language literally rewired your brain to experience time nonlinearly? Villeneuve asks, then makes you cry about it. Amy Adams carries this film with her face alone. The heptapod language is beautiful. You\'ll want to learn it.',
    cast: [
      { name: 'Amy Adams', role: 'Louise Banks', initials: 'AA', color: '#0a0e14' },
      { name: 'Jeremy Renner', role: 'Ian Donnelly', initials: 'JR', color: '#140a0a' },
      { name: 'Forest Whitaker', role: 'Weber', initials: 'FW', color: '#0a140a' },
    ],
    progress: null,
    posterGradient: 'linear-gradient(135deg, #080c10 0%, #0a1018 40%, #060a0e 80%, #040608 100%)',
    heroGradient: 'linear-gradient(135deg, #060810 0%, #0a1018 50%, #060808 100%)',
    inWatchlist: false,
    episodes: null,
    type: 'movie',
  },
  {
    id: 'everything-everywhere',
    title: 'Everything Everywhere All at Once',
    year: 2022,
    duration: '2h 19m',
    durationMin: 139,
    rating: 7.8,
    genres: ['Sci-Fi', 'Comedy'],
    format: '4K HDR',
    description: 'An aging Chinese immigrant is swept up in an insane adventure, where she alone can save the world by exploring other universes connecting with the lives she could have led.',
    aiSummary: 'The Daniels took a $14 million budget and delivered the multiverse story the MCU wishes it could make. Hot dogs for hands. A googly eye universe. Michelle Yeoh\'s absolute commitment to chaos. It\'s simultaneously the most chaotic and most tender film of the decade.',
    cast: [
      { name: 'Michelle Yeoh', role: 'Evelyn Wang', initials: 'MY', color: '#1a0a12' },
      { name: 'Ke Huy Quan', role: 'Waymond Wang', initials: 'KQ', color: '#0a121a' },
      { name: 'Jamie Lee Curtis', role: 'Deirdre', initials: 'JC', color: '#121a0a' },
      { name: 'Stephanie Hsu', role: 'Joy Wang', initials: 'SH', color: '#1a120a' },
    ],
    progress: 0.51,
    posterGradient: 'linear-gradient(135deg, #1a0a10 0%, #12081a 40%, #0a1012 80%, #100a1a 100%)',
    heroGradient: 'linear-gradient(135deg, #14080e 0%, #0a0614 50%, #0e0a14 100%)',
    inWatchlist: false,
    episodes: null,
    type: 'movie',
  },
  {
    id: 'blade-runner-2049',
    title: 'Blade Runner 2049',
    year: 2017,
    duration: '2h 44m',
    durationMin: 164,
    rating: 8.0,
    genres: ['Sci-Fi', 'Thriller'],
    format: '4K HDR',
    description: 'Young Blade Runner K\'s discovery of a long-buried secret leads him to track down former Blade Runner Rick Deckard, who\'s been missing for thirty years.',
    aiSummary: 'Villeneuve and Deakins created the most beautiful-looking sequel ever made — a 164-minute mood board for existential loneliness. Ryan Gosling staring into the rain is basically this film\'s entire thesis. Slow. Stunning. A work of art.',
    cast: [
      { name: 'Ryan Gosling', role: 'K', initials: 'RG', color: '#0a0e14' },
      { name: 'Harrison Ford', role: 'Deckard', initials: 'HF', color: '#140e0a' },
      { name: 'Ana de Armas', role: 'Joi', initials: 'AA', color: '#0a1410' },
      { name: 'Sylvia Hoeks', role: 'Luv', initials: 'SH', color: '#14080a' },
    ],
    progress: null,
    posterGradient: 'linear-gradient(135deg, #0a0c10 0%, #0c0e14 40%, #080a0e 80%, #060810 100%)',
    heroGradient: 'linear-gradient(135deg, #060810 0%, #0a0c14 50%, #08080c 100%)',
    inWatchlist: false,
    episodes: null,
    type: 'movie',
  },
  {
    id: 'stranger-things',
    title: 'Stranger Things',
    year: 2016,
    duration: '45–60m',
    durationMin: 50,
    rating: 8.7,
    genres: ['Sci-Fi', 'Horror'],
    format: '4K HDR',
    description: 'When a young boy disappears, his mother, a police chief, and his friends must confront terrifying supernatural forces in order to get him back.',
    aiSummary: 'Spielberg and King had a 1980s baby and fed it pure nostalgia. The Upside Down is a metaphor for grief that nobody asked for but desperately needed. Eleven\'s arc from lab experiment to teenager is one of TV\'s great character journeys.',
    cast: [
      { name: 'Millie Bobby Brown', role: 'Eleven', initials: 'MB', color: '#1a0a14' },
      { name: 'Finn Wolfhard', role: 'Mike Wheeler', initials: 'FW', color: '#0a101a' },
      { name: 'Winona Ryder', role: 'Joyce Byers', initials: 'WR', color: '#1a100a' },
      { name: 'David Harbour', role: 'Chief Hopper', initials: 'DH', color: '#0a1a0a' },
      { name: 'Gaten Matarazzo', role: 'Dustin', initials: 'GM', color: '#140a1a' },
    ],
    progress: 0.73,
    posterGradient: 'linear-gradient(135deg, #0a040e 0%, #14081a 40%, #0a060e 80%, #080410 100%)',
    heroGradient: 'linear-gradient(135deg, #070410 0%, #0f0618 50%, #0a040c 100%)',
    inWatchlist: true,
    type: 'series',
    episodes: [
      {
        season: 1,
        episodes: [
          { id: 's1e1', title: 'The Vanishing of Will Byers', duration: '47m', progress: 1.0, thumbnail: 'linear-gradient(135deg, #0a0414 0%, #140820 100%)' },
          { id: 's1e2', title: 'The Weirdo on Maple Street', duration: '55m', progress: 1.0, thumbnail: 'linear-gradient(135deg, #0c0616 0%, #160a22 100%)' },
          { id: 's1e3', title: 'Holly, Jolly', duration: '51m', progress: 0.73, thumbnail: 'linear-gradient(135deg, #0e0818 0%, #180c24 100%)' },
          { id: 's1e4', title: 'The Body', duration: '53m', progress: 0, thumbnail: 'linear-gradient(135deg, #0a0414 0%, #14081e 100%)' },
          { id: 's1e5', title: 'The Flea and the Acrobat', duration: '49m', progress: 0, thumbnail: 'linear-gradient(135deg, #0c0616 0%, #160a20 100%)' },
          { id: 's1e6', title: 'The Monster', duration: '46m', progress: 0, thumbnail: 'linear-gradient(135deg, #0a0414 0%, #140818 100%)' },
          { id: 's1e7', title: 'The Bathtub', duration: '41m', progress: 0, thumbnail: 'linear-gradient(135deg, #0c0616 0%, #16081c 100%)' },
          { id: 's1e8', title: 'The Upside Down', duration: '54m', progress: 0, thumbnail: 'linear-gradient(135deg, #0a0414 0%, #14082a 100%)' },
        ]
      },
      {
        season: 2,
        episodes: [
          { id: 's2e1', title: 'MADMAX', duration: '48m', progress: 0, thumbnail: 'linear-gradient(135deg, #100614 0%, #1a0a20 100%)' },
          { id: 's2e2', title: 'Trick or Treat, Freak', duration: '56m', progress: 0, thumbnail: 'linear-gradient(135deg, #120814 0%, #1c0c22 100%)' },
          { id: 's2e3', title: 'The Pollywog', duration: '51m', progress: 0, thumbnail: 'linear-gradient(135deg, #0e0610 0%, #180a1c 100%)' },
          { id: 's2e4', title: 'Will the Wise', duration: '47m', progress: 0, thumbnail: 'linear-gradient(135deg, #100814 0%, #1a0c1e 100%)' },
          { id: 's2e5', title: 'Dig Dug', duration: '54m', progress: 0, thumbnail: 'linear-gradient(135deg, #0c0610 0%, #16081c 100%)' },
          { id: 's2e6', title: 'The Spy', duration: '50m', progress: 0, thumbnail: 'linear-gradient(135deg, #0e0812 0%, #180a1e 100%)' },
          { id: 's2e7', title: 'The Lost Sister', duration: '57m', progress: 0, thumbnail: 'linear-gradient(135deg, #100614 0%, #1a0a22 100%)' },
          { id: 's2e8', title: 'The Mind Flayer', duration: '52m', progress: 0, thumbnail: 'linear-gradient(135deg, #0c0610 0%, #160820 100%)' },
          { id: 's2e9', title: 'The Gate', duration: '60m', progress: 0, thumbnail: 'linear-gradient(135deg, #100814 0%, #1a0c24 100%)' },
        ]
      },
      {
        season: 3,
        episodes: [
          { id: 's3e1', title: 'Suzie, Do You Copy?', duration: '52m', progress: 0, thumbnail: 'linear-gradient(135deg, #120814 0%, #1e0e22 100%)' },
          { id: 's3e2', title: 'The Mall Rats', duration: '51m', progress: 0, thumbnail: 'linear-gradient(135deg, #100614 0%, #1c0a20 100%)' },
        ]
      },
    ],
  },
  {
    id: 'avatar',
    title: 'Avatar: The Way of Water',
    year: 2022,
    duration: '3h 12m',
    durationMin: 192,
    rating: 7.6,
    genres: ['Sci-Fi', 'Adventure'],
    format: '4K HDR 3D',
    description: 'Jake Sully lives with his newfound family formed on the extrasolar moon Pandora.',
    aiSummary: 'James Cameron spent $460 million making the ocean look absolutely incredible. He succeeded. Nothing else matters.',
    cast: [
      { name: 'Sam Worthington', role: 'Jake Sully', initials: 'SW', color: '#051a1a' },
      { name: 'Zoe Saldana', role: 'Neytiri', initials: 'ZS', color: '#05101a' },
    ],
    progress: null,
    posterGradient: 'linear-gradient(135deg, #031a1a 0%, #052228 40%, #031214 80%, #020a0e 100%)',
    heroGradient: 'linear-gradient(135deg, #021414 0%, #041c22 50%, #030e10 100%)',
    inWatchlist: false,
    episodes: null,
    type: 'movie',
  },
  {
    id: 'mad-max',
    title: 'Mad Max: Fury Road',
    year: 2015,
    duration: '2h 0m',
    durationMin: 120,
    rating: 8.1,
    genres: ['Action', 'Sci-Fi'],
    format: '4K HDR',
    description: 'In a post-apocalyptic wasteland, a woman rebels against a tyrannical ruler in search for her homeland with the aid of a group of female prisoners, a psychotic worshiper, and a drifter named Max.',
    aiSummary: 'George Miller made a 2-hour car chase that is somehow the most feminist action film of its decade. Charlize Theron has one arm and more presence than everyone else combined. The War Boys spray chrome paint so they can die shiny and chrome.',
    cast: [
      { name: 'Tom Hardy', role: 'Max', initials: 'TH', color: '#1a0e04' },
      { name: 'Charlize Theron', role: 'Furiosa', initials: 'CT', color: '#1a0804' },
    ],
    progress: null,
    posterGradient: 'linear-gradient(135deg, #1a0a02 0%, #2a1404 40%, #1a0c04 80%, #100804 100%)',
    heroGradient: 'linear-gradient(135deg, #140802 0%, #1e1004 50%, #100804 100%)',
    inWatchlist: false,
    episodes: null,
    type: 'movie',
  },
  {
    id: 'the-matrix',
    title: 'The Matrix',
    year: 1999,
    duration: '2h 16m',
    durationMin: 136,
    rating: 8.7,
    genres: ['Action', 'Sci-Fi'],
    format: '4K HDR',
    description: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
    aiSummary: 'The Wachowskis woke up and chose to break cinema in 1999. Every action movie post-Matrix owes it royalties. The bullet-time shot hasn\'t aged a day. The red pill/blue pill is now so culturally overused it hurts, but in context it was absolutely perfect.',
    cast: [
      { name: 'Keanu Reeves', role: 'Neo', initials: 'KR', color: '#040a04' },
      { name: 'Laurence Fishburne', role: 'Morpheus', initials: 'LF', color: '#0a0404' },
      { name: 'Carrie-Anne Moss', role: 'Trinity', initials: 'CM', color: '#040a04' },
    ],
    progress: 0.45,
    posterGradient: 'linear-gradient(135deg, #020a02 0%, #040e04 40%, #020802 80%, #010601 100%)',
    heroGradient: 'linear-gradient(135deg, #010801 0%, #020c02 50%, #010601 100%)',
    inWatchlist: false,
    episodes: null,
    type: 'movie',
  },
];

export const continueWatching = mockMovies.filter(m => m.progress !== null && m.progress > 0 && m.progress < 1);
export const trending = mockMovies.filter(m => [8.5, 8.6, 8.7, 8.8, 9.0].includes(m.rating));
export const getMovieById = (id: string): Movie | undefined => mockMovies.find(m => m.id === id);
