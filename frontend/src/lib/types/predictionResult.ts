import { Probability } from "./probability";

export interface PredictionResult {
  predicted_winner: string;
  predicted_method: string;
  probabilities: Probability[];
}