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
        />
      )}
      disablePortal

    />
  );
}
