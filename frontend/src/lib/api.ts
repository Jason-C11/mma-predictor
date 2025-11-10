import axios from "axios";
import { PredictionResult } from "./types/PredictionResults";
import { FighterStats } from "./types/FighterStats";
const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export const fetchFighters = async () => {
  const res = await axios.get(`${API_BASE}/fighters`);
  return res.data;
};

export const fetchFighterData = async (fighterId: string): Promise<FighterStats> => {
  const res = await axios.get<FighterStats>(`${API_BASE}/fighters/stats`, {
    params: {
      fighter_id: fighterId, 
    },
  });

  return res.data;
};

// To do
// export const fetchFightResults = async () => {
//   const res = await axios.get(`${API_BASE}/fighter/`);
//   return res.data;
// };

export const predictFight = async (
  fighter1Id: string,
  fighter2Id: string,
  model: string
): Promise<PredictionResult> => {
  const { data } = await axios.get<PredictionResult>(`${API_BASE}/predict`, {
    params: {
      fighter1_id: fighter1Id,
      fighter2_id: fighter2Id,
      model: model,
    },
  });
  return {
    predicted_winner: data.predicted_winner,
    predicted_method: data.predicted_method,
    probabilities: data.probabilities,
  };
};
