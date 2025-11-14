import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Skeleton,
  alpha,
  Stack,
  CardMedia,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { FolderOutlined, CategoryOutlined } from "@mui/icons-material";

export default function CategoryShowcase({ categories = [], loading, limit = 6, showMore = false, onMoreClick }) {
  const theme = useTheme();
  const navigate = useNavigate();

  // تنظيم الفئات: الرئيسية فقط للعرض
  const organizedCategories = useMemo(() => {
    if (loading || !categories.length) return [];

    // عرض الفئات الرئيسية فقط
    const parentCategories = categories.filter((cat) => !cat.parent);
    return parentCategories.slice(0, limit);
  }, [categories, loading, limit]);

  const displayCategories = loading
    ? Array.from({ length: limit }, (_, idx) => ({ _id: idx }))
    : organizedCategories;

  const handleCategoryClick = (category) => {
    if (!loading && category._id) {
      navigate(`/catalog?category=${category._id}`);
    }
  };

  return (
    <Box>
      <Grid container spacing={3}>
        {displayCategories.map((category, idx) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={category._id ?? idx}>
            <Card
              elevation={0}
              onClick={() => handleCategoryClick(category)}
              sx={{
                borderRadius: 4,
                height: "100%",
                overflow: "hidden",
                border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                transition: "all 0.3s ease",
                cursor: loading ? "default" : "pointer",
                bgcolor: "background.paper",
                position: "relative",
                "&:hover": loading
                  ? {}
                  : {
                      transform: "translateY(-8px)",
                      boxShadow: `0 12px 40px ${alpha(
                        theme.palette.primary.main,
                        0.15
                      )}`,
                      borderColor: theme.palette.primary.main,
                      "& .category-image": {
                        transform: "scale(1.1)",
                      },
                    },
              }}
            >
              {loading ? (
                <>
                  <Skeleton variant="rectangular" height={200} />
                  <CardContent sx={{ p: 3 }}>
                    <Skeleton width="70%" height={32} sx={{ mb: 1.5 }} />
                    <Skeleton width="50%" height={20} />
                  </CardContent>
                </>
              ) : (
                <>
                  <Box
                    sx={{
                      position: "relative",
                      height: 200,
                      bgcolor: alpha(theme.palette.primary.main, 0.08),
                      overflow: "hidden",
                    }}
                  >
                    {category.image ? (
                      <CardMedia
                        component="img"
                        image={category.image}
                        alt={category.name}
                        className="category-image"
                        sx={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          transition: "transform 0.3s ease",
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {category.parent ? (
                          <CategoryOutlined
                            sx={{
                              fontSize: 80,
                              color: alpha(theme.palette.primary.main, 0.3),
                            }}
                          />
                        ) : (
                          <FolderOutlined
                            sx={{
                              fontSize: 80,
                              color: alpha(theme.palette.primary.main, 0.3),
                            }}
                          />
                        )}
                      </Box>
                    )}
                    <Box
                      sx={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        bgcolor: alpha(theme.palette.primary.main, 0.9),
                        color: "white",
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 2,
                        fontSize: "0.75rem",
                        fontWeight: 600,
                      }}
                    >
                      {category.itemsCount ?? 0} منتج
                    </Box>
                  </Box>
                  <CardContent sx={{ p: 3 }}>
                    <Stack spacing={1.5}>
                      <Typography
                        variant="h5"
                        sx={{
                          color: "primary.main",
                          fontWeight: 600,
                          lineHeight: 1.3,
                        }}
                      >
                        {category.name}
                      </Typography>
                      {category.description && (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            lineHeight: 1.6,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {category.description}
                        </Typography>
                      )}
                    </Stack>
                  </CardContent>
                </>
              )}
            </Card>
          </Grid>
        ))}
        {showMore && !loading && (
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <Card
              elevation={0}
              onClick={onMoreClick}
              sx={{
                borderRadius: 4,
                height: "100%",
                minHeight: 300,
                border: `2px dashed ${alpha(theme.palette.primary.main, 0.3)}`,
                transition: "all 0.3s ease",
                cursor: "pointer",
                bgcolor: alpha(theme.palette.primary.main, 0.02),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                "&:hover": {
                  borderColor: theme.palette.primary.main,
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                  transform: "translateY(-8px)",
                  boxShadow: `0 12px 40px ${alpha(
                    theme.palette.primary.main,
                    0.15
                  )}`,
                },
              }}
            >
              <Stack spacing={2} alignItems="center" sx={{ p: 4 }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CategoryOutlined
                    sx={{
                      fontSize: 40,
                      color: "primary.main",
                    }}
                  />
                </Box>
                <Typography
                  variant="h6"
                  sx={{
                    color: "primary.main",
                    fontWeight: 600,
                    textAlign: "center",
                  }}
                >
                  عرض جميع الفئات
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ textAlign: "center" }}
                >
                  اكتشف المزيد من الفئات والمنتجات
                </Typography>
              </Stack>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}

