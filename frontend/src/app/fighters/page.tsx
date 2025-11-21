"use client";

import { useEffect, useState } from "react";
import { Fighter } from "@/lib/types/Fighter";
import { FighterData } from "@/lib/types/FighterData";
import SearchDropdown, { OptionType } from "@/components/SearchDropdown";
import { Box, Card, Grid, Stack, Tooltip, Typography } from "@mui/material";
import { fetchFighters, fetchFighterData } from "@/lib/api";
import InfoIcon from "@mui/icons-material/Info";
import { useQuery } from "@tanstack/react-query";

export default function FighterStats() {
  const [fighter1, setFighter1] = useState<OptionType | null>(null);
  const [fighter2, setFighter2] = useState<OptionType | null>(null);
  const [allFighters, setAllFighters] = useState<OptionType[]>([]);

  const [fighter1Stats, setFighter1Stats] = useState<FighterData | null>(null);
  const [fighter2Stats, setFighter2Stats] = useState<FighterData | null>(null);

  const {
    data: fighters,
    isLoading,
    error,
  } = useQuery<Fighter[]>({
    queryKey: ["fighters"],
    queryFn: fetchFighters,
  });

  // Load fighter data
  useEffect(() => {
    if (fighters) {
      const options = fighters.map((f) => ({
        label: f.fighter_name,
        id: f.fighter_id,
      }));
      setAllFighters(options);
    }
  }, [fighters]);

  useEffect(() => {
    if (fighter1?.id) {
      const loadStats = async () => {
        const data = await fetchFighterData(fighter1.id);
        setFighter1Stats(data);
      };
      loadStats();
    } else {
      setFighter1Stats(null);
    }
  }, [fighter1]);

  useEffect(() => {
    if (fighter2?.id) {
      const loadStats = async () => {
        const data = await fetchFighterData(fighter2.id);
        setFighter2Stats(data);
      };
      loadStats();
    } else {
      setFighter2Stats(null);
    }
  }, [fighter2]);

  const statMapping: {
    label: string;
    key: keyof FighterData;
    fmt?: (v: any) => string;
  }[] = [
    { label: "DOB", key: "dob" },
    { label: "Reach", key: "reach" },
    { label: "Stance", key: "stance" },
    {
      label: "Significant Strikes Landed",
      key: "sig_str_landed",
      fmt: (v: number) => v.toFixed(2),
    },
    {
      label: "Total Strikes Landed",
      key: "total_str_landed",
      fmt: (v: number) => v.toFixed(2),
    },
    {
      label: "Takedowns Landed",
      key: "td_landed",
      fmt: (v: number) => v.toFixed(2),
    },
    {
      label: "Head Strikes Landed",
      key: "head_landed",
      fmt: (v: number) => v.toFixed(2),
    },
    {
      label: "Body Strikes Landed",
      key: "body_landed",
      fmt: (v: number) => v.toFixed(2),
    },
    {
      label: "Leg Strikes Landed",
      key: "leg_landed",
      fmt: (v: number) => v.toFixed(2),
    },
    {
      label: "Distance Strikes Landed",
      key: "distance_landed",
      fmt: (v: number) => v.toFixed(2),
    },
    {
      label: "Clinch Strikes Landed",
      key: "clinch_landed",
      fmt: (v: number) => v.toFixed(2),
    },
    {
      label: "Ground Strikes Landed",
      key: "ground_landed",
      fmt: (v: number) => v.toFixed(2),
    },
    {
      label: "Significant Strikes Attempted",
      key: "sig_str_attempts",
      fmt: (v: number) => v.toFixed(2),
    },
    {
      label: "Total Strikes Attempted",
      key: "total_str_attempts",
      fmt: (v: number) => v.toFixed(2),
    },
    {
      label: "Takedown Attempts",
      key: "td_attempts",
      fmt: (v: number) => v.toFixed(2),
    },
    { label: "Knockdowns", key: "kd", fmt: (v: number) => v.toFixed(2) },
    {
      label: "Submission Attempts",
      key: "sub_att",
      fmt: (v: number) => v.toFixed(2),
    },
    { label: "Reversals", key: "rev", fmt: (v: number) => v.toFixed(2) },
    {
      label: "Control Time (seconds)",
      key: "ctrl_seconds",
      fmt: (v: number) => v.toFixed(2),
    },
    {
      label: "Significant Strike Accuracy",
      key: "sig_str_acc",
      fmt: (v: number) => (v * 100).toFixed(2) + " %",
    },
    {
      label: "Takedown Accuracy",
      key: "td_acc",
      fmt: (v: number) => (v * 100).toFixed(2) + " %",
    },
  ];

  const getStatValue = (
    stats: FighterData | null,
    key: keyof FighterData,
    fmt?: (v: any) => string
  ) => (stats ? (fmt ? fmt(stats[key]) : stats[key] || "-") : "-");

  const Fighter1StatsColumn = ({ stats }: { stats: FighterData | null }) => (
    <Stack spacing={1}>
      {statMapping.map(({ key, fmt }, idx) => (
        <Card
          key={idx}
          sx={{
            p: 0.5,
            borderRadius: 3,
            borderColor: "#555",
            borderWidth: 0.5,
            bgcolor: "#222",
            textAlign: "center",
          }}
        >
          <Typography>{getStatValue(stats, key, fmt)}</Typography>
        </Card>
      ))}
    </Stack>
  );

  const StatsLabelsColumn = () => (
    <Stack spacing={1}>
      {statMapping.map(({ label }, idx) => (
        <Card
          key={idx}
          sx={{
            p: 0.5,
            borderRadius: 3,
            borderColor: "#555",
            borderWidth: 0.5,
            bgcolor: "#222",
            color: "#D4CFCF",
            textAlign: "center",
          }}
        >
          <Typography
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {label}
          </Typography>
        </Card>
      ))}
    </Stack>
  );

  const Fighter2StatsColumn = ({ stats }: { stats: FighterData | null }) => (
    <Stack spacing={1}>
      {statMapping.map(({ key, fmt }, idx) => (
        <Card
          key={idx}
          sx={{
            p: 0.5,
            borderRadius: 3,
            bgcolor: "#222",
            borderColor: "#555",
            borderWidth: 0.5,
            textAlign: "center",
          }}
        >
          <Typography>{getStatValue(stats, key, fmt)}</Typography>
        </Card>
      ))}
    </Stack>
  );

  return (
    <Box component="main" sx={{ width: "100%" }}>
      <Box
        sx={{
          borderWidth: 1.5,
          borderColor: "#555",
          width: "80%",
          mx: "auto",
          p: 2,
          mt: 4,
          bgcolor: "#222",
          borderRadius: 3,
        }}
      >
        <Box sx={{ p: 2, textAlign: "center" }}>
          <Typography
            variant="h1"
            sx={{
              pb: { xs: 2, sm: 4 },
              fontSize: { xs: "32px", sm: "48px", md: "64px" },
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            Compare Stats
            <Tooltip title="Average Stats Per Fight" arrow>
              <InfoIcon fontSize="inherit" sx={{ cursor: "pointer" }} />
            </Tooltip>
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            width: "100%",
            pb: 2,
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ width: "38%" }}>
            <SearchDropdown
              options={allFighters.filter((f) => f.id !== fighter2?.id)}
              label="Fighter 1"
              value={fighter1}
              onChange={setFighter1}
            />
          </Box>

          <Box sx={{ width: "38%" }}>
            <SearchDropdown
              options={allFighters.filter((f) => f.id !== fighter1?.id)}
              label="Fighter 2"
              value={fighter2}
              onChange={setFighter2}
            />
          </Box>
        </Box>
        <Grid
          container
          spacing={2}
          justifyContent="center"
          alignItems="flex-start"
        >
          <Grid sx={{ flexGrow: 1 }}>
            <Fighter1StatsColumn stats={fighter1Stats} />
          </Grid>
          <Grid sx={{ width: "20%" }}>
            <StatsLabelsColumn />
          </Grid>
          <Grid sx={{ flexGrow: 1 }}>
            <Fighter2StatsColumn stats={fighter2Stats} />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
