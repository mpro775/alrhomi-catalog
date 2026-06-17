import { Box, Typography, Grid, Skeleton, Stack } from "@mui/material";
import { useMemo, FC, ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowBackRounded, GridViewRounded } from "@mui/icons-material";
import { onImageError } from "../utils/fallbackImage";

interface Category {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  parent?: string | { name: string };
  itemsCount?: number;
}

interface CategoryShowcaseProps {
  categories?: Category[];
  loading?: boolean;
  limit?: number;
  showMore?: boolean;
  onMoreClick?: () => void;
}

const CategoryShowcase: FC<CategoryShowcaseProps> = ({
  categories = [],
  loading = false,
  limit = 6,
  showMore = false,
  onMoreClick,
}): ReactElement => {
  const navigate = useNavigate();

  const organizedCategories = useMemo(() => {
    if (loading || !categories.length) return [];
    return categories.filter((cat) => !cat.parent).slice(0, limit);
  }, [categories, loading, limit]);

  const displayCategories = loading
    ? Array.from({ length: limit }, (_, idx) => ({ _id: `skeleton-${idx}` } as Category))
    : organizedCategories;

  return (
    <Grid container spacing={3}>
      {displayCategories.map((category, idx) => (
        <Grid size={{ xs: 6, sm: 6, md: 4 }} key={category._id ?? idx}>
          <Box
            className={loading ? undefined : "product-card"}
            onClick={() => !loading && navigate(`/catalog?category=${category._id}`)}
            sx={{
              height: "100%",
              cursor: loading ? "default" : "pointer",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 3,
              boxShadow: "var(--shadow-soft)",
              "&:hover img": { transform: "scale(1.06)" },
            }}
          >
            {loading ? (
              <>
                <Skeleton variant="rectangular" height={170} sx={{ bgcolor: "#f1e9dc" }} />
                <Box sx={{ p: 2.5 }}>
                  <Skeleton width="60%" height={28} />
                  <Skeleton width="90%" />
                </Box>
              </>
            ) : (
              <>
                <Box
                  sx={{
                    position: "relative",
                    height: { xs: 130, md: 180 },
                    overflow: "hidden",
                    bgcolor: "#fbf8f2",
                  }}
                >
                  {category.image ? (
                    <Box
                      component="img"
                      src={category.image}
                      alt={category.name}
                      loading="lazy"
                      onError={onImageError}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.6s cubic-bezier(0.22,1,0.36,1)",
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <GridViewRounded sx={{ fontSize: 40, color: "secondary.main", opacity: 0.7 }} />
                    </Box>
                  )}

                  {typeof category.itemsCount === "number" && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: 12,
                        insetInlineEnd: 12,
                        bgcolor: "rgba(255,255,255,0.92)",
                        color: "primary.main",
                        px: 1.5,
                        py: 0.3,
                        borderRadius: 999,
                        fontWeight: 700,
                        fontSize: "0.72rem",
                      }}
                    >
                      {category.itemsCount} قطعة
                    </Box>
                  )}
                </Box>

                <Box sx={{ p: { xs: 2, md: 2.5 }, flexGrow: 1 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      mb: 0.5,
                      fontSize: { xs: "1rem", md: "1.2rem" },
                    }}
                  >
                    {category.name}
                  </Typography>

                  <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color: "primary.main", mt: 1 }}>
                    <Typography variant="caption" sx={{ fontWeight: 700 }}>
                      تصفّح الفئة
                    </Typography>
                    <ArrowBackRounded sx={{ fontSize: 15 }} />
                  </Stack>
                </Box>
              </>
            )}
          </Box>
        </Grid>
      ))}

      {showMore && !loading && (
        <Grid size={{ xs: 6, sm: 6, md: 4 }}>
          <Box
            onClick={onMoreClick}
            sx={{
              height: "100%",
              minHeight: 200,
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 1.5,
              borderRadius: 3,
              border: "1.5px dashed",
              borderColor: "secondary.main",
              bgcolor: "rgba(194,161,77,0.06)",
              transition: "all 0.25s ease",
              "&:hover": { bgcolor: "rgba(194,161,77,0.12)" },
            }}
          >
            <GridViewRounded sx={{ fontSize: 40, color: "secondary.main" }} />
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 700,
                color: "primary.main",
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              عرض جميع الفئات <ArrowBackRounded fontSize="small" />
            </Typography>
          </Box>
        </Grid>
      )}
    </Grid>
  );
};

export default CategoryShowcase;