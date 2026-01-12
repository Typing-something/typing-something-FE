// types/ranking.ts

export type RankingAccount = {
    email: string;
    profile_pic: string;
    ranking_score: number;
    user_id: number;
    username: string;
  };
  
  export type RankingStats = {
    avg_accuracy: number;
    avg_cpm: number;
    avg_wpm: number;
    best_cpm: number;
    best_wpm: number;
    max_combo: number;
    play_count: number;
  };
  
  export type RankingItem = {
    account: RankingAccount;
    rank: number;
    stats: RankingStats;
  };
  
  export type GetRankingResponse = {
    data: RankingItem[];
    message: string;
    success: boolean;
  };