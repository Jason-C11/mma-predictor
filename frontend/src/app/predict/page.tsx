"use client";

import { useState } from "react";
import FighterSearchBar from "@/components/FighterSearchBar";
import { Fighter } from "@/lib/types/fighter";
import { Probability } from "@/lib/types/probability";
import { PredictionResult } from "@/lib/types/predictionResult";
import { predictFight } from "@/lib/api";
import { Button } from "@mui/material";




export default function PredictionPage() {
  const [fighter1, setFighter1] = useState<Fighter | null>(null);
  const [fighter2, setFighter2] = useState<Fighter | null>(null);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState<"Random Forest" | "XGBoost" | "LightGBM">("Random Forest");

  
const handlePredict = async () => {
  if (!fighter1 || !fighter2) return;
  setLoading(true);
  try {
    const result: PredictionResult | any = await predictFight(fighter1.fighter_id, fighter2.fighter_id, model);

    let formattedProbabilities = "";
    if (Array.isArray(result.probabilities)) {
      formattedProbabilities = result.probabilities
        .map((p: Probability) => `${p.fighter}: ${(p.probability * 100).toFixed(1)}%`)
        .join(", ");
    } else if (result.probabilities && typeof result.probabilities === "object") {
      formattedProbabilities = Object.entries(result.probabilities)
        .map(([fighter, prob]) => `${fighter}: ${(prob as number * 100).toFixed(1)}%`)
        .join(", ");
    }

    // setPrediction(`${result.predicted_winner} - ${result.predicted_method} (${formattedProbabilities})`);
    setPrediction(`${result.predicted_winner} - (${formattedProbabilities})`);
  } catch (error) {
    console.error(error);
    setPrediction("Error predicting fight");
  } finally {
    setLoading(false);
  }
};
// ==================================

 return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Predict a Fight</h1>

      {/* Dropdown for model selection */}
      <div>
        <label className="block mb-1 font-medium">Select Model</label>
        <select
          value={model}
          onChange={(e) =>
            setModel(e.target.value as "Random Forest" | "XGBoost" | "LightGBM")
          }
          className="border border-gray-300 rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-black bg-white"
        >
          <option value="Random Forest">Random Forest</option>
          <option value="XGBoost">XGBoost</option>
          <option value="LightGBM">LightGBM</option>
        </select>
      </div>


      <div>
        <label className="block mb-1">Fighter 1</label>
        <FighterSearchBar
          onSelect={setFighter1}
          selectedId={fighter1?.fighter_id || ""}
          selectedId2={fighter2?.fighter_id || ""}
        />
      </div>

      <div>
        <label className="block mb-1">Fighter 2</label>
        <FighterSearchBar
          onSelect={setFighter2}
          selectedId={fighter2?.fighter_id || ""}
          selectedId2={fighter1?.fighter_id || ""}
        />
      </div>

      <Button
        sx={{
            px: 4,           
            py: 2,              
            backgroundColor: '#222222', 
            color: 'white',     
            borderRadius: 1,    
            '&:disabled': {
              color: 'white',
              opacity: 0.5,     
            },
            '&:hover': {
              color: 'black',
              backgroundColor: '#fc0349', 
            },
          }}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        onClick={handlePredict}
        disabled={!fighter1 || !fighter2 || loading}
      >
        {loading ? "Predicting..." : "Predict Fight"}
      </Button>

      {prediction && (
        <div className="mt-4 p-2 bg-black-100 rounded">
          <strong>Prediction:</strong> {prediction}
        </div>
      )}
    </div>
  );
}