import { TextField, Box, InputAdornment, IconButton, SxProps, Theme, TextFieldProps, useTheme } from "@mui/material";
import Search from "@mui/icons-material/Search";
import Close from "@mui/icons-material/Close";
import { useState, useEffect, useRef, FC, ReactElement } from "react";
import debounce from "lodash.debounce";

interface SearchBarProps {
  value?: string;
  onSearch: (value: string) => void;
  placeholder?: string;
  sx?: SxProps<Theme>;
}

type SearchBarComponentProps = SearchBarProps & Omit<TextFieldProps, "onChange" | "value" | "placeholder">;

const SearchBar: FC<SearchBarComponentProps> = ({
  value = "",
  onSearch,
  placeholder,
  sx,
  ...textFieldProps
}): ReactElement => {
  const [inputValue, setInputValue] = useState<string>(value);
  const debounceRef = useRef<ReturnType<typeof debounce> | null>(null);
  const theme = useTheme();

  useEffect(() => {
    debounceRef.current = debounce((v: string) => {
      onSearch(v);
    }, 300);

    return () => debounceRef.current?.cancel();
  }, [onSearch]);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  return (
    <Box sx={sx}>
      <TextField
        fullWidth
        placeholder={placeholder || "ابحث هنا..."}
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          debounceRef.current?.(e.target.value);
        }}
        variant="standard"
        InputProps={{
          disableUnderline: true,
          startAdornment: (
            <InputAdornment position="start">
              <Search sx={{ color: theme.palette.primary.main, fontSize: 28 }} />
            </InputAdornment>
          ),
          endAdornment: inputValue && (
            <InputAdornment position="end">
              <IconButton
                onClick={() => {
                  setInputValue("");
                  onSearch("");
                }}
                size="small"
              >
                <Close sx={{ color: theme.palette.text.secondary }} />
              </IconButton>
            </InputAdornment>
          ),
          sx: {
            px: 2,
            py: 1,
            color: theme.palette.text.primary,
            fontSize: "1.2rem",
            "& input::placeholder": {
              color: theme.palette.text.secondary,
              opacity: 0.7,
            },
          },
        }}
        {...textFieldProps}
      />
    </Box>
  );
};

export default SearchBar;