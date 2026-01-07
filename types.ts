
export interface Rider {
  id: string;
  name: string;
  team: string;
  nationality: string;
}

export interface Race {
  id: string;
  name: string;
  date: string; // ISO 8601 format
  deadline: string; // ISO 8601 format
  status: 'upcoming' | 'finished';
}

export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  isAdmin?: boolean;
}

export interface Prediction {
  userId: string;
  raceId: string;
  riders: [string, string, string]; // Array of 3 rider IDs
}

export interface RaceResult {
  raceId: string;
  results: { riderId: string; rank: number }[]; // Array of top 20 riders
}

export interface Score {
  userId: string;
  raceId: string;
  basePoints: number;
  bonusPoints: number;
  totalPoints: number;
  bonusType?: string;
}

export interface Ranking {
  userId: string;
  totalScore: number;
  rank: number;
}
