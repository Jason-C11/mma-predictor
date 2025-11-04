"use client";

import { useState, useEffect } from "react";
import { fetchFighters } from "@/lib/api";
import { Fighter } from "@/lib/types/fighter";


interface FighterSearchProps {
  selectedId?: string;
  selectedId2?: string;
  onSelect: (fighter: Fighter | null) => void;
}

export default function FighterSearch({ onSelect, selectedId, selectedId2 }: FighterSearchProps) {
  const [allFighters, setAllFighters] = useState<Fighter[]>([]);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Fighter[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const loadFighters = async () => {
      const data = await fetchFighters();
      setAllFighters(data);
    };
    loadFighters();
  }, []);

  useEffect(() => {
    if (!query) {
      setResults([]);
      setOpen(false);
      return;
    }

    const filtered = allFighters.filter(
      (fighter) =>
        fighter.fighter_name.toLowerCase().includes(query.toLowerCase()) &&
        fighter.fighter_id.toString() !== selectedId &&// ignore currently selected fighter
        fighter.fighter_id.toString() !== selectedId2
    );

    setResults(filtered);
    setOpen(filtered.length > 0);
  }, [query, allFighters, selectedId]);

  const handleSelect = (fighter: Fighter) => {
    onSelect(fighter);
    setQuery(fighter.fighter_name);
    setResults([]);
    setOpen(false);
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full border px-3 py-2 rounded bg-gray-100 text-black placeholder-gray-500"
        placeholder="Search for a fighter..."
        onFocus={() => results.length > 0 && setOpen(true)}
      />

      {open && results.length > 0 && (
        <ul className="absolute z-10 w-full bg-black border rounded mt-1 max-h-60 overflow-auto shadow-lg">
          {results.map((fighter) => (
            <li
              key={fighter.fighter_id}
              className="px-3 py-2 cursor-pointer hover:bg-gray-300"
              onClick={() => handleSelect(fighter)}
            >
              {fighter.fighter_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}