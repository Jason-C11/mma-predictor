"use client";

import React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

export type OptionType = { label: string; id: string };

interface SearchDropdownProps {
  options: OptionType[];
  label: string;
  disabledOpts?: OptionType[];
  value: OptionType | null;
  onChange: (value: OptionType | null) => void;
}

export default function SearchDropdown({
  options,
  label,
  disabledOpts = [],
  value,
  onChange,
}: SearchDropdownProps) {
  return (
    <Autocomplete
      value={value}
      onChange={(_: React.SyntheticEvent, newValue: OptionType | null) => onChange(newValue)}
      options={options}
      getOptionLabel={(option) => option.label}
      getOptionDisabled={(option) =>
        disabledOpts.some((disabled) => disabled.id === option.id)
      }
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          sx={{
            "& .MuiInputLabel-root": {
              color: "white", // default label color
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "#fc0349", // focused label color
            },
            "& .MuiOutlinedInput-root": {
              backgroundColor: "#222", // input background
              color: "white", // input text
            },
            "& .MuiOutlinedInput-root.Mui-focused": {
              borderColor: "#555", // input border focused
            },
          }}
        />
      )}
      disablePortal
      slotProps={{
        popper: {
          sx: {
            "& .MuiAutocomplete-listbox": {
              backgroundColor: "#222", // dropdown background
              color: "white", // text color
            },
            "& .MuiAutocomplete-option:hover": {
              backgroundColor: "#555", // hover background
              color: "white", // hover text
            },
          },
        },
        clearIndicator: {
          sx: { color: "white", "&:hover": { color: "#fc0349" } },
        },
        popupIndicator: {
          sx: { color: "white", "&:hover": { color: "#fc0349" } },
        },
      }}
    />
  );
}
