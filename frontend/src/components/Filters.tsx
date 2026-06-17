import { Box, Typography, Chip, Button, Stack, Divider } from "@mui/material";
import { useMemo, FC, ReactElement } from "react";
import ClearAll from "@mui/icons-material/ClearAll";
import { Category } from "../types/models.types";

interface FilterValues {
  category?: string;
  q?: string;
  [key: string]: string | undefined;
}

interface FiltersProps {
  categories?: Category[];
  values: FilterValues;
  onChange?: (payload: Partial<FilterValues>) => void;
  onReset?: () => void;
}

const Filters: FC<FiltersProps> = ({
  categories = [],
  values,
  onChange,
  onReset,
}): ReactElement => {
  const categoryName = useMemo(() => {
    const map = new Map(categories.map((c) => [c._id, c.name]));
    return (id?: string) => (id ? map.get(id) ?? id : id);
  }, [categories]);

  const activeFilters = useMemo(() => {
    if (!values) return [];
    return Object.entries(values).filter(
      ([key, value]) =>
        value && !["q", "sortBy", "sortOrder"].includes(key) && value !== ""
    );
  }, [values]);

  const itemSx = (active: boolean) => ({
    p: 1.4,
    borderRadius: 2,
    cursor: "pointer",
    transition: "all 0.2s ease",
    bgcolor: active ? "rgba(44,74,59,0.09)" : "transparent",
    border: "1px solid",
    borderColor: active ? "rgba(44,74,59,0.35)" : "transparent",
    color: active ? "primary.main" : "text.secondary",
    "&:hover": {
      bgcolor: active ? "rgba(44,74,59,0.12)" : "rgba(44,74,59,0.05)",
      color: "primary.main",
    },
  });

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h6" sx={{ mb: 0.5, fontWeight: 700 }}>
          التصفية
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          اكتشف المنتجات حسب الفئة
        </Typography>
      </Box>

      <Box>
        <Typography
          variant="subtitle2"
          sx={{
            mb: 1.5,
            fontWeight: 700,
            color: "secondary.main",
            letterSpacing: 0.5,
          }}
        >
          الفئات
        </Typography>

        <Stack spacing={0.75}>
          <Box onClick={() => onChange?.({ category: "" })} sx={itemSx(!values?.category)}>
            <Typography variant="body2" sx={{ fontWeight: !values?.category ? 700 : 500 }}>
              جميع المنتجات
            </Typography>
          </Box>

          {categories.map((category) => {
            const active = values?.category === category._id;

            return (
              <Box
                key={category._id}
                onClick={() => onChange?.({ category: category._id })}
                sx={itemSx(active)}
              >
                <Typography variant="body2" sx={{ fontWeight: active ? 700 : 500 }}>
                  {category.name}
                </Typography>
              </Box>
            );
          })}
        </Stack>
      </Box>

      {!!activeFilters.length && (
        <>
          <Divider />

          <Stack spacing={1.5}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              الفلاتر النشطة
            </Typography>

            <Stack direction="row" gap={1} flexWrap="wrap">
              {activeFilters.map(([field, value]) => (
                <Chip
                  key={field}
                  label={field === "category" ? categoryName(value) : value}
                  onDelete={() => onChange?.({ [field]: "" })}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Stack>

            <Button
              variant="text"
              color="warning"
              fullWidth
              startIcon={<ClearAll />}
              onClick={onReset}
            >
              مسح الكل
            </Button>
          </Stack>
        </>
      )}
    </Stack>
  );
};

export default Filters;