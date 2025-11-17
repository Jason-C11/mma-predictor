"use client";

import { Box, Typography } from "@mui/material";
import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";

interface ProbabilityRingProps {
  label1: string;
  label2: string;
  probability: number; 
  color1?: string;
  color2?: string;
  size?: number;
  thickness?: number;
}

export default function ProbabilityRing({
  label1,
  label2,
  probability,
  color1 = "#D22B2B",
  color2 = "#6495ED",
  size = 140,
  thickness = 12,
}: ProbabilityRingProps) {
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      rotate: probability * 3.6,
      transition: { duration: 1.5, ease: "easeInOut" },
    });
  }, [probability, controls]);

  const radius = size / 2;
  const innerSize = size - thickness * 2;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 3,
        flexWrap: "wrap",
      }}
    >
      {/* Legend */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <Typography sx={{ textAlign:"left", color: color1, fontWeight: "bold" }}>
          {label1}: {probability.toFixed(2)}%
        </Typography>
        <Typography sx={{ textAlign:"left",  color: color2, fontWeight: "bold" }}>
          {label2}: {(100 - probability).toFixed(2)}%
        </Typography>
      </Box>

      {/* Circular bar */}
      <Box
        sx={{
          width: size,
          height: size,
          borderRadius: "50%",
          backgroundColor: "#555",
          position: "relative",
        }}
      >
        {/* Animated slice for label1 */}
        <motion.div
          style={{
            width: size,
            height: size,
            borderRadius: "50%",
            position: "absolute",
            top: 0,
            left: 0,
            background: `conic-gradient(${color1} 0deg 0deg, ${color2} 0deg 360deg)`,
          }}
          animate={{
            background: [
              `conic-gradient(${color1} 0deg 0deg, ${color2} 0deg 360deg)`,
              `conic-gradient(${color1} 0deg ${probability * 3.6}deg, ${color2} ${probability * 3.6}deg 360deg)`,
            ],
          }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />

        {/* Inner circle */}
        <Box
          sx={{
            width: innerSize,
            height: innerSize,
            borderRadius: "50%",
            backgroundColor: "#222",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            top: thickness,
            left: thickness,
          }}
        >

        </Box>
      </Box>
    </Box>
  );
}
