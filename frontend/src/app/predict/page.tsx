'use client';

import { useEffect, useState } from "react";
import { Fighter } from "@/lib/types/Fighter";
import { Probability } from "@/lib/types/Probability";
import { PredictionResult } from "@/lib/types/PredictionResults";
import { predictFight, fetchFighters } from "@/lib/api";
import { Box, Button, Typography } from "@mui/material";
import SearchDropdown, { OptionType } from "@/components/SearchDropdown";
import { useQuery } from "@tanstack/react-query";

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

  const modelOptions: OptionType[] = [
    { label: "Random Forest", id: "Random Forest" },
    { label: "XGBoost", id: "XGBoost" },
    { label: "LightGBM", id: "LightGBM" },
  ];

  const { data: fighters } = useQuery<Fighter[]>({
    queryKey: ["fighters"],
    queryFn: fetchFighters,
  });

  useEffect(() => {
    if (fighters) {
      setAllFighters(
        fighters.map((f) => ({ label: f.fighter_name, id: f.fighter_id }))
      );
    }
  }, [fighters]);

  const handlePredict = async () => {
    if (!fighter1 || !fighter2 || !model) return;
    setLoading(true);
    try {
      const result: PredictionResult | any = await predictFight(
        fighter1.id,
        fighter2.id,
        model.id
      );

      let formattedProbabilities = "";
      if (Array.isArray(result.probabilities)) {
        formattedProbabilities = result.probabilities
          .map(
            (p: Probability) =>
              `${p.fighter}: ${(p.probability * 100).toFixed(1)}%`
          )
          .join(", ");
      } else if (result.probabilities && typeof result.probabilities === "object") {
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
    <Box
      component="main"
      sx={{
        m: { xs: 2, sm: 4 },
        p: { xs: 2, sm: 4 },
        borderRadius: 3,
        borderWidth: 1.5,
        borderColor: "#555",
        bgcolor: "#222",
      }}
    >
      <Typography
        variant="h1"
        sx={{
          pb: { xs: 2, sm: 4 },
          fontSize: { xs: "32px", sm: "48px", md: "64px" },
          textAlign: "center",
        }}
      >
        Predict a Fight
      </Typography>

      {/* Dropdowns stacked */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          maxWidth: { xs: "100%", sm: "500px", md: "600px" },
          mx: "auto", // centers container
        }}
      >
        {/* Model selection */}
        <SearchDropdown
          options={modelOptions}
          label="Select Model"
          value={model}
          onChange={setModel}
        />

        {/* Fighter 1 */}
        <SearchDropdown
          options={allFighters.filter((f) => f.id !== fighter2?.id)}
          label="Fighter 1"
          value={fighter1}
          onChange={setFighter1}
        />

        {/* Fighter 2 */}
        <SearchDropdown
          options={allFighters.filter((f) => f.id !== fighter1?.id)}
          label="Fighter 2"
          value={fighter2}
          onChange={setFighter2}
        />
      </Box>

      {/* Predict button */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <Button
          onClick={handlePredict}
          disabled={!fighter1 || !fighter2 || !model || loading}
          variant="contained"
          size="large"
          sx={{ width: { xs: "100%", sm: "auto" } }}
        >
          {loading ? "Predicting..." : "Predict Fight"}
        </Button>
      </Box>

      {/* Prediction result */}
      <Box sx={{ mt: 6 }}>
        <Typography
          variant="h2"
          sx={{
            mb: 1,
            fontSize: { xs: "20px", sm: "24px", md: "28px" },
            textAlign: "center",
          }}
        >
          Prediction
        </Typography>

        <Box
          sx={{
            bgcolor: "#333",
            borderRadius: 3,
            borderWidth: 1.5,
            borderColor: "#555",
            minHeight: "5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            px: 2,
          }}
        >
          <Typography
            sx={{
              textAlign: "center",
              fontSize: { xs: "16px", sm: "18px", md: "20px" },
            }}
          >
            {prediction || " "}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
