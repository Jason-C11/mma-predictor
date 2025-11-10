"use client";

import { useEffect, useState } from "react";
import { FighterStats } from "@/lib/types/FighterStats";
import SearchDropdown, { OptionType } from "@/components/SearchDropdown";
import { Box, Typography } from "@mui/material";
import { fetchFighters, fetchFighterData } from "@/lib/api";

export default function FighterStats() {
  const [fighter1, setFighter1] = useState<OptionType | null>(null);
  const [fighter2, setFighter2] = useState<OptionType | null>(null);
  const [allFighters, setAllFighters] = useState<OptionType[]>([]);

  const [fighter1Stats, setFighter1Stats] = useState<FighterStats | null>(null);
  const [fighter2Stats, setFighter2Stats] = useState<FighterStats | null>(null);

  useEffect(() => {
    const loadFighters = async () => {
      const data = await fetchFighters();
      const options: OptionType[] = data.map((f) => ({
        label: f.fighter_name,
        id: f.fighter_id,
      }));
      setAllFighters(options);
    };
    loadFighters();
  }, []);

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

  const renderStats = (stats: FighterStats) => {
    const fmt = (num: number) => num.toFixed(2);

    return (
      <Box sx={{ mt: 2 }}>
        <Typography>DOB: {stats.dob || "-"}</Typography>
        <Typography>Reach: {stats.reach || "-"}</Typography>
        <Typography>Stance: {stats.stance || "-"}</Typography>
        <Typography>Significant Strikes Landed: {fmt(stats.sig_str_landed)}</Typography>
        <Typography>Total Strikes Landed: {fmt(stats.total_str_landed)}</Typography>
        <Typography>Takedowns Landed: {fmt(stats.td_landed)}</Typography>
        <Typography>Head Strikes Landed: {fmt(stats.head_landed)}</Typography>
        <Typography>Body Strikes Landed: {fmt(stats.body_landed)}</Typography>
        <Typography>Leg Strikes Landed: {fmt(stats.leg_landed)}</Typography>
        <Typography>Distance Strikes Landed: {fmt(stats.distance_landed)}</Typography>
        <Typography>Clinch Strikes Landed: {fmt(stats.clinch_landed)}</Typography>
        <Typography>Ground Strikes Landed: {fmt(stats.ground_landed)}</Typography>
        <Typography>Significant Strikes Attempted: {fmt(stats.sig_str_attempts)}</Typography>
        <Typography>Total Strikes Attempted: {fmt(stats.total_str_attempts)}</Typography>
        <Typography>Takedown Attempts: {fmt(stats.td_attempts)}</Typography>
        <Typography>Knockdowns: {fmt(stats.kd)}</Typography>
        <Typography>Submission Attempts: {fmt(stats.sub_att)}</Typography>
        <Typography>Reversals: {fmt(stats.rev)}</Typography>
        <Typography>Control Time (seconds): {fmt(stats.ctrl_seconds)}</Typography>
        <Typography>Significant Strike Accuracy: {fmt(stats.sig_str_acc)} %</Typography>
        <Typography>Takedown Accuracy: {fmt(stats.td_acc)} %</Typography>
      </Box>
    );
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box>
        <Typography variant="h1" sx={{ pt: 4, pl: 4 }}>
          Compare Stats
        </Typography>
      </Box>

      <Box sx={{ display: "flex", width: "100%", p: 2 }}>
        {/* Fighter 1 */}
        <Box sx={{ width: "50%", p: 2 }}>
          <SearchDropdown
            options={allFighters.filter((f) => f.id !== fighter2?.id)}
            label="Fighter 1"
            value={fighter1}
            onChange={setFighter1}
          />
          {fighter1Stats && renderStats(fighter1Stats)}
        </Box>

        {/* Fighter 2 */}
        <Box sx={{ width: "50%", p: 2 }}>
          <SearchDropdown
            options={allFighters.filter((f) => f.id !== fighter1?.id)}
            label="Fighter 2"
            value={fighter2}
            onChange={setFighter2}
          />
          {fighter2Stats && renderStats(fighter2Stats)}
        </Box>
      </Box>
    </Box>
  );
}
