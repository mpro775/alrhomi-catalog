// src/components/Filters.jsx
import {
  Box,
  Paper,
  Typography,
  Chip,
  Button,
  Stack,
  Divider,
} from "@mui/material";
import { useMemo } from "react";
import { ClearAll } from "@mui/icons-material";

const fieldLabels = {
  category: "الفئة",
};

export default function Filters({
  categories = [],
  values,
  onChange,
  onReset,
  sx,
}) {

  const activeFilters = useMemo(() => {
    if (!values) return [];
    return Object.entries(values).filter(
      ([key, value]) =>
        value &&
        !["q"].includes(key) &&
        (Array.isArray(value) ? value.some(Boolean) : value !== "")
    );
  }, [values]);

  const handleChange = (payload) => {
    onChange?.(payload);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 4,
        position: "sticky",
        top: 120,
        border: "1px solid",
        borderColor: "divider",
        ...sx,
      }}
    >
      <Stack spacing={3}>
        <Box>
          <Typography variant="h5" sx={{ mb: 1 }}>
            الفلاتر
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
            حدد معايير البحث للوصول إلى المنتج المناسب
          </Typography>
        </Box>

        <Divider />

        <Box>
          <Typography variant="subtitle1" sx={{ mb: 1.5 }}>
            الفئات
          </Typography>
          <Stack spacing={1}>
            <Chip
              label="الكل"
              onClick={() => handleChange({ category: "" })}
              variant={!values?.category ? "filled" : "outlined"}
              color={!values?.category ? "primary" : "default"}
              sx={{
                borderRadius: 3,
                transition: "all 0.2s ease",
                justifyContent: "flex-start",
                "&:hover": {
                  transform: "translateY(-2px)",
                },
              }}
            />
            {categories.map((category) => {
              const isChild = !!category.parent;
              const parentName =
                category.parent && typeof category.parent === "object"
                  ? category.parent.name
                  : null;
              return (
                <Chip
                  key={category._id}
                  label={
                    isChild && parentName
                      ? `↳ ${category.name}`
                      : category.name
                  }
                  onClick={() => handleChange({ category: category._id })}
                  variant={
                    values?.category === category._id ? "filled" : "outlined"
                  }
                  color={
                    values?.category === category._id ? "primary" : "default"
                  }
                  sx={{
                    borderRadius: 3,
                    transition: "all 0.2s ease",
                    justifyContent: "flex-start",
                    ml: isChild ? 2 : 0,
                    fontSize: isChild ? "0.85rem" : "0.875rem",
                    "&:hover": {
                      transform: "translateY(-2px)",
                    },
                  }}
                />
              );
            })}
          </Stack>
        </Box>

        {!!activeFilters.length && (
          <>
            <Divider />
            <Stack spacing={2}>
                  <Typography variant="subtitle1">
                الفلاتر النشطة
              </Typography>
              <Stack direction="row" gap={1} flexWrap="wrap">
                {activeFilters.map(([field, value]) => {
                  const label = fieldLabels[field] || field;
                  return (
                    <Chip
                      key={field}
                      label={`${label}: ${value}`}
                      onDelete={() =>
                        handleChange({
                          [field]: typeof value === "string" ? "" : undefined,
                        })
                      }
                      sx={{
                        borderRadius: 3,
                      }}
                    />
                  );
                })}
              </Stack>
              <Button
                variant="outlined"
                color="error"
                fullWidth
                startIcon={<ClearAll />}
                onClick={onReset}
                sx={{
                  borderRadius: 3,
                  py: 1.2,
                }}
              >
                مسح جميع الفلاتر
              </Button>
            </Stack>
          </>
        )}
      </Stack>
    </Paper>
  );
}
