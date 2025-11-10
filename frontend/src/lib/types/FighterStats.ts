
export interface FighterStats {
  // Fighter info fields
  fighter_id: string;
  fighter_name: string;
  dob?: string;
  reach?: string;
  stance?: string;

  // Career averages 
  sig_str_landed: number;
  total_str_landed: number;
  td_landed: number;
  head_landed: number;
  body_landed: number;
  leg_landed: number;
  distance_landed: number;
  clinch_landed: number;
  ground_landed: number;
  sig_str_attempts: number;
  total_str_attempts: number;
  td_attempts: number;
  kd: number;
  sub_att: number;
  rev: number;
  ctrl_seconds: number;
  sig_str_acc: number;
  td_acc: number;
}