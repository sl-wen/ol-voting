export interface PollOption {
  id: string;
  text: string;
}

export interface Poll {
  id: string;
  title: string;
  description?: string;
  options: PollOption[];
  allow_multiple: boolean;
  created_at: string;
}

export interface Vote {
  id: string;
  poll_id: string;
  selected_options: string[];
  voter_ip: string;
  voter_fingerprint: string;
  created_at: string;
}

export interface VoteCount {
  optionId: string;
  count: number;
  percentage: number;
}

export interface SupabaseEnv {
  url: string;
  anonKey: string;
}
