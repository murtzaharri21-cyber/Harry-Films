export type TitleKind = "movie" | "series" | "drama";

export type Episode = {
  id: string;
  season: number;
  episode: number;
  name: string;
  synopsis: string;
  durationMin: number;
  videoUrl: string;
};

export type Title = {
  id: string;
  name: string;
  synopsis: string;
  kind: TitleKind;
  genres: string[];
  year: number;
  rating: string;
  durationMin: number;
  seasons: number;
  posterUrl: string;
  backdropUrl: string;
  videoUrl: string;
  matchScore: number;
  featured: boolean;
  trending: boolean;
  isNew: boolean;
  comingSoon: boolean;
  original: boolean;
  episodes: Episode[];
};

export type TitleInput = {
  name: string;
  synopsis: string;
  kind: TitleKind;
  genres: string;
  year: number;
  rating: string;
  durationMin: number;
  seasons: number;
  posterUrl: string;
  backdropUrl: string;
  videoUrl: string;
  featured: boolean;
  trending: boolean;
  isNew: boolean;
  comingSoon: boolean;
  original: boolean;
};
