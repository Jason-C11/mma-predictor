"use client";

import { useEffect, useState } from "react";
import { Fighter } from "@/lib/types/fighter";
import { Probability } from "@/lib/types/probability";
import { PredictionResult } from "@/lib/types/predictionResult";
import { predictFight, fetchFighters } from "@/lib/api";
import { Box, Button, Typography } from "@mui/material";
import SearchDropdown, { OptionType } from "@/components/SearchDropdown";

export default function PredictionPage() {
  const [allFighters, setAllFighters] = useState<OptionType[]>([]);
  const [fighter1, setFighter1] = useState<OptionType | null>(null);
  const [fighter2, setFighter2] = useState<OptionType | null>(null);
  const [model, setModel] = useState<OptionType | null>({
    label: "Random Forest",
    id: "Random Forest",
  });
  const [prediction, setPrediction] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Model options
  const modelOptions: OptionType[] = [
    { label: "Random Forest", id: "Random Forest" },
    { label: "XGBoost", id: "XGBoost" },
    { label: "LightGBM", id: "LightGBM" },
  ];

  // Load fighter data
  useEffect(() => {
    const loadFighters = async () => {
      const data: Fighter[] = await fetchFighters();
      const options: OptionType[] = data.map((f) => ({
        label: f.fighter_name,
        id: f.fighter_id,
      }));
      setAllFighters(options);
    };
    loadFighters();
  }, []);

  const handlePredict = async () => {
    if (!fighter1 || !fighter2 || !model) return;
    setLoading(true);
    try {
      const result: PredictionResult | any = await predictFight(
        fighter1.id,
        fighter2.id,
        model.id // use the id of the selected model
      );

      let formattedProbabilities = "";
      if (Array.isArray(result.probabilities)) {
        formattedProbabilities = result.probabilities
          .map(
            (p: Probability) =>
              `${p.fighter}: ${(p.probability * 100).toFixed(1)}%`
          )
          .join(", ");
      } else if (
        result.probabilities &&
        typeof result.probabilities === "object"
      ) {
        formattedProbabilities = Object.entries(result.probabilities)
          .map(
            ([fighter, prob]) =>
              `${fighter}: ${((prob as number) * 100).toFixed(1)}%`
          )
          .join(", ");
      }

      setPrediction(`${result.predicted_winner} - (${formattedProbabilities})`);
    } catch (error) {
      console.error(error);
      setPrediction("Error predicting fight");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 6 }}>
      <Typography variant="h1" sx={{ pb: 4 }}>
        {" "}
        Predict a Fight{" "}
      </Typography>

      {/* Model selection using SearchDropdown */}
      <Box sx={{ pb: 2 }}>
        <SearchDropdown
          options={modelOptions}
          label="Select Model"
          value={model}
          onChange={setModel}
        />
      </Box>

      {/* Fighter 1 */}
      <Box sx={{ pb: 2 }}>
        <SearchDropdown
          options={allFighters.filter((f) => f.id !== fighter2?.id)}
          label="Fighter 1"
          value={fighter1}
          onChange={setFighter1}
        />
      </Box>

      {/* Fighter 2 */}
      <Box sx={{ pb: 2 }}>
        <SearchDropdown
          options={allFighters.filter((f) => f.id !== fighter1?.id)}
          label="Fighter 2"
          value={fighter2}
          onChange={setFighter2}
        />
      </Box>

      {/* Predict button */}
      <Button
        onClick={handlePredict}
        disabled={!fighter1 || !fighter2 || !model || loading}
      >
        {loading ? "Predicting..." : "Predict Fight"}
      </Button>

<Box sx={{ mt: 8, mb: 2}}>
  {/* Label on top */}
  <Typography variant="h2" sx={{ mb: 1 }}>
    Prediction
  </Typography>

 
  <Box
    sx={{
      p: 2,
      bgcolor: "#222",
      borderRadius: 1,
      minHeight: "2.5rem", 
      display: "flex",
      alignItems: "center",
    }}
  >
    {prediction || " "}
  </Box>
</Box>
    </Box>
  );
}
