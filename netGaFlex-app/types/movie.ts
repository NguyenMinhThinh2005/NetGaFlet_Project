export interface CastMember {
  name: string;
  role: string;
  initials: string;
  color: string;
}

export interface Episode {
  name: string;
  slug: string;
  filename: string;
  link_embed: string;
  link_m3u8: string;
}

export interface MovieDetail {
  id: string;
  title: string;
  originalTitle: string;
  year: number;
  duration: string;
  rating: number;
  genres: string[];
  format: string;
  description: string;
  aiSummary: string;
  cast: CastMember[];
  thumbUrl?: string;
  posterUrl?: string;
  heroGradient: string;
}
