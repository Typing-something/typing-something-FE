export type Me = {
    userId: number;  
    name: string;
    handle: string;
    tier: string;
    email?: string;
    image: string | null;
    ranking_score: number | null;
    avg_accuracy: number | null;
    avg_wpm: number | null;
    max_combo: number | null;
    play_count: number | null;
  };