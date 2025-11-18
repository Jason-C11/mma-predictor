"use client";

import { useState, useEffect } from "react";
import { Fighter } from "@/lib/types/Fighter";
import SearchDropdown, { OptionType } from "@/components/SearchDropdown";
import { fetchFighters, fetchFighterHistory } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { FighterHistory } from "@/lib/types/FighterHistory";

export default function FighterHistoryPage() {
  const [fighter, setFighter] = useState<OptionType | null>(null);
  const [allFighters, setAllFighters] = useState<OptionType[]>([]);
  const [fighterHist, setFighterHist] = useState<FighterHistory[]>([]);

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

  useEffect(() => {
    if (fighter?.id) {
      const loadHistory = async () => {
        const data = await fetchFighterHistory(fighter.id);
        setFighterHist(data);
      };
      loadHistory();
    } else {
      setFighterHist([]);
    }
  }, [fighter]);
  
  // may have to update db later with metadata containing ordering of fighters
  const formatDecisionDetails = (details: string, method: string) => {
    if (!details) return "";
    if (method.toLowerCase().includes("decision")) {
      return details
        .split(".") 
        .map((part) => part.trim().replace(/\s*-\s*/g, "-")) 
        .filter((part) => part.length > 0)
        .join(", "); 
    }
    return details;
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
        borderStyle: "solid",
        bgcolor: "#222",
        overflowX: "auto",
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
        Fighter History
      </Typography>

      <SearchDropdown
        options={allFighters.filter((f) => f.id !== fighter?.id)}
        label="Fighter"
        value={fighter}
        onChange={setFighter}
      />

      {fighterHist.length > 0 && (
        <TableContainer
          component={Paper}
          sx={{
            maxHeight: { xs: 400, sm: 500 },
            overflowY: "auto",
            mt: 4,
          }}
        >
          <Table stickyHeader sx={{ minWidth: 900 }}>
            <TableHead>
              <TableRow sx={{ height: { xs: 60, sm: 70 } }}>
                {[
                  "Event",
                  "Fighter",
                  "Opponent",
                  "Weightclass",
                  "Time Format",
                  "Outcome",
                  "Method",
                  "Round",
                  "Time",
                  "Details",
                ].map((header) => (
                  <TableCell
                    key={header}
                    sx={{
                      fontSize: { xs: "0.9rem", sm: "1rem", md: "1.1rem" },
                      py: { xs: 2, sm: 3 },
                      px: { xs: 1, sm: 2 },
                    }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {fighterHist.map((row, idx) => (
                <TableRow key={idx} sx={{ height: { xs: 60, sm: 70 } }}>
                  {[
                    row.event,
                    row.fighter_name,
                    row.opponent_name,
                    row.weightclass,
                    row.time_format,
                    row.outcome,
                    row.method,
                    row.round_,
                    row.time,
                    row.details,
                  ].map((cell, i) => (
                    <TableCell
                      key={i}
                      sx={{
                        fontSize: { xs: "0.9rem", sm: "1rem", md: "1.1rem" },
                        py: { xs: 2, sm: 3 },
                        px: { xs: 1, sm: 2 },
                      }}
                    >
                      {i === 9
                        ? formatDecisionDetails(cell as string, row.method)
                        : cell}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {fighter && fighterHist.length === 0 && (
        <Typography sx={{ mt: 4, textAlign: "center", color: "#aaa" }}>
          No fight history found for this fighter.
        </Typography>
      )}
    </Box>
  );
}
