"use client";

import { Box, Button, CircularProgress, Typography } from "@mui/material";
import SportsMmaIcon from "@mui/icons-material/SportsMma";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchFighters, predictFight } from "@/lib/api";
import { PredictionResult } from "@/lib/types/PredictionResults";
import ProbabilityRing from "@/components/ProbabilityRing";

export default function HomePage() {
  const [nextFight, setNextFight] = useState<any>(null);
  const [predictionData, setPredictionData] = useState<any>(null);
  const defaultModel = "LightGBM";

  const { data: fighters } = useQuery({
    queryKey: ["fighters"],
    queryFn: fetchFighters,
  });


  useEffect(() => {
    async function loadNextFight() {
      try {
        const res = await fetch("/api/nextFight");
        setNextFight(await res.json());
      } catch (err) {
        console.error(err);
      }
    }
    loadNextFight();
  }, []);


  useEffect(() => {
    if (!nextFight || !fighters) return;

    async function loadPrediction() {
      const fighter1 = fighters.find(
        (f: any) =>
          f.fighter_name.toLowerCase() === nextFight.fighter1.toLowerCase()
      );
      const fighter2 = fighters.find(
        (f: any) =>
          f.fighter_name.toLowerCase() === nextFight.fighter2.toLowerCase()
      );
      if (!fighter1 || !fighter2) return;

      try {
        const result: PredictionResult | any = await predictFight(
          fighter1.fighter_id,
          fighter2.fighter_id,
          defaultModel
        );

        let formattedProbabilities = "";
        if (result.probabilities && typeof result.probabilities === "object") {
          formattedProbabilities = Object.entries(result.probabilities)
            .map(([f, prob]) => `${f}: ${((prob as number) * 100).toFixed(2)}%`)
            .join(", ");
        }

        setPredictionData({
          fighter1Label: fighter1.fighter_name,
          fighter2Label: fighter2.fighter_name,
          probability:
            Number(result.probabilities[fighter1.fighter_name]) * 100,
          text: `${result.predicted_winner} - (${formattedProbabilities})`,
        });
      } catch (err) {
        console.error(err);
      }
    }

    loadPrediction();
  }, [nextFight, fighters]);

  const LoadingBlock = (label: string) => (
    <Box
      sx={{
        flex: 1,
        maxWidth: { xs: "100%", md: "50%" },
        borderRadius: 3,
        bgcolor: "#222",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 300, 
      }}
    >
      <Box sx={{ p: 4 }}>
        <CircularProgress thickness={6} size={160} sx={{ color: "#a60000" }} />
      </Box>
      <Typography variant="h2" color="#fff">
        {label}
      </Typography>
    </Box>
  );

  return (
    <Box component="main" sx={{ p: 4 }}>
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          mb: 6,
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontWeight: "bold",
            textAlign: "center",
            fontSize: { xs: "40px", sm: "60px", md: "80px", lg: "100px" },
          }}
        >
          Enter The Octagon
          <SportsMmaIcon
            sx={{
              fontSize: { xs: "40px", sm: "60px", md: "80px", lg: "100px" },
              verticalAlign: "middle",
              ml: 1,
            }}
          />
        </Typography>

        <Typography
          variant="h2"
          sx={{
            color: "#fff",
            textAlign: "center",
            fontSize: { xs: "20px", sm: "28px", md: "36px", lg: "48px" },
          }}
        >
          ML Powered Fight Predictions
        </Typography>

        <Button
          variant="contained"
          color="primary"
          size="large"
          href="/predict"
        >
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: "18px", sm: "20px", md: "24px", lg: "28px" },
            }}
          >
            Predict Now
          </Typography>
        </Button>
      </Box>

      {/* Event Box */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
          alignItems: "stretch",
          justifyContent: "center",
          width: "100%",
          mt: 4,
          px: { xs: 2, sm: 4 },
        }}
      >
        {/* Event Banner */}
        {!nextFight ? (
          LoadingBlock("Loading event...")
        ) : (
          <Box
            sx={{
              flex: 1,
              maxWidth: { xs: "100%", md: "50%" },
              height: { xs: 250, sm: 300, md: 450, lg: 600 },
              position: "relative",
              borderRadius: 3,
              overflow: "hidden",
              display: "flex",
              alignItems: "flex-end",
            }}
          >
            {nextFight.bannerImages?.[0] && (
              <img
                src={nextFight.bannerImages[0].img}
                alt={nextFight.eventTitle}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            )}

            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                width: "100%",
                bgcolor: "rgba(0,0,0,0.5)",
                color: "#fff",
                p: 2,
              }}
            >
              <Typography variant="h1" sx={{ fontWeight: "bold" }}>
                {nextFight.eventTitle}
              </Typography>
              <Typography variant="h2">{nextFight.eventDate}</Typography>
              <Typography variant="h2">
                {nextFight.fighter1} vs {nextFight.fighter2}
              </Typography>
            </Box>
          </Box>
        )}

        {/* Prediction */}
        <Box
          sx={{
            flex: 1,
            maxWidth: { xs: "100%", md: "50%" },
            bgcolor: "#222",
            borderRadius: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 2,
          }}
        >
          {!predictionData ? (
            LoadingBlock("Loading Prediction...")
          ) : (
            <Box sx={{ px: 4, pt: 6, textAlign: "left" }}>
              <ProbabilityRing
                label1={predictionData.fighter1Label}
                label2={predictionData.fighter2Label}
                probability={predictionData.probability}
                size={200}
                thickness={100}
              />
              <Typography variant="h1" sx={{ pt: 4 }}>
                {predictionData.text}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
