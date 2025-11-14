// src/components/SearchBar.jsx
import { TextField, Box, InputAdornment, IconButton } from "@mui/material";
import { Search, Close } from "@mui/icons-material";
import { useState, useEffect, useRef } from "react";
import debounce from "lodash.debounce";

export default function SearchBar({
  value = "",
  onSearch,
  placeholder,
  sx,
  ...textFieldProps
}) {
  const [inputValue, setInputValue] = useState(value);
  const debounceRef = useRef();

  useEffect(() => {
    // انشئ الدالة المؤجلة (debounced)
    debounceRef.current = debounce((v) => {
      onSearch(v);
    }, 300);

    return () => {
      debounceRef.current?.cancel();
    };
  }, [onSearch]);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleSearch = (v) => {
    setInputValue(v);
    debounceRef.current(v);
  };

  const clearSearch = () => {
    setInputValue("");
    onSearch("");
  };

  return (
    <Box sx={sx}>
      <TextField
        fullWidth
        placeholder={placeholder || "ابحث هنا..."}
        value={inputValue}
        onChange={(e) => handleSearch(e.target.value)}
        variant="outlined"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search color="primary" fontSize="large" />
            </InputAdornment>
          ),
          endAdornment: value && (
            <InputAdornment position="end">
              <IconButton
                onClick={clearSearch}
                size="small"
                aria-label="مسح البحث"
                sx={{ "&:hover": { bgcolor: "action.hover" } }}
              >
                <Close fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
          sx: {
            borderRadius: 3,
            height: 60,
            fontSize: "1.1rem",
            "& fieldset": {
              borderWidth: 2,
            },
            "&:hover fieldset": {
              borderColor: "primary.main",
            },
            "&.Mui-focused fieldset": {
              borderWidth: 2,
            },
          },
        }}
        {...textFieldProps}
      />
    </Box>
  );
}
