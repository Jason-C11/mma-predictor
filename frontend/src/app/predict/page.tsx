"use client";

import { useState } from "react";
import { Fighter } from "@/lib/types/Fighter";
import { PredictionResult } from "@/lib/types/PredictionResults";
import { predictFight, fetchFighters } from "@/lib/api";
import { Box, Button, Typography } from "@mui/material";
import SearchDropdown, { OptionType } from "@/components/SearchDropdown";
import { useQuery } from "@tanstack/react-query";
import ProbabilityRing from "@/components/ProbabilityRing";

export default function PredictionPage() {
  const [fighter1, setFighter1] = useState<OptionType | null>(null);
  const [fighter2, setFighter2] = useState<OptionType | null>(null);
  const [model, setModel] = useState<OptionType>({
    label: "Random Forest",
    id: "Random Forest",
  });
  const [loading, setLoading] = useState(false);
  const [predictionData, setPredictionData] = useState<{
    fighter1Label: string;
    fighter2Label: string;
    probability: number;
    text: string;
  } | null>(null);

  const { data: fighters } = useQuery<Fighter[]>({
    queryKey: ["fighters"],
    queryFn: fetchFighters,
  });

  const allFighters =
    fighters?.map((f) => ({
      label: f.fighter_name,
      id: f.fighter_id,
    })) || [];

  const modelOptions: OptionType[] = [
    { label: "Random Forest", id: "Random Forest" },
    { label: "XGBoost", id: "XGBoost" },
    { label: "LightGBM", id: "LightGBM" },
  ];

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
      if (result.probabilities && typeof result.probabilities === "object") {
        formattedProbabilities = Object.entries(result.probabilities)
          .map(([f, prob]) => `${f}: ${((prob as number) * 100).toFixed(2)}%`)
          .join(", ");
      }

      setPredictionData({
        fighter1Label: fighter1.label,
        fighter2Label: fighter2.label,
        probability: result.probabilities[fighter1.label] * 100,
        text: `${result.predicted_winner} - (${formattedProbabilities})`,
      });
    } catch (error) {
      console.error(error);
      setPredictionData({
        fighter1Label: "",
        fighter2Label: "",
        probability: 0,
        text: "Error predicting fight",
      });
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
          textAlign: "center",
        }}
      >
        Predict a Fight
      </Typography>

      {/* Dropdowns */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          maxWidth: { xs: "100%", sm: "500px", md: "600px" },
          mx: "auto",
        }}
      >
        <SearchDropdown
          options={modelOptions}
          label="Select Model"
          value={model}
          onChange={(selected) => setModel(selected as OptionType)}
        />
        <SearchDropdown
          options={allFighters.filter((f) => f.id !== fighter2?.id)}
          label="Fighter 1"
          value={fighter1}
          onChange={setFighter1}
        />
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
            fontSize: { xs: "20px", sm: "24px", md: "36px" },
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
            p:2,
          }}
        >
          {predictionData && (
            <Box sx={{ textAlign: "center" }}>
              <ProbabilityRing
                label1={predictionData.fighter1Label}
                label2={predictionData.fighter2Label}
                probability={predictionData.probability}
                size={200}
                thickness={100}
              />
              <Typography
                variant = "h1"
                sx={{
                  mt: 2,
                  fontSize: { xs: "16px", sm: "18px", md: "20px", lg: "30px"},
                }}
              >
                {predictionData.text}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
